import { assertEquals } from "jsr:@std/assert";
import RAM512 from "./ram512.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("RAM512: outputs 0s initially at all addresses", () => {
  const ram = RAM512();
  // Test a sample of addresses: first, last, and some in between
  const addresses: BitTuple<9>[] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0, 0, 0, 0, 0, 0, 1, 1, 1], // 7
    [0, 0, 0, 0, 1, 1, 1, 1, 1], // 63
    [0, 0, 1, 0, 0, 0, 0, 0, 0], // 64
    [0, 1, 0, 0, 0, 0, 0, 0, 0], // 128
    [1, 0, 0, 0, 0, 0, 0, 0, 0], // 256
    [1, 1, 1, 1, 1, 1, 1, 1, 1], // 511
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
});

Deno.test("RAM512: can load and read back at each address", () => {
  const ram = RAM512();

  // Write to several addresses
  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 0, 0, 0, 0, 0, 1, 1, 1]; // 7
  ram.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0]; // 256
  ram.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [0, 0, 0, 0, 0, 0, 1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

Deno.test("RAM512: writing at one address does not affect others", () => {
  const ram = RAM512();
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0]; // 170
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [1, 0, 1, 0, 1, 0, 1, 0, 1]; // 341
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM512: can overwrite a value at an address", () => {
  const ram = RAM512();
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1]; // 307
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM512: does not change output until tock", () => {
  const ram = RAM512();
  ram.address = [0, 0, 1, 0, 1, 0, 1, 0, 1]; // 85
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Not updated yet
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});
