import { assertEquals } from "@std/assert";
import { loadRom } from "./main.ts";
import { createEmulatorComputer } from "./emulator_computer.ts";
import { HackEmulator } from "./hack_emulator.ts";
import type { DisplayDriver } from "./types.ts";

// ── loadRom ──────────────────────────────────────────────────────────────────

Deno.test("loadRom: parses binary lines into instruction words", async () => {
  // Write a tiny ROM to a temp file: three instructions in binary text.
  const path = await Deno.makeTempFile({ suffix: ".txt" });
  await Deno.writeTextFile(path, [
    "0000000000000001", // 1
    "1111111111111111", // 65535 (0xFFFF)
    "0101010101010101", // 21845
  ].join("\n"));

  const rom = loadRom(path);

  assertEquals(rom(0), 1);
  assertEquals(rom(1), 65535);
  assertEquals(rom(2), 21845);
  assertEquals(rom(3), undefined); // out of range
});

Deno.test("loadRom: ignores trailing blank lines", async () => {
  const path = await Deno.makeTempFile({ suffix: ".txt" });
  await Deno.writeTextFile(path, "0000000000000111\n\n\n");

  const rom = loadRom(path);

  assertEquals(rom(0), 7);
  assertEquals(rom(1), undefined);
});

// ── Integration ───────────────────────────────────────────────────────────────
//
// A minimal two-instruction Hack program that writes 0xFFFF to screen word 0:
//
//   @16384           → 0100000000000000   (A = 16384 = screen start address)
//   M=-1             → 1110111010001000   (memory[A] = 0xFFFF)
//   @2               → 0000000000000010   (infinite loop)
//   0;JMP            → 1110101010000111
//
// The screen base address in the Hack memory map is 16384 (bit 14 of the
// 15-bit address space = 1, bit 13 = 0).  The 13-bit word index inside the
// screen for address 16384 is sliceBits(16384, 0, 13) = 0, so the write goes
// to shadowScreen[0].
//
// Cycle trace after reset:
//   Cycle 1  tick/tock → @16384 → A register = 16384
//   Cycle 2  tick/tock → M=-1  → pendingWrite={addr:0, val:0xFFFF}; tock commits
//
// Therefore after ≥ 2 CPU cycles, readScreen()[0] must equal 0xFFFF (65535).

const SCREEN_PROGRAM = [
  "0100000000000000", // @16384
  "1110111010001000", // M=-1
  "0000000000000010", // @2
  "1110101010000111", // 0;JMP
];

/**
 * Build a ROM function from an array of binary-string instructions.
 * Mirrors what loadRom does at runtime, without needing a file on disk.
 */
function romFromLines(lines: string[]): (address: number) => number | undefined {
  return (address) => {
    const line = lines[address];
    return line !== undefined ? parseInt(line, 2) : undefined;
  };
}

Deno.test("EmulatorComputer: screen write captured in shadow buffer", () => {
  const computer = createEmulatorComputer(romFromLines(SCREEN_PROGRAM));

  // Reset cycle (mirrors HackEmulator.start())
  computer.reset = 1;
  computer.tick();
  computer.tock();
  computer.reset = 0;

  // Run 4 cycles — more than enough for the first M=-1 to commit.
  for (let i = 0; i < 4; i++) {
    computer.tick();
    computer.tock();
  }

  const buf = new Uint16Array(8192);
  computer.readScreen(buf);

  // Word 0 of the shadow screen must be 0xFFFF (all pixels black).
  assertEquals(buf[0], 0xFFFF);

  // The rest of the screen must still be zero (untouched).
  assertEquals(buf.slice(1).every((w) => w === 0), true);
});

Deno.test("HackEmulator: display driver receives screen state after first frame", async () => {
  const computer = createEmulatorComputer(romFromLines(SCREEN_PROGRAM));

  // Capture the last render call from the display driver.
  let lastFrame: Uint16Array | null = null;
  const display: DisplayDriver = {
    render(screenWords) {
      // Copy the buffer — the emulator reuses the same Uint16Array each frame.
      lastFrame = screenWords.slice();
    },
  };

  const emulator = new HackEmulator(computer, display);

  // start() is async (uses setTimeout internally); wait long enough for the
  // first frame to fire and then stop cleanly.
  await new Promise<void>((resolve) => {
    emulator.start(50); // 50 cycles per frame — enough to hit the screen write
    setTimeout(() => {
      emulator.stop();
      resolve();
    }, 100); // 100 ms is plenty for one 16 ms frame
  });

  // The display driver must have been called at least once.
  assertEquals(lastFrame !== null, true);

  // Screen word 0 must be 0xFFFF.
  assertEquals(lastFrame![0], 0xFFFF);
});
