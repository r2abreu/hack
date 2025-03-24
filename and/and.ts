import nand from "../nand/nand.ts";
import type { bit } from "../utility.ts";
/**
 * @module AND
 *
 * @param {bit} a
 * @param {bit} b
 * @returns {bit}
 *
 * | A | B | A AND B |
 * |---|---|:--------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   0    |
 * | 1 | 0 |   0    |
 * | 1 | 1 |   1    |
 */
export default function (a: bit, b: bit): bit {
  const w1 = nand(a, b);
  return nand(w1, w1);
}
