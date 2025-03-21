import nand from "../nand/nand.ts";
import type { binary } from "../utility.ts";
/*
| A | B | A OR B |
|---|---|-------|
| 0 | 0 |   0   |
| 0 | 1 |   1   |
| 1 | 0 |   1   |
| 1 | 1 |   1   |
*/
export default function (a: binary, b: binary): binary {
  const w1 = nand(a, b);
  return nand(w1, w1);
}
