import and from "../and/and.ts";
import dmux8way from "../dmux8way/dmux8way.ts";
import { alu } from "@r2/hack";
import not from "../not/not.ts";
import or from "../or/or.ts";
import or8way from "../or8way/or8way.ts";
import mux16 from "../mux16/mux16.ts";
import Register from "../register/register.ts";
import PC from "../pc/pc.ts";
import dmux from "../dmux/dmux.ts";
import { index, sliceBits } from "../utility.ts";

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
 * @module CPU
 *
 * @param {number} inM - 16-bit input from memory (M register, only lowest 16 bits used).
 * @param {number} instruction - 16-bit instruction to execute (from ROM, only lowest 16 bits used).
 * @param {0|1} reset - Reset signal (1: reset PC to 0).
 * @returns {Object} out
 * @returns {number} out.outM - 16-bit output to memory (value to write when `writeM` is 1).
 * @returns {number} out.addressM - 15-bit address for memory access (from A register, only lowest 15 bits used).
 * @returns {0|1} out.writeM - Write signal (1: write `outM` to memory at `addressM`).
 * @returns {number} out.pc - 15-bit program counter value (address of next instruction, only lowest 15 bits used).
 *
 * ## Example
 * // Evaluating the CPU for a single instruction
 * cpu.inM = 0b000000000001010; // Value from memory
 * cpu.instruction = 0b1110101010101010; // Some C-instruction
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
export default class CPU {
  #a = Register();
  #d = Register();
  #pc = PC();
  #inM = 0;
  #instruction = 0;
  #reset = 0;

  get #alu() {
    const dout = this.#d.value;
    const aout = this.#a.value;
    const aluy = mux16(aout, this.#inM, index(this.#instruction, 12));

    return alu(dout, aluy, {
      no: index(this.#instruction, 6),
      f: index(this.#instruction, 7),
      ny: index(this.#instruction, 8),
      zy: index(this.#instruction, 9),
      nx: index(this.#instruction, 10),
      zx: index(this.#instruction, 11),
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
    ] = dmux8way(1, sliceBits(this.#instruction, 3, 3));

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
    return or8way(
      parseInt(
        [
          this.#destination.desta,
          this.#destination.destam,
          this.#destination.destad,
          this.#destination.destadm,
          this.#ainstruction,
          0,
          0,
          0,
        ].join(""),
        2,
      ),
    );
  }

  get #loadd() {
    return and(
      or8way(
        parseInt(
          [
            this.#destination.destd,
            this.#destination.destdm,
            this.#destination.destad,
            this.#destination.destadm,
            0,
            0,
            0,
            0,
          ].join(""),
          2,
        ),
      ),
      this.#cinstruction,
    );
  }

  get #writeM() {
    const outputM = or8way(parseInt(
      [
        this.#destination.destm,
        this.#destination.destdm,
        this.#destination.destam,
        this.#destination.destadm,
        0,
        0,
        0,
        0,
      ].join(""),
      2,
    ));

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
    ] = dmux8way(1, sliceBits(this.#instruction, 0, 3));

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

    return or8way(parseInt(
      [
        jumpjgt,
        jumpjeq,
        jumpjge,
        jumpjlt,
        jumpjne,
        jumpjle,
        JMP,
        0,
      ].join(""),
      2,
    ));
  }

  get outM(): number {
    return this.#alu.out;
  }
  get writeM(): number {
    return this.#writeM;
  }
  get pc(): number {
    return this.#pc.value;
  }
  get addressM(): number {
    return sliceBits(this.#a.value, 0, 15);
  }

  set inM(val: number) {
    this.#inM = val;
  }

  get #ainstruction() {
    return dmux(1, index(this.#instruction, 15))[0];
  }

  get #cinstruction() {
    return dmux(1, index(this.#instruction, 15))[1];
  }

  set instruction(val: number) {
    this.#instruction = val;
  }

  set reset(val: number) {
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
