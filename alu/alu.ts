import add16 from "../add16/add16.ts";
import and16 from "../and16/and16.ts";
import mux16 from "../mux16/mux16.ts";
import not from "../not/not.ts";
import not16 from "../not16/not16.ts";
import or from "../or/or.ts";
import or8way from "../or8way/or8way.ts";
import { index, sliceBits } from "../utility.ts";

export interface AluControlBits {
  /** Zero the x input if 1 */
  zx: number;
  /** Negate the x input if 1 */
  nx: number;
  /** Zero the y input if 1 */
  zy: number;
  /** Negate the y input if 1 */
  ny: number;
  /** Function code: 1 for Add, 0 for And */
  f: number;
  /** Negate the output if 1 */
  no: number;
}

/**
 * @module ALU
 *
 * @param {number} x - 16-bit input (as a number; only the lowest 16 bits are used)
 * @param {number} y - 16-bit input (as a number; only the lowest 16 bits are used)
 * @param {AluControlBits} control_bits - Object containing all ALU control bits
 * @returns {{out: number, zr: 0|1, ng: 0|1}}
 *
 * | zx | nx | zy | ny |  f | no | Output        | Description           |
 * |----|----|----|----|----|----|--------------|----------------------|
 * | 1  | 0  | 1  | 0  | 1  | 0  |     0        | Constant zero        |
 * | 1  | 1  | 1  | 1  | 1  | 1  |     1        | Constant one         |
 * | 1  | 1  | 1  | 0  | 1  | 0  |    -1        | Constant minus one   |
 * | 0  | 0  | 1  | 0  | 1  | 0  |     x        | Pass through x       |
 * | 1  | 0  | 0  | 0  | 1  | 0  |     y        | Pass through y       |
 * | 0  | 1  | 1  | 0  | 1  | 1  |    !x        | Bitwise not x        |
 * | 1  | 0  | 0  | 1  | 1  | 1  |    !y        | Bitwise not y        |
 * | 0  | 1  | 1  | 0  | 1  | 0  |    -x        | Negate x             |
 * | 1  | 0  | 0  | 1  | 1  | 0  |    -y        | Negate y             |
 * | 0  | 1  | 1  | 1  | 1  | 1  |   x + 1      | x plus one           |
 * | 1  | 1  | 0  | 1  | 1  | 1  |   y + 1      | y plus one           |
 * | 0  | 0  | 1  | 1  | 1  | 0  |   x - 1      | x minus one          |
 * | 1  | 0  | 0  | 0  | 1  | 0  |   y - 1      | y minus one          |
 * | 0  | 0  | 0  | 0  | 1  | 0  |   x + y      | Add x and y          |
 * | 0  | 1  | 0  | 0  | 1  | 1  |   x - y      | Subtract y from x    |
 * | 0  | 0  | 0  | 1  | 1  | 1  |   y - x      | Subtract x from y    |
 * | 0  | 0  | 0  | 0  | 0  | 0  |   x & y      | Bitwise and          |
 * | 0  | 1  | 0  | 1  | 0  | 1  |   x \| y     | Bitwise or           |
 *
 * The ALU computes a 16-bit output (`out`) and two status flags:
 *   - `zr`: 1 if out == 0, else 0
 *   - `ng`: 1 if out < 0 (in two's complement), else 0
 */

export default function (
  x: number,
  y: number,
  { zx, nx, zy, ny, f, no }: AluControlBits,
): { ng: number; out: number; zr: number } {
  if (zx) x = mux16(x, 0, zx);
  if (nx) x = not16(x);
  if (zy) y = mux16(y, 0, zy);
  if (ny) y = not16(y);

  const operation_result = f ? add16(x, y) : and16(x, y);
  const not_operation_result = not16(operation_result);
  const out = mux16(operation_result, not_operation_result, no);

  const first_or = or8way(sliceBits(out, 0, 7));
  const second_or = or8way(sliceBits(out, 8, 8));
  const last_or = or(first_or, second_or);
  const zr = not(last_or);

  return {
    ng: index(out, 15),
    out,
    zr,
  };
}
