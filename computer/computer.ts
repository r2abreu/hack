import Memory from "../memory/memory.ts";
import CPU from "../cpu/cpu.ts";
import ROM32K from "../rom32k/rom32k.ts";
import { bit } from "../utility.ts";

/**
 * COMPUTER - Top-level Hack computer chip.
 *
 * Integrates the CPU, ROM (program), and unified memory (RAM, screen, keyboard) into a complete, clock-driven computer system.
 * Executes Hack machine language programs by fetching instructions from ROM, processing data, and interacting with memory-mapped I/O.
 *
 * ## Organization
 * - Contains:
 *   - CPU: Executes instructions, manages A/D registers, ALU, and program counter.
 *   - ROM32K: 32K-word, 16-bit wide read-only memory for program instructions.
 *   - MEMORY: 32K-word, 16-bit wide unified memory (RAM, screen, keyboard).
 * - The CPU fetches instructions from ROM and reads/writes data to MEMORY.
 * - Memory-mapped I/O: Screen and keyboard are mapped into the upper part of the address space.
 *
 * ## Operation
 * - On each clock cycle:
 *   - Fetches the next instruction from ROM using the program counter (PC).
 *   - Executes the instruction using the CPU and ALU.
 *   - Reads/writes data to MEMORY as needed.
 *   - Handles jumps and program flow by updating the PC.
 * - Continues until the program ends or the computer is reset.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the computer (processes the current instruction).
 * - Call `tock()` to update outputs and prepare for the next cycle.
 *
 * @module COMPUTER
 *
 * @param {bit} reset - Reset signal (1: reset PC to 0, 0: normal operation).
 *
 * @example
 * // Initialize and run the computer
 * computer.reset = 1; // Reset the computer
 * computer.tick();
 * computer.tock();
 * computer.reset = 0; // Release reset
 * for (let i = 0; i < 1000; i++) {
 *   computer.tick();
 *   computer.tock();
 * }
 */

interface Computer {
  reset: bit;
  tick(): void;
  tock(): void;
}

export default function (): Computer {
  let reset: bit = 0;

  const memory = Memory();
  const rom32k = ROM32K();
  const cpu = new CPU();

  return {
    set reset(val: bit) {
      reset = val;
    },
    tick() {
      cpu.instruction = rom32k(cpu.pc)!;
      cpu.reset = reset;
      cpu.inM = memory.value;

      memory.in = cpu.outM;
      memory.load = cpu.writeM;
      memory.address = cpu.addressM;

      memory.tick();
      cpu.tick();
    },
    tock() {
      memory.tock();
      cpu.tock();
    },
  };
}
