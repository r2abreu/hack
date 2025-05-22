import { assertEquals } from "jsr:@std/assert";
import Bit from "./bit.ts";
import clock from "../clock/clock.ts"; // Adjust as needed

Deno.test("Bit: outputs 0 initially", () => {
  const bit = Bit();
  assertEquals(bit(0, 0), 0);
  assertEquals(bit(1, 0), 0);
});

Deno.test("Bit: loads and stores a 1", () => {
  const bit = Bit();
  assertEquals(bit(1, 1), 0); // Set input=1, load=1, output still 0
  clock.tick();
  clock.tock();
  assertEquals(bit(0, 0), 1); // Output updates to 1
});

Deno.test("Bit: holds value when load is 0", () => {
  const bit = Bit();
  bit(1, 1); // Prepare to store 1
  clock.tick();
  clock.tock();
  assertEquals(bit(0, 0), 1); // Output is 1

  bit(0, 0); // load=0, input=0, should not change
  clock.tick();
  clock.tock();
  assertEquals(bit(0, 0), 1); // Output still 1
});

Deno.test("Bit: can reset to 0 when load is 1", () => {
  const bit = Bit();
  bit(1, 1);
  clock.tick();
  clock.tock();
  assertEquals(bit(0, 0), 1);

  bit(0, 1); // load=1, input=0, should store 0
  clock.tick();
  clock.tock();
  assertEquals(bit(0, 0), 0);
});

Deno.test("Bit: does not change output until tock", () => {
  const bit = Bit();
  bit(1, 1);
  clock.tick();
  assertEquals(bit(0, 0), 0); // Output not updated yet
  clock.tock();
  assertEquals(bit(0, 0), 1); // Output updated after tock
});
