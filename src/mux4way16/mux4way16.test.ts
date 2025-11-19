import { assertEquals } from "jsr:@std/assert";
import mux4way16 from "./mux4way16.ts";

// Define 16-bit test patterns as numbers
const A = 0b1010101010101010;
const B = 0b0101010101010101;
const C = 0b1111111111111111;
const D = 0b0000000000000000;

// sel = [0, 0], should return A
Deno.test("mux4way16: sel=[0,0] should return A", () => {
  assertEquals(
    mux4way16(A, B, C, D, 0b00),
    A,
    "mux4way16(sel=[0,0]) should return A",
  );
});

// sel = [0, 1], should return B
Deno.test("mux4way16: sel=[0,1] should return B", () => {
  assertEquals(
    mux4way16(A, B, C, D, 0b01),
    B,
    "mux4way16(sel=[0,1]) should return B",
  );
});

// sel = [1, 0], should return C
Deno.test("mux4way16: sel=[1,0] should return C", () => {
  assertEquals(
    mux4way16(A, B, C, D, 0b10),
    C,
    "mux4way16(sel=[1,0]) should return C",
  );
});

// sel = [1, 1], should return D
Deno.test("mux4way16: sel=[1,1] should return D", () => {
  assertEquals(
    mux4way16(A, B, C, D, 0b11),
    D,
    "mux4way16(sel=[1,1]) should return D",
  );
});
