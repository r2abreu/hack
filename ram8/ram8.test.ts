import { assertEquals } from "jsr:@std/assert";
import ram8 from "./ram8.ts";
import clock from "../clock/clock.ts";

// Test 1: Write to address 0, read after clock
Deno.test("RAM8: write and read at address 0", () => {
  const ram = ram8();

  // Write to address 0, output should be zeros before clock
  assertEquals(
    ram([1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1], 1, [0, 0, 0]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Before clock, address 0 should output zeros",
  );
  clock.tick();
  clock.tock();

  // After clock, address 0 should output the written value
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 0, 0]),
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    "After clock, address 0 should output the written value",
  );
});

// Test 2: Write to address 1, read after clock
Deno.test("RAM8: write and read at address 1", () => {
  const ram = ram8();

  // Write to address 1, output should be zeros before clock
  assertEquals(
    ram([0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0], 1, [0, 0, 1]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Before clock, address 1 should output zeros",
  );
  clock.tick();
  clock.tock();

  // After clock, address 1 should output the written value
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 0, 1]),
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0],
    "After clock, address 1 should output the written value",
  );
});

// Test 3: Write to address 7, read after clock
Deno.test("RAM8: write and read at address 7", () => {
  const ram = ram8();

  // Write to address 7, output should be zeros before clock
  assertEquals(
    ram([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], 1, [1, 1, 1]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Before clock, address 7 should output zeros",
  );
  clock.tick();
  clock.tock();

  // After clock, address 7 should output the written value
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [1, 1, 1]),
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    "After clock, address 7 should output the written value",
  );
});

// Test 4: Read from an unwritten address (should be zeros)
Deno.test("RAM8: read from unwritten address", () => {
  const ram = ram8();

  // Read from address 2, never written
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 1, 0]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Unwritten address should output zeros",
  );
});

// Test 5: Overwrite address 0
Deno.test("RAM8: overwrite at address 0", () => {
  const ram = ram8();

  // First write to address 0
  ram([1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1], 1, [0, 0, 0]);
  clock.tick();
  clock.tock();

  // Overwrite address 0, output should be previous value before clock
  assertEquals(
    ram([1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1], 1, [0, 0, 0]),
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    "Before clock, address 0 should output previous value",
  );
  clock.tick();
  clock.tock();

  // After clock, address 0 should output the new value
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 0, 0]),
    [1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    "After clock, address 0 should output the overwritten value",
  );
});

// Test 6: Write with load=0 should NOT overwrite
Deno.test("RAM8: load=0 does not overwrite", () => {
  const ram = ram8();

  // Write to address 0
  ram([1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1], 1, [0, 0, 0]);
  clock.tick();
  clock.tock();

  // Try to write with load=0 (should not overwrite)
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 0, 0]),
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    "Load=0 should not overwrite address 0",
  );
  clock.tick();
  clock.tock();

  // After clock, address 0 should still output the previous value
  assertEquals(
    ram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, [0, 0, 0]),
    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    "After clock, address 0 should still output the previous value",
  );
});
