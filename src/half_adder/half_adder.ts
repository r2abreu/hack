import xor from "../xor/xor.ts";
import and from "../and/and.ts";

/**
 * @module halfadder
 *
 * @param {number} a - first input bit (0 or 1)
 * @param {number} b - second input bit (0 or 1)
 * @returns {number[]} [carry, sum] - both are binary numbers (0 or 1)
 *
 * | a | b | carry | sum |
 * |---|---|:-----:|:---:|
 * | 0 | 0 |   0   |  0  |
 * | 0 | 1 |   0   |  1  |
 * | 1 | 0 |   0   |  1  |
 * | 1 | 1 |   1   |  0  |
 *
 * the halfadder computes the carry-out and sum of two single-bit binary inputs.
 * returns an array: [carry, sum].
 */

export default function half_adder(a: number, b: number): [number, number] {
  const carry = and(a, b);
  const sum = xor(a, b);

  return [carry, sum];
}
