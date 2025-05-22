import add16 from "../add16/add16.ts";
import and16 from "../and16/and16.ts";
import mux16 from "../mux16/mux16.ts";
import not from "../not/not.ts";
import not16 from "../not16/not16.ts";
import or from "../or/or.ts";
import or8way from "../or8way/or8way.ts";
import type { BitTuple, bit } from "../utility.ts";

export interface AluControlBits {
  /** Zero the x input if 1 */
  zx: bit;
  /** Negate the x input if 1 */
  nx: bit;
  /** Zero the y input if 1 */
  zy: bit;
  /** Negate the y input if 1 */
  ny: bit;
  /** Function code: 1 for Add, 0 for And */
  f: bit;
  /** Negate the output if 1 */
  no: bit;
}

/**
 * @module ALU
 *
 * @param {BitTuple<16>} x - 16-bit input
 * @param {BitTuple<16>} y - 16-bit input
 * @param {AluControlBits} control_bits - Object containing all ALU control bits
 * @returns {{out: BitTuple<16>, zr: bit, ng: bit}}
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
 * The ALU computes a 16-bit output (out) and two status flags:
 *   - zr: 1 if out == 0, else 0
 *   - ng: 1 if out < 0 (in two's complement), else 0
 */

export default function (
  x: BitTuple<16>,
  y: BitTuple<16>,
  { zx, nx, zy, ny, f, no }: AluControlBits
): { ng: bit; out: BitTuple<16>; zr: bit } {
  const zero = new Array<bit>(16).fill(0) as BitTuple<16>;

  if (zx) x = mux16(x, zero, zx);
  if (nx) x = not16(x);
  if (zy) y = mux16(y, zero, zy);
  if (ny) y = not16(y);

  const operation_result = f ? add16(x, y) : and16(x, y);
  const not_operation_result = not16(operation_result);
  const out = mux16(operation_result, not_operation_result, no);

  const first_or = or8way(out.slice(0, 7) as BitTuple<8>);
  const second_or = or8way(out.slice(8) as BitTuple<8>);
  const last_or = or(first_or, second_or);
  const zr = not(last_or);

  return {
    ng: out[15],
    out,
    zr,
  };
}
