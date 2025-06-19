import dmux from "../dmux/dmux.ts";
import mux16 from "../mux16/mux16.ts";
import RAM4K from "../ram4k/ram4k.ts";
import type { bit, BitTuple } from "../utility.ts";
/**
 * SCREEN - 8,192-register (16-bit each) memory-mapped display chip.
 *
 * Provides an 8K-word, 16-bit wide random-access memory, mapped to the computer's screen.
 * Each bit in this memory controls a pixel on the display: 1 for black, 0 for white.
 * Built from 16 RAM512 chips.
 *
 * ## Organization
 * - 8,192 registers, each 16 bits wide (total 131,072 bits/pixels).
 * - Internally organized as 16 RAM512 chips.
 * - The high 4 bits of `address` select the RAM512 chip.
 * - The low 9 bits of `address` select the register within the chosen RAM512.
 * - Each register maps to 16 consecutive horizontal pixels on the screen.
 *
 * ## Clocking
 * - Call `tick()` to advance the state of the chip (latches input if `load` is 1).
 * - Call `tock()` to update the output to reflect the most recent state.
 *
 * @module SCREEN
 *
 * @param {BitTuple<16>} in - 16-bit data input (each bit maps to a pixel).
 * @param {bit} load - Load signal (1: store input, 0: preserve).
 * @param {BitTuple<13>} address - 13-bit address selector (0-8191).
 * @returns {BitTuple<16>} value - 16-bit data output from the selected register.
 *
 * @example
 * // Set pixels at address 1234 (draw on the screen)
 * screen.in = [1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0]; // 8 black pixels, 8 white pixels
 * screen.address = [0,0,0,1,0,0,1,1,0,1,0,0,1]; // 13-bit address for 1234
 * screen.load = 1;
 * screen.tick();
 * screen.tock();
 * let output = screen.value;
 */

interface SCREEN {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<13>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): SCREEN {
  const rams = [RAM4K(), RAM4K()];

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<13> = Array(13).fill(0) as BitTuple<13>;

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
      return mux16(rams[0].value, rams[1].value, address[address.length - 1]);
    },
    tick() {
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = address.slice(0, 12) as BitTuple<12>;
        rams[i].load = dmux(load, address[address.length - 1])[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
