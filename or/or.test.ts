import { assertEquals } from "jsr:@std/assert";
import or from "./or.ts";

Deno.test("OR gate function", () => {
  assertEquals(or(0, 0), 0, "OR(0,0) should return 0");
  assertEquals(or(0, 1), 1, "OR(0,1) should return 1");
  assertEquals(or(1, 0), 1, "OR(1,0) should return 1");
  assertEquals(or(1, 1), 1, "OR(1,1) should return 1");
});
