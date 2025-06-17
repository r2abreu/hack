import { assertEquals } from "jsr:@std/assert";
import RAM4K from "./ram4k.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("RAM4K: outputs 0s initially at all addresses", () => {
  const ram = RAM4K();
  // Sample a handful of addresses: first, last, and some in between
  const addresses: BitTuple<12>[] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], // 31
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 255
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 256
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 512
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2048
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 4095
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
});

Deno.test("RAM4K: can load and read back at each address", () => {
  const ram = RAM4K();

  // Write to several addresses
  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]; // 31
  ram.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 2048
  ram.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

Deno.test("RAM4K: writing at one address does not affect others", () => {
  const ram = RAM4K();
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 1365
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 2730
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM4K: can overwrite a value at an address", () => {
  const ram = RAM4K();
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]; // 2457
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM4K: does not change output until tock", () => {
  const ram = RAM4K();
  ram.address = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 682
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Not updated yet
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});
