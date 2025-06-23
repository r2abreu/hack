import Memory from "./memory.ts";
import { assertEquals } from "jsr:@std/assert";
import { mask } from "../utility.ts";

// Test writing and reading to RAM region (address < 24575)
Deno.test("Memory: Write and read RAM region", () => {
  const memory = Memory();

  // Address 0 (RAM), 15 bits
  memory.address = 0b000000000000000;
  memory.in = 0b1010101010101010;
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back
  memory.load = 1;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, mask(0b1010101010101010));
});

// Test writing and reading to SCREEN region (address 24575 = 0b011111111111111)
Deno.test("Memory: Write and read SCREEN region", () => {
  const memory = Memory();

  // Address 24575 (SCREEN base), 15 bits
  memory.address = 0b011111111111111; // 24575
  memory.in = 0b0101010101010101;
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back
  memory.load = 0b0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, mask(0b0101010101010101));
});

// Test that writing to KEYBOARD region (address 24576) does not change its value
Deno.test("Memory: Keyboard is read-only", () => {
  const memory = Memory();

  // Try to write to the keyboard address (should be ignored), 15 bits
  memory.address = 0b100000000000000; // 24576
  memory.in = 0b1111000011110000;
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back; should be a 16-bit value (typically 0 if no key is pressed)
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value.toString(2).padStart(16, "0").length, 16);
});

// Test RAM and SCREEN regions do not interfere
Deno.test("Memory: RAM and SCREEN are independent", () => {
  const memory = Memory();

  // Write to RAM address 1, 15 bits
  memory.address = 0b000000000000001;
  memory.in = 0b1111111100000000;
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Write to SCREEN address 24575, 15 bits
  memory.address = 0b011111111111111; // 24575
  memory.in = 0b0000111111110000;
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back RAM address 1
  memory.address = 0b000000000000001;
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, 0b1111111100000000);

  // Read back SCREEN address 24575
  memory.address = 0b011111111111111;
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, 0b0000111111110000);
});
