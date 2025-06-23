import and16 from "../and16/and16.ts";
import or16 from "../or16/or16.ts";
import { mask } from "../utility.ts";

/**
 * @module mux16
 *
 * @param {number} a - First 16-bit input (binary number)
 * @param {number} b - Second 16-bit input (binary number)
 * @param {number} sel - Selector bit (0 or 1)
 * @returns {number} - 16-bit output (binary number)
 *
 * Returns a if sel is 0, b if sel is 1.
 */
export default function mux16(a: number, b: number, sel: number): number {
  const _sel = mask(sel ? 0b1111111111111111 : 0);
  const notsel = ~_sel;

  const lh = and16(_sel, b);
  const rh = and16(notsel, a);

  return or16(lh, rh);
}
