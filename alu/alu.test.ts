import { assertEquals } from "jsr:@std/assert";
import alu, { type AluControlBits } from "./alu.ts";

// Helper for binary formatting (optional, for readable error messages)
const bin16 = (n: number) => n.toString(2).padStart(16, "0");

// 0
Deno.test("ALU: computes 0", () => {
  const x = 0b0000000000000000;
  const y = 0b0000000000000000;
  const control: AluControlBits = { zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, 0b0000000000000000, bin16(result.out));
  assertEquals(result.zr, 1);
  assertEquals(result.ng, 0);
});

// 1
Deno.test("ALU: computes 1", () => {
  const x = 0b0000000000000000;
  const y = 0b0000000000000000;
  const control: AluControlBits = { zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 };
  const result = alu(x, y, control);
  assertEquals(result.out, 0b0000000000000001, bin16(result.out));
  assertEquals(result.zr, 0);
  assertEquals(result.ng, 0);
});

// -1 (all bits set)
Deno.test("ALU: computes -1", () => {
  const x = 0b0000000000000000;
  const y = 0b0000000000000000;
  const control: AluControlBits = { zx: 1, nx: 1, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, 0b1111111111111111, bin16(result.out));
  assertEquals(result.zr, 0);
  assertEquals(result.ng, 1);
});

// Passes through x
Deno.test("ALU: passes through x", () => {
  const x = 0b1010101000000000;
  const y = 0b0000000000000000;
  const control: AluControlBits = { zx: 0, nx: 0, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, x, bin16(result.out));
});

// Passes through y
Deno.test("ALU: passes through y", () => {
  const x = 0b0000000000000000;
  const y = 0b0101010100000000;
  const control: AluControlBits = { zx: 1, nx: 0, zy: 0, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, y, bin16(result.out));
});

// Bitwise not x
Deno.test("ALU: bitwise not x", () => {
  const x = 0b1010101000000000;
  const y = 0b0000000000000000;
  const control: AluControlBits = { zx: 0, nx: 1, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, (~x) & 0xFFFF, bin16(result.out)); // 16-bit mask
});

// Add x and y
Deno.test("ALU: add x and y", () => {
  const x = 0b0000000000000001; // 1
  const y = 0b0000000000000011; // 3
  const control: AluControlBits = { zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, 0b0000000000000100, bin16(result.out)); // 4
});

// Bitwise and
Deno.test("ALU: bitwise and", () => {
  const x = 0b1010101000000000;
  const y = 0b1101010100000000;
  const control: AluControlBits = { zx: 0, nx: 0, zy: 0, ny: 0, f: 0, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, x & y, bin16(result.out));
});
