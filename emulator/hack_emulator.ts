/**
 * @module emulator/hack_emulator
 *
 * The `HackEmulator` class is the **platform-agnostic core** of the emulator.
 * It owns the clock loop, decides how many CPU cycles to run per video frame,
 * and delegates all I/O concerns to driver objects supplied at construction time.
 *
 * The emulator knows **nothing** about terminals, browsers, or any other runtime
 * environment. Swapping the console driver for a DOM driver requires only a
 * different `main.ts` — this file never changes.
 *
 * ## Frame loop
 *
 * The loop runs via `setTimeout` so that the Deno event loop stays alive for
 * other async tasks (e.g., the keyboard input listener added in Phase 2).
 * Each iteration:
 *   1. Run `cyclesPerFrame` tick+tock pairs (the "fast" CPU simulation).
 *   2. Copy the screen shadow buffer and hand it to the display driver.
 *   3. Schedule the next frame.
 */

import type { DisplayDriver } from "./types.ts";
import type { EmulatorComputer } from "./emulator_computer.ts";

export class HackEmulator {
  /** Reusable buffer handed to the display driver on every frame. */
  readonly #screenBuf = new Uint16Array(8192);

  /** Set to false by `stop()` to break the frame loop. */
  #running = false;

  /** Handle of the pending setTimeout, used by stop() to cancel it. */
  #timer: ReturnType<typeof setTimeout> | undefined;

  /**
   * @param computer  The chip-level simulation with screen read access.
   * @param display   The platform driver that renders pixels each frame.
   */
  constructor(
    private readonly computer: EmulatorComputer,
    private readonly display: DisplayDriver,
  ) {}

  /**
   * Start the emulator.
   *
   * Resets the computer (one reset cycle), then enters the frame loop.
   * Returns immediately — the loop runs asynchronously via `setTimeout`.
   *
   * @param cyclesPerFrame  Number of tick+tock pairs per video frame.
   *                        Higher values make programs run faster but may
   *                        make the display feel less smooth.
   *                        Default: 10 000 (a reasonable starting point for
   *                        simple nand2tetris programs).
   */
  start(cyclesPerFrame = 10_000): void {
    // ── Hardware reset ────────────────────────────────────────────────────
    // Drive the reset pin high for one full cycle so the program counter
    // jumps back to address 0, then release it before normal execution.
    this.computer.reset = 1;
    this.computer.tick();
    this.computer.tock();
    this.computer.reset = 0;

    this.#running = true;

    const frame = () => {
      if (!this.#running) return;

      // ── CPU cycles ───────────────────────────────────────────────────────
      // Run the simulation as fast as possible for `cyclesPerFrame` cycles.
      for (let i = 0; i < cyclesPerFrame; i++) {
        this.computer.tick();
        this.computer.tock();
      }

      // ── Render ───────────────────────────────────────────────────────────
      // Copy the shadow screen buffer then hand it to the display driver.
      // The display driver must not hold a reference beyond this call since
      // `#screenBuf` is reused on every frame.
      this.computer.readScreen(this.#screenBuf);
      this.display.render(this.#screenBuf);

      // ── Schedule next frame ──────────────────────────────────────────────
      // 16 ms ≈ 60 fps.  The actual rate depends on how long the CPU loop and
      // render take; for heavy programs you may want to lower cyclesPerFrame.
      this.#timer = setTimeout(frame, 16);
    };

    // Kick off the first frame.
    this.#timer = setTimeout(frame, 0);
  }

  /**
   * Stop the emulator after the current frame completes.
   * Safe to call multiple times.
   */
  stop(): void {
    this.#running = false;
    clearTimeout(this.#timer);
  }
}
