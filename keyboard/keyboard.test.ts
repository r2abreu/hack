import { assertEquals } from "jsr:@std/assert";
import Keyboard from "./keyboard.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("Keyboard: outputs 0s initially", () => {
  const keyboard = Keyboard();
  assertEquals(keyboard.value, 0);
});

Deno.test("Keyboard: loads and stores a value", () => {
  const keyboard = Keyboard();
  const value = 0b1001101010100110;

  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value));
});

Deno.test("Keyboard: holds value when load is 0", () => {
  const keyboard = Keyboard();
  const value = 0b1010101010101010;

  // Store value
  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value));

  // Change input, load=0, should not update
  const newValue = 0b0101010101010101;
  keyboard.in = newValue;
  keyboard.load = 0;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value));
});

Deno.test("Keyboard: can overwrite stored value", () => {
  const keyboard = Keyboard();
  const value1 = 0b1010101010101010;
  const value2 = 0b0101010101010101;

  // Store value1
  keyboard.in = value1;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value1));

  // Store value2
  keyboard.in = value2;
  keyboard.load = 1;
  keyboard.tick();
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value2));
});

Deno.test("Keyboard: does not change output until tock", () => {
  const keyboard = Keyboard();
  const value = 0b1111111111111111;
  const zero = 0;

  keyboard.in = value;
  keyboard.load = 1;
  keyboard.tick();
  // Output should not change until tock
  assertEquals(keyboard.value, zero);
  keyboard.tock();
  assertEquals(keyboard.value, mask16(value));
});
