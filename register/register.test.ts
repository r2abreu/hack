import { assertEquals } from "jsr:@std/assert";
import Register from "./register.ts";
import clock from "../clock/clock.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("Register: outputs 0s initially", () => {
  const register = Register();
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(register(zero, 0), zero);
  assertEquals(register(zero, 1), zero);
});

Deno.test("Register: loads and stores a value", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Set input, load=1, output should still be 0s before tick/tock
  assertEquals(register(value, 1), zero);

  // Tick/tock: value should now be stored
  clock.tick();
  clock.tock();
  assertEquals(register(zero, 0), value);
});

Deno.test("Register: holds value when load is 0", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Store value
  register(value, 1);
  clock.tick();
  clock.tock();
  assertEquals(register(zero, 0), value);

  // Change input, load=0, should not update
  const newValue: BitTuple<16> = [
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  ];
  register(newValue, 0);
  clock.tick();
  clock.tock();
  assertEquals(register(zero, 0), value);
});

Deno.test("Register: can overwrite stored value", () => {
  const register = Register();
  const value1: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const value2: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Store value1
  register(value1, 1);
  clock.tick();
  clock.tock();
  assertEquals(register(zero, 0), value1);

  // Store value2
  register(value2, 1);
  clock.tick();
  clock.tock();
  assertEquals(register(zero, 0), value2);
});

Deno.test("Register: does not change output until tock", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  register(value, 1);
  clock.tick();
  // Output should not change until tock
  assertEquals(register(zero, 0), zero);
  clock.tock();
  assertEquals(register(zero, 0), value);
});
