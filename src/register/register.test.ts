import { assertEquals } from "jsr:@std/assert";
import Register from "./register.ts";
import { mask } from "../utility.ts";

// Helper: 16-bit mask (to ensure values are always 16 bits)

Deno.test("Register: outputs 0s initially", () => {
  const register = Register();
  const zero = 0;
  assertEquals(register.value, zero);
});

Deno.test("Register: loads and stores a value", () => {
  const register = Register();
  const value = 0b1100101010100110; // Example 16-bit value

  register.in = value;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, mask(value));
});

Deno.test("Register: holds value when load is 0", () => {
  const register = Register();
  const value = 0b1010101010101010;

  // Store value
  register.in = value;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, mask(value));

  // Change input, load=0, should not update
  const newValue = 0b0101010101010101;
  register.in = newValue;
  register.load = 0;
  register.tick();
  register.tock();
  assertEquals(register.value, mask(value));
});

Deno.test("Register: can overwrite stored value", () => {
  const register = Register();
  const value1 = 0b1010101010101010;
  const value2 = 0b0101010101010101;

  // Store value1
  register.in = value1;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, mask(value1));

  // Store value2
  register.in = value2;
  register.load = 1;
  register.tick();
  register.tock();
  assertEquals(register.value, mask(value2));
});

Deno.test("Register: does not change output until tock", () => {
  const register = Register();
  const value = 0b1111111111111111;
  const zero = 0;

  register.in = value;
  register.load = 1;
  register.tick();
  // Output should not change until tock
  assertEquals(register.value, zero);
  register.tock();
  assertEquals(register.value, mask(value));
});
