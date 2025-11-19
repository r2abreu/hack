/**
 * @module DMUX4WAY
 *
 * @param number _in
 * @param number sel
 * @returns {number}
 *
 * Input: a[16], b[16], c[16], d[16], sel[2]
 * Output: out[16]
 */
export default function dmux4way(
  _in: number,
  sel: number,
): [number, number, number, number] {
  const out = [0, 0, 0, 0];
  out[sel & 0b11] = _in;
  return out as [number, number, number, number];
}
