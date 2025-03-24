import { assertEquals } from "jsr:@std/assert";
import xor from "./xor.ts";

Deno.test("XOR gate function", () => {
  assertEquals(xor(0, 0), 0, "XOR(0,0) should return 0");
  assertEquals(xor(0, 1), 1, "XOR(0,1) should return 1");
  assertEquals(xor(1, 0), 1, "XOR(1,0) should return 1");
  assertEquals(xor(1, 1), 0, "XOR(1,1) should return 0");
});
