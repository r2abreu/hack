import { index, mask } from "../utility.ts";

/**
 * @module MUX8WAY16
 *
 * @param {number} a - First 16-bit input (binary number)
 * @param {number} b - Second 16-bit input (binary number)
 * @param {number} c - Third 16-bit input (binary number)
 * @param {number} d - Fourth 16-bit input (binary number)
 * @param {number} e - Fifth 16-bit input (binary number)
 * @param {number} f - Sixth 16-bit input (binary number)
 * @param {number} g - Seventh 16-bit input (binary number)
 * @param {number} h - Eighth 16-bit input (binary number)
 * @param {number} sel - 3-bit selector (binary number, 0 to 7)
 * @returns {number} - 16-bit output (binary number)
 *
 * Selects and returns one of the eight 16-bit inputs based on sel.
 */
export default function mux8way16(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
  sel: number,
): number {
  const _a = mask(a);
  const _b = mask(b);
  const _c = mask(c);
  const _d = mask(d);
  const _e = mask(e);
  const _f = mask(f);
  const _g = mask(g);
  const _h = mask(h);
  const _sel = mask(sel);

  if ((1 - index(_sel, 2)) & (1 - index(_sel, 1)) & (1 - index(_sel, 0))) {
    return _a;
  }
  if ((1 - index(_sel, 2)) & (1 - index(_sel, 1)) & index(_sel, 0)) return _b;
  if ((1 - index(_sel, 2)) & index(_sel, 1) & (1 - index(_sel, 0))) return _c;
  if ((1 - index(_sel, 2)) & index(_sel, 1) & index(_sel, 0)) return _d;
  if (index(_sel, 2) & (1 - index(_sel, 1)) & (1 - index(_sel, 0))) return _e;
  if (index(_sel, 2) & (1 - index(_sel, 1)) & index(_sel, 0)) return _f;
  if (index(_sel, 2) & index(_sel, 1) & (1 - index(_sel, 0))) return _g;

  return _h; // (sel[0] === 1 && sel[1] === 1 && sel[2] === 1)
}
