import { assertEquals } from "jsr:@std/assert";
import CPU from "./cpu.ts";
import type { BitTuple } from "../utility.ts";

// --- A-instruction: @42 ---
Deno.test("A-instruction loads A register and addressM", () => {
  const cpu = new CPU();
  // 0000000000101010 (big endian) => [0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0] (little endian)
  cpu.instruction = [
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>;
  cpu.inM = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.addressM, [
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
});

// --- Reset behavior ---
Deno.test("resets program counter on reset", () => {
  const cpu = new CPU();
  cpu.reset = 1;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.pc, [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
});

// --- PC increment ---
Deno.test("increments program counter by default", () => {
  const cpu = new CPU();
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.pc, [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
});

// --- C-instruction: D=A ---
// 1110110000010000 (big endian)
// comp: 011000 (A), dest: 010 (D), jump: 000
// little endian: [0,0,0,0,1,0,0,0,0,0,1,1,0,1,1,1]
Deno.test("C-instruction D=A stores A in D", () => {
  const cpu = new CPU();

  // 1. @7
  cpu.instruction = [
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>; // @7 (little endian)
  cpu.inM = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();

  // 2. D=A
  cpu.instruction = [
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // To check D, do D->A and check addressM
  // D->A: 1110001100001000 (big endian)
  // little endian: [0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,1]
  cpu.instruction = [
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // addressM should now be 7 (from D)
  assertEquals(cpu.addressM, [
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
});

// --- C-instruction: M=D (write to memory) ---
// 1110001100001000 (big endian)
// comp: 000110 (D), dest: 001 (M), jump: 000
// little endian: [0,0,0,1,0,0,0,0,0,1,1,0,0,0,1,1]
Deno.test("C-instruction M=D sets writeM", () => {
  const cpu = new CPU();

  // 1. @5
  cpu.instruction = [
    1,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>; // @5 (little endian)
  cpu.inM = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();

  // 2. D=A
  cpu.instruction = [
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // 3. M=D
  cpu.instruction = [
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    1,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // writeM should be 1 (indicating a write to memory)
  assertEquals(cpu.writeM, 1);
});

// --- C-instruction: D;JGT (jump if D>0) ---
// 1110001100000001 (big endian)
// comp: 000110 (D), dest: 010 (D), jump: 001 (JGT)
// little endian: [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1]
Deno.test("C-instruction D;JGT causes jump when D>0", () => {
  const cpu = new CPU();

  // 1. @1
  cpu.instruction = [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>; // @1 (little endian)
  cpu.inM = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ] as BitTuple<16>;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();
  // 2. D=A
  cpu.instruction = [
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // 3. D;JGT (jump if D>0)
  cpu.instruction = [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    0,
    0,
    0,
    1,
    1,
    1,
  ] as BitTuple<16>;
  cpu.tick();
  cpu.tock();

  // After jump, PC should be set to A (which was 1), so after one more tick/tock it should be 1
  assertEquals(cpu.pc, [
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
});
