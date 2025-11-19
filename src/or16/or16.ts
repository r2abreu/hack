import { mask } from "../utility.ts";

/**
 * @module or16
 *
 * @param {number} a - First 16-bit input (binary number)
 * @param {number} b - Second 16-bit input (binary number)
 * @returns {number} - 16-bit output (binary number)
 *
 * Returns the bitwise OR of the two 16-bit inputs.
 */
export default function or16(a: number, b: number): number {
  return mask(a | b);
}
