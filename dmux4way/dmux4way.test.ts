import { assertEquals } from "jsr:@std/assert";
import dmux4way from "./dmux4way.ts";
const _in: number = 1;

Deno.test("dmux4way: sel=0b00 routes _in to first output", () => {
  assertEquals(
    dmux4way(_in, 0b00),
    [_in, 0, 0, 0],
    "dmux4way(sel=0b00) should route _in to the first output",
  );
});

Deno.test("dmux4way: sel=0b01 routes _in to second output", () => {
  assertEquals(
    dmux4way(_in, 0b01),
    [0, _in, 0, 0],
    "dmux4way(sel=0b01) should route _in to the second output",
  );
});

Deno.test("dmux4way: sel=0b10 routes _in to third output", () => {
  assertEquals(
    dmux4way(_in, 0b10),
    [0, 0, _in, 0],
    "dmux4way(sel=0b10) should route _in to the third output",
  );
});

Deno.test("dmux4way: sel=0b11 routes _in to fourth output", () => {
  assertEquals(
    dmux4way(_in, 0b11),
    [0, 0, 0, _in],
    "dmux4way(sel=0b11) should route _in to the fourth output",
  );
});
