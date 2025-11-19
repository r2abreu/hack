
import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import Register from "../register/register.ts";
import type { Tuple } from "../utility.ts";

interface RAM8 {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * 8-register (16-bit) random-access memory chip.
 *
 * - 3-bit address selects one of 8 registers.
 * - 16-bit input and output values (binary numbers).
 * - Call tick() to latch input if load is 1; tock() to update output[1][3][6].
 *
 * @interface RAM8
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} address - 3-bit address (binary number, 0 to 7)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */

export default function ram8(): RAM8 {
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
      registers[address].in = input;
      registers[address].load = dmux[address];
      registers[address].tick();
    },
    tock() {
      registers[address].tock();
    },
  };
}
