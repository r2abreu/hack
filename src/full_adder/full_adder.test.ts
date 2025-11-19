import { assertEquals } from "jsr:@std/assert";
import full_adder from "./full_adder.ts";

Deno.test("FullAdder function", () => {
  assertEquals(
    full_adder(0, 0, 0),
    [0, 0],
    "full_adder(0,0,0) should return [0, 0]"
  );
  assertEquals(
    full_adder(0, 0, 1),
    [0, 1],
    "full_adder(0,0,1) should return [0, 1]"
  );
  assertEquals(
    full_adder(0, 1, 0),
    [0, 1],
    "full_adder(0,1,0) should return [0, 1]"
  );
  assertEquals(
    full_adder(0, 1, 1),
    [1, 0],
    "full_adder(0,1,1) should return [1, 0]"
  );
  assertEquals(
    full_adder(1, 0, 0),
    [0, 1],
    "full_adder(1,0,0) should return [0, 1]"
  );
  assertEquals(
    full_adder(1, 0, 1),
    [1, 0],
    "full_adder(1,0,1) should return [1, 0]"
  );
  assertEquals(
    full_adder(1, 1, 0),
    [1, 0],
    "full_adder(1,1,0) should return [1, 0]"
  );
  assertEquals(
    full_adder(1, 1, 1),
    [1, 1],
    "full_adder(1,1,1) should return [1, 1]"
  );
});
