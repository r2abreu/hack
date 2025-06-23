import { mask } from "../utility.ts";

/*
 * @module AND16
 *
 * Bitwise AND of two 16-bit numbers.
 *
 * @param {number} a - First 16-bit input (only lowest 16 bits used)
 * @param {number} b - Second 16-bit input (only lowest 16 bits used)
 * @returns {number} 16-bit result of a & b
 *
 * @example
 * AND16(0b1010, 0b1100); // 0b1000
 */
export default function and16(a: number, b: number): number {
  return mask(a & b);
}
