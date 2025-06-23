import { assertEquals } from "jsr:@std/assert";
import and16 from "./and16.ts";

Deno.test("and16 function (numbers version, explicit)", () => {
  // Test case 1: both numbers are all zeros
  assertEquals(
    and16(0b0000000000000000, 0b0000000000000000),
    0b0000000000000000,
    "and16(all zeros) should return all zeros",
  );

  // Test case 2: both numbers are all ones
  assertEquals(
    and16(0b1111111111111111, 0b1111111111111111),
    0b1111111111111111,
    "and16(all ones) should return all ones",
  );

  // Test case 3: one number is all zeros, the other all ones
  assertEquals(
    and16(0b0000000000000000, 0b1111111111111111),
    0b0000000000000000,
    "and16(zeros and ones) should return all zeros",
  );

  // Test case 4: alternating pattern
  assertEquals(
    and16(0b0101010101010101, 0b1010101010101010),
    0b0000000000000000,
    "and16(alternating pattern) should return all zeros",
  );

  // Test case 5: random pattern
  assertEquals(
    and16(0b1010110011001101, 0b0111001111011111),
    0b0010000011001101,
    "and16(random pattern) should return the correct AND result",
  );
});
