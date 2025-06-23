import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM512 from "../ram512/ram512.ts";
import { sliceBits, type Tuple } from "../utility.ts";

/**
 * 4,096-register (16-bit) random-access memory chip.
 *
 * - 12-bit address selects one of 4,096 registers.
 * - 16-bit input and output values (binary numbers).
 * - Built from 8 RAM512 chips: high 3 bits of address select chip, low 9 bits select register[1].
 * - Call tick() to latch input if load is 1; tock() to update output.
 *
 * @interface RAM4K
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} address - 12-bit address (binary number, 0 to 4095)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */

interface RAM4K {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

export default function ram4k(): RAM4K {
  const rams = Array.from({ length: 8 }, () => RAM512());

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
      const ramValues = rams.map((r) => r.value) as Tuple<
        ReturnType<typeof RAM512>["value"],
        8
      >;
      return mux8way16(...ramValues, sliceBits(address, 0, 3));
    },
    tick() {
      const dmux = dmux8way(load, sliceBits(address, 0, 3));
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = sliceBits(address, 3, 9);
        rams[i].load = dmux[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
