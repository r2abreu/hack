/**
 * @module web/main
 *
 * Browser entry point for the Hack emulator.
 *
 * Wires together:
 *   - The LOL ROM (assembled binary, imported as a raw text asset by Vite)
 *   - `EmulatorComputer`  — chip-level simulation
 *   - `CanvasDisplayDriver` — renders pixels onto the <canvas> element
 *   - `HackEmulator`      — the platform-agnostic clock loop
 *
 * To run:
 *   cd web && npm install && npm run dev
 */

import { createEmulatorComputer } from "../emulator/emulator_computer.ts";
import { HackEmulator } from "../emulator/hack_emulator.ts";
import { CanvasDisplayDriver } from "../emulator/drivers/canvas_display.ts";

// Vite's `?raw` suffix imports the file contents as a plain string at
// bundle time — no fetch required, no async loading.
import lolHack from "../programs/lol.hack?raw";

// ── ROM loader ────────────────────────────────────────────────────────────────

/**
 * Parse an assembled `.hack` file (one 16-bit binary string per line) into
 * the ROM function expected by `createEmulatorComputer`.
 *
 * @param hack  Raw text content of the `.hack` file.
 * @returns     A function mapping instruction address → 16-bit value.
 */
function parseRom(hack: string): (address: number) => number | undefined {
  const lines = hack.split("\n").filter((l) => l.trim().length > 0);
  return (address) => {
    const line = lines[address];
    return line !== undefined ? parseInt(line.trim(), 2) : undefined;
  };
}

// ── Wiring ────────────────────────────────────────────────────────────────────

const canvas = document.getElementById("screen") as HTMLCanvasElement;

const rom = parseRom(lolHack);
const computer = createEmulatorComputer(rom);
const display = new CanvasDisplayDriver(canvas);
const emulator = new HackEmulator(computer, display);

// 10 000 cycles per frame gives the LOL program plenty of time to draw before
// the first render, while keeping the loop smooth at ~60 fps.
emulator.start(10_000);
