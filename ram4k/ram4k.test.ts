import { assertEquals } from "jsr:@std/assert";
import RAM4K from "./ram4k.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("RAM4K: outputs 0s initially at all addresses", () => {
  const ram = RAM4K();
  // Sample a handful of addresses: first, last, and some in between
  const addresses = [
    0b000000000000, // 0
    0b000000000001, // 1
    0b000001111111, // 31
    0b000111111111, // 255
    0b001000000000, // 256
    0b010000000000, // 512
    0b100000000000, // 2048
    0b111111111111, // 4095
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, 0);
  }
});

Deno.test("RAM4K: can load and read back at each address", () => {
  const ram = RAM4K();

  // Write to several addresses
  ram.address = 0b000000000000; // 0
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b000001111111; // 31
  ram.in = 0b1010101010101010;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b100000000000; // 2048
  ram.in = 0b0101010101010101;
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = 0b000000000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b000001111111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1010101010101010));

  ram.address = 0b100000000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b0101010101010101));
});

Deno.test("RAM4K: writing at one address does not affect others", () => {
  const ram = RAM4K();
  ram.address = 0b010101010101; // 1365
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b010101010101;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b101010101010; // 2730
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM4K: can overwrite a value at an address", () => {
  const ram = RAM4K();
  ram.address = 0b100110011001; // 2457
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = 0b0000000000000000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b100110011001;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM4K: does not change output until tock", () => {
  const ram = RAM4K();
  ram.address = 0b001010101010; // 682
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, 0); // Not updated yet
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));
});
