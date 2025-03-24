import not from "../not/not.ts";
import type { BitTuple } from "../utility.ts";

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
  for (let i = 0; i < _in.length; i++) {
    _in[i] = not(_in[i]);
  }

  return _in;
}
