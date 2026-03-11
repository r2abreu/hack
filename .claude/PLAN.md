# Plan: Web Simulator Support (peek/poke API)

## Goal
Add `peek(address)` and `poke(address, value)` to Computer interface for web simulators.

## Memory Map (reference)
| Address | Device |
|---------|--------|
| 0-16383 | RAM |
| 16384-24575 | Screen (8K words = 512x256 pixels) |
| 24576 | Keyboard |

## What the Simulator Needs
| Method | Purpose |
|--------|---------|
| `computer(program)` | Load pre-compiled .hack binary |
| `peek(16384-24575)` | Read screen buffer → render to canvas |
| `poke(24576, keyCode)` | Inject keyboard state from DOM events |
| `tick()/tock()` | Run CPU cycles |

Note: Jack OS (Screen.jack, Keyboard.jack, etc.) is compiled into the program binary. No need to implement it separately.

### Changes Required

#### 1. ROM32K - Accept instruction array
**File:** `rom32k/rom32k.ts`

```typescript
// Before: Deno file system dependency
export default function rom32k(): (address: number) => number | undefined {
  const rom = Deno.readTextFileSync(...);
  return (instructionNumber) => parseInt(rom[instructionNumber], 2);
}

// After: Accept array parameter
export default function rom32k(instructions: number[] = []): (address: number) => number | undefined {
  return (address) => instructions[address];
}
```

#### 2. Computer - Add peek/poke, accept program
**File:** `computer/computer.ts`

```typescript
interface Computer {
  reset: bit;
  tick(): void;
  tock(): void;
  peek(address: number): number;      // NEW
  poke(address: number, value: number): void;  // NEW
}

export default function (program: number[] = []): Computer {
  const memory = Memory();
  const rom32k = ROM32K(program);
  const cpu = new CPU();

  return {
    // ... existing reset, tick, tock ...

    peek(address: number): number {
      const prevAddr = memory.address;
      memory.address = address;
      memory.load = 0;
      const value = memory.value;
      memory.address = prevAddr;
      return value;
    },

    poke(address: number, value: number): void {
      const prevAddr = memory.address;
      const prevLoad = memory.load;
      const prevIn = memory.in;

      memory.address = address;
      memory.in = value;
      memory.load = 1;
      memory.tick();
      memory.tock();

      memory.address = prevAddr;
      memory.load = prevLoad;
      memory.in = prevIn;
    },
  };
}
```

#### 3. Keyboard - No changes needed
**Verified:** Memory routing already sends load signal to keyboard register. Register respects `load=1`. Writes via `poke(24576, value)` will work.

#### 4. Update tests
- `rom32k/rom32k.test.ts` - Use array-based loading
- `computer/computer.test.ts` - Add peek/poke tests

#### 5. Delete file
- `rom32k/instructions.txt`

---

## Usage Example

```typescript
import { computer } from "@r2/hack";

// Load pre-compiled Tetris (array of 16-bit instructions)
const hack = computer(tetrisProgram);

// Game loop
function frame() {
  // Run ~30000 cycles per frame (~60fps)
  for (let i = 0; i < 30000; i++) {
    hack.tick();
    hack.tock();
  }

  // Render screen (8K words → 512x256 pixels)
  for (let i = 0; i < 8192; i++) {
    const word = hack.peek(16384 + i);
    // Each bit = 1 pixel, render to canvas...
  }

  requestAnimationFrame(frame);
}

// Keyboard input
document.addEventListener('keydown', (e) => hack.poke(24576, e.keyCode));
document.addEventListener('keyup', () => hack.poke(24576, 0));

frame();
```

---

## Files to Modify
1. `rom32k/rom32k.ts` - Array-based loading
2. `computer/computer.ts` - Add peek/poke, accept program
3. `rom32k/rom32k.test.ts` - Update tests
4. `computer/computer.test.ts` - Add peek/poke tests

## Files to Delete
- `rom32k/instructions.txt`

## Breaking Changes
- `computer()` now requires a `program: number[]` argument (no default empty array - program is required)
- `rom32k()` now requires an `instructions: number[]` argument

