import clock from "../clock/clock.ts";
import type { bit } from "../utility.ts";

/**
 * @module DFF
 *
 * @param {bit} in - 1-bit input value
 * @returns {object} out - DFF interface with getter/setter for value
 *
 * Input:  in (bit)
 * Output: out (bit)
 * Function:
 *   On every clock tick, the input is sampled for the next cycle.
 *   On every clock tock, the output is updated to the sampled value.
 *
 * The DFF (Data Flip-Flop) is a primitive sequential component that stores a single bit.
 * It updates its output in sync with the system clock's tick/tock phases.
 */

export default function () {
  let output: bit = 0;
  let next: bit = 0;
  let input: bit = 0;

  const obj = {
    get value() {
      return output;
    },

    set value(newVal: bit) {
      input = newVal;
    },
  };

  clock.addEventListener("tick", () => {
    next = input;
  });

  clock.addEventListener("tock", () => {
    output = next;
  });

  return obj;
}
