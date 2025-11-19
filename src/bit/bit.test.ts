import { assertEquals } from "jsr:@std/assert";
import Bit from "./bit.ts"; // Adjust the import as needed

Deno.test("Bit: outputs 0 initially", () => {
  const bit = Bit(0, 0);
  assertEquals(bit.value, 0);
});

Deno.test("Bit: loads and stores a 1", () => {
  const bit = Bit(0, 0);
  assertEquals(bit.value, 0);

  bit.in = 1;
  bit.load = 1;
  bit.tick();
  bit.tock();

  assertEquals(bit.value, 1);
});

Deno.test("Bit: holds value when load is 0", () => {
  const bit = Bit(0, 0);

  bit.in = 1;
  bit.load = 1;
  bit.tick();
  bit.tock();
  assertEquals(bit.value, 1);

  bit.in = 0;
  bit.load = 0;
  bit.tick();
  bit.tock();
  assertEquals(bit.value, 1); // Should still hold the previous value
});

Deno.test("Bit: can reset to 0 when load is 1", () => {
  const bit = Bit(0, 0);

  bit.in = 1;
  bit.load = 1;
  bit.tick();
  bit.tock();
  assertEquals(bit.value, 1);

  bit.in = 0;
  bit.load = 1;
  bit.tick();
  bit.tock();
  assertEquals(bit.value, 0);
});

Deno.test("Bit: does not change output until tock", () => {
  const bit = Bit(0, 0);

  bit.in = 1;
  bit.load = 1;
  bit.tick();
  assertEquals(bit.value, 0); // Output not updated yet
  bit.tock();
  assertEquals(bit.value, 1); // Output updated after tock
});
