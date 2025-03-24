import type { BitTuple } from "../utility.ts";

/**
 * @module MUX4WAY16
 *
 * @param {BitTuple<16>} a
 * @param {BitTuple<16>} b
 * @param {BitTuple<16>} c
 * @param {BitTuple<16>} d
 * @param {BitTuple<2>} sel
 * @returns {bit}
 *
 * Input: a[16], b[16], c[16], d[16], sel[2]
 * Output: out[16]
 */
export default function (
  a: BitTuple<16>,
  b: BitTuple<16>,
  c: BitTuple<16>,
  d: BitTuple<16>,
  sel: BitTuple<2>
): BitTuple<16> {
  if (sel[0] === 0 && sel[1] === 0) return a;
  if (sel[0] === 0 && sel[1] === 1) return b;
  if (sel[0] === 1 && sel[1] === 0) return c;

  return d;
}
