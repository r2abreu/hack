import SCREEN from "./screen.ts";
import { assertEquals } from "jsr:@std/assert";

// Helper to ensure 16-bit values
const mask16 = (n: number) => n & 0xFFFF;

Deno.test("SCREEN writes and reads from first RAM4K chip (address MSB = 0)", () => {
  const screen = SCREEN();

  // Write value 0b1010101010101010 at address 0 (MSB = 0)
  screen.in = 0b1010101010101010;
  screen.address = 0b0000000000000; // 13 bits, MSB = 0
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Read back
  screen.load = 0;
  screen.tick();
  screen.tock();
  assertEquals(screen.value, mask16(0b1010101010101010));
});

Deno.test("SCREEN writes and reads from second RAM4K chip (address MSB = 1)", () => {
  const screen = SCREEN();

  // Write value 0b0101010101010101 at address 0b1000000000000 (MSB = 1)
  screen.in = 0b0101010101010101;
  screen.address = 0b1000000000000; // 13 bits, MSB = 1
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Read back
  screen.load = 0;
  screen.tick();
  screen.tock();
  assertEquals(screen.value, mask16(0b0101010101010101));
});

Deno.test("SCREEN does not overwrite when load=0", () => {
  const screen = SCREEN();

  // Write value at address 0
  screen.in = 0b1111000011110000;
  screen.address = 0b0000000000000;
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Try to write a different value with load=0
  screen.in = 0b0000111100001111;
  screen.load = 0;
  screen.tick();
  screen.tock();

  // Value should remain the same as before
  assertEquals(screen.value, mask16(0b1111000011110000));
});
