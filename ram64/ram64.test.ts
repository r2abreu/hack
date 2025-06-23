import { assertEquals } from "jsr:@std/assert";
import RAM64 from "./ram64.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("RAM64: outputs 0s initially at all addresses", () => {
  const ram = RAM64();
  // Check a selection of addresses (first and last in each RAM8 block)
  const addresses = [
    0b000000,
    0b000111,
    0b001000,
    0b001111,
    0b010000,
    0b010111,
    0b011000,
    0b011111,
    0b100000,
    0b100111,
    0b101000,
    0b101111,
    0b110000,
    0b110111,
    0b111000,
    0b111111,
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, 0);
  }
});

Deno.test("RAM64: can load and read back at each address", () => {
  const ram = RAM64();

  // Write to several addresses
  ram.address = 0b000000;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b000111;
  ram.in = 0b1010101010101010;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b111111;
  ram.in = 0b0101010101010101;
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = 0b000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b000111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1010101010101010));

  ram.address = 0b111111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b0101010101010101));
});

Deno.test("RAM64: writing at one address does not affect others", () => {
  const ram = RAM64();
  ram.address = 0b010101;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b010101;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b101010;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM64: can overwrite a value at an address", () => {
  const ram = RAM64();
  ram.address = 0b100110;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = 0b0000000000000000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b100110;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM64: does not change output until tock", () => {
  const ram = RAM64();
  ram.address = 0b001010;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, 0); // Not updated yet
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));
});
