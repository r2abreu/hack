import { assertEquals } from "jsr:@std/assert";
import or8way from "./or8way.ts";

// All zeros, should return 0
Deno.test("or8way: all zeros should return 0", () => {
  assertEquals(
    or8way(0b00000000),
    0,
    "or8way(all zeros) should return 0",
  );
});

// All ones, should return 1
Deno.test("or8way: all ones should return 1", () => {
  assertEquals(
    or8way(0b11111111),
    1,
    "or8way(all ones) should return 1",
  );
});

// Only the first bit is 1
Deno.test("or8way: first bit 1 should return 1", () => {
  assertEquals(
    or8way(0b10000000),
    1,
    "or8way(mix with 1) should return 1",
  );
});

// Only the fourth bit is 1
Deno.test("or8way: fourth bit 1 should return 1", () => {
  assertEquals(
    or8way(0b00010000),
    1,
    "or8way(mix with 1) should return 1",
  );
});

// Only the last bit is 1
Deno.test("or8way: only last bit 1 should return 1", () => {
  assertEquals(
    or8way(0b00000001),
    1,
    "or8way(only last bit 1) should return 1",
  );
});

// All ones except last bit, should return 1
Deno.test("or8way: all ones except last bit should return 1", () => {
  assertEquals(
    or8way(0b11111110),
    1,
    "or8way(only last bit 0) should return 1",
  );
});
