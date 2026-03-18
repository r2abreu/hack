# The Red Pill: Gate-Level Simulation vs Web Emulation

## Why every web-based Hack emulator uses direct arithmetic

Every successful browser-based Hack emulator — including the **official nand2tetris web IDE** —
does **not** run gate-level simulation. They all use:

- **Direct arithmetic** for the ALU (bitwise ops instead of gate trees)
- **Flat arrays** for memory (instead of RAM16K → RAM4K → RAM512 → RAM64 → RAM8 → Register)
- **`requestAnimationFrame`** instead of `setTimeout` for smoother rendering
- **Decoupled rendering** from CPU cycles (render at display refresh rate, not every cycle batch)

### The numbers

Our gate-level simulation has a **5-level-deep RAM hierarchy**:

```
RAM16K → 4× RAM4K → 8× RAM512 → 8× RAM64 → 8× RAM8 → 8× Register
```

Each memory access traverses this entire tree with `dmux` on the way down and `mux` on the way
back up. The CPU recomputes the ALU 3+ times per tick via uncached getter properties. A single
`tick()` + `tock()` cycle triggers **~700+ function calls**. At 10,000 cycles per frame, that's
**7 million function calls per frame** — the browser can't keep up.

A direct-arithmetic emulator does the same work in **~20 operations per cycle**.

### How others solve it

| Project | CPU | Memory | Rendering |
|---|---|---|---|
| [Official nand2tetris web-ide](https://github.com/nand2tetris/web-ide) | Direct bitwise decoding | Flat `Int16Array` | React + Canvas |
| [Kevin Laflamme's emulator](https://lamfl.am/blog/2016/09/16/hack_emulator/) | 30 direct opcodes | Flat array | `requestAnimationFrame`, decoupled refresh |
| [hack-stack](https://github.com/hmarr/hack-stack) | Rust → WebAssembly | Flat array (Rust) | WebGL (GPU) |
| [Hithroc's emulator](https://github.com/Hithroc/hack-emulator) | Direct TS implementation | Flat state | React + Canvas |

## So what's the point of the gate-level TypeScript implementation?

The gate-level TS code and the web emulator serve **completely different purposes**.

### The gate-level code is the coursework

Building `Not` from `Nand`, `RAM16K` from `RAM4K` from `RAM512`... that's the entire nand2tetris
educational journey. The TypeScript code **is** the hardware design, expressed in a real
programming language instead of HDL. Its value is **correctness**, not speed.

### It's testable and verifiable

Every chip can be unit-tested in isolation with `deno test`. You can assert bit-level correctness
and prove your designs work — from a single `Nand` gate all the way up to a complete `Computer`.

### It runs fine outside the browser

The console emulator (via Deno with `setTimeout`) can afford the gate-level overhead because
there's no 16ms frame deadline and no UI thread to block.

### The analogy

Think of it this way:

- The **gate-level TS chips** are like a **Verilog/VHDL design** — they describe hardware structure
  and can be simulated for verification.
- The **fast web emulator** is like an **FPGA** — it implements the same semantics as the design
  but executes them on a flat, fast substrate.

The fast emulator doesn't replace or diminish the gate-level chips. It consumes the same ROM
output (`.hack` files) and implements the same `EmulatorComputer` interface. The gate-level code
stays as-is for testing and education.
