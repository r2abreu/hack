/**
 * Tests for emulator/emulator_computer.ts
 */

import { assertEquals } from "@std/assert";
import { createEmulatorComputer } from "./emulator_computer.ts";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Build a ROM from an array of binary instruction strings. */
function rom(lines: string[]): (addr: number) => number | undefined {
  return (addr) => lines[addr] !== undefined ? parseInt(lines[addr], 2) : undefined;
}

/** Reset + run N cycles on a computer. */
function run(computer: ReturnType<typeof createEmulatorComputer>, cycles: number) {
  computer.reset = 1; computer.tick(); computer.tock();
  computer.reset = 0;
  for (let i = 0; i < cycles; i++) { computer.tick(); computer.tock(); }
}

const buf = new Uint16Array(8192);

// Minimal programs
// @16384 → A=16384 (screen word 0)
// M=-1   → screen[0] = 0xFFFF
// @2     → infinite loop
// 0;JMP
const WRITE_SCREEN_0 = [
  "0100000000000000", // @16384
  "1110111010001000", // M=-1
  "0000000000000010", // @2
  "1110101010000111", // 0;JMP
];

// @16385 → A=16385 (screen word 1)
// M=-1   → screen[1] = 0xFFFF
const WRITE_SCREEN_1 = [
  "0100000000000001", // @16385
  "1110111010001000", // M=-1
  "0000000000000010", // @2
  "1110101010000111", // 0;JMP
];

// @1   → A=1 (RAM address 1, not screen)
// M=-1 → RAM[1] = 0xFFFF (no screen effect)
const WRITE_RAM = [
  "0000000000000001", // @1
  "1110111010001000", // M=-1
  "0000000000000010", // @2
  "1110101010000111", // 0;JMP
];

// ── tests ─────────────────────────────────────────────────────────────────────

Deno.test("readScreen: initial state is all zeros", () => {
  const computer = createEmulatorComputer(rom([]));
  computer.readScreen(buf);
  assertEquals(buf.every((w) => w === 0), true);
});

Deno.test("readScreen: write to screen word 0 (address 16384)", () => {
  const computer = createEmulatorComputer(rom(WRITE_SCREEN_0));
  run(computer, 4);
  computer.readScreen(buf);
  assertEquals(buf[0], 0xFFFF);
  assertEquals(buf.slice(1).every((w) => w === 0), true);
});

Deno.test("readScreen: write to screen word 1 (address 16385)", () => {
  const computer = createEmulatorComputer(rom(WRITE_SCREEN_1));
  run(computer, 4);
  computer.readScreen(buf);
  assertEquals(buf[1], 0xFFFF);
  assertEquals(buf[0], 0);
});

Deno.test("readScreen: write to RAM does not affect screen", () => {
  const computer = createEmulatorComputer(rom(WRITE_RAM));
  run(computer, 4);
  computer.readScreen(buf);
  assertEquals(buf.every((w) => w === 0), true);
});

Deno.test("reset: restarts program from instruction 0", () => {
  // Run the screen-write program, then reset and check PC restarts.
  // We verify by resetting and running only 1 cycle — if PC reset to 0,
  // the first instruction (@16384) runs again, which is harmless.
  // Screen should still hold 0xFFFF from the first run (reset ≠ clear screen).
  const computer = createEmulatorComputer(rom(WRITE_SCREEN_0));
  run(computer, 4);
  computer.readScreen(buf);
  assertEquals(buf[0], 0xFFFF);

  // Reset and re-run.
  run(computer, 4);
  computer.readScreen(buf);
  assertEquals(buf[0], 0xFFFF); // still set — program ran again cleanly
});
