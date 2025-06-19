import and from "../and/and.ts";
import dmux8way from "../dmux8way/dmux8way.ts";
import { alu } from "@r2/hack";
import type { bit, BitTuple } from "../utility.ts";
import not from "../not/not.ts";
import or from "../or/or.ts";
import or8way from "../or8way/or8way.ts";
import mux16 from "../mux16/mux16.ts";
import Register from "../register/register.ts";
import PC from "../pc/pc.ts";
import dmux from "../dmux/dmux.ts";
/**
 * CPU - Hack Central Processing Unit (CPU) chip.
 *
 * Implements the Hack CPU, which executes instructions by interacting with memory and an ALU.
 * The CPU fetches instructions, decodes them, computes results, and manages program control flow.
 *
 * ## Functionality
 * - On each evaluation, the CPU:
 *   - Receives a 16-bit instruction (`instruction`), a 16-bit input from memory (`inM`), and the current reset signal.
 *   - Decodes the instruction to determine ALU operation, destination(s), and jump conditions.
 *   - Computes the ALU output based on the instruction and inputs.
 *   - Updates internal registers (A, D, and PC) according to the instruction's destination and control bits.
 *   - Determines whether to write to memory, which address to use, and what value to output.
 *   - Supports jumps, conditional execution, and reset.
 *
 * ## Interface
 * @module CPU
 *
 * @param {BitTuple<16>} inM - 16-bit input from memory (M register).
 * @param {BitTuple<16>} instruction - 16-bit instruction to execute (from ROM).
 * @param {bit} reset - Reset signal (1: reset PC to 0).
 * @returns {Object} out
 * @returns {BitTuple<16>} out.outM - 16-bit output to memory (value to write when `writeM` is 1).
 * @returns {BitTuple<15>} out.addressM - 15-bit address for memory access (from A register).
 * @returns {bit} out.writeM - Write signal (1: write `outM` to memory at `addressM`).
 * @returns {BitTuple<15>} out.pc - 15-bit program counter value (address of next instruction).
 *
 * ## Example
 * // Evaluating the CPU for a single instruction
 * cpu.inM = [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0]; // Value from memory
 * cpu.instruction = [1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0]; // Some C-instruction
 * cpu.reset = 0;
 * cpu.evaluate(); // Or equivalent method to update outputs
 * let outM = cpu.out.outM;        // Value to write to memory (if writeM)
 * let addressM = cpu.out.addressM; // Address for memory access
 * let writeM = cpu.out.writeM;     // Whether to write to memory
 * let pc = cpu.out.pc;             // Next instruction address
 *
 * // Resetting the CPU
 * cpu.reset = 1;
 * cpu.evaluate();
 * let pc = cpu.out.pc; // Should be 0 after reset
 */
// interface CPU {
//   inM: BitTuple<16>;
//   instruction: BitTuple<16>;
//   reset: bit;
//   readonly outM: BitTuple<16>;
//   readonly addressM: BitTuple<16>;
//   readonly writeM: bit;
//   readonly pc: BitTuple<16>;
//   private alu: ReturnType<typeof alu>;
//   tick(): void;
//   tock(): void;
// }

export default class CPU {
  #a = Register();
  #d = Register();
  #pc = PC();
  #inM = Array(16).fill(0) as BitTuple<16>;
  #instruction = Array(16).fill(0) as BitTuple<16>;
  #reset: bit = 0;

  get #alu() {
    const dout = this.#d.value;
    const aout = this.#a.value;
    const aluy = mux16(aout, this.#inM, this.#instruction[12]);

    return alu(dout, aluy, {
      no: this.#instruction[6],
      f: this.#instruction[7],
      ny: this.#instruction[8],
      zy: this.#instruction[9],
      nx: this.#instruction[10],
      zx: this.#instruction[11],
    });
  }

  get #destination() {
    const [
      destnull,
      destm,
      destd,
      destdm,
      desta,
      destam,
      destad,
      destadm,
    ] = dmux8way(1, this.#instruction.slice(3, 6) as BitTuple<3>);

    return {
      destm,
      destd,
      destdm,
      desta,
      destam,
      destad,
      destadm,
    };
  }

  get #loada() {
    return or8way([
      this.#destination.desta,
      this.#destination.destam,
      this.#destination.destad,
      this.#destination.destadm,
      this.#ainstruction,
      0,
      0,
      0,
    ]);
  }

  get #loadd() {
    return and(
      or8way(
        [
          this.#destination.destd,
          this.#destination.destdm,
          this.#destination.destad,
          this.#destination.destadm,
          0,
          0,
          0,
          0,
        ],
      ),
      this.#cinstruction,
    );
  }

  get #writeM() {
    const outputM = or8way([
      this.#destination.destm,
      this.#destination.destdm,
      this.#destination.destam,
      this.#destination.destadm,
      0,
      0,
      0,
      0,
    ]);

    return and(outputM, this.#cinstruction);
  }

  get #jump() {
    const [
      nulljump,
      JGT,
      JEQ,
      JGE,
      JLT,
      JNE,
      JLE,
      JMP,
    ] = dmux8way(1, this.#instruction.slice(0, 3) as BitTuple<3>);

    const { ng, zr } = this.#alu;
    const alupositive = and(not(zr), not(ng));
    const jumpjgt = and(JGT, alupositive);
    const jumpjeq = and(JEQ, zr);
    const greaterorequal = or(alupositive, zr);
    const jumpjge = and(JGE, greaterorequal);
    const jumpjlt = and(JLT, ng);
    const jumpjne = and(JNE, not(zr));
    const lowerorequal = or(ng, zr);
    const jumpjle = and(JLE, lowerorequal);

    return or8way([
      jumpjgt,
      jumpjeq,
      jumpjge,
      jumpjlt,
      jumpjne,
      jumpjle,
      JMP,
      0,
    ]);
  }

  get outM(): BitTuple<16> {
    return this.#alu.out;
  }
  get writeM(): bit {
    return this.#writeM;
  }
  get pc(): BitTuple<16> {
    return this.#pc.value;
  }
  get addressM(): BitTuple<15> {
    return this.#a.value.slice(0, 15) as BitTuple<15>;
  }

  set inM(val: BitTuple<16>) {
    this.#inM = val;
  }

  get #ainstruction() {
    return dmux(1, this.#instruction[15])[0];
  }

  get #cinstruction() {
    return dmux(1, this.#instruction[15])[1];
  }

  set instruction(val: BitTuple<16>) {
    this.#instruction = val;
  }

  set reset(val: bit) {
    this.#reset = val;
  }

  get #registerain() {
    return mux16(
      this.#alu.out,
      this.#instruction,
      this.#ainstruction,
    );
  }

  tick() {
    this.#a.in = this.#registerain;
    this.#a.load = this.#loada;

    this.#d.in = this.#alu.out;
    this.#d.load = this.#loadd;

    const increment = or(not(this.#jump), this.#ainstruction);
    this.#pc.reset = this.#reset;
    this.#pc.in = this.#a.value;
    this.#pc.load = not(increment);
    this.#pc.inc = increment;

    this.#a.tick();
    this.#d.tick();
    this.#pc.tick();
  }

  tock() {
    this.#a.tock();
    this.#d.tock();
    this.#pc.tock();
  }
}
