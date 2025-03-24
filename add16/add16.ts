import type { BitTuple, bit } from "../utility.ts";
import full_adder from "../full_adder/full_adder.ts";

/**
 * @module ADD16
 *
 * @param {BitTuple<16>} a - First 16-bit input tuple
 * @param {BitTuple<16>} b - Second 16-bit input tuple
 * @returns {BitTuple<16>} sum - 16-bit sum output tuple
 *
 * Input: a[16], b[16]
 * Output: sum[16]
 * Function: for i = 0..15, sum = a + b (binary addition, ignoring overflow)
 *
 * The ADD16 module computes the bitwise sum of two 16-bit inputs, returning a 16-bit tuple representing the result.
 */

export default function (a: BitTuple<16>, b: BitTuple<16>): BitTuple<16> {
  const out = new Array<bit>(16).fill(0) as BitTuple<16>;

  let carry: bit = 0;
  for (let i = 0; i < 16; i++) {
    const [_carry, sum] = full_adder(a[i], b[i], carry);

    carry = _carry;
    out[i] = sum;
  }

  return out;
}
