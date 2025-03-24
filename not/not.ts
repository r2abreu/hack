import type { bit } from "../utility.ts";

/**
 * @module NOT
 *
 * @param {bit} _in
 * @returns {bit}
 *
 * | A | NOT A |
 * |---|:-----:|
 * | 0 | 1 |
 * | 1 | 0 |
 */
export default function (_in: bit): bit {
  if (_in === 1) return 0;
  else return 1;
}
