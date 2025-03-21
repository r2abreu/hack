import type { binary } from "../utility.ts";

/*
| A | B | A AND B |
|---|---|--------|
| 0 | 0 |   0    |
| 0 | 1 |   0    |
| 1 | 0 |   0    |
| 1 | 1 |   1    |
*/
export default function (a: binary, b: binary): binary {
  if (a && b) return 0;

  return 1;
}
