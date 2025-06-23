import SCREEN from "../screen/screen.ts";
import dmux from "../dmux/dmux.ts";
import RAM16K from "../ram16k/ram16k.ts";
import Keyboard from "../keyboard/keyboard.ts";
import mux16 from "../mux16/mux16.ts";
import { index, sliceBits } from "../utility.ts";

interface Memory {
  in: number;
  load: number;
  address: number;
  value: number;
  tock: () => void;
  tick: () => void;
}

/**
 * Memory - Unified memory chip for the Hack computer platform.
 *
 * Provides a 32K-word, 16-bit wide addressable memory space, integrating RAM, screen memory, and keyboard input.
 * The chip routes read and write operations to the appropriate internal device based on the 15-bit binary address input.
 *
 * Organization:
 * - 32,768 registers (words), each 16 bits wide.
 * - Address space is divided as follows:
 *   - 0b000000000000000 to 0b101111111111111 (0 to 24575): General-purpose RAM (24K, read/write)
 *   - 0b110000000000000 to 0b111111111111111 (24576 to 32767): Memory-mapped I/O
 *     - 0b110000000000000 to 0b111111111111111 (24576 to 32767): Screen memory (8K, read/write)
 *     - 0b110000000000000 (24576): Keyboard input (read-only)
 *
 * Routing Logic:
 * - Addresses 0b000000000000000 to 0b101111111111111: Routed to RAM16K and RAM8K chips (read/write)
 * - Addresses 0b110000000000000 to 0b111111111111111: Routed to SCREEN chip (read/write)
 * - Address 0b110000000000000: Routed to KEYBOARD chip (read-only)
 * - Writes to address 0b110000000000000 (KEYBOARD) are ignored.
 *
 * Clocking:
 * - Call tick() to latch input (`in`) to memory if `load` is 1 at the given 15-bit binary address.
 * - Call tock() to update the output (`value`) to reflect the most recent state.
 *
 * @module Memory
 *
 * @param {number} in - 16-bit data input as a binary number (0b0000000000000000 to 0b1111111111111111).
 * @param {number} load - Load signal (1: store input at address, 0: preserve).
 * @param {number} address - 15-bit address selector as a binary number (0b000000000000000 to 0b111111111111111).
 * @returns {number} value - 16-bit data output from the selected register or device (as a binary number).
 *
 * @example
 * // Store a value at RAM address 0b000010011001010 (1234 in binary)
 * memory.in = 0b1010101010101010; // 16-bit input
 * memory.address = 0b000010011001010; // 15-bit binary address
 * memory.load = 1;
 * memory.tick();
 * memory.tock();
 * let output = memory.value;
 *
 * // Read the current key code from keyboard (address 0b110000000000000)
 * memory.address = 0b110000000000000; // 15-bit binary address for keyboard input
 * memory.load = 0;
 * memory.tick();
 * memory.tock();
 * let key = memory.value;
 */
export default function memory(): Memory {
  const screen = SCREEN();
  const ram = RAM16K();
  const keyboard = Keyboard();

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
    set in(val: number) {
      input = val;
    },
    get value() {
      const peripheralout = mux16(
        screen.value,
        keyboard.value,
        index(address, 13),
      );

      return mux16(ram.value, peripheralout, index(address, 14));
    },
    tick() {
      const [loadram, loadperipheral] = dmux(load, index(address, 14));
      const [loadscreen, loadkeyboard] = dmux(
        loadperipheral,
        index(address, 13),
      );

      ram.in = input;
      ram.load = loadram;
      ram.address = sliceBits(address, 0, 15);

      screen.in = input;
      screen.load = loadscreen;
      screen.address = sliceBits(address, 0, 13);

      keyboard.in = input;
      keyboard.load = loadkeyboard;

      [screen, ram, keyboard].forEach((m) => m.tick());
    },
    tock() {
      [screen, ram, keyboard].forEach((m) => m.tock());
    },
  };
}
