import { assertEquals } from "jsr:@std/assert";
import alu from "./alu.ts";
import type { BitTuple } from "../utility.ts";
import type { AluControlBits } from "./alu.ts";

Deno.test("ALU: computes 0", () => {
  const x: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 1, nx: 0, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assertEquals(result.zr, 1);
  assertEquals(result.ng, 0);
});

Deno.test("ALU: computes 1", () => {
  const x: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 1, nx: 1, zy: 1, ny: 1, f: 1, no: 1 };
  const result = alu(x, y, control);
  assertEquals(result.out, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assertEquals(result.zr, 0);
  assertEquals(result.ng, 0);
});

Deno.test("ALU: computes -1", () => {
  const x: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 1, nx: 1, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  assertEquals(result.zr, 0);
  assertEquals(result.ng, 1);
});

Deno.test("ALU: passes through x", () => {
  const x: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 0, nx: 0, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("ALU: passes through y", () => {
  const x: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 1, nx: 0, zy: 0, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("ALU: bitwise not x", () => {
  const x: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 0, nx: 1, zy: 1, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});

Deno.test("ALU: add x and y", () => {
  const x: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1
  const y: BitTuple<16> = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 3
  const control: AluControlBits = { zx: 0, nx: 0, zy: 0, ny: 0, f: 1, no: 0 };
  const result = alu(x, y, control);
  // 1 + 3 = 4 -> [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0]
  assertEquals(result.out, [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("ALU: bitwise and", () => {
  const x: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const y: BitTuple<16> = [1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  const control: AluControlBits = { zx: 0, nx: 0, zy: 0, ny: 0, f: 0, no: 0 };
  const result = alu(x, y, control);
  assertEquals(result.out, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
