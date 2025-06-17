import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM512 from "../ram512/ram512.ts";
import type { bit, BitTuple, Tuple } from "../utility.ts";

/**
 * RAM4K - 4096-register (16-bit each) random-access memory chip.
 *
 * Provides a 4096-word, 16-bit wide random-access memory, built from 8 RAM512 chips.
 *
 * ## Organization
 * - 4096 registers, each 16 bits wide.
 * - Internally organized as 8 RAM512 chips.
 * - The high 3 bits of `address` select the RAM512 chip.
 * - The low 9 bits of `address` select the register within the chosen RAM512.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the chip (latches input if `load` is 1).
 * - Call `tock()` to update the output to reflect the most recent state.
 *
 * @module RAM4K
 *
 * @param {BitTuple<16>} in - 16-bit data input.
 * @param {bit} load - Load signal (1: store input, 0: preserve).
 * @param {BitTuple<12>} address - 12-bit address selector (0-4095).
 * @returns {BitTuple<16>} value - 16-bit data output from the selected register.
 *
 * @example
 * // Store a value at address 1234
 * ram4k.in = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]; // 16-bit value
 * ram4k.address = [0,0,0,1,0,0,1,1,0,1,0,0]; // 12-bit address for 1234
 * ram4k.load = 1;
 * ram4k.tick();
 * ram4k.tock();
 * let output = ram4k.value;
 */

interface RAM64 {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<12>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): RAM64 {
  const rams = Array.from({ length: 8 }, () => RAM512());

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<12> = Array(12).fill(0) as BitTuple<12>;

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
        ReturnType<typeof RAM512>["value"],
        8
      >;
      return mux8way16(...ramValues, address.slice(0, 3) as BitTuple<3>);
    },
    tick() {
      const dmux = dmux8way(load, address.slice(0, 3) as BitTuple<3>);
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = address.slice(3) as BitTuple<9>;
        rams[i].load = dmux[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
