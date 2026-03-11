# Hack Computer Architecture

TypeScript/Deno implementation of the Hack computer from "The Elements of Computing Systems" (Nand2Tetris). A complete 16-bit computer system built from first principles: NAND gates → logic gates → ALU → CPU → full computer with assembler.

## Quick Reference

```bash
deno task test          # Run all tests
deno task bench         # Run benchmarks
```

## Project Structure

```
/                       # Root contains all chip modules
├── Gate primitives:    nand/, not/, and/, or/, xor/
├── 16-bit gates:       and16/, or16/, not16/, or8way/
├── Multiplexers:       mux/, mux16/, mux4way16/, mux8way16/
├── Demultiplexers:     dmux/, dmux4way/, dmux8way/
├── Arithmetic:         half_adder/, full_adder/, add16/, inc16/, alu/
├── Sequential:         dff/, bit/, register/, pc/
├── RAM hierarchy:      ram8/, ram64/, ram512/, ram4k/, ram16k/
├── Memory/IO:          rom32k/, screen/, keyboard/, memory/
├── Processing:         cpu/, computer/
├── Assembler:          assembler/ (with parse/, code/, symbol_table/)
├── main.ts             # Public API exports
├── utility.ts          # Bit manipulation utilities
└── deno.json           # Build config (version, tasks)
```

Each module directory contains:
- `<module>.ts` - Implementation
- `<module>.test.ts` - Tests

## Architecture Patterns

### Two-Phase Clocking
Sequential components use tick/tock for synchronous state updates:
```typescript
register.tick();  // Capture input
register.tock();  // Output new state
```

### Hierarchical Composition
Each layer builds on simpler components following hardware design:
- Primitives (NAND) → Gates → Combinational → Sequential → CPU → Computer

### Bit Manipulation
Uses TypeScript numbers as 16-bit vectors with utilities in `utility.ts`:
- `index(value, bit)` - Extract single bit
- `sliceBits(value, start, end)` - Extract bit range
- `mask(start, end)` - Create bit mask

## Key Components

| Component | File | Description |
|-----------|------|-------------|
| ALU | `alu/alu.ts` | 18 operations via 6 control bits (zx,nx,zy,ny,f,no) |
| CPU | `cpu/cpu.ts` | Decodes A/C instructions, manages A,D registers and PC |
| Memory | `memory/memory.ts` | Unified 32K space: RAM16K + Screen + Keyboard |
| Assembler | `assembler/assembler.ts` | Two-pass: symbol resolution then code generation |
| Computer | `computer/computer.ts` | Top-level integration |

## Code Conventions

- Line width: 80 characters
- Private fields: `#` prefix (e.g., `#aRegister`)
- All components export default function/class
- JSDoc comments with truth tables for gates
- Tests use `Deno.test()` with `@std/assert`

## Hack Instruction Set

**A-instruction**: `@value` - Load value into A register (bit 15 = 0)

**C-instruction**: `dest=comp;jump` - Computation (bit 15 = 1)
- Bits 12-6: computation
- Bits 5-3: destination (A, D, M)
- Bits 2-0: jump condition

## Testing

Each module has comprehensive tests verifying truth tables and edge cases:
```bash
deno test                           # All tests
deno test cpu/                      # Single module
deno test --filter "ALU"            # By name
```

## Publishing

Package `@r2/hack` on JSR. Version in `deno.json`. Auto-publishes via GitHub Actions on push to master.
