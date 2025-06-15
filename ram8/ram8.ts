import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import Register from "../register/register.ts";
import type { bit, BitTuple } from "../utility.ts";

/**
 * @module RAM8
 *
 * @returns {function(
 *   in: BitTuple<16>,
 *   load: bit,
 *   address: BitTuple<3>
 * ): BitTuple<16>} RAM8 - 8-register (16-bit each) memory function
 *
 * Input:
 *   in[16]    (BitTuple<16>) - 16-bit data input
 *   load      (bit)          - Load signal
 *   address[3] (BitTuple<3>) - 3-bit address selector (0-7)
 *
 * Output:
 *   out[16]   (BitTuple<16>) - 16-bit data output from selected register
 *
 * Function:
 *   - The RAM8 chip consists of 8 registers, each 16 bits wide.
 *   - When `load == 1`, the value of `in` is stored into the register selected by `address` on the next clock cycle.
 *   - When `load == 0`, the selected register preserves its previous value.
 *   - The output always reflects the value stored in the register selected by `address`.
 *
 * The RAM8 chip provides a simple 8-word, 16-bit wide random-access memory, built from 8 Register chips.
 */
export default function (): (
  _in: BitTuple<16>,
  load: bit,
  address: BitTuple<3>,
) => BitTuple<16> {
  const r0 = Register();
  const r1 = Register();
  const r2 = Register();
  const r3 = Register();
  const r4 = Register();
  const r5 = Register();
  const r6 = Register();
  const r7 = Register();

  return (_in: BitTuple<16>, load: bit, address: BitTuple<3>) => {
    const [
      loadreg0,
      loadreg1,
      loadreg2,
      loadreg3,
      loadreg4,
      loadreg5,
      loadreg6,
      loadreg7,
    ] = dmux8way(load, address);

    return mux8way16(
      r0(_in, loadreg0),
      r1(_in, loadreg1),
      r2(_in, loadreg2),
      r3(_in, loadreg3),
      r4(_in, loadreg4),
      r5(_in, loadreg5),
      r6(_in, loadreg6),
      r7(_in, loadreg7),
      address,
    );
  };
}
