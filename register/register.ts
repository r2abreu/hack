import Bit from "../bit/bit.ts";
import type { BitTuple, bit } from "../utility.ts";

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
export default function (): (_in: BitTuple<16>, load: bit) => BitTuple<16> {
  const bits = new Array(16).fill(null).map(() => Bit()) as Array<
    ReturnType<typeof Bit>
  >;

  return function (_in: BitTuple<16>, load: bit) {
    const out = new Array<bit>(16).fill(0) as BitTuple<16>;
    for (let i = 0; i < 16; i++) {
      out[i] = bits[i](_in[i], load);
    }

    return out;
  };
}
