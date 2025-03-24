import { assertEquals } from "jsr:@std/assert";
import add16 from "./add16.ts";
import { BitTuple } from "../utility.ts";

Deno.test("add16: adds two zero arrays", () => {
  const a: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const b: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(add16(a, b), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("add16: adds one and zero", () => {
  const a: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const b: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(add16(a, b), [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("add16: adds two numbers without overflow", () => {
  const a: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1+4+16+64 = 85
  const b: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]; // 2+8+32+128 = 170
  // 85 + 170 = 255 = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]
  assertEquals(add16(a, b), [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("add16: adds two max arrays (overflow)", () => {
  const a: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const b: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  // 65535 + 65535 = 131070, lower 16 bits: 1111111111111110
  assertEquals(add16(a, b), [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});

Deno.test("add16: adds with carry from lower to higher bits", () => {
  const a: BitTuple<16> = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const b: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // 15 + 1 = 16 = [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
  assertEquals(add16(a, b), [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
