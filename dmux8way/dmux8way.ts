import type { bit, BitTuple } from "../utility.ts";

/**
 * @module DMUX4WAY
 *
 * @param {bit}} _in
 * @param {BitTuple<3>} sel
 * @returns {BitTuple<8>}
 *
 * Input: a[16], b[16], c[16], d[16], e[16], f[16], g[16], h[16], sel[2]
 * Output: out[16]
 */

export default function (_in: bit, sel: BitTuple<3>): BitTuple<8> {
  if (sel[0] === 0 && sel[1] === 0 && sel[2] === 0) {
    return [_in, 0, 0, 0, 0, 0, 0, 0];
  }
  if (sel[0] === 1 && sel[1] === 0 && sel[2] === 0) {
    return [0, _in, 0, 0, 0, 0, 0, 0];
  }
  if (sel[0] === 0 && sel[1] === 1 && sel[2] === 0) {
    return [0, 0, _in, 0, 0, 0, 0, 0];
  }
  if (sel[0] === 1 && sel[1] === 1 && sel[2] === 0) {
    return [0, 0, 0, _in, 0, 0, 0, 0];
  }
  if (sel[0] === 0 && sel[1] === 0 && sel[2] === 1) {
    return [0, 0, 0, 0, _in, 0, 0, 0];
  }
  if (sel[0] === 1 && sel[1] === 0 && sel[2] === 1) {
    return [0, 0, 0, 0, 0, _in, 0, 0];
  }
  if (sel[0] === 0 && sel[1] === 1 && sel[2] === 1) {
    return [0, 0, 0, 0, 0, 0, _in, 0];
  }

  // sel[0] === 1 && sel[1] === 1 && sel[2] === 1
  return [0, 0, 0, 0, 0, 0, 0, _in];
}
