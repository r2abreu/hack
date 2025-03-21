import type { binary } from "../utility.ts";

/**
 * @module NAND
 *
 * @param {binary} a
 * @param {binary} b
 * @returns {binary}
 *
 * | A | B | A NAND B |
 * |---|---|:--------:|
 * | 0 | 0 |   1    |
 * | 0 | 1 |   1    |
 * | 1 | 0 |   1    |
 * | 1 | 1 |   0    |
 */
export default function (a: binary, b: binary): binary {
  if (a && b) return 0;

  return 1;
}
