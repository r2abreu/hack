import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM8 from "../ram8/ram8.ts";
import { sliceBits, type Tuple } from "../utility.ts";

interface RAM64 {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * 64-register (16-bit) random-access memory chip.
 *
 * - 6-bit address selects one of 64 registers.
 * - 16-bit input and output values (binary numbers).
 * - Built from 8 RAM8 chips: high 3 bits of address select chip, low 3 bits select register.
 * - Call tick() to latch input if load is 1; tock() to update output.
 *
 * @interface RAM64
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} address - 6-bit address (binary number, 0 to 63)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */
export default function ram64(): RAM64 {
  const rams = Array.from({ length: 8 }, () => RAM8());

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
        ReturnType<typeof RAM8>["value"],
        8
      >;
      return mux8way16(...ramValues, sliceBits(address, 0, 3));
    },
    tick() {
      const dmux = dmux8way(load, sliceBits(address, 0, 3));
      const ram = rams[sliceBits(address, 0, 3)];
      ram.in = input;
      ram.address = sliceBits(address, 3, 3);
      ram.load = dmux[sliceBits(address, 0, 3)];
      ram.tick();
    },
    tock() {
      const ram = rams[sliceBits(address, 0, 3)];
      ram.tock();
    },
  };
}
