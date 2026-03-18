/**
 * @module emulator/types
 *
 * Core driver interfaces for the HackEmulator.
 *
 * These interfaces are the only contracts the emulator core knows about.
 * Concrete implementations (console, DOM, etc.) live in `drivers/` and are
 * wired together in `main.ts`. Adding a new platform means writing new drivers
 * and a new entry point — the core never changes.
 */

/**
 * Platform-agnostic display driver.
 *
 * The emulator calls `render()` once per frame after running N clock cycles.
 * Implementations are free to render the pixel data however they want:
 * ANSI half-block characters in a terminal, a `<canvas>` element in a browser,
 * a pixel buffer written to a file for testing, etc.
 */
export interface DisplayDriver {
  /**
   * Render the current screen state.
   *
   * The Hack screen is 512 pixels wide and 256 pixels tall, stored as 8192
   * 16-bit words in row-major order.
   *
   * Pixel layout inside each word:
   * - Word index `i` maps to screen row `Math.floor(i / 32)` and column group
   *   `(i % 32) * 16`.
   * - Bit `j` (0 = LSB) of word `i` is the pixel at column `(i % 32)*16 + j`,
   *   row `Math.floor(i / 32)`.
   * - A set bit (`1`) means **black**; a clear bit (`0`) means **white**.
   *   (This follows the nand2tetris / Hack platform convention.)
   *
   * @param screenWords  Typed array of 8192 Uint16 values — one per screen word.
   *                     The array is reused across frames; copy it if you need
   *                     to hold onto it asynchronously.
   */
  render(screenWords: Uint16Array): void;
}
