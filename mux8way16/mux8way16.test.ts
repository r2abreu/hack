import { assertEquals } from "jsr:@std/assert";
import mux8way16 from "./mux8way16.ts";

// Use 16-bit numbers as inputs
const A = 0b1010101010101010;
const B = 0b0101010101010101;
const C = 0b1111111111111111;
const D = 0b0000000000000000;
const E = 0b1000000000000000;
const F = 0b0111111111111111;
const G = 0b1100001110001101;
const H = 0b0011011001011101;

Deno.test("mux8way16: sel=0b000 should return A", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b000),
    A,
    "mux8way16(sel=0b000) should return A",
  );
});

Deno.test("mux8way16: sel=0b001 should return B", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b001),
    B,
    "mux8way16(sel=0b001) should return B",
  );
});

Deno.test("mux8way16: sel=0b010 should return C", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b010),
    C,
    "mux8way16(sel=0b010) should return C",
  );
});

Deno.test("mux8way16: sel=0b011 should return D", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b011),
    D,
    "mux8way16(sel=0b011) should return D",
  );
});

Deno.test("mux8way16: sel=0b100 should return E", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b100),
    E,
    "mux8way16(sel=0b100) should return E",
  );
});

Deno.test("mux8way16: sel=0b101 should return F", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b101),
    F,
    "mux8way16(sel=0b101) should return F",
  );
});

Deno.test("mux8way16: sel=0b110 should return G", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b110),
    G,
    "mux8way16(sel=0b110) should return G",
  );
});

Deno.test("mux8way16: sel=0b111 should return H", () => {
  assertEquals(
    mux8way16(A, B, C, D, E, F, G, H, 0b111),
    H,
    "mux8way16(sel=0b111) should return H",
  );
});
