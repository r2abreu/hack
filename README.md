TypeScript implementation of the Hack computer architecture, as described in _The Elements of Computing Systems_ by **Noam Nisan and Shimon Schocken**.

- https://www.nand2tetris.org/

## Example

```typescript
import { and, or } from "jsr:@r2/hack";

and(1, 1); //  -> 1
or(1, 0); //  -> 1
```

## Chip Set

|   Name    | Supported |
| :-------: | :-------: |
|    not    |    ✔️     |
|   not16   |    ✔️     |
|    and    |    ✔️     |
|    or     |    ✔️     |
|    xor    |    ✔️     |
|  or8way   |    ✔️     |
|   or16    |    ✔️     |
|   and16   |    ✔️     |
|    mux    |    ✔️     |
|   mux16   |    ✔️     |
| mux4way16 |    ✔️     |
| mux8way16 |    ✔️     |
|   dmux    |    ✔️     |
| dmux4way  |    ✔️     |
| dmux8way  |    ✔️     |

## Disclaimer

🚧 **This project is a work in progress.** Some features may be incomplete or subject to change. Contributions and feedback are welcome!

## Acknowledgments

This project is based on _The Elements of Computing Systems_ by **Noam Nisan and Shimon Schocken**.
