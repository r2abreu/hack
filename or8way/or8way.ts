import type { BitTuple, bit } from "../utility.ts";
import or from "../or/or.ts";

/**
 * @module OR8WAY
 *
 * @param {BitTuple<8>} _in
 * @returns {bit}
 *
 * Or8Way
 * Input: in[8]
 * Output: out
 */
export default function (_in: BitTuple<8>): bit {
  const _01 = or(_in[0], _in[1]);
  const _23 = or(_in[2], _in[3]);
  const _45 = or(_in[4], _in[5]);
  const _67 = or(_in[6], _in[7]);

  const _0123 = or(_01, _23);
  const _4567 = or(_45, _67);

  return or(_0123, _4567);
}
