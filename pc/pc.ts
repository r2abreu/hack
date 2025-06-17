import Register from "../register/register.ts";
import type { bit, BitTuple } from "../utility.ts";
import inc16 from "../inc16/inc16.ts";
import mux16 from "../mux16/mux16.ts";
/**
 * PC - 16-bit programmable counter (Program Counter) chip.
 *
 * Implements a 16-bit program counter that can increment, load a value, reset to zero, or hold its current state.
 *
 * ## Functionality
 * - On each clock cycle, the PC can:
 *   - **Increment** its value by 1 if `inc` is 1 (unless `load` or `reset` is also 1).
 *   - **Load** an external 16-bit value if `load` is 1 (has priority over `inc`).
 *   - **Reset** to 0 if `reset` is 1 (has priority over `load` and `inc`).
 *   - **Hold** its current value if all control signals are 0.
 * - Output always reflects the current value of the PC.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the PC (applies control signals on the next clock cycle).
 * - Call `tock()` to update the output to reflect the most recent state.
 *
 * @module PC
 *
 * @param {BitTuple<16>} in - 16-bit data input (used when loading a value).
 * @param {bit} load - Load signal (1: load `in` into PC).
 * @param {bit} inc - Increment signal (1: increment PC by 1).
 * @param {bit} reset - Reset signal (1: reset PC to 0).
 * @returns {BitTuple<16>} out - 16-bit current value of the PC.
 *
 * @example
 * // Increment the PC
 * pc.inc = 1;
 * pc.load = 0;
 * pc.reset = 0;
 * pc.tick();
 * pc.tock();
 * let value = pc.out;
 *
 * // Load a specific value
 * pc.in = [0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0]; // 10
 * pc.load = 1;
 * pc.inc = 0;
 * pc.reset = 0;
 * pc.tick();
 * pc.tock();
 * let value = pc.out; // Should be 10
 *
 * // Reset the PC
 * pc.reset = 1;
 * pc.load = 0;
 * pc.inc = 0;
 * pc.tick();
 * pc.tock();
 * let value = pc.out; // Should be 0
 */
interface PC {
  load: bit;
  inc: bit;
  reset: bit;
  in: BitTuple<16>;
  value: BitTuple<16>
  tick: () => void;
  tock: () => void;
}

export default function (): PC {
  const register = Register();
  register.load = 1;

  let load: bit = 0;
  let reset: bit = 0;
  let inc: bit = 0;
  let input = Array(16).fill(0) as BitTuple<16>;

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
      const resetout = mux16(normout, Array(16).fill(0) as BitTuple<16>, reset); // reset if reset==1
      register.in = resetout;
      register.tick();
    },
    tock() {
      register.tock();
    },
  };
}
