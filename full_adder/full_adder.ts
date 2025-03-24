import type { bit, BitTuple } from "../utility.ts";
import or from "../or/or.ts";
import half_adder from "../half_adder/half_adder.ts";

/**
 * @module FullAdder
 *
 * @param {bit} a - First input bit
 * @param {bit} b - Second input bit
 * @param {bit} c - Carry-in bit
 * @returns {[bit, bit]} [carry, sum]
 *
 * | A | B | C | CARRY | SUM |
 * |---|---|---|:-----:|:---:|
 * | 0 | 0 | 0 |   0   |  0  |
 * | 0 | 0 | 1 |   0   |  1  |
 * | 0 | 1 | 0 |   0   |  1  |
 * | 0 | 1 | 1 |   1   |  0  |
 * | 1 | 0 | 0 |   0   |  1  |
 * | 1 | 0 | 1 |   1   |  0  |
 * | 1 | 1 | 0 |   1   |  0  |
 * | 1 | 1 | 1 |   1   |  1  |
 *
 * The FullAdder computes the carry-out and sum of three single-bit inputs (a, b, c).
 * Returns a tuple: [carry, sum].
 */

export default function (a: bit, b: bit, c: bit): BitTuple<2> {
  const [ab_carry, ab_sum] = half_adder(a, b);
  const [abc_carry, sum] = half_adder(ab_sum, c);
  const carry = or(ab_carry, abc_carry);

  return [carry, sum];
}
