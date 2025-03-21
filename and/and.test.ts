import { assertEquals } from "jsr:@std/assert";
import and from "./and.ts";

Deno.test("AND gate function", () => {
  assertEquals(and(0, 0), 0, "AND(0,0) should return 0");
  assertEquals(and(0, 1), 0, "AND(0,1) should return 0");
  assertEquals(and(1, 0), 0, "AND(1,0) should return 0");
  assertEquals(and(1, 1), 1, "AND(1,1) should return 1");
});
