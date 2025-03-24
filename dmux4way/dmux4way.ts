import type { BitTuple, bit } from "../utility.ts";

/**
 * @module DMUX4WAY
 *
 * @param {bit}} _in
 * @param {BitTuple<2>} sel
 * @returns {BitTuple<4>}
 *
 * Input: a[16], b[16], c[16], d[16], sel[2]
 * Output: out[16]
 */
export default function (_in: bit, sel: BitTuple<2>): BitTuple<4> {
  if (sel[0] === 0 && sel[1] === 0) return [_in, 0, 0, 0];
  if (sel[0] === 0 && sel[1] === 1) return [0, _in, 0, 0];
  if (sel[0] === 1 && sel[1] === 0) return [0, 0, _in, 0];

  return [0, 0, 0, _in];
}
