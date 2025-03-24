import type { bit } from "../utility.ts";
import nand from "../nand/nand.ts";
/**
 * @module OR
 *
 * @param {bit} a
 * @param {bit} b
 * @returns {bit}
 *
 * | A | B | A OR B |
 * |---|---|:--------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   1    |
 * | 1 | 0 |   1    |
 * | 1 | 1 |   1    |
 */
export default function (a: bit, b: bit): bit {
  const nota = nand(a, a);
  const notb = nand(b, b);
  const nandab = nand(nota, notb);
  const nandnandab = nand(nandab, nandab);

  return nand(nandnandab, nandnandab);
}
