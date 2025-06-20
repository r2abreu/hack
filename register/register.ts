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
  const state: bit[] = Array(16).fill(0);
  const next: bit[] = Array(16).fill(0);
  let input: bit[] = Array(16).fill(0);
  let load: bit = 0;

  return {
    get in() {
      return input as BitTuple<16>;
    },
    set in(val) {
      input = val;
    },
    get load() {
      return load;
    },
    set load(val) {
      load = val;
    },
    get value() {
      return state as BitTuple<16>;
    },
    tick() {
      if (load) {
        for (let i = 0; i < 16; i++) next[i] = input[i];
      } else {
        for (let i = 0; i < 16; i++) next[i] = state[i];
      }
    },
    tock() {
      for (let i = 0; i < 16; i++) state[i] = next[i];
    },
  };
}
