import dmux4way from "../dmux4way/dmux4way.ts";
import dmux8way from "../dmux8way/dmux8way.ts";
import mux4way16 from "../mux4way16/mux4way16.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM4K from "../ram4k/ram4k.ts";
import type { bit, BitTuple, Tuple } from "../utility.ts";

/**
 * RAM16K - 16,384-register (16-bit each) random-access memory chip.
 *
 * Provides a 16K-word, 16-bit wide random-access memory, built from 4 RAM4K chips.
 *
 * ## Organization
 * - 16,384 registers, each 16 bits wide.
 * - Internally organized as 4 RAM4K chips.
 * - The high 2 bits of `address` select the RAM4K chip.
 * - The low 12 bits of `address` select the register within the chosen RAM4K.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the chip (latches input if `load` is 1).
 * - Call `tock()` to update the output to reflect the most recent state.
 *
 * @module RAM16K
 *
 * @param {BitTuple<16>} in - 16-bit data input.
 * @param {bit} load - Load signal (1: store input, 0: preserve).
 * @param {BitTuple<14>} address - 14-bit address selector (0-16383).
 * @returns {BitTuple<16>} value - 16-bit data output from the selected register.
 *
 * @example
 * // Store a value at address 12345
 * ram16k.in = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]; // 16-bit value
 * ram16k.address = [0,0,1,1,0,0,0,1,1,1,0,0,1,1]; // 14-bit address for 12345
 * ram16k.load = 1;
 * ram16k.tick();
 * ram16k.tock();
 * let output = ram16k.value;
 */

interface RAM64 {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<14>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): RAM64 {
  const rams = Array.from({ length: 4 }, () => RAM4K());

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<14> = Array(14).fill(0) as BitTuple<14>;

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
    set in(val: BitTuple<16>) {
      input = val;
    },
    get value() {
      const ramValues = rams.map((r) => r.value) as Tuple<
        ReturnType<typeof RAM4K>["value"],
        4
      >;
      return mux4way16(...ramValues, address.slice(0, 2) as BitTuple<2>);
    },
    tick() {
      const dmux = dmux4way(load, address.slice(0, 2) as BitTuple<2>);
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = address.slice(3) as BitTuple<12>;
        rams[i].load = dmux[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
