import { assertEquals } from "jsr:@std/assert";
import mux4way16 from "./mux4way16.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("mux4way16 function", () => {
  const A: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const B: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  const C: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const D: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // Test case 1: sel = [0, 0], should return A
  assertEquals(
    mux4way16(
      A,
      B,
      C,
      D,
      [0, 0] // sel = [0, 0]
    ),
    A,
    "mux4way16(sel=[0,0]) should return A"
  );

  // Test case 2: sel = [0, 1], should return B
  assertEquals(
    mux4way16(
      A,
      B,
      C,
      D,
      [0, 1] // sel = [0, 1]
    ),
    B,
    "mux4way16(sel=[0,1]) should return B"
  );

  // Test case 3: sel = [1, 0], should return C
  assertEquals(
    mux4way16(
      A,
      B,
      C,
      D,
      [1, 0] // sel = [1, 0]
    ),
    C,
    "mux4way16(sel=[1,0]) should return C"
  );

  // Test case 4: sel = [1, 1], should return D
  assertEquals(
    mux4way16(
      A,
      B,
      C,
      D,
      [1, 1] // sel = [1, 1]
    ),
    D,
    "mux4way16(sel=[1,1]) should return D"
  );
});
