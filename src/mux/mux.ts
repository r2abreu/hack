import not from "../not/not.ts";
import and from "../and/and.ts";
import or from "../or/or.ts";

/**
 * @module MUX
 *
 * @param {number} a - First input bit (0 or 1)
 * @param {number} b - Second input bit (0 or 1)
 * @param {number} sel - Selector bit (0 or 1)
 * @returns {number} - Output bit (0 or 1)
 *
 * | a | b | sel | mux(a, b, sel) |
 * |---|---|-----|:--------------:|
 * | 0 | 0 |  0  |       0        |
 * | 0 | 1 |  0  |       0        |
 * | 1 | 0 |  0  |       1        |
 * | 1 | 1 |  0  |       1        |
 * | 0 | 0 |  1  |       0        |
 * | 0 | 1 |  1  |       1        |
 * | 1 | 0 |  1  |       0        |
 * | 1 | 1 |  1  |       1        |
 *
 * The MUX (multiplexer) returns either input a or input b based on the selector bit sel.
 * If sel is 0, returns a. If sel is 1, returns b.
 */
export default function mux(a: number, b: number, sel: number): number {
  const notsel = not(sel);
  const lh = and(sel, b);
  const rh = and(notsel, a);

  return or(lh, rh);
}
