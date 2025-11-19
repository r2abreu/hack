import { assertEquals } from "jsr:@std/assert";
import nand from "./nand.ts";

Deno.test("NAND gate function", () => {
  assertEquals(nand(0, 0), 1, "NAND(0,0) should return 1");
  assertEquals(nand(0, 1), 1, "NAND(0,1) should return 1");
  assertEquals(nand(1, 0), 1, "NAND(1,0) should return 1");
  assertEquals(nand(1, 1), 0, "NAND(1,1) should return 0");
});
