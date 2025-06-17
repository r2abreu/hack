import { assertEquals } from "jsr:@std/assert";
import RAM16K from "./ram16k.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("RAM16K: outputs 0s initially at all addresses", () => {
  const ram = RAM16K();
  // Sample a range of addresses: first, last, and some in between
  const addresses: BitTuple<14>[] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 1
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1], // 63
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 255
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 512
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8192
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 16383
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
});

Deno.test("RAM16K: can load and read back at each address", () => {
  const ram = RAM16K();

  // Write to several addresses
  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1]; // 127
  ram.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 8192
  ram.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);

  ram.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

Deno.test("RAM16K: writing at one address does not affect others", () => {
  const ram = RAM16K();
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 5461
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 10922
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM16K: can overwrite a value at an address", () => {
  const ram = RAM16K();
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]; // 9842
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM16K: does not change output until tock", () => {
  const ram = RAM16K();
  ram.address = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 2730
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Not updated yet
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});
