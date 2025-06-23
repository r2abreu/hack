import { assertEquals } from "jsr:@std/assert";
import or16 from "./or16.ts";

Deno.test("or16 function (numbers version, explicit)", () => {
  // Test case 1: both numbers are all zeros
  assertEquals(
    or16(0b0000000000000000, 0b0000000000000000),
    0b0000000000000000,
    "or16(all zeros) should return all zeros",
  );

  // Test case 2: both numbers are all ones
  assertEquals(
    or16(0b1111111111111111, 0b1111111111111111),
    0b1111111111111111,
    "or16(all ones) should return all ones",
  );

  // Test case 3: one number is all zeros, the other all ones
  assertEquals(
    or16(0b0000000000000000, 0b1111111111111111),
    0b1111111111111111,
    "or16(zeros and ones) should return all ones",
  );

  // Test case 4: alternating pattern
  assertEquals(
    or16(0b1010101010101010, 0b1111111111111111),
    0b1111111111111111,
    "or16(alternating pattern) should return all ones",
  );

  // Test case 5: random pattern
  assertEquals(
    or16(0b1010110011001101, 0b0111001111011111),
    0b1111111111011111,
    "or16(random pattern) should return the correct OR result",
  );
});
