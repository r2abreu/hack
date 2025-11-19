import { assertEquals } from "jsr:@std/assert";
import RAM16K from "./ram16k.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("RAM16K: outputs 0s initially at all addresses", () => {
  const ram = RAM16K();
  // Sample a range of addresses: first, last, and some in between
  const addresses = [
    0b00000000000000, // 0
    0b00000000000001, // 1
    0b00000011111111, // 255
    0b00000000111111, // 63
    0b00010000000000, // 4096
    0b00100000000000, // 8192
    0b11111111111111, // 16383
  ];
  for (const addr of addresses) {
    ram.address = addr;
    assertEquals(ram.value, 0);
  }
});

Deno.test("RAM16K: can load and read back at each address", () => {
  const ram = RAM16K();

  // Write to several addresses
  ram.address = 0b00000000000000; // 0
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b00000011111111; // 255
  ram.in = 0b1010101010101010;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b00100000000000; // 8192
  ram.in = 0b0101010101010101;
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from those addresses
  ram.load = 0;

  ram.address = 0b00000000000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b00000011111111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1010101010101010));

  ram.address = 0b00100000000000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b0101010101010101));
});

Deno.test("RAM16K: writing at one address does not affect others", () => {
  const ram = RAM16K();
  ram.address = 0b01010101010101; // 5461
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b01010101010101;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));

  ram.address = 0b10101010101010; // 10922
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM16K: can overwrite a value at an address", () => {
  const ram = RAM16K();
  ram.address = 0b10011001100110; // 9830
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = 0b0000000000000000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b10011001100110;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM16K: does not change output until tock", () => {
  const ram = RAM16K();
  ram.address = 0b00101010101010; // 2730
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, 0); // Not updated yet
  ram.tock();
  assertEquals(ram.value, mask16(0b1111111111111111));
});
