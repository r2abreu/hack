import nand from "../nand/nand.ts";

/**
 * @module OR
 *
 * @param {number} a - First input bit (0 or 1)
 * @param {number} b - Second input bit (0 or 1)
 * @returns {number} - Output bit (0 or 1)
 *
 * | a | b | a OR b |
 * |---|---|:------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   1    |
 * | 1 | 0 |   1    |
 * | 1 | 1 |   1    |
 *
 * Returns the logical OR of a and b.
 */
export default function or(a: number, b: number): number {
  const nota = nand(a, a);
  const notb = nand(b, b);
  const nandab = nand(nota, notb);
  const nandnandab = nand(nandab, nandab);

  return nand(nandnandab, nandnandab);
}
