import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM64 from "../ram64/ram64.ts";
import type { bit, BitTuple, Tuple } from "../utility.ts";

/**
 * RAM512 - 512-register (16-bit each) random-access memory chip.
 *
 * Provides a 512-word, 16-bit wide random-access memory, built from 8 RAM64 chips.
 *
 * ## Organization
 * - 512 registers, each 16 bits wide.
 * - Internally organized as 8 RAM64 chips.
 * - The high 3 bits of `address` select the RAM64 chip.
 * - The low 6 bits of `address` select the register within the chosen RAM64.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the chip (latches input if `load` is 1).
 * - Call `tock()` to update the output to reflect the most recent state.
 *
 * @module RAM512
 *
 * @param {BitTuple<16>} in - 16-bit data input.
 * @param {bit} load - Load signal (1: store input, 0: preserve).
 * @param {BitTuple<9>} address - 9-bit address selector (0-511).
 * @returns {BitTuple<16>} value - 16-bit data output from the selected register.
 *
 * @example
 * // Store a value at address 42
 * ram512.in = [0,1,1,...]; // 16-bit value
 * ram512.address = [0,1,0,1,0,1,0,1,0]; // 9-bit address
 * ram512.load = 1;
 * ram512.tick();
 * ram512.tock();
 * let output = ram512.value;
 */

interface RAM64 {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<9>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): RAM64 {
  const rams = Array.from({ length: 8 }, () => RAM64());

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<9> = Array(9).fill(0) as BitTuple<9>;

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
        ReturnType<typeof RAM64>["value"],
        8
      >;
      return mux8way16(...ramValues, address.slice(0, 3) as BitTuple<3>);
    },
    tick() {
      const dmux = dmux8way(load, address.slice(0, 3) as BitTuple<3>);
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = address.slice(3) as BitTuple<6>;
        rams[i].load = dmux[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
