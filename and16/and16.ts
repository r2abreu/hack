import and from "../and/and.ts";
import type { BitTuple } from "../utility.ts";

/**
 * @module AND16
 *
 * @param {BitTuple<16>} a
 * @param {BitTuple<16>} b
 * @returns {BitTuple<16>}
 *
 * Input: a[16], b[16]
 * Output: out[16]
 * Function: for i = 0..15 out[i] = And(a[i], b[i])
 */
export default function (a: BitTuple<16>, b: BitTuple<16>): BitTuple<16> {
  const out: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;

  for (let i = 0; i < 16; i++) out[i] = and(a[i], b[i]);

  return out;
}
