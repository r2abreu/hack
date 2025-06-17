import { assertEquals } from "jsr:@std/assert";
import RAM64 from "./ram64.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("RAM64: outputs 0s initially at all addresses", () => {
  const ram = RAM64();
  // Check all 8 RAM8s, first and last register in each
  const addresses: BitTuple<6>[] = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1],
    [0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1],
    [0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1],
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
});

Deno.test("RAM64: can load and read back at each address", () => {
  const ram = RAM64();

  // Write to several addresses
  ram.address = [0, 0, 0, 0, 0, 0];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [0, 0, 0, 1, 1, 1];
  ram.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = [1, 1, 1, 1, 1, 1];
  ram.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = [0, 0, 0, 0, 0, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [0, 0, 0, 1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);

  ram.address = [1, 1, 1, 1, 1, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

Deno.test("RAM64: writing at one address does not affect others", () => {
  const ram = RAM64();
  ram.address = [0, 1, 0, 1, 0, 1];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [0, 1, 0, 1, 0, 1];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

  ram.address = [1, 0, 1, 0, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM64: can overwrite a value at an address", () => {
  const ram = RAM64();
  ram.address = [1, 0, 0, 1, 1, 0];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = [1, 0, 0, 1, 1, 0];
  ram.tick();
  ram.tock();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

Deno.test("RAM64: does not change output until tock", () => {
  const ram = RAM64();
  ram.address = [0, 0, 1, 0, 1, 0];
  ram.in = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Not updated yet
  ram.tock();
  assertEquals(ram.value, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
});
