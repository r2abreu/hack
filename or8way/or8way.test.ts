import { assertEquals } from "jsr:@std/assert";
import or8way from "./or8way.ts";

Deno.test("or8way function", () => {
  // Test case 1: All zeros, should return 0
  assertEquals(
    or8way([0, 0, 0, 0, 0, 0, 0, 0]),
    0,
    "or8way(all zeros) should return 0"
  );

  // Test case 2: All ones, should return 1
  assertEquals(
    or8way([1, 1, 1, 1, 1, 1, 1, 1]),
    1,
    "or8way(all ones) should return 1"
  );

  // Test case 3: Mix of ones and zeros, should return 1 (because at least one 1 exists)
  assertEquals(
    or8way([1, 0, 0, 0, 0, 0, 0, 0]),
    1,
    "or8way(mix with 1) should return 1"
  );

  // Test case 4: Another mix of ones and zeros, should return 1
  assertEquals(
    or8way([0, 0, 0, 1, 0, 0, 0, 0]),
    1,
    "or8way(mix with 1) should return 1"
  );

  // Test case 5: All zeros except the last one, should return 1
  assertEquals(
    or8way([0, 0, 0, 0, 0, 0, 0, 1]),
    1,
    "or8way(only last bit 1) should return 1"
  );

  // Test case 6: All ones except the last one, should return 1
  assertEquals(
    or8way([1, 1, 1, 1, 1, 1, 1, 0]),
    1,
    "or8way(only last bit 0) should return 1"
  );
});
