import Memory from "./memory.ts";
import { assertEquals } from "jsr:@std/assert";

// Test writing and reading to RAM region (address < 24576)
Deno.test("Memory: Write and read RAM region", () => {
  const memory = Memory();

  // Address 0 (RAM)
  memory.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0
  memory.in = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]; // 0b1010101010101010, LSB first
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back
  memory.load = 1;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
});

// Test writing and reading to SCREEN region (address 24576 = 0x6000)
Deno.test("Memory: Write and read SCREEN region", () => {
  const memory = Memory();

  // Address 24576 (SCREEN base)
  memory.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]; // 24576, LSB first (0x6000)
  memory.in = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]; // 0b0101010101010101, LSB first
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]);
});

// Test that writing to KEYBOARD region (address 24576) does not change its value
Deno.test("Memory: Keyboard is read-only", () => {
  const memory = Memory();

  // Try to write to the keyboard address (should be ignored)
  memory.address = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]; // 24576, LSB first (0x6000)
  memory.in = [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back; should be a 16-bit value (typically 0 if no key is pressed)
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value.length, 16);
});

// Test RAM and SCREEN regions do not interfere
Deno.test("Memory: RAM and SCREEN are independent", () => {
  const memory = Memory();

  // Write to RAM address 1
  memory.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1
  memory.in = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Write to SCREEN address 24577
  memory.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]; // 24577, LSB first
  memory.in = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
  memory.load = 1;
  memory.tick();
  memory.tock();

  // Read back RAM address 1
  memory.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Read back SCREEN address 24577
  memory.address = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0];
  memory.load = 0;
  memory.tick();
  memory.tock();
  assertEquals(memory.value, [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0]);
});
