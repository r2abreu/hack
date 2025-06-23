/**
 * @module nand
 *
 * @param {number} a - First input bit (0 or 1)
 * @param {number} b - Second input bit (0 or 1)
 * @returns {number} - Output bit (0 or 1)
 *
 * | a | b | a NAND b |
 * |---|---|:--------:|
 * | 0 | 0 |     1    |
 * | 0 | 1 |     1    |
 * | 1 | 0 |     1    |
 * | 1 | 1 |     0    |
 *
 * Returns the NAND of a and b.
 */
export default function nand(a: number, b: number): number {
  if (a && b) return 0;

  return 1;
}
