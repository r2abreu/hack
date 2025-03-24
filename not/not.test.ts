import { assertEquals } from "jsr:@std/assert";
import not from "./not.ts";

Deno.test("NOT gate function", () => {
  assertEquals(not(0), 1, "NOT(0) should return 0");
  assertEquals(not(1), 0, "NOT(1) should return 1");
});
