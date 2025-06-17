import { assertEquals } from "jsr:@std/assert";
import RAM8 from "./ram8.ts";

Deno.test("RAM8: outputs 0s initially at all addresses", () => {
  const ram = RAM8();
  ram.address = [0, 0, 0];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [0, 0, 1];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [0, 1, 0];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [0, 1, 1];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [1, 0, 0];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [1, 0, 1];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [1, 1, 0];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ram.address = [1, 1, 1];
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM8: can load and read back at each address", () => {
  const ram = RAM8();

  // Write to all addresses
  ram.address = [0, 0, 0];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 0, 1];
  ram.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 1, 0];
  ram.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 1, 1];
  ram.in = [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 0, 0];
  ram.in = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 0, 1];
  ram.in = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 1, 0];
  ram.in = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 1, 1];
  ram.in = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from all addresses
  ram.load = 0;
  ram.address = [0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [0, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);

  ram.address = [0, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);

  ram.address = [0, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]);

  ram.address = [1, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]);

  ram.address = [1, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);

  ram.address = [1, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]);

  ram.address = [1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]);
});

Deno.test("RAM8: writing at one address does not affect others", () => {
  const ram = RAM8();
  ram.address = [0, 1, 1];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  ram.address = [0, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM8: can overwrite a value at an address", () => {
  const ram = RAM8();
  ram.address = [1, 0, 0];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [1, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM8: does not change output until tock", () => {
  const ram = RAM8();
  ram.address = [0, 0, 1];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Output not updated yet
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); // Output updated after tock
});
