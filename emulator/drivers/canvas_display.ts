/**
 * @module emulator/drivers/canvas_display
 *
 * Browser `<canvas>` implementation of `DisplayDriver`.
 *
 * ## Rendering technique
 *
 * The Hack screen is 512 × 256 monochrome pixels.  We map it 1:1 onto an
 * `HTMLCanvasElement` whose dimensions are set to exactly 512 × 256 at
 * construction time.  CSS can then scale the element up to any display size
 * without any changes here.
 *
 * Each frame we:
 *   1. Walk every word in the shadow buffer.
 *   2. Unpack each of its 16 bits into an RGBA pixel (black or white, fully
 *      opaque) written into a pre-allocated `ImageData` buffer.
 *   3. Call `putImageData` once to push the whole frame to the GPU in a single
 *      call — the same single-call strategy used by the console driver for
 *      similar reasons (minimise round-trips / flicker).
 *
 * ## Colour convention
 *
 * Hack platform: bit = 1 → black pixel; bit = 0 → white pixel.
 * RGBA mapping: black = (0, 0, 0, 255); white = (255, 255, 255, 255).
 */

import type { DisplayDriver } from "../types.ts";

/**
 * Canvas display driver.
 *
 * Renders the 512 × 256 Hack screen onto an `HTMLCanvasElement` using the
 * 2D `ImageData` API.  Instantiate once and pass to `HackEmulator`.
 *
 * @example
 * ```ts
 * const canvas = document.getElementById("screen") as HTMLCanvasElement;
 * const display = new CanvasDisplayDriver(canvas);
 * const emulator = new HackEmulator(computer, display);
 * emulator.start(10_000);
 * ```
 */
export class CanvasDisplayDriver implements DisplayDriver {
  /** 2D rendering context obtained from the canvas at construction time. */
  readonly #ctx: CanvasRenderingContext2D;

  /**
   * Pre-allocated pixel buffer — 512 × 256 pixels × 4 bytes (RGBA).
   * Reused on every frame to avoid GC pressure from repeated `createImageData`
   * calls.  The alpha channel is initialised to 255 once and never touched again.
   */
  readonly #imageData: ImageData;

  /**
   * @param canvas  The `<canvas>` element to render into.  Its width and height
   *                are set to exactly 512 × 256 so that 1 canvas pixel = 1 Hack
   *                pixel.  Scale the element with CSS to suit your layout.
   */
  constructor(canvas: HTMLCanvasElement) {
    canvas.width = 512;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get 2D context from canvas");
    this.#ctx = ctx;

    this.#imageData = this.#ctx.createImageData(512, 256);

    // Pre-fill alpha channel to fully opaque.  R/G/B will be written each frame;
    // alpha is constant and never needs updating after this point.
    for (let i = 3; i < this.#imageData.data.length; i += 4) {
      this.#imageData.data[i] = 255;
    }
  }

  /**
   * Render one frame onto the canvas.
   *
   * Called by `HackEmulator` once per frame after `cyclesPerFrame` CPU cycles.
   * Unpacks each screen word bit-by-bit into RGBA pixels and flushes the entire
   * frame with a single `putImageData` call.
   *
   * @param screenWords  8192-element `Uint16Array` — one word per screen cell.
   */
  render(screenWords: Uint16Array): void {
    const { data } = this.#imageData;

    // Iterate 256 rows × 32 words per row.
    for (let row = 0; row < 256; row++) {
      for (let wordCol = 0; wordCol < 32; wordCol++) {
        const word = screenWords[row * 32 + wordCol];

        // Each word holds 16 pixels; bit 0 is the leftmost column of the group.
        for (let bit = 0; bit < 16; bit++) {
          const col = wordCol * 16 + bit;

          // Pixel index into the flat RGBA buffer (4 bytes per pixel).
          const idx = (row * 512 + col) * 4;

          // Hack convention: 1 = black (0), 0 = white (255).
          const color = ((word >> bit) & 1) ? 0 : 255;
          data[idx] = color;     // R
          data[idx + 1] = color; // G
          data[idx + 2] = color; // B
          // data[idx + 3] = 255 — already set at construction, never changes.
        }
      }
    }

    // Push the complete frame to the canvas in a single GPU upload.
    this.#ctx.putImageData(this.#imageData, 0, 0);
  }
}
