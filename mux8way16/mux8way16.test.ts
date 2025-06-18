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

  // sel = [0,0,0] => A
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [0, 0, 0]),
    A,
    "mux8way16(sel=[0,0,0]) should return A",
  );
  // sel = [1,0,0] => B
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [1, 0, 0]),
    B,
    "mux8way16(sel=[1,0,0]) should return B",
  );
  // sel = [0,1,0] => C
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [0, 1, 0]),
    C,
    "mux8way16(sel=[0,1,0]) should return C",
  );
  // sel = [1,1,0] => D
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [1, 1, 0]),
    D,
    "mux8way16(sel=[1,1,0]) should return D",
  );
  // sel = [0,0,1] => E
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [0, 0, 1]),
    E,
    "mux8way16(sel=[0,0,1]) should return E",
  );
  // sel = [1,0,1] => F
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [1, 0, 1]),
    F,
    "mux8way16(sel=[1,0,1]) should return F",
  );
  // sel = [0,1,1] => G
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [0, 1, 1]),
    G,
    "mux8way16(sel=[0,1,1]) should return G",
  );
  // sel = [1,1,1] => H
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, [1, 1, 1]),
    H,
    "mux8way16(sel=[1,1,1]) should return H",
  );
});
