import { mask } from "../utility.ts";

/**
 * Adds two numbers and returns the sum masked to the lowest 16 bits.
 *
 * Both input numbers are first masked to 16 bits, then added together.
 * The result is also masked to ensure the return value is a 16-bit number.
 *
 * @param {number} a - The first operand. Only the least significant 16 bits are used.
 * @param {number} b - The second operand. Only the least significant 16 bits are used.
 * @returns {number} The 16-bit masked sum of the two operands.
 *
 * @example
 * add16(0b0000000000000010, 0b0000000000000011); // 0b0000000000000101 (5)
 * add16(0xFFFF, 1); // 0x0000 (0), because (0xFFFF + 1) & 0xFFFF === 0
 */
export default function (a: number, b: number): number {
  const _a = mask(a);
  const _b = mask(b);

  return mask(a + b);
}
