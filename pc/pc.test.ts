import { assertEquals } from "jsr:@std/assert";
import PC from "./pc.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("PC: outputs 0 initially", () => {
  const pc = PC();
  assertEquals(pc.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("PC: increments correctly", () => {
  const pc = PC();
  pc.inc = 1;
  pc.load = 0;
  pc.reset = 0;
  pc.tick();
  pc.tock();
  // 1 = 0b0000000000000001
  assertEquals(pc.value, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  pc.tick();
  pc.tock();
  // 2 = 0b0000000000000010
  assertEquals(pc.value, [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("PC: load overrides increment", () => {
  const pc = PC();
  pc.inc = 1;
  pc.load = 1;
  pc.reset = 0;
  // 42 = 0b00101010
  pc.in = [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // After loading, increment should work again
  pc.inc = 1;
  pc.load = 0;
  pc.tick();
  pc.tock();
  // 43 = 0b00101011
  assertEquals(pc.value, [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("PC: reset overrides load and increment", () => {
  const pc = PC();
  // Set to a nonzero value, 1234 = 0b0000010011010010
  pc.in = [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0];
  pc.load = 1;
  pc.inc = 0;
  pc.reset = 0;
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0]);
  // Now try increment + reset
  pc.inc = 1;
  pc.load = 0;
  pc.reset = 1;
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // Reset always wins
  // 9999 = 0b0010011100001111
  pc.in = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0];
  pc.load = 1;
  pc.inc = 1;
  pc.reset = 1;
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("PC: holds value when all control signals are 0", () => {
  const pc = PC();
  // Set to 7 = 0b0000000000000111
  pc.in = [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  pc.load = 1;
  pc.inc = 0;
  pc.reset = 0;
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // Now hold
  pc.load = 0;
  pc.inc = 0;
  pc.reset = 0;
  pc.tick();
  pc.tock();
  assertEquals(pc.value, [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("PC: does not change output until tock", () => {
  const pc = PC();
  pc.inc = 1;
  pc.tick();
  // Value should not be updated yet
  assertEquals(pc.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  pc.tock();
  assertEquals(pc.value, [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
