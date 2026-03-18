/**
 * @module emulator/emulator_computer
 *
 * EmulatorComputer wraps the same chips used by the standard `Computer` chip
 * but keeps direct references to `Screen` and `Keyboard` so the emulator can:
 *
 *   1. Read all 8 192 screen words after each frame (via a shadow buffer).
 *   2. Inject host key codes into the keyboard register (Phase 2).
 *
 * Why not reuse `Computer` from `computer/computer.ts`?
 * Because that factory encloses `Memory`, `Screen`, and `Keyboard` in a private
 * closure with no escape hatch. `EmulatorComputer` duplicates the wiring (~30
 * lines) using the **same imported chips** so no existing behaviour changes.
 *
 * ## Shadow screen buffer
 *
 * Reading screen state by iterating all 8 192 addresses is non-trivial: the RAM
 * hierarchy only propagates the address to ONE sub-chip per `tick()`, so a naive
 * scan would read stale data from the other sub-chips. Instead we intercept every
 * screen write during `tick()` and commit it to a `Uint16Array` in `tock()`.
 * This is O(1) per CPU write and O(8 192) for the bulk copy in `readScreen()`.
 *
 * ## `lastAddr` and memory-read timing
 *
 * The original `computer.ts` reads `memory.value` **before** updating
 * `memory.address`. That means the CPU sees the value at the address that was
 * current at the END of the previous cycle — which is the correct Hack behaviour
 * (M always refers to the A register from the previous instruction boundary).
 * We replicate this by saving `cpu.addressM` into `lastAddr` at the end of each
 * `tick()` and using it to route `cpu.inM` at the start of the next `tick()`.
 */

import SCREEN from "../screen/screen.ts";
import RAM16K from "../ram16k/ram16k.ts";
import Keyboard from "../keyboard/keyboard.ts";
import CPU from "../cpu/cpu.ts";
import dmux from "../dmux/dmux.ts";
import mux16 from "../mux16/mux16.ts";
import { index, sliceBits, type bit } from "../utility.ts";

/** Public surface exposed to `HackEmulator`. */
export interface EmulatorComputer {
  /** Drive the reset pin high for one cycle to restart the program counter. */
  reset: bit;

  /**
   * Phase 1 of the clock cycle.
   * Feeds inputs into all chips, propagates combinational logic, and latches
   * new state (but does not commit it yet — that happens in `tock()`).
   */
  tick(): void;

  /**
   * Phase 2 of the clock cycle.
   * Commits latched state across all chips and updates their output values.
   * Also commits any pending screen write to the shadow buffer.
   */
  tock(): void;

  /**
   * Copy the current shadow screen buffer into `out`.
   * Call this after `tock()` to get a consistent snapshot of all 8 192 words.
   *
   * @param out  A `Uint16Array` of length 8 192 to write into.
   */
  readScreen(out: Uint16Array): void;
}

/**
 * Create an `EmulatorComputer` driven by the supplied ROM function.
 *
 * @param rom  A function that maps an instruction address (0–32 767) to the
 *             16-bit machine-code word stored there, or `undefined` if the
 *             address is out of range. This matches the shape returned by the
 *             `ROM32K` factory from `rom32k/rom32k.ts`.
 */
export function createEmulatorComputer(
  rom: (address: number) => number | undefined,
): EmulatorComputer {
  // ── Chips ────────────────────────────────────────────────────────────────
  // These are the exact same chip instances the standard Computer uses;
  // we just hold onto them directly instead of letting them hide in a closure.
  const screen = SCREEN();
  const ram = RAM16K();
  const keyboard = Keyboard(); // Phase 1: never written; always reads 0.
  const cpu = new CPU();

  // ── State ─────────────────────────────────────────────────────────────────
  let reset: bit = 0;

  /**
   * The memory address that was active at the end of the previous `tick()`.
   * Used to route `cpu.inM` at the start of the next `tick()` so that the CPU
   * reads from the address set by the previous instruction (correct Hack timing).
   */
  let lastAddr = 0;

  /**
   * Shadow copy of every screen word that has been written.
   * Initialised to all-white (0), matching the Hack platform power-on state.
   */
  const shadowScreen = new Uint16Array(8_192);

  /**
   * Stores a pending screen write between `tick()` and `tock()`.
   * We capture the write target in `tick()` (when `cpu.outM` is valid) and
   * commit it to `shadowScreen` in `tock()` (after the chip state settles).
   */
  let pendingWrite: { addr: number; val: number } | null = null;

  return {
    set reset(val: bit) {
      reset = val;
    },

    tick() {
      // ── Step 1: Supply the CPU with the next instruction ─────────────────
      // `cpu.pc` is the program counter value settled from the last `tock()`.
      cpu.instruction = rom(cpu.pc) ?? 0;
      cpu.reset = reset;

      // ── Step 2: Feed memory output into the CPU (cpu.inM) ────────────────
      // We use `lastAddr` (the address from the previous cycle) so the CPU sees
      // M = memory[A] at the time the instruction was decoded — not the address
      // the current instruction is about to write to.
      //
      // Address bit 14: 0 → RAM, 1 → peripherals (screen / keyboard).
      // Address bit 13: 0 → screen, 1 → keyboard.
      const peripheralOut = mux16(
        screen.value, // screen is at peripheral bit-13 = 0
        keyboard.value, // keyboard at bit-13 = 1 (always 0 in Phase 1)
        index(lastAddr, 13),
      );
      cpu.inM = mux16(ram.value, peripheralOut, index(lastAddr, 14));

      // ── Step 3: Decode the write address for this cycle ──────────────────
      // `cpu.addressM` is the current A-register value (15 bits).
      // Save it so the next tick() can use it as `lastAddr`.
      const addr = cpu.addressM;
      lastAddr = addr;

      // ── Step 4: Route CPU write signals to the correct chip ──────────────
      // dmux(signal, selector) → [if-sel-0, if-sel-1]
      const [loadRam, loadPeripheral] = dmux(cpu.writeM, index(addr, 14));
      const [loadScreen, _loadKeyboard] = dmux(loadPeripheral, index(addr, 13));

      // RAM (bit 14 = 0)
      ram.in = cpu.outM;
      ram.load = loadRam;
      ram.address = sliceBits(addr, 0, 15); // RAM16K uses 14-bit addresses

      // Screen (bit 14 = 1, bit 13 = 0); 13-bit word index inside the screen
      screen.in = cpu.outM;
      screen.load = loadScreen;
      screen.address = sliceBits(addr, 0, 13);

      // Keyboard: never written by the CPU in the Hack spec — no injection yet.
      keyboard.in = 0;
      keyboard.load = 0;

      // ── Step 5: Track screen write for the shadow buffer ─────────────────
      // We capture the write HERE (in tick) because `cpu.outM` holds the
      // correct ALU result for the current instruction before tock() commits.
      if (loadScreen) {
        pendingWrite = { addr: sliceBits(addr, 0, 13), val: cpu.outM };
      } else {
        pendingWrite = null;
      }

      // ── Step 6: Advance all chips through phase 1 ─────────────────────────
      ram.tick();
      screen.tick();
      keyboard.tick();
      cpu.tick();
    },

    tock() {
      // Commit all chip state from tick().
      ram.tock();
      screen.tock();
      keyboard.tock();
      cpu.tock();

      // Commit the screen write (if any) to our shadow buffer.
      // This happens AFTER chip tocks so the shadow matches committed chip state.
      if (pendingWrite !== null) {
        shadowScreen[pendingWrite.addr] = pendingWrite.val;
        pendingWrite = null;
      }
    },

    readScreen(out: Uint16Array) {
      // Bulk-copy the shadow buffer into the caller's array.
      // TypedArray.set() uses a native memory copy — much faster than a JS loop.
      out.set(shadowScreen);
    },
  };
}
