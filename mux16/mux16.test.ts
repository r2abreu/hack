import { assertEquals } from "jsr:@std/assert";
import mux16 from "./mux16.ts";

// Test case 1: sel is 0, should return A
Deno.test("mux16: sel=0, all zeros should return A", () => {
  assertEquals(
    mux16(0b0000000000000000, 0b1111111111111111, 0),
    0b0000000000000000,
  );
});

// Test case 2: sel is 1, should return B
Deno.test("mux16: sel=1, all ones should return B", () => {
  assertEquals(
    mux16(0b0000000000000000, 0b1111111111111111, 1),
    0b1111111111111111,
  );
});

// Test case 3: Mix of A and B with sel=0
Deno.test("mux16: sel=0, mix of A and B should return A", () => {
  assertEquals(
    mux16(0b1010101010101010, 0b0101010101010101, 0),
    0b1010101010101010,
  );
});

// Test case 4: Mix of A and B with sel=1
Deno.test("mux16: sel=1, mix of A and B should return B", () => {
  assertEquals(
    mux16(0b1010101010101010, 0b0101010101010101, 1),
    0b0101010101010101,
  );
});

// Test case 5: sel=1, alternating pattern in A and B
Deno.test("mux16: sel=1, alternating pattern should return B", () => {
  assertEquals(
    mux16(0b1010101010101010, 0b0101010101010101, 1),
    0b0101010101010101,
  );
});
