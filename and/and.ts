import nand from "../nand/nand.ts";
import type { binary } from "../utility.ts";
/**
 * @module AND
 *
 * @param {binary} a
 * @param {binary} b
 * @returns {binary}
 *
 * | A | B | A AND B |
 * |---|---|:--------:|
 * | 0 | 0 |   0    |
 * | 0 | 1 |   0    |
 * | 1 | 0 |   0    |
 * | 1 | 1 |   1    |
 */
export default function (a: binary, b: binary): binary {
  const w1 = nand(a, b);
  return nand(w1, w1);
}
