import Bit from "../bit/bit.ts";
import type { bit, BitTuple } from "../utility.ts";

/**
 * @module Register
 *
 * @returns {function(in: BitTuple<16>, load: bit): BitTuple<16>} Register - 16-bit register function
 *
 * Input:  in[16] (BitTuple<16>), load (bit)
 * Output: out[16] (BitTuple<16>)
 * Function:
 *   If load == 1, stores `in` on next clock cycle.
 *   If load == 0, preserves previous value.
 *
 * The Register chip is a 16-bit storage element built from 16 Bit chips.
 * It outputs the currently stored 16-bit value.
 */

export interface Register {
  in: BitTuple<16>;
  value: BitTuple<16>;
  load: bit;
  tock: () => void;
  tick: () => void;
}

export default function (): Register {
  const bits = Array.from({ length: 16 }, () => Bit());

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;

  return {
    get in() {
      return input;
    },
    set in(val: BitTuple<16>) {
      input = val;
    },
    get load() {
      return load;
    },
    set load(newVal) {
      load = newVal;
    },
    get value() {
      return bits.map((bit) => bit.value) as BitTuple<16>;
    },
    tick() {
      for (let i = 0; i < bits.length; i++) {
        bits[i].load = load;
        bits[i].in = input[i];
        bits[i].tick();
      }
    },
    tock() {
      for (const bit of bits) bit.tock();
    },
  };
}
