import { assertEquals } from "jsr:@std/assert";
import Register from "./register.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("Register: outputs 0s initially", () => {
  const register = Register();
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(register.value, zero);
});

Deno.test("Register: loads and stores a value", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1];

  register.in = value;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, value);
});

Deno.test("Register: holds value when load is 0", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];

  // Store value
  register.in = value;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, value);

  // Change input, load=0, should not update
  const newValue: BitTuple<16> = [
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
    0,
    1,
  ];
  register.in = newValue;
  register.load = 0;
  register.tick();
  register.tock();
  assertEquals(register.value, value);
});

Deno.test("Register: can overwrite stored value", () => {
  const register = Register();
  const value1: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const value2: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

  // Store value1
  register.in = value1;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, value1);

  // Store value2
  register.in = value2;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, value2);
});

Deno.test("Register: does not change output until tock", () => {
  const register = Register();
  const value: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  register.in = value;
  register.load = 1;
  register.tick();
  // Output should not change until tock
  assertEquals(register.value, zero);
  register.tock();
  assertEquals(register.value, value);
});
