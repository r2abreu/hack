import Register from "../register/register.ts";
import inc16 from "../inc16/inc16.ts";
import mux16 from "../mux16/mux16.ts";

/**
 * @module PC
 *
 * @param {number} in - 16-bit input (binary number, used when loading)
 * @param {number} load - Load signal (1: load `in` into PC)
 * @param {number} inc - Increment signal (1: increment PC by 1)
 * @param {number} reset - Reset signal (1: reset PC to 0)
 * @returns {number} out - 16-bit current value of the PC (binary number)
 *
 * 16-bit program counter. On each clock cycle:
 * - If reset is 1, sets PC to 0.
 * - Else if load is 1, loads `in` into PC.
 * - Else if inc is 1, increments PC by 1.
 * - Else holds current value.
 *
 * Use tick() to apply control signals, and tock() to update output.
 */

interface PC {
  load: number;
  inc: number;
  reset: number;
  in: number;
  value: number;
  tick: () => void;
  tock: () => void;
}

export default function pc(): PC {
  const register = Register();
  register.load = 1;

  let load = 0;
  let reset = 0;
  let inc = 0;
  let input = 0;

  return {
    get load() {
      return load;
    },
    set load(val) {
      load = val;
    },
    get reset() {
      return reset;
    },
    set reset(val) {
      reset = val;
    },
    get inc() {
      return inc;
    },
    set inc(val) {
      inc = val;
    },
    get in() {
      return input;
    },
    set in(val) {
      input = val;
    },
    get value() {
      return register.value;
    },
    tick() {
      // Priority: reset > load > inc > hold
      const incremented = inc16(register.value);
      const incout = mux16(register.value, incremented, inc); // inc if inc==1
      const normout = mux16(incout, input, load); // load if load==1
      const resetout = mux16(normout, 0, reset); // reset if reset==1
      register.in = resetout;
      register.tick();
    },
    tock() {
      register.tock();
    },
  };
}
