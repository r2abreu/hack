import type { BitTuple } from "../utility.ts";

/**
 * @module MUX8WAY16
 *
 * @param {BitTuple<16>} a
 * @param {BitTuple<16>} b
 * @param {BitTuple<16>} c
 * @param {BitTuple<16>} d
 * @param {BitTuple<16>} e
 * @param {BitTuple<16>} f
 * @param {BitTuple<16>} g
 * @param {BitTuple<16>} h
 * @param {BitTuple<3>} sel
 * @returns {bit}
 *
 * Input: a[16], b[16], c[16], d[16], sel[3]
 * Output: out[16]
 */
export default function (
  a: BitTuple<16>,
  b: BitTuple<16>,
  c: BitTuple<16>,
  d: BitTuple<16>,
  e: BitTuple<16>,
  f: BitTuple<16>,
  g: BitTuple<16>,
  h: BitTuple<16>,
  sel: BitTuple<3>,
): BitTuple<16> {
  if (sel[0] === 0 && sel[1] === 0 && sel[2] === 0) return a;
  if (sel[0] === 1 && sel[1] === 0 && sel[2] === 0) return b;
  if (sel[0] === 0 && sel[1] === 1 && sel[2] === 0) return c;
  if (sel[0] === 1 && sel[1] === 1 && sel[2] === 0) return d;
  if (sel[0] === 0 && sel[1] === 0 && sel[2] === 1) return e;
  if (sel[0] === 1 && sel[1] === 0 && sel[2] === 1) return f;
  if (sel[0] === 0 && sel[1] === 1 && sel[2] === 1) return g;

  return h; // (sel[0] === 1 && sel[1] === 1 && sel[2] === 1)
}
