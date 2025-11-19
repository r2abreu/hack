import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM64 from "../ram64/ram64.ts";
import { sliceBits, type Tuple } from "../utility.ts";

interface RAM512 {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * 512-register (16-bit) random-access memory chip.
 *
 * - 9-bit address selects one of 512 registers.
 * - 16-bit input and output values (binary numbers).
 * - Built from 8 RAM64 chips: high 3 bits of address select chip, low 6 bits select register[3].
 * - Call tick() to latch input if load is 1; tock() to update output.
 *
 * @interface RAM512
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} address - 9-bit address (binary number, 0 to 511)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */
export default function ram512(): RAM512 {
  const rams = Array.from({ length: 8 }, () => RAM64());

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
        ReturnType<typeof RAM64>["value"],
        8
      >;
      return mux8way16(...ramValues, sliceBits(address, 0, 3));
    },
    tick() {
      const dmux = dmux8way(load, sliceBits(address, 0, 3));
      const ram = rams[sliceBits(address, 0, 3)];
      ram.address = sliceBits(address, 3, 6);
      ram.in = input;
      ram.load = dmux[sliceBits(address, 0, 3)];
      ram.tick();
    },
    tock() {
      const ram = rams[sliceBits(address, 0, 3)];
      ram.tock();
    },
  };
}
