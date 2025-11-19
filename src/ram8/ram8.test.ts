import { assertEquals } from "jsr:@std/assert";
import RAM8 from "./ram8.ts";

// 16-bit mask to ensure values are always 16 bits
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("RAM8: outputs 0s initially at all addresses", () => {
  const ram = RAM8();
  for (let addr = 0; addr < 8; addr++) {
    ram.address = addr;
    assertEquals(ram.value, 0);
  }
});

Deno.test("RAM8: can load and read back at each address", () => {
  const ram = RAM8();

  // Write to all addresses
  ram.address = 0b000;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b001;
  ram.in = 0b1010101010101010;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b010;
  ram.in = 0b0101010101010101;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b011;
  ram.in = 0b1100110011001100;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b100;
  ram.in = 0b0011001100110011;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b101;
  ram.in = 0b1001100110011001;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b110;
  ram.in = 0b0110011001100110;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.address = 0b111;
  ram.in = 0b1111000011110000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  // Read back from all addresses
  ram.load = 0;
  const expected = [
    0b1111111111111111,
    0b1010101010101010,
    0b0101010101010101,
    0b1100110011001100,
    0b0011001100110011,
    0b1001100110011001,
    0b0110011001100110,
    0b1111000011110000,
  ];
  for (let addr = 0; addr < 8; addr++) {
    ram.address = addr;
    ram.tick();
    ram.tock();
    assertEquals(ram.value, mask16(expected[addr]));
  }
});

Deno.test("RAM8: writing at one address does not affect others", () => {
  const ram = RAM8();
  ram.address = 0b011;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b000;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);

  ram.address = 0b011;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0b1111111111111111);

  ram.address = 0b111;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM8: can overwrite a value at an address", () => {
  const ram = RAM8();
  ram.address = 0b100;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.in = 0b0000000000000000;
  ram.load = 1;
  ram.tick();
  ram.tock();

  ram.load = 0;
  ram.address = 0b100;
  ram.tick();
  ram.tock();
  assertEquals(ram.value, 0);
});

Deno.test("RAM8: does not change output until tock", () => {
  const ram = RAM8();
  ram.address = 0b001;
  ram.in = 0b1111111111111111;
  ram.load = 1;
  ram.tick();
  assertEquals(ram.value, 0); // Output not updated yet
  ram.tock();
  assertEquals(ram.value, 0b1111111111111111); // Output updated after tock
});
