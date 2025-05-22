import not from "../not/not.ts";
import type { BitTuple, bit } from "../utility.ts";

/**
 * @module NOT16
 *
 * @param {BitTuple<16>} _in
 * @returns {BitTuple<16>}
 *
 * Input: _in[16]
 * Output: out[16]
 * Function: for i = 0..15 out[i] = Not(_in[i])
 */
export default function (_in: BitTuple<16>): BitTuple<16> {
  const out = new Array<bit>(16).fill(0) as BitTuple<16>;
  for (let i = 0; i < _in.length; i++) {
    out[i] = not(_in[i]);
  }

  return out;
}
