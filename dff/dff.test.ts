import { assertEquals } from "jsr:@std/assert";
import DFF from "./dff.ts";

Deno.test("DFF: outputs 0 initially", () => {
  const dff = DFF();
  assertEquals(dff.value, 0);
  dff.value = 1;
  assertEquals(dff.value, 0);
});

Deno.test("DFF: latches input on tick and updates output on tock", () => {
  const dff = DFF();

  // Set input to 1, output should still be 0
  dff.value = 1;
  assertEquals(dff.value, 0);

  // Tick: sample input
  dff.tick();

  // Output should still be 0 before tock
  assertEquals(dff.value, 0);

  // Tock: output updates to previous input
  dff.tock();
  assertEquals(dff.value, 1);

  // Change input to 0, output remains 1 until next tick/tock
  dff.value = 0;
  assertEquals(dff.value, 1);
  dff.tick();
  assertEquals(dff.value, 1);
  dff.tock();
  assertEquals(dff.value, 0);
});

Deno.test("DFF: handles multiple cycles", () => {
  const dff = DFF();

  // Cycle 1: input 1
  dff.value = 1;
  dff.tick();
  dff.tock();
  assertEquals(dff.value, 1);

  // Cycle 2: input 0
  dff.value = 0;
  dff.tick();
  dff.tock();
  assertEquals(dff.value, 0);

  // Cycle 3: input 1
  dff.value = 1;
  dff.tick();
  dff.tock();
  assertEquals(dff.value, 1);
});
