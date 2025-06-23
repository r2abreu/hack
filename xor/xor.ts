import not from "../not/not.ts";
import and from "../and/and.ts";
import or from "../or/or.ts";

/**
 * @module XOR
 *
 * @param {number} a - Input bit (0 or 1)
 * @param {number} b - Input bit (0 or 1)
 * @returns {number} - Output bit (0 or 1)
 *
 * | a | b | a XOR b |
 * |---|---|:-------:|
 * | 0 | 0 |    0    |
 * | 0 | 1 |    1    |
 * | 1 | 0 |    1    |
 * | 1 | 1 |    0    |
 *
 * Returns the logical exclusive OR of bits a and b.
 */
export default function xor(a: number, b: number): number {
  const nota = not(a);
  const notb = not(b);
  const lh = and(nota, b);
  const rh = and(a, notb);

  return or(lh, rh);
}
