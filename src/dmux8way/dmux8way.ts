import { index, type Tuple } from "../utility.ts";

/**
 * @module dmux4way
 *
 * @param {number} _in - the input as a binary number (for example, 16 bits: 0bxxxxxxxxxxxxxxxx).
 * @param {number} sel - the selector as a 2-bit binary number (0b00 to 0b11).
 * @returns {number[]} - an array of 4 binary numbers (each 16 bits). only one will equal the input; the rest will be 0.
 *
 * example:
 *   dmux4way(0b1010101010101010, 0b10) // => [0, 0, 0b1010101010101010, 0]
 */

export default function dmux8way(
  _in: number,
  sel: number,
): Tuple<number, 8> {
  const sel0 = index(sel, 0);
  const sel1 = index(sel, 1);
  const sel2 = index(sel, 2);

  if (!(sel0 | sel1 | sel2)) {
    return [_in, 0, 0, 0, 0, 0, 0, 0];
  }

  if (sel0 & ~sel1 & ~sel2) {
    return [0, _in, 0, 0, 0, 0, 0, 0];
  }
  if (~sel0 & sel1 & ~sel2) {
    return [0, 0, _in, 0, 0, 0, 0, 0];
  }
  if (sel0 & sel1 & ~sel2) {
    return [0, 0, 0, _in, 0, 0, 0, 0];
  }
  if (~sel0 & ~sel1 & sel2) {
    return [0, 0, 0, 0, _in, 0, 0, 0];
  }
  if (sel0 & ~sel1 & sel2) {
    return [0, 0, 0, 0, 0, _in, 0, 0];
  }
  if (~sel0 & sel1 & sel2) {
    return [0, 0, 0, 0, 0, 0, _in, 0];
  }

  // sel[0] === 1 && sel[1] === 1 && sel[2] === 1
  return [0, 0, 0, 0, 0, 0, 0, _in];
}
