/**
 * Tests for emulator/drivers/console_display.ts
 *
 * render() writes directly to Deno.stdout, so we capture its output by
 * temporarily replacing writeSync with a function that collects the bytes.
 */

import { assertEquals } from "@std/assert";
import { ConsoleDisplayDriver } from "./console_display.ts";

// ── stdout capture helper ─────────────────────────────────────────────────────

/**
 * Calls render() and returns everything it would have written to stdout
 * as a decoded string, without actually printing anything.
 */
function capture(screen: Uint16Array): string {
  const chunks: Uint8Array[] = [];

  const original = Deno.stdout.writeSync.bind(Deno.stdout);
  // deno-lint-ignore no-explicit-any
  (Deno.stdout as any).writeSync = (data: Uint8Array) => {
    chunks.push(data.slice());
    return data.length;
  };

  new ConsoleDisplayDriver().render(screen);

  // deno-lint-ignore no-explicit-any
  (Deno.stdout as any).writeSync = original;

  const total = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const c of chunks) { total.set(c, offset); offset += c.length; }
  return new TextDecoder().decode(total);
}

// ── tests ─────────────────────────────────────────────────────────────────────

Deno.test("render: output starts with hide-cursor and cursor-home", () => {
  const out = capture(new Uint16Array(8192));
  assertEquals(out.startsWith("\x1b[?25l\x1b[H"), true);
});

Deno.test("render: produces exactly 128 terminal lines", () => {
  const out = capture(new Uint16Array(8192));
  // One newline per terminal line (each covers 2 pixel rows → 256/2 = 128).
  assertEquals(out.split("\n").length - 1, 128);
});

Deno.test("render: all-white screen uses white fg + white bg", () => {
  // All bits = 0 → white pixels → key = (0<<1)|0 = 0 → \x1b[97;107m
  const out = capture(new Uint16Array(8192));
  assertEquals(out.includes("\x1b[97;107m"), true);
  assertEquals(out.includes("\x1b[30;40m"), false); // no black
});

Deno.test("render: all-black screen uses black fg + black bg", () => {
  // All bits = 1 → black pixels → key = (1<<1)|1 = 3 → \x1b[30;40m
  const screen = new Uint16Array(8192).fill(0xFFFF);
  const out = capture(screen);
  assertEquals(out.includes("\x1b[30;40m"), true);
  assertEquals(out.includes("\x1b[97;107m"), false); // no white
});

Deno.test("render: top-black bottom-white uses black fg + white bg", () => {
  // Set only even rows (top of each pair) to all-black.
  // top=1, bot=0 → key = (1<<1)|0 = 2 → \x1b[30;107m
  const screen = new Uint16Array(8192);
  for (let row = 0; row < 256; row += 2) {
    for (let word = 0; word < 32; word++) {
      screen[row * 32 + word] = 0xFFFF;
    }
  }
  const out = capture(screen);
  assertEquals(out.includes("\x1b[30;107m"), true);
});

Deno.test("render: top-white bottom-black uses white fg + black bg", () => {
  // Set only odd rows (bottom of each pair) to all-black.
  // top=0, bot=1 → key = (0<<1)|1 = 1 → \x1b[97;40m
  const screen = new Uint16Array(8192);
  for (let row = 1; row < 256; row += 2) {
    for (let word = 0; word < 32; word++) {
      screen[row * 32 + word] = 0xFFFF;
    }
  }
  const out = capture(screen);
  assertEquals(out.includes("\x1b[97;40m"), true);
});

Deno.test("render: half-block character present in output", () => {
  const out = capture(new Uint16Array(8192));
  assertEquals(out.includes("▀"), true);
});
