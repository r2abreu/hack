import SCREEN from "../screen/screen.ts";
import dmux from "../dmux/dmux.ts";
import RAM16K from "../ram16k/ram16k.ts";
import type { bit, BitTuple } from "../utility.ts";
import Keyboard from "../keyboard/keyboard.ts";
import mux16 from "../mux16/mux16.ts";

/**
 * MEMORY - Unified memory chip for the Hack computer platform.
 *
 * Provides a 32K-word, 16-bit wide addressable memory space, integrating RAM, screen memory, and keyboard input.
 * The chip routes read and write operations to the appropriate internal device based on the address input.
 *
 * ## Organization
 * - 32,768 registers (words), each 16 bits wide.
 * - Address space is divided as follows:
 *   - 0x0000–0x5FFF (0–24575): General-purpose RAM (24K, read/write)
 *   - 0x6000–0x7FFF (24576–32767): Memory-mapped I/O
 *     - 0x6000–0x7FFF (24576–32767): Screen memory (8K, read/write)
 *     - 0x6000 (24576): Keyboard input (read-only)
 *
 * ## Routing Logic
 * - Addresses 0–24575: Routed to RAM16K and RAM8K chips (read/write)
 * - Addresses 24576–32767: Routed to SCREEN chip (read/write)
 * - Address 24576: Routed to KEYBOARD chip (read-only)
 * - Writes to address 24576 (KEYBOARD) are ignored.
 *
 * ## Clocking
 * - Call `tick()` to latch input (`in`) to memory if `load` is 1 at the given `address`.
 * - Call `tock()` to update the output (`value`) to reflect the most recent state.
 *
 * @module MEMORY
 *
 * @param {BitTuple<16>} in - 16-bit data input.
 * @param {bit} load - Load signal (1: store input at address, 0: preserve).
 * @param {BitTuple<15>} address - 15-bit address selector (0–32767).
 * @returns {BitTuple<16>} value - 16-bit data output from the selected register/device.
 *
 * @example
 * // Store a value at RAM address 1234
 * memory.in = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0];
 * memory.address = [0,1,0,0,1,1,0,1,0,0,0,1,0,0,0]; // 15-bit address for 1234 (LSB first)
 * memory.load = 1;
 * memory.tick();
 * memory.tock();
 * let output = memory.value;
 *
 * // Read the current key code from keyboard
 * memory.address = [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0]; // 24576 (0x6000), LSB first
 * memory.load = 0;
 * memory.tick();
 * memory.tock();
 * let key = memory.value;
 */

interface Memory {
  in: BitTuple<16>;
  load: bit;
  address: BitTuple<15>;
  value: BitTuple<16>;
  tock: () => void;
  tick: () => void;
}

export default function (): Memory {
  const screen = SCREEN();
  const ram = RAM16K();
  const keyboard = Keyboard();

  let input: BitTuple<16> = Array(16).fill(0) as BitTuple<16>;
  let load: bit = 0;
  let address: BitTuple<15> = Array(15).fill(0) as BitTuple<15>;

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
      const peripheralout = mux16(screen.value, keyboard.value, address[13]);

      return mux16(ram.value, peripheralout, address[13]);
    },
    tick() {
      const [loadram, loadperipheral] = dmux(load, address[13]);
      const [loadscreen, loadkeyboard] = dmux(address[12], loadperipheral);

      ram.in = input;
      ram.load = loadram;
      ram.address = address.slice(0, 14) as BitTuple<14>;

      screen.in = input;
      screen.load = loadscreen;
      screen.address = address.slice(0, 13) as BitTuple<13>;

      keyboard.in = input;
      keyboard.load = loadkeyboard;

      [screen, ram, keyboard].forEach((m) => m.tick());
    },
    tock() {
      [screen, ram, keyboard].forEach((m) => m.tock());
    },
  };
}
