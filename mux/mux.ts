import type { bit } from "../utility.ts";
import not from "../not/not.ts";
import and from "../and/and.ts";
import or from "../or/or.ts";

/**
 * @module MUX
 *
 * @param {bit} a
 * @param {bit} b
 * @param {bit} sel
 * @returns {bit}
 *
 * | A | B | SEL | MUX(A, B, SEL) |
 * |---|---|-----|:--------------:|
 * | 0 | 0 |  0  |       0       |
 * | 0 | 1 |  0  |       0       |
 * | 1 | 0 |  0  |       1       |
 * | 1 | 1 |  0  |       1       |
 * | 0 | 0 |  1  |       0       |
 * | 0 | 1 |  1  |       1       |
 * | 1 | 0 |  1  |       0       |
 * | 1 | 1 |  1  |       1       |
 */
export default function (a: bit, b: bit, sel: bit): bit {
  const notsel = not(sel);
  const lh = and(sel, b);
  const rh = and(notsel, a);

  return or(lh, rh);
}
