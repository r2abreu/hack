import { assertEquals } from "jsr:@std/assert";
import dmux8way from "./dmux8way.ts";
import type { bit } from "../utility.ts";

Deno.test("dmux8way function", () => {
  const _in: bit = 1;
  // Test case 1: sel = [0, 0, 0], should route _in to the first output (index 0)
  assertEquals(
    dmux8way(_in, [0, 0, 0]), // sel = [0, 0, 0]
    [_in, 0, 0, 0, 0, 0, 0, 0], // _in goes to the first output
    "dmux8way(sel=[0,0,0]) should route _in to the first output"
  );

  // Test case 2: sel = [0, 0, 1], should route _in to the second output (index 1)
  assertEquals(
    dmux8way(_in, [0, 0, 1]), // sel = [0, 0, 1]
    [0, _in, 0, 0, 0, 0, 0, 0], // _in goes to the second output
    "dmux8way(sel=[0,0,1]) should route _in to the second output"
  );

  // Test case 3: sel = [0, 1, 0], should route _in to the third output (index 2)
  assertEquals(
    dmux8way(_in, [0, 1, 0]), // sel = [0, 1, 0]
    [0, 0, _in, 0, 0, 0, 0, 0], // _in goes to the third output
    "dmux8way(sel=[0,1,0]) should route _in to the third output"
  );

  // Test case 4: sel = [0, 1, 1], should route _in to the fourth output (index 3)
  assertEquals(
    dmux8way(_in, [0, 1, 1]), // sel = [0, 1, 1]
    [0, 0, 0, _in, 0, 0, 0, 0], // _in goes to the fourth output
    "dmux8way(sel=[0,1,1]) should route _in to the fourth output"
  );

  // Test case 5: sel = [1, 0, 0], should route _in to the fifth output (index 4)
  assertEquals(
    dmux8way(_in, [1, 0, 0]), // sel = [1, 0, 0]
    [0, 0, 0, 0, _in, 0, 0, 0], // _in goes to the fifth output
    "dmux8way(sel=[1,0,0]) should route _in to the fifth output"
  );

  // Test case 6: sel = [1, 0, 1], should route _in to the sixth output (index 5)
  assertEquals(
    dmux8way(_in, [1, 0, 1]), // sel = [1, 0, 1]
    [0, 0, 0, 0, 0, _in, 0, 0], // _in goes to the sixth output
    "dmux8way(sel=[1,0,1]) should route _in to the sixth output"
  );

  // Test case 7: sel = [1, 1, 0], should route _in to the seventh output (index 6)
  assertEquals(
    dmux8way(_in, [1, 1, 0]), // sel = [1, 1, 0]
    [0, 0, 0, 0, 0, 0, _in, 0], // _in goes to the seventh output
    "dmux8way(sel=[1,1,0]) should route _in to the seventh output"
  );

  // Test case 8: sel = [1, 1, 1], should route _in to the eighth output (index 7)
  assertEquals(
    dmux8way(_in, [1, 1, 1]), // sel = [1, 1, 1]
    [0, 0, 0, 0, 0, 0, 0, _in], // _in goes to the eighth output
    "dmux8way(sel=[1,1,1]) should route _in to the eighth output"
  );
});
