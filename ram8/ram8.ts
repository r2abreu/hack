import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import Register from "../register/register.ts";
import type { Tuple } from "../utility.ts";

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

interface RAM8 {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

export default function (): RAM8 {
  const registers = Array.from({ length: 8 }, () => Register());

  let input = 0;
  let load = 0;
  let address = 0;

  return {
    get load() {
      return load;
    },
    set load(newVal) {
      load = newVal;
    },
    get address() {
      return address;
    },
    set address(newVal) {
      address = newVal;
    },
    get in() {
      return input;
    },
    set in(val: number) {
      input = val;
    },
    get value() {
      const registerValues = registers.map((r) => r.value) as Tuple<
        ReturnType<typeof Register>["value"],
        8
      >;
      return mux8way16(...registerValues, address);
    },
    tick() {
      const dmux = dmux8way(load, address);
      for (let i = 0; i < registers.length; i++) {
        registers[i].in = input;
        registers[i].load = dmux[i];
        registers[i].tick();
      }
    },
    tock() {
      for (const register of registers) register.tock();
    },
  };
}
