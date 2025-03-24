import type { bit } from "../utility.ts";

/**
 * @module NAND
 *
 * @param {bit} a
 * @param {bit} b
 * @returns {bit}
 *
 * | A | B | A NAND B |
 * |---|---|:--------:|
 * | 0 | 0 |   1    |
 * | 0 | 1 |   1    |
 * | 1 | 0 |   1    |
 * | 1 | 1 |   0    |
 */
export default function (a: bit, b: bit): bit {
  if (a && b) return 0;

  return 1;
}
