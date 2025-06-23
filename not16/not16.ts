import { mask } from "../utility.ts";

/**
 * @module not16
 *
 * @param {number} _in - 16-bit input (binary number)
 * @returns {number} - 16-bit output (binary number)
 *
 * Returns the bitwise NOT of the 16-bit input.
 */
export default function not16(_in: number): number {
  return mask(~_in);
}
