import Register from "../register/register.ts";

/**
 * KEYBOARD - Memory-mapped keyboard input chip for Hack computer.
 *
 * Provides a single 16-bit read-only register reflecting the current key pressed on the host keyboard.
 * The chip is memory-mapped at address 24576 (0x6000). When no key is pressed, the register outputs 0.
 * When a key is pressed, the register outputs the 16-bit Hack key code of the currently pressed key.
 *
 * ## Organization
 * - 1 register, 16 bits wide.
 * - Read-only: cannot be written to by the CPU.
 * - The value updates asynchronously to reflect the most recently pressed key, or 0 if none is pressed.
 *
 * ## Usage
 * - The Hack computer reads the value at address 24576 to detect user input.
 * - Key codes correspond to Hack platform conventions (e.g., ASCII for character keys, specific codes for arrows, etc.).
 * - Only one key code is reported at a time; if multiple keys are pressed, the chip outputs the code of the last key pressed.
 *
 * ## Clocking
 * - No clocking or load signals; value updates automatically as host key state changes.
 *
 * @module KEYBOARD
 *
 * @returns {BitTuple<16>} value - 16-bit code of the currently pressed key, or 0 if no key is pressed.
 *
 * @example
 * // Read the current key code
 * let key = keyboard.value;
 * if (key !== 0) {
 *   // A key is pressed; process input
 * }
 */
export default function () {
  return Register();
}
