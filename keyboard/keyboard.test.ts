import { assertEquals } from "jsr:@std/assert";
import Keyboard from "./keyboard.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("Keyboard: outputs 0s initially", () => {
  const keyboard = Keyboard();
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  assertEquals(keyboard.value, zero);
});

Deno.test("Keyboard: loads and stores a value", () => {
  const keyboard = Keyboard();
  const value: BitTuple<16> = [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1];

  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, value);
});

Deno.test("Keyboard: holds value when load is 0", () => {
  const keyboard = Keyboard();
  const value: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];

  // Store value
  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, value);

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
  keyboard.in = newValue;
  keyboard.load = 0;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, value);
});

Deno.test("Keyboard: can overwrite stored value", () => {
  const keyboard = Keyboard();
  const value1: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const value2: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

  // Store value1
  keyboard.in = value1;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, value1);

  // Store value2
  keyboard.in = value2;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, value2);
});

Deno.test("Keyboard: does not change output until tock", () => {
  const keyboard = Keyboard();
  const value: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const zero: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  // Output should not change until tock
  assertEquals(keyboard.value, zero);
  keyboard.tock();
  assertEquals(keyboard.value, value);
});
