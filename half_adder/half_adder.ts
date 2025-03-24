import type { bit, BitTuple } from "../utility.ts";
import xor from "../xor/xor.ts";
import and from "../and/and.ts";

/**
 * @module HalfAdder
 *
 * @param {bit} a - First input bit
 * @param {bit} b - Second input bit
 * @returns {[bit, bit]} [carry, sum]
 *
 * | A | B | CARRY | SUM |
 * |---|---|:-----:|:---:|
 * | 0 | 0 |   0   |  0  |
 * | 0 | 1 |   0   |  1  |
 * | 1 | 0 |   0   |  1  |
 * | 1 | 1 |   1   |  0  |
 *
 * The HalfAdder computes the carry-out and sum of two single-bit inputs.
 * Returns a tuple: [carry, sum].
 */

export default function (a: bit, b: bit): BitTuple<2> {
  const carry = and(a, b);
  const sum = xor(a, b);

  return [carry, sum];
}
