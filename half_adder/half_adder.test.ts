import { assertEquals } from "jsr:@std/assert";
import half_adder from "./half_adder.ts";

Deno.test("HalfAdder function", () => {
  assertEquals(
    half_adder(0, 0),
    [0, 0],
    "half_adder(0,0) should return [0, 0]"
  );
  assertEquals(
    half_adder(0, 1),
    [0, 1],
    "half_adder(0,1) should return [0, 1]"
  );
  assertEquals(
    half_adder(1, 0),
    [0, 1],
    "half_adder(1,0) should return [0, 1]"
  );
  assertEquals(
    half_adder(1, 1),
    [1, 0],
    "half_adder(1,1) should return [1, 0]"
  );
});
