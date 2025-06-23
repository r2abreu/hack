import { assertEquals } from "jsr:@std/assert";
import CPU from "./cpu.ts";

// Helper to mask to 16 bits
const mask16 = (n: number) => n & 0xFFFF;

// --- A-instruction: @42 ---
Deno.test("A-instruction loads A register and addressM", () => {
  const cpu = new CPU();
  // 42 = 0b0000000000101010
  cpu.instruction = 0b0000000000101010;
  cpu.inM = 0;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.addressM, 42);
});

// --- Reset behavior ---
Deno.test("resets program counter on reset", () => {
  const cpu = new CPU();
  cpu.reset = 1;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.pc, 0);
});

// --- PC increment ---
Deno.test("increments program counter by default", () => {
  const cpu = new CPU();
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();
  assertEquals(cpu.pc, 1);
});

// --- C-instruction: D=A ---
Deno.test("C-instruction D=A stores A in D", () => {
  const cpu = new CPU();

  // 1. @7
  cpu.instruction = 0b0000000000000111; // @7
  cpu.inM = 0;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();

  // 2. D=A (1110110000010000)
  cpu.instruction = 0b1110110000010000;
  cpu.tick();
  cpu.tock();

  // 3. D->A: 1110001100001000
  cpu.instruction = 0b1110001100001000;
  cpu.tick();
  cpu.tock();

  // addressM should now be 7 (from D)
  assertEquals(cpu.addressM, 7);
});

// --- C-instruction: M=D (write to memory) ---
Deno.test("C-instruction M=D sets writeM", () => {
  const cpu = new CPU();

  // 1. @5
  cpu.instruction = 0b0000000000000101; // @5
  cpu.inM = 0;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();

  // 2. D=A (1110110000010000)
  cpu.instruction = 0b1110110000010000;
  cpu.tick();
  cpu.tock();

  // 3. M=D (1110001100001000)
  cpu.instruction = 0b1110001100011000;
  cpu.tick();
  cpu.tock();

  // writeM should be 1 (indicating a write to memory)
  assertEquals(cpu.writeM, 1);
});

// --- C-instruction: D;JGT (jump if D>0) ---
Deno.test("C-instruction D;JGT causes jump when D>0", () => {
  const cpu = new CPU();

  // 1. @1
  cpu.instruction = 0b0000000000000001; // @1
  cpu.inM = 0;
  cpu.reset = 0;
  cpu.tick();
  cpu.tock();

  // 2. D=A (1110110000010000)
  cpu.instruction = 0b1110110000010000;
  cpu.tick();
  cpu.tock();

  // 3. D;JGT (1110001100000001)
  cpu.instruction = 0b1110001100000001;
  cpu.tick();
  cpu.tock();

  // After jump, PC should be set to A (which was 1)
  assertEquals(cpu.pc, 1);
});
