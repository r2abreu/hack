import type { BitTuple } from "../utility.ts";
import add16 from "../add16/add16.ts";

/**
 * @module INC16
 *
 * @param {BitTuple<16>} in - 16-bit input tuple
 * @returns {BitTuple<16>} out - 16-bit output tuple
 *
 * Input: in[16]
 * Output: out[16]
 * Function: out = in + 1 (binary increment, ignoring overflow)
 *
 * The INC16 module increments a 16-bit input by 1, returning the result as a 16-bit tuple.
 */

export default function (_in: BitTuple<16>): BitTuple<16> {
  const one: BitTuple<16> = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  return add16(_in, one);
}
