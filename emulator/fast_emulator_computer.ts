/**
 * @module emulator/fast_emulator_computer
 *
 * A high-performance implementation of `EmulatorComputer` that replaces the
 * gate-level chip simulation with direct arithmetic on flat arrays.
 *
 * See `red_pill.md` at the repo root for the full rationale.
 *
 * The public interface (`EmulatorComputer`) is identical to the gate-level
 * version, so `HackEmulator` and display drivers work without changes.
 */

import type { EmulatorComputer } from "./emulator_computer.ts";
import type { bit } from "../utility.ts";

/**
 * Create a fast `EmulatorComputer` driven by the supplied ROM function.
 *
 * Drop-in replacement for `createEmulatorComputer` — same interface, orders of
 * magnitude faster because it uses flat arrays and direct bitwise arithmetic
 * instead of gate-level chip simulation.
 */
export function createFastEmulatorComputer(
  rom: (address: number) => number | undefined,
): EmulatorComputer {
  // ── Registers ───────────────────────────────────────────────────────────
  let regA = 0;
  let regD = 0;
  let pc = 0;

  // ── Memory ──────────────────────────────────────────────────────────────
  // 0–16383: RAM, 16384–24575: Screen, 24576: Keyboard.
  const mem = new Int16Array(32768);

  // Shadow screen buffer for the display driver (unsigned, like the original).
  const shadowScreen = new Uint16Array(8192);

  let resetPin: bit = 0;

  // Pending write captured during tick(), committed during tock().
  let pendingAddr = -1;
  let pendingVal = 0;

  // State captured during tick() for the registers, committed in tock().
  let nextA = 0;
  let nextD = 0;
  let nextPC = 0;

  return {
    set reset(val: bit) {
      resetPin = val;
    },

    tick() {
      const instruction = rom(pc) ?? 0;

      if (resetPin) {
        nextA = regA;
        nextD = regD;
        nextPC = 0;
        pendingAddr = -1;
        return;
      }

      const isC = (instruction & 0x8000) !== 0; // bit 15

      if (!isC) {
        // ── A-instruction ─────────────────────────────────────────────────
        nextA = instruction;
        nextD = regD;
        nextPC = pc + 1;
        pendingAddr = -1;
        return;
      }

      // ── C-instruction ───────────────────────────────────────────────────
      const comp = (instruction >> 6) & 0x7F; // bits 12–6
      const dest = (instruction >> 3) & 0x07; // bits 5–3
      const jump = instruction & 0x07; // bits 2–0

      // ALU input y: A register or M[A] depending on the 'a' bit (bit 12)
      const useM = (comp & 0x40) !== 0;
      const y = useM ? (mem[regA & 0x7FFF] | 0) : regA;

      // ALU computation — matches the Hack ALU truth table exactly.
      const zx = (comp >> 5) & 1;
      const nx = (comp >> 4) & 1;
      const zy = (comp >> 3) & 1;
      const ny = (comp >> 2) & 1;
      const f = (comp >> 1) & 1;
      const no = comp & 1;

      let ax = regD;
      if (zx) ax = 0;
      if (nx) ax = ~ax;

      let ay = y;
      if (zy) ay = 0;
      if (ny) ay = ~ay;

      let out = f ? (ax + ay) : (ax & ay);
      if (no) out = ~out;

      // Truncate to 16-bit signed
      out = (out << 16) >> 16;

      // ── Destination ─────────────────────────────────────────────────────
      nextA = (dest & 0x04) ? out : regA; // bit 2 → A
      nextD = (dest & 0x02) ? out : regD; // bit 1 → D

      if (dest & 0x01) { // bit 0 → M
        const addr = regA & 0x7FFF;
        pendingAddr = addr;
        pendingVal = out;
      } else {
        pendingAddr = -1;
      }

      // ── Jump ────────────────────────────────────────────────────────────
      const isNeg = out < 0;
      const isZero = out === 0;
      const isPos = out > 0;

      let doJump = false;
      switch (jump) {
        case 0:
          break;
        case 1:
          doJump = isPos;
          break; // JGT
        case 2:
          doJump = isZero;
          break; // JEQ
        case 3:
          doJump = !isNeg;
          break; // JGE
        case 4:
          doJump = isNeg;
          break; // JLT
        case 5:
          doJump = !isZero;
          break; // JNE
        case 6:
          doJump = !isPos;
          break; // JLE
        case 7:
          doJump = true;
          break; // JMP
      }

      nextPC = doJump ? (regA & 0x7FFF) : (pc + 1);
    },

    tock() {
      regA = nextA;
      regD = nextD;
      pc = nextPC;

      if (pendingAddr >= 0) {
        mem[pendingAddr] = pendingVal;

        // Update shadow screen buffer if write targets the screen region.
        if (pendingAddr >= 16384 && pendingAddr < 24576) {
          shadowScreen[pendingAddr - 16384] = pendingVal & 0xFFFF;
        }
      }
    },

    readScreen(out: Uint16Array) {
      out.set(shadowScreen);
    },
  };
}
