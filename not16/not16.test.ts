import { assertEquals } from "jsr:@std/assert";
import not16 from "./not16.ts";

Deno.test("not16 function", () => {
  assertEquals(
    not16([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    "not16(all zeros) should return all ones"
  );

  assertEquals(
    not16([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "not16(all ones) should return all zeros"
  );
  assertEquals(
    not16([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]),
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    "not16(alternating) should return inverted pattern"
  );

  assertEquals(
    not16([1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0],
    "not16(random pattern) should return the correct inverted pattern"
  );
});
