import nand from "../nand/nand.ts";
/**
 * @module AND
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 *
 * | A | B | A AND B |
 * |---|---|:--------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   0    |
 * | 1 | 0 |   0    |
 * | 1 | 1 |   1    |
 */
export default function and(a: number, b: number): number {
  const w1 = nand(a, b);
  return nand(w1, w1);
}
