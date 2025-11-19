import { assertEquals } from "jsr:@std/assert";
import mux from "./mux.ts";

Deno.test("MUX gate function", () => {
  assertEquals(mux(0, 0, 0), 0, "MUX(0,0,0) should return 0");
  assertEquals(mux(0, 1, 0), 0, "MUX(0,1,0) should return 0");
  assertEquals(mux(1, 0, 0), 1, "MUX(1,0,0) should return 1");
  assertEquals(mux(1, 1, 0), 1, "MUX(1,1,0) should return 1");
  assertEquals(mux(0, 0, 1), 0, "MUX(0,0,1) should return 0");
  assertEquals(mux(0, 1, 1), 1, "MUX(0,1,1) should return 1");
  assertEquals(mux(1, 0, 1), 0, "MUX(1,0,1) should return 0");
  assertEquals(mux(1, 1, 1), 1, "MUX(1,1,1) should return 1");
});
