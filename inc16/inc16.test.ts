import { assertEquals } from "jsr:@std/assert";
import inc16 from "./inc16.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("inc16: increments zero", () => {
  const input: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const expected = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(inc16(input), expected);
});

Deno.test("inc16: increments one", () => {
  const input: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const expected = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(inc16(input), expected);
});

Deno.test("inc16: increments a middle value", () => {
  const input: BitTuple<16> = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 15
  const expected = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 16
  assertEquals(inc16(input), expected);
});

Deno.test("inc16: increments max value (wraps to zero)", () => {
  const input: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // 65535
  const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0
  assertEquals(inc16(input), expected);
});
