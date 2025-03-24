import { assertEquals } from "jsr:@std/assert";
import mux8way16 from "./mux8way16.ts";
import type { BitTuple } from "../utility.ts";

Deno.test("mux8way16 function", () => {
  const A: BitTuple<16> = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  const B: BitTuple<16> = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  const C: BitTuple<16> = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const D: BitTuple<16> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const E: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const F: BitTuple<16> = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const G: BitTuple<16> = [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1];
  const H: BitTuple<16> = [0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1];

  // Test case 1: sel = [0, 0, 0], should return A
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [0, 0, 0] // sel = [0, 0, 0]
    ),
    A,
    "mux8way16(sel=[0,0,0]) should return A"
  );

  // Test case 2: sel = [0, 0, 1], should return B
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [0, 0, 1] // sel = [0, 0, 1]
    ),
    B,
    "mux8way16(sel=[0,0,1]) should return B"
  );

  // Test case 3: sel = [0, 1, 0], should return C
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [0, 1, 0] // sel = [0, 1, 0]
    ),
    C,
    "mux8way16(sel=[0,1,0]) should return C"
  );

  // Test case 4: sel = [0, 1, 1], should return D
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [0, 1, 1] // sel = [0, 1, 1]
    ),
    D,
    "mux8way16(sel=[0,1,1]) should return D"
  );

  // Test case 5: sel = [1, 0, 0], should return E
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [1, 0, 0] // sel = [1, 0, 0]
    ),
    E,
    "mux8way16(sel=[1,0,0]) should return E"
  );

  // Test case 6: sel = [1, 0, 1], should return F
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [1, 0, 1] // sel = [1, 0, 1]
    ),
    F,
    "mux8way16(sel=[1,0,1]) should return F"
  );

  // Test case 7: sel = [1, 1, 0], should return G
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [1, 1, 0] // sel = [1, 1, 0]
    ),
    G,
    "mux8way16(sel=[1,1,0]) should return G"
  );

  // Test case 8: sel = [1, 1, 1], should return H
  assertEquals(
    mux8way16(
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      [1, 1, 1] // sel = [1, 1, 1]
    ),
    H,
    "mux8way16(sel=[1,1,1]) should return H"
  );
});
