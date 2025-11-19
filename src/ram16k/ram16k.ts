import dmux4way from "../dmux4way/dmux4way.ts";
import mux4way16 from "../mux4way16/mux4way16.ts";
import RAM4K from "../ram4k/ram4k.ts";
import { sliceBits, type Tuple } from "../utility.ts";

interface RAM16K {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * 16,384-register (16-bit) random-access memory chip.
 *
 * - 14-bit address selects one of 16,384 registers.
 * - 16-bit input and output values (binary numbers).
 * - Call tick() to latch input if load is 1; tock() to update output.
 * - Built from 4 RAM4K chips (high 2 bits of address select chip, low 12 bits select register).
 *
 * @interface RAM16K
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} address - 14-bit address (binary number, 0 to 16383)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */
export default function ram16k(): RAM16K {
  const rams = Array.from({ length: 4 }, () => RAM4K());

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
        ReturnType<typeof RAM4K>["value"],
        4
      >;
      return mux4way16(...ramValues, sliceBits(address, 0, 2));
    },
    tick() {
      const dmux = dmux4way(load, sliceBits(address, 0, 2));
      const ram = rams[sliceBits(address, 0, 2)];
      ram.in = input;
      ram.address = sliceBits(address, 3, 12);
      ram.load = dmux[sliceBits(address, 0, 2)];
      ram.tick();
    },
    tock() {
      const ram = rams[sliceBits(address, 0, 2)];
      ram.tock();
    },
  };
}
