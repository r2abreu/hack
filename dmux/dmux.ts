/**
 * @module DMUX
 *
 * @param {number} _in
 * @param {number} sel
 * @returns {[number, number]}
 *
 * | IN  | SEL | A | B |
 * |-----|-----|---|---|
 * |  0  |  0  | 0 | 0 |
 * |  0  |  1  | 0 | 0 |
 * |  1  |  0  | 1 | 0 |
 * |  1  |  1  | 0 | 1 |
 */
export default function dmux(_in: number, sel: number): [number, number] {
  return [_in & ~sel, _in & sel];
}
