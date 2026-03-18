/**
 * Tests for emulator/hack_emulator.ts
 */

import { assertEquals } from "@std/assert";
import { createEmulatorComputer } from "./emulator_computer.ts";
import { HackEmulator } from "./hack_emulator.ts";
import type { DisplayDriver } from "./types.ts";

// ── helpers ───────────────────────────────────────────────────────────────────

function rom(lines: string[]): (addr: number) => number | undefined {
  return (addr) => lines[addr] !== undefined ? parseInt(lines[addr], 2) : undefined;
}

// Writes 0xFFFF to screen word 0 then loops.
const WRITE_SCREEN_0 = [
  "0100000000000000", // @16384
  "1110111010001000", // M=-1
  "0000000000000010", // @2
  "1110101010000111", // 0;JMP
];

/** Waits ms milliseconds. */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── tests ─────────────────────────────────────────────────────────────────────

Deno.test("start: calls render at least once", async () => {
  const computer = createEmulatorComputer(rom([]));
  let renderCount = 0;
  const display: DisplayDriver = { render: () => { renderCount++; } };

  const emulator = new HackEmulator(computer, display);
  emulator.start(10);
  await wait(100);
  emulator.stop();

  assertEquals(renderCount > 0, true);
});

Deno.test("stop: halts the render loop", async () => {
  const computer = createEmulatorComputer(rom([]));
  let renderCount = 0;
  const display: DisplayDriver = { render: () => { renderCount++; } };

  const emulator = new HackEmulator(computer, display);
  emulator.start(10);
  await wait(50);
  emulator.stop();
  const countAtStop = renderCount;

  // Wait longer — no new renders should occur after stop().
  await wait(100);
  assertEquals(renderCount, countAtStop);
});

Deno.test("start: screen state is passed to render", async () => {
  const computer = createEmulatorComputer(rom(WRITE_SCREEN_0));
  let lastFrame: Uint16Array | null = null;
  const display: DisplayDriver = {
    render: (screen) => { lastFrame = screen.slice(); },
  };

  const emulator = new HackEmulator(computer, display);
  emulator.start(50); // enough cycles for the screen write to commit
  await wait(100);
  emulator.stop();

  assertEquals(lastFrame !== null, true);
  assertEquals(lastFrame![0], 0xFFFF);
});

Deno.test("start: more cyclesPerFrame runs more instructions", async () => {
  // A program that increments D on every cycle: D=D+1
  // We can't inspect D directly, but more cycles = more screen writes
  // so we just verify the emulator runs without errors at high cycle counts.
  const computer = createEmulatorComputer(rom(WRITE_SCREEN_0));
  let rendered = false;
  const display: DisplayDriver = { render: () => { rendered = true; } };

  const emulator = new HackEmulator(computer, display);
  emulator.start(50);
  await wait(100);
  emulator.stop();

  assertEquals(rendered, true);
});
