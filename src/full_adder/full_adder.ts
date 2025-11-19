import or from "../or/or.ts";
import half_adder from "../half_adder/half_adder.ts";

/**
 * @module full_adder
 *
 * @param {number} a - first input bit (0 or 1)
 * @param {number} b - second input bit (0 or 1)
 * @param {number} c - carry-in bit (0 or 1)
 * @returns {number[]} [carry, sum] - both are binary numbers (0 or 1)
 *
 * | a | b | c | carry | sum |
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
 * the full_adder computes the carry-out and sum of three single-bit binary inputs (a, b, c).
 * returns an array: [carry, sum].
 */

export default function full_adder(
  a: number,
  b: number,
  c: number,
): [number, number] {
  const [ab_carry, ab_sum] = half_adder(a, b);
  const [abc_carry, sum] = half_adder(ab_sum, c);
  const carry = or(ab_carry, abc_carry);

  return [carry, sum];
}
