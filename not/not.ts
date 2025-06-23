/**
 * @module not
 *
 * @param {number} _in - Input bit (0 or 1)
 * @returns {number} - Output bit (0 or 1)
 *
 * | a | not a |
 * |---|:-----:|
 * | 0 |   1   |
 * | 1 |   0   |
 *
 * Returns the bitwise NOT of the input.
 */
export default function not(_in: number): number {
  if (_in === 1) return 0;
  else return 1;
}
