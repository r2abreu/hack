import { assertEquals } from "jsr:@std/assert";
import dmux8way from "./dmux8way.ts";
import type { bit } from "../utility.ts";

Deno.test("dmux8way function (last bit is MSB)", () => {
  const _in: bit = 1;

  // sel = [0, 0, 0] => index 0
  assertEquals(
    dmux8way(_in, [0, 0, 0]),
    [_in, 0, 0, 0, 0, 0, 0, 0],
    "sel=[0,0,0] routes _in to index 0",
  );

  // sel = [1, 0, 0] => index 1 (LSB is 1)
  assertEquals(
    dmux8way(_in, [1, 0, 0]),
    [0, _in, 0, 0, 0, 0, 0, 0],
    "sel=[1,0,0] routes _in to index 1",
  );

  // sel = [0, 1, 0] => index 2 (middle bit is 1)
  assertEquals(
    dmux8way(_in, [0, 1, 0]),
    [0, 0, _in, 0, 0, 0, 0, 0],
    "sel=[0,1,0] routes _in to index 2",
  );

  // sel = [1, 1, 0] => index 3 (1+2)
  assertEquals(
    dmux8way(_in, [1, 1, 0]),
    [0, 0, 0, _in, 0, 0, 0, 0],
    "sel=[1,1,0] routes _in to index 3",
  );

  // sel = [0, 0, 1] => index 4 (MSB is 1)
  assertEquals(
    dmux8way(_in, [0, 0, 1]),
    [0, 0, 0, 0, _in, 0, 0, 0],
    "sel=[0,0,1] routes _in to index 4",
  );

  // sel = [1, 0, 1] => index 5 (1+4)
  assertEquals(
    dmux8way(_in, [1, 0, 1]),
    [0, 0, 0, 0, 0, _in, 0, 0],
    "sel=[1,0,1] routes _in to index 5",
  );

  // sel = [0, 1, 1] => index 6 (2+4)
  assertEquals(
    dmux8way(_in, [0, 1, 1]),
    [0, 0, 0, 0, 0, 0, _in, 0],
    "sel=[0,1,1] routes _in to index 6",
  );

  // sel = [1, 1, 1] => index 7 (1+2+4)
  assertEquals(
    dmux8way(_in, [1, 1, 1]),
    [0, 0, 0, 0, 0, 0, 0, _in],
    "sel=[1,1,1] routes _in to index 7",
  );
});
