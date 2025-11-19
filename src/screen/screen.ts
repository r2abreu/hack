import dmux from "../dmux/dmux.ts";
import mux16 from "../mux16/mux16.ts";
import RAM4K from "../ram4k/ram4k.ts";
import { index, sliceBits } from "../utility.ts";

interface Screen {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * Memory-mapped 16-bit screen device (Screen).
 *
 * - 8,192 16-bit registers (0–8191), each representing 16 horizontal pixels (total 256 x 512 monochrome pixels).
 * - 13-bit address selects a register.
 * - Writing updates pixel data; reading returns current value.
 * - Used for direct pixel manipulation in Hack platforms.
 */

export default function screen(): Screen {
  const rams = [RAM4K(), RAM4K()];

  let input = 0;
  let load = 0;
  let address = 0;

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
    get in(): number {
      return input;
    },
    set in(val) {
      input = val;
    },
    get value() {
      return mux16(rams[0].value, rams[1].value, index(address, 12));
    },
    tick() {
      for (let i = 0; i < rams.length; i++) {
        rams[i].in = input;
        rams[i].address = sliceBits(address, 0, 13);
        rams[i].load = dmux(load, index(address, 12))[i];
        rams[i].tick();
      }
    },
    tock() {
      for (const ram of rams) ram.tock();
    },
  };
}
