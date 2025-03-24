import type { bit } from "../utility.ts";
import not from "../not/not.ts";
import and from "../and/and.ts";

/**
 * @module DMUX
 *
 * @param {bit} _in
 * @param {bit} sel
 * @returns {[bit, bit]}
 *
 * | IN  | SEL | A | B |
 * |-----|-----|---|---|
 * |  0  |  0  | 0 | 0 |
 * |  0  |  1  | 0 | 0 |
 * |  1  |  0  | 1 | 0 |
 * |  1  |  1  | 0 | 1 |
 */
export default function (_in: bit, sel: bit): [bit, bit] {
  const notsel = not(sel);
  const a = and(_in, notsel);
  const b = and(_in, sel);

  return [a, b];
}
