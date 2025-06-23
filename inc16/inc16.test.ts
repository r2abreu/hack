import { assertEquals } from "jsr:@std/assert";
import inc16 from "./inc16.ts";

// Helper: pad to 16 bits for display (optional)
const bin16 = (n: number) => n.toString(2).padStart(16, "0");

// 0 + 1 = 1
Deno.test("inc16: increments zero", () => {
  const input = 0b0000000000000000;
  const expected = 0b0000000000000001;
  assertEquals(
    inc16(input),
    expected,
    `${bin16(input)} + 1 = ${bin16(expected)}`,
  );
});

// 1 + 1 = 2
Deno.test("inc16: increments one", () => {
  const input = 0b0000000000000001;
  const expected = 0b0000000000000010;
  assertEquals(
    inc16(input),
    expected,
    `${bin16(input)} + 1 = ${bin16(expected)}`,
  );
});

// 15 + 1 = 16
Deno.test("inc16: increments a middle value", () => {
  const input = 0b0000000000001111; // 15
  const expected = 0b0000000000010000; // 16
  assertEquals(
    inc16(input),
    expected,
    `${bin16(input)} + 1 = ${bin16(expected)}`,
  );
});

// 65535 + 1 = 0 (wrap around)
Deno.test("inc16: increments max value (wraps to zero)", () => {
  const input = 0b1111111111111111; // 65535
  const expected = 0b0000000000000000; // 0
  assertEquals(
    inc16(input),
    expected,
    `${bin16(input)} + 1 = ${bin16(expected)}`,
  );
});
