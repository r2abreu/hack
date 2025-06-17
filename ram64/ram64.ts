import dmux8way from "../dmux8way/dmux8way.ts";
import mux8way16 from "../mux8way16/mux8way16.ts";
import RAM8 from "../ram8/ram8.ts";
import type { bit, BitTuple, Tuple } from "../utility.ts";

/**
 * @module RAM64
 *
 * @returns {RAM64} RAM64 - 64-register (16-bit each) random-access memory chip
 *
 * Input:
 *   in[16]      (BitTuple<16>) - 16-bit data input
 *   load        (bit)          - Load signal (1: store input, 0: preserve)
 *   address[6]  (BitTuple<6>)  - 6-bit address selector (0-63)
 *
 * Output:
 *   value[16]   (BitTuple<16>) - 16-bit data output from the selected register
 *
 * Function:
 *   - The RAM64 chip consists of 64 registers, each 16 bits wide, organized as 8 RAM8 chips.
 *   - The high 3 bits of `address` select which RAM8 chip to use.
 *   - The low 3 bits of `address` select which register within the selected RAM8.
 *   - When `load == 1`, the value of `in` is stored into the register selected by `address` on the next clock cycle.
 *   - When `load == 0`, the selected register preserves its previous value.
 *   - The output always reflects the value stored in the register selected by `address`.
 *
 * The RAM64 chip provides a 64-word, 16-bit wide random-access memory, built from 8 RAM8 chips.
 *
 * Clocking:
 *   - Call `tick()` to advance the state of the chip (latches input if load is 1).
 *   - Call `tock()` to update the output to reflect the most recent state.
 */

interface RAM64 {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<6>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): RAM64 {
  const rams = Array.from({ length: 8 }, () => RAM8());

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<6> = Array(6).fill(0) as BitTuple<6>;

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
        ReturnType<typeof RAM8>["value"],
        8
      >;
      return mux8way16(...ramValues, address.slice(0, 3) as BitTuple<3>);
    },
    tick() {
      const dmux = dmux8way(load, address.slice(0, 3) as BitTuple<3>);
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = address.slice(3, 6) as BitTuple<3>;
        rams[i].load = dmux[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
