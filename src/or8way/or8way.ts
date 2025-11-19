import or from "../or/or.ts";
import { index } from "../utility.ts";

/**
 * @module or8way
 *
 * @param {number} _in - 8-bit input (binary number)
 * @returns {number} - Output bit (0 or 1)
 *
 * Returns 1 if any bit in the 8-bit input is 1, otherwise returns 0.
 */
export default function or8way(_in: number): number {
  const _01 = or(index(_in, 0), index(_in, 1));
  const _23 = or(index(_in, 2), index(_in, 3));
  const _45 = or(index(_in, 4), index(_in, 5));
  const _67 = or(index(_in, 6), index(_in, 7));

  const _0123 = or(_01, _23);
  const _4567 = or(_45, _67);

  return or(_0123, _4567);
}
