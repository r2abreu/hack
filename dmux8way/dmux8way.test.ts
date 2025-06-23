import { assertEquals } from "jsr:@std/assert";
import dmux8way from "./dmux8way.ts";

const _in = 1;

// Helper: convert a number to a 3-bit selector array if needed
// const toBits = n => [n & 1, (n >> 1) & 1, (n >> 2) & 1];

Deno.test("dmux8way: sel=0b000 routes _in to index 0", () => {
  assertEquals(
    dmux8way(_in, 0b000),
    [_in, 0, 0, 0, 0, 0, 0, 0],
    "sel=0b000 routes _in to index 0",
  );
});

Deno.test("dmux8way: sel=0b001 routes _in to index 1", () => {
  assertEquals(
    dmux8way(_in, 0b001),
    [0, _in, 0, 0, 0, 0, 0, 0],
    "sel=0b001 routes _in to index 1",
  );
});

Deno.test("dmux8way: sel=0b010 routes _in to index 2", () => {
  assertEquals(
    dmux8way(_in, 0b010),
    [0, 0, _in, 0, 0, 0, 0, 0],
    "sel=0b010 routes _in to index 2",
  );
});

Deno.test("dmux8way: sel=0b011 routes _in to index 3", () => {
  assertEquals(
    dmux8way(_in, 0b011),
    [0, 0, 0, _in, 0, 0, 0, 0],
    "sel=0b011 routes _in to index 3",
  );
});

Deno.test("dmux8way: sel=0b100 routes _in to index 4", () => {
  assertEquals(
    dmux8way(_in, 0b100),
    [0, 0, 0, 0, _in, 0, 0, 0],
    "sel=0b100 routes _in to index 4",
  );
});

Deno.test("dmux8way: sel=0b101 routes _in to index 5", () => {
  assertEquals(
    dmux8way(_in, 0b101),
    [0, 0, 0, 0, 0, _in, 0, 0],
    "sel=0b101 routes _in to index 5",
  );
});

Deno.test("dmux8way: sel=0b110 routes _in to index 6", () => {
  assertEquals(
    dmux8way(_in, 0b110),
    [0, 0, 0, 0, 0, 0, _in, 0],
    "sel=0b110 routes _in to index 6",
  );
});

Deno.test("dmux8way: sel=0b111 routes _in to index 7", () => {
  assertEquals(
    dmux8way(_in, 0b111),
    [0, 0, 0, 0, 0, 0, 0, _in],
    "sel=0b111 routes _in to index 7",
  );
});
