import type { bit } from "../utility.ts";
import not from "../not/not.ts";
import and from "../and/and.ts";
import or from "../or/or.ts";

/**
 * @module XOR
 *
 * @param {bit} a
 * @param {bit} b
 * @returns {bit}
 *
 * | A | B | A XOR B |
 * |---|---|:--------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   1    |
 * | 1 | 0 |   1    |
 * | 1 | 1 |   0    |
 */
export default function (a: bit, b: bit): bit {
  const nota = not(a);
  const notb = not(b);
  const lh = and(nota, b);
  const rh = and(a, notb);

  return or(lh, rh);
}
