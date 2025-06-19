import SCREEN from "./screen.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("SCREEN writes and reads from first RAM4K chip (address MSB = 0)", () => {
  const screen = SCREEN();

  // Write value 0b1010101010101010 at address 0 (MSB = 0)
  screen.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // LSB first
  screen.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // MSB = 0
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Read back
  screen.load = 0;
  screen.tick();
  screen.tock();
  assertEquals(screen.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

Deno.test("SCREEN writes and reads from second RAM4K chip (address MSB = 1)", () => {
  const screen = SCREEN();

  // Write value 0b0101010101010101 at address 0b1000000000000 (MSB = 1)
  screen.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // LSB first
  screen.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]; // MSB = 1
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Read back
  screen.load = 0;
  screen.tick();
  screen.tock();
  assertEquals(screen.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
});

Deno.test("SCREEN does not overwrite when load=0", () => {
  const screen = SCREEN();

  // Write value at address 0
  screen.in = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]; // 0b1111000011110000, LSB first
  screen.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  screen.load = 1;
  screen.tick();
  screen.tock();

  // Try to write a different value with load=0
  screen.in = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]; // 0b0000111100001111, LSB first
  screen.load = 0;
  screen.tick();
  screen.tock();

  // Value should remain the same as before
  assertEquals(screen.value, [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]);
});
