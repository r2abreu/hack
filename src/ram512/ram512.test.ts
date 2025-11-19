import { assertEquals } from "jsr:@std/assert";
import RAM512 from "./ram512.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("RAM512: outputs 0s initially at all addresses", () => {
  const ram = RAM512();
  // Test a sample of addresses: first, last, and some in between
  const addresses = [
    0b000000000, // 0
    0b000000001, // 1
    0b000000111, // 7
    0b000111111, // 63
    0b001000000, // 64
    0b010000000, // 128
    0b100000000, // 256
    0b111111111, // 511
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, 0);
  }
});

Deno.test("RAM512: can load and read back at each address", () => {
  const ram = RAM512();

  // Write to several addresses
  ram.address = 0b000000000; // 0
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b000000111; // 7
  ram.in = 0b1010101010101010;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b100000000; // 256
  ram.in = 0b0101010101010101;
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = 0b000000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b000000111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1010101010101010));

  ram.address = 0b100000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b0101010101010101));
});

Deno.test("RAM512: writing at one address does not affect others", () => {
  const ram = RAM512();
  ram.address = 0b010101010; // 170
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b010101010;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b101010101; // 341
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM512: can overwrite a value at an address", () => {
  const ram = RAM512();
  ram.address = 0b100110011; // 307
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = 0b0000000000000000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b100110011;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM512: does not change output until tock", () => {
  const ram = RAM512();
  ram.address = 0b001010101; // 85
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, 0); // Not updated yet
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));
});
