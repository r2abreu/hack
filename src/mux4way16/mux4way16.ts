import { index, mask } from "../utility.ts";

/**
 * @module MUX4WAY16
 *
 * @param {number} a - First 16-bit input (binary number)
 * @param {number} b - Second 16-bit input (binary number)
 * @param {number} c - Third 16-bit input (binary number)
 * @param {number} d - Fourth 16-bit input (binary number)
 * @param {number} sel - 2-bit selector (binary number, 0 to 3)
 * @returns {number} - 16-bit output (binary number)
 *
 * Selects and returns one of the four 16-bit inputs based on sel.
 */
export default function mux4way16(
  a: number,
  b: number,
  c: number,
  d: number,
  sel: number,
): number {
  const _a = mask(a);
  const _b = mask(b);
  const _c = mask(c);
  const _d = mask(d);
  const _sel = mask(sel);

  const s0 = index(_sel, 0);
  const s1 = index(_sel, 1);

  if ((1 - s0) & (1 - s1)) return _a; // 00
  if ((1 - s1) & s0) return _b; // 01
  if (s1 & (1 - s0)) return _c; // 10
  return _d; // 11
}
