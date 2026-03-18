import { filter, pipe, split } from "../fp/fp.ts";

/**
 * @module emulator/main
 *
 * Entry point for the console-based HackEmulator.
 *
 * This file is the **composition root**: it wires a ROM loader, the emulator
 * computer, and the console display driver together.  Swapping to a different
 * platform (e.g., DOM canvas) means writing a new entry point — the core files
 * (`emulator_computer.ts`, `hack_emulator.ts`, `types.ts`) never change.
 *
 * ## Usage
 *
 * ```sh
 * deno run --allow-read emulator/main.ts [path/to/program.txt]
 * ```
 *
 * - The optional argument is a path to a ROM file: a plain-text file where
 *   each line is a 16-bit binary instruction (e.g. `0110000000000001`).
 *   This is the format produced by the nand2tetris Assembler.
 * - If omitted, the ROM defaults to the sample `rom32k/instructions.txt`
 *   included in this repository.
 *
 * Press Ctrl+C to exit.  The terminal cursor and colours are restored on exit.
 *
 * ## Terminal requirements
 *
 * The Hack screen is 512 × 256 pixels.  The console driver renders it as
 * 512 characters wide × 128 lines tall (using Unicode half-block `▀` glyphs).
 * A terminal at least 512 columns wide is recommended for a full-resolution
 * view; narrower terminals will clip the right side.
 */

import { createEmulatorComputer } from "./emulator_computer.ts";
import { HackEmulator } from "./hack_emulator.ts";
import {
  ConsoleDisplayDriver,
  SHOW_CURSOR,
} from "./drivers/console_display.ts";

// ── ROM loader ────────────────────────────────────────────────────────────────

/**
 * Load a ROM from a plain-text file.
 *
 * Each non-empty line in the file must be a 16-bit binary number (e.g.
 * `0000000000000001`).  Line N becomes instruction N (0-indexed), which is
 * what the Hack CPU fetches when the program counter equals N.
 *
 * Returns a function with the same signature as `ROM32K()`: given an address
 * it returns the instruction word, or `undefined` if the address is out of
 * range.  The computer treats `undefined` as a no-op (the CPU will stall or
 * loop depending on the program).
 *
 * @param path  Absolute or relative path to the ROM text file.
 */
const isLineEmpty = (line: string) => line.trim().length > 0;

export function loadRom(path: string): (address: number) => number | undefined {
  const lines = pipe(
    Deno.readTextFileSync, 
    split("\n"), 
    filter(isLineEmpty)
  )(path) as string[]

  return (address: number) => {
    const line = lines[address];
    return line !== undefined ? parseInt(line.trim(), 2) : undefined;
  };
}


// ── Wiring ────────────────────────────────────────────────────────────────────
// Guard with import.meta.main so importing this module in tests does not
// start the emulator or register signal handlers.

if (import.meta.main) {
  const defaultRom = new URL("../rom32k/instructions.txt", import.meta.url)
    .pathname;
  const romPath = Deno.args[0] ?? defaultRom;

  const rom = loadRom(romPath);
  const computer = createEmulatorComputer(rom);
  const display = new ConsoleDisplayDriver();
  const emulator = new HackEmulator(computer, display);

  const enc = new TextEncoder();

  Deno.addSignalListener("SIGINT", () => {
    emulator.stop();
    Deno.stdout.writeSync(enc.encode(SHOW_CURSOR + "\x1b[0m\n"));
    Deno.exit(0);
  });
  emulator.start(10_000);
}
