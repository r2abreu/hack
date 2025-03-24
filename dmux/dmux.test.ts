import { assertEquals } from "jsr:@std/assert";
import dmux from "./dmux.ts";

Deno.test("DMUX gate function", () => {
  assertEquals(dmux(0, 0), [0, 0], "DMUX(0, 0) should return [0, 0]");
  assertEquals(dmux(0, 1), [0, 0], "DMUX(0, 1) should return [0, 0]");
  assertEquals(dmux(1, 0), [1, 0], "DMUX(1, 0) should return [1, 0]");
  assertEquals(dmux(1, 1), [0, 1], "DMUX(1, 1) should return [0, 1]");
});
