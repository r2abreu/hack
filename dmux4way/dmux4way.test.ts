import { assertEquals } from "jsr:@std/assert";
import dmux4way from "./dmux4way.ts";
import type { bit } from "../utility.ts";

Deno.test("dmux4way function", () => {
  const _in: bit = 1;

  // Test case 1: sel = [0, 0], should route _in to the first output (index 0)
  assertEquals(
    dmux4way(_in, [0, 0]), // sel = [0, 0]
    [_in, 0, 0, 0], // _in goes to the first output
    "dmux4way(sel=[0,0]) should route _in to the first output"
  );

  // Test case 2: sel = [0, 1], should route _in to the second output (index 1)
  assertEquals(
    dmux4way(_in, [0, 1]), // sel = [0, 1]
    [0, _in, 0, 0], // _in goes to the second output
    "dmux4way(sel=[0,1]) should route _in to the second output"
  );

  // Test case 3: sel = [1, 0], should route _in to the third output (index 2)
  assertEquals(
    dmux4way(_in, [1, 0]), // sel = [1, 0]
    [0, 0, _in, 0], // _in goes to the third output
    "dmux4way(sel=[1,0]) should route _in to the third output"
  );

  // Test case 4: sel = [1, 1], should route _in to the fourth output (index 3)
  assertEquals(
    dmux4way(_in, [1, 1]), // sel = [1, 1]
    [0, 0, 0, _in], // _in goes to the fourth output
    "dmux4way(sel=[1,1]) should route _in to the fourth output"
  );
});
