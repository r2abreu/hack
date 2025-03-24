import mux from "../mux/mux.ts";
import type { BitTuple, bit } from "../utility.ts";

/**
 * @module MUX
 *
 * @param {BitTuple<16>} a
 * @param {BitTuple<16>} b
 * @returns {BitTuple<16>}
 *
 * Input: a[16], b[16], sel
 * Output: out[16]
 * Function: for i = 0..15 out[i] = Mux(a[i], b[i])
 */
export default function (
  a: BitTuple<16>,
  b: BitTuple<16>,
  sel: bit
): BitTuple<16> {
  const out: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;

  for (let i = 0; i < 16; i++) out[i] = mux(a[i], b[i], sel);

  return out;
}
