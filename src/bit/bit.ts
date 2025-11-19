import dff from "../dff/dff.ts";
import type { bit } from "../utility.ts";

/**
 * @module Bit
 *
 * @param {bit} in - 1-bit input value
 * @param {bit} load - 1-bit load signal (1: store input, 0: keep current)
 * @returns {object} out - Bit interface with getter for output and setters for input/load
 *
 * Input:  in (bit), load (bit)
 * Output: out (bit)
 * Function:
 *   If load == 1, stores `in` on next clock cycle.
 *   If load == 0, preserves previous value.
 *
 * The Bit chip is a 1-bit register built from a DFF.
 */
interface Bit {
  value: bit;
  in: bit;
  load: bit;
  tick: () => void;
  tock: () => void;
}

export default function (_in: bit = 0, load: bit = 0): Bit {
  const _dff = dff();
  let __in: bit = _in;
  let _load: bit = load;

  return {
    get in() {
      return __in;
    },
    set in(val: bit) {
      __in = val;
    },
    get load() {
      return _load;
    },
    set load(val: bit) {
      _load = val;
    },
    get value() {
      return _dff.value;
    },
    tick() {
      if (_load) _dff.value = __in;
      _dff.tick();
    },
    tock() {
      _dff.tock();
    },
  };
}
