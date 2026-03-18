/**
 * Screen indexing (shown at 2:1, 8×4 pixels = 2 words wide, 4 rows tall):
 *
 * Pixel grid (each cell is 1 pixel, columns 0-7, rows 0-3):
 *
 *             word 0                 word 1
 *        bit: 0 1 2 3 4 5 6 7   bit: 0 1 2 3 4 5 6 7
 *  row 0:     □ □ ■ □ □ ■ □ □        □ ■ □ □ □ □ ■ □
 *  row 1:     □ ■ □ □ ■ □ □ □        □ □ □ ■ □ □ □ ■
 *  row 2:     ■ □ □ ■ □ □ □ ■        □ □ ■ □ ■ □ □ □
 *  row 3:     □ □ ■ □ □ □ ■ □        ■ □ □ □ □ ■ □ □
 *
 * Shadow buffer layout (screenWords, 4 rows × 2 words = 8 entries):
 *
 *   index = row * 2 + wordCol        (2 words per row in this example;
 *                                     32 words per row in the real screen)
 *
 *   screenWords[0] = row 0, word 0   screenWords[1] = row 0, word 1
 *   screenWords[2] = row 1, word 0   screenWords[3] = row 1, word 1
 *   screenWords[4] = row 2, word 0   screenWords[5] = row 2, word 1
 *   screenWords[6] = row 3, word 0   screenWords[7] = row 3, word 1
 *
 * Terminal rendering (▀ packs 2 pixel rows into 1 terminal line):
 *
 *   termRow 0 → topRow=0, botRow=1 → screenWords[0..1] and screenWords[2..3]
 *   termRow 1 → topRow=2, botRow=3 → screenWords[4..5] and screenWords[6..7]
 *
 * Extracting pixel at (row, col):
 *
 *   word  = screenWords[row * 2 + (col >> 4)]   (col / 16, selects the word)
 *   pixel = (word >> (col & 15)) & 1             (col % 16, selects the bit)
 */

/**
 * @module emulator/drivers/console_display
 *
 * Console (ANSI terminal) implementation of `DisplayDriver`.
 *
 * ## Rendering technique
 *
 * The Hack screen is 512 pixels wide and 256 pixels tall — too large for most
 * terminals at 1:1 character resolution.  We use the Unicode UPPER HALF BLOCK
 * character `▀` (U+2580) to pack **two pixel rows** into one terminal line:
 *
 *   - The **foreground** colour paints the top half of the cell (top pixel row).
 *   - The **background** colour paints the bottom half (bottom pixel row).
 *
 * This gives us 128 terminal lines for 256 pixel rows.  Horizontally we still
 * need 512 columns, so a wide terminal (≥ 512 chars) is required for a
 * full-resolution view.  Narrower terminals will see the right side cut off,
 * but the driver remains correct — just crop.
 *
 * ## Colour mapping
 *
 * Hack convention: bit = 1 → **black** pixel; bit = 0 → **white** pixel.
 *
 *   | top | bot | foreground | background |
 *   |-----|-----|------------|------------|
 *   |  0  |  0  | white      | white      |
 *   |  0  |  1  | white      | black      |
 *   |  1  |  0  | black      | white      |
 *   |  1  |  1  | black      | black      |
 *
 * ## Performance
 *
 * To avoid the overhead of a system call per character, the entire frame is
 * assembled into a single string and written with one `Deno.stdout.writeSync`
 * call.  ANSI escape codes are emitted only when the colour pair changes from
 * the previous character, which keeps the output small for typical programs
 * (long runs of uniform colour are common in Hack graphics).
 */

import type { DisplayDriver } from "../types.ts";

// ── ANSI escape sequences ────────────────────────────────────────────────────
// We use the standard 8-colour foreground/background codes plus the bright
// variants so that "white" is genuinely white and "black" is genuinely black.

/** Hide the terminal cursor (avoids flickering cursor artefacts). */
const HIDE_CURSOR = "\x1b[?25l";

/** Show the terminal cursor (used on shutdown). */
export const SHOW_CURSOR = "\x1b[?25h";

/** Move the cursor to the top-left corner without clearing the screen. */
const CURSOR_HOME = "\x1b[H";

/** Reset all ANSI attributes (applied at the end of each line). */
const RESET = "\x1b[0m";

/**
 * Pre-built ANSI prefix strings for each of the four possible (top, bottom)
 * pixel combinations.  Indexed as `(topBit << 1) | botBit`.
 *
 *   Index 0 (0b00): white fg, white bg
 *   Index 1 (0b01): white fg, black bg
 *   Index 2 (0b10): black fg, white bg
 *   Index 3 (0b11): black fg, black bg
 */
const ANSI: readonly string[] = [
  "\x1b[97;107m", // 0b00 — white fg + white bg
  "\x1b[97;40m", //  0b01 — white fg + black bg
  "\x1b[30;107m", // 0b10 — black fg + white bg
  "\x1b[30;40m", //  0b11 — black fg + black bg
];

/** The half-block glyph — top half is foreground, bottom half is background. */
const HALF_BLOCK = "▀";

// ── TextEncoder ─────────────────────────────────────────────────────────────
// Allocated once and reused to avoid GC pressure on every frame.
const encoder = new TextEncoder();

/**
 * ANSI terminal display driver.
 *
 * Renders the 512 × 256 Hack screen into a terminal using Unicode half-block
 * characters and ANSI colour codes.  Instantiate once and pass to `HackEmulator`.
 *
 * @example
 * ```ts
 * const display = new ConsoleDisplayDriver();
 * const emulator = new HackEmulator(computer, display);
 * emulator.start();
 * ```
 */
export class ConsoleDisplayDriver implements DisplayDriver {
  /**
   * Render one frame.
   *
   * Called by `HackEmulator` once per frame after `cyclesPerFrame` CPU cycles.
   * Builds the full terminal output as a string and flushes it in a single
   * write to minimise flicker.
   *
   * @param screenWords  8 192-element Uint16Array — one word per screen cell.
   */
  render(screenWords: Uint16Array): void {
    // Start each frame by hiding the cursor and jumping to the top-left so we
    // repaint over the previous frame without clearing (no flash).
    let out = HIDE_CURSOR + CURSOR_HOME;

    // Hack screen: 32 words per row (512 pixels / 16 bits per word), 256 rows.
    // Each terminal line covers two consecutive Hack rows (top and bottom half).
    for (let termRow = 0; termRow < 128; termRow++) {
      const topRow = termRow * 2; // Hack pixel row for the foreground half
      const botRow = termRow * 2 + 1; // Hack pixel row for the background half

      // Track the last emitted colour combination. ANSI colours are sticky —
      // once set they persist until changed. We only emit a new escape code
      // when the colour changes from the previous character. Reset to -1 each
      // row because we emit \x1b[0m at the end of every row, clearing the colour.
      let prevKey = -1;

      for (let wordCol = 0; wordCol < 32; wordCol++) {
        // Word indices in the shadow buffer.
        const topWord = screenWords[topRow * 32 + wordCol];
        const botWord = screenWords[botRow * 32 + wordCol];

        // Each word encodes 16 horizontal pixels; bit 0 is the leftmost.
        for (let bit = 0; bit < 16; bit++) {
          // Extract the pixel value for top and bottom rows.
          // Hack convention: 1 = black, 0 = white.
          const topPixel = (topWord >> bit) & 1;
          const botPixel = (botWord >> bit) & 1;

          // Combine into a 2-bit key: bit1 = top, bit0 = bottom.
          const key = (topPixel << 1) | botPixel;

          // Emit an ANSI escape only when the colour pair changes.
          if (key !== prevKey) {
            out += ANSI[key];
            prevKey = key;
          }

          out += HALF_BLOCK;
        }
      }

      // Reset attributes at the end of every line so the next line starts clean.
      out += RESET + "\n";
    }

    Deno.stdout.writeSync(encoder.encode(out));
  }
}
