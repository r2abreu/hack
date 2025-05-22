import dff from "../dff/dff.ts";
import type { bit } from "../utility.ts";

export default function (): (_in: bit, load: bit) => bit {
  const _dff = dff();

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

  return function (_in: bit, load: bit): bit {
    if (load) {
      _dff.value = _in;
    }

    return _dff.value;
  };
}
