import { assertEquals } from "jsr:@std/assert";
import not16 from "./not16.ts";

Deno.test("not16 function (numbers version, explicit)", () => {
  // all zeros -> all ones
  assertEquals(
    not16(0b0000000000000000),
    0b1111111111111111,
    "not16(all zeros) should return all ones",
  );

  // all ones -> all zeros
  assertEquals(
    not16(0b1111111111111111),
    0b0000000000000000,
    "not16(all ones) should return all zeros",
  );

  // alternating: 0101010101010101 -> 1010101010101010
  assertEquals(
    not16(0b0101010101010101),
    0b1010101010101010,
    "not16(alternating) should return inverted pattern",
  );

  // random: 1010110011001101 -> 0101001100110010
  assertEquals(
    not16(0b1010110011001101),
    0b0101001100110010,
    "not16(random pattern) should return the correct inverted pattern",
  );
});
