// Conway's Game of Life — Hack Assembly
//
// 32-column × 16-row toroidal grid.
// Each cell maps to one screen word-column × 16 pixel rows,
// filling the entire 512×256 display.
//
// Current generation: RAM[256..767]
// Next generation:    RAM[768..1279]
//
// Seed: R-pentomino at center + glider at top-left.

// ── Clear grid buffers (RAM[256..1279]) ─────────────────
@256
D=A
@R5
M=D
(CLEAR)
@R5
A=M
M=0
@R5
MD=M+1
@1280
D=D-A
@CLEAR
D;JLT

// ── Seed: R-pentomino near center ───────────────────────
//   .XX  (row 7, col 16..17)
//   XX.  (row 8, col 15..16)
//   .X.  (row 9, col 16)
@1
D=A
@496
M=D
@497
M=D
@527
M=D
@528
M=D
@560
M=D

// ── Seed: glider at top-left ────────────────────────────
//   .X.  (row 1, col 2)
//   ..X  (row 2, col 3)
//   XXX  (row 3, col 1..3)
@290
M=D
@323
M=D
@353
M=D
@354
M=D
@355
M=D

// ═════════════════════════════════════════════════════════
// GENERATION LOOP
// ═════════════════════════════════════════════════════════
(GEN)
@R0
M=0

(ROW_LOOP)
// R9 = 256 + R0*32 (current gen row base)
@R0
D=M
@R15
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
@256
D=D+A
@R9
M=D

// R12 = R9 + 512 (next gen row base)
@512
D=D+A
@R12
M=D

// R10 = prev row base (wrap row 0 → row 15)
@R0
D=M
@PREV_WRAP
D;JEQ
@32
D=A
@R9
D=M-D
@R10
M=D
@PREV_DONE
0;JMP
(PREV_WRAP)
@736
D=A
@R10
M=D
(PREV_DONE)

// R11 = next row base (wrap row 15 → row 0)
@R0
D=M
@15
D=D-A
@NEXT_WRAP
D;JEQ
@32
D=A
@R9
D=D+M
@R11
M=D
@NEXT_DONE
0;JMP
(NEXT_WRAP)
@256
D=A
@R11
M=D
(NEXT_DONE)

@R1
M=0

// ── COLUMN LOOP ─────────────────────────────────────────
(COL_LOOP)

// R3 = prev col (wrap col 0 → col 31)
@R1
D=M
@PCWRAP
D;JEQ
D=D-1
@R3
M=D
@PCDONE
0;JMP
(PCWRAP)
@31
D=A
@R3
M=D
(PCDONE)

// R4 = next col (wrap col 31 → col 0)
@R1
D=M
@31
D=D-A
@NCWRAP
D;JEQ
@32
D=D+A
@R4
M=D
@NCDONE
0;JMP
(NCWRAP)
@R4
M=0
(NCDONE)

// ── Count 8 neighbors into R2 ──────────────────────────
@R2
M=0

// (prev_row, prev_col)
@R10
D=M
@R3
A=D+M
D=M
@R2
M=D+M

// (prev_row, col)
@R10
D=M
@R1
A=D+M
D=M
@R2
M=D+M

// (prev_row, next_col)
@R10
D=M
@R4
A=D+M
D=M
@R2
M=D+M

// (row, prev_col)
@R9
D=M
@R3
A=D+M
D=M
@R2
M=D+M

// (row, next_col)
@R9
D=M
@R4
A=D+M
D=M
@R2
M=D+M

// (next_row, prev_col)
@R11
D=M
@R3
A=D+M
D=M
@R2
M=D+M

// (next_row, col)
@R11
D=M
@R1
A=D+M
D=M
@R2
M=D+M

// (next_row, next_col)
@R11
D=M
@R4
A=D+M
D=M
@R2
M=D+M

// ── Current cell value → R14 ───────────────────────────
@R9
D=M
@R1
A=D+M
D=M
@R14
M=D

// ── Apply rules ─────────────────────────────────────────
// count==3 → alive (birth or survival)
@R2
D=M
@3
D=D-A
@ALIVE
D;JEQ

// count==2 && currently alive → survive
@R2
D=M
@2
D=D-A
@CHK
D;JEQ

// else → dead
@DEAD
0;JMP

(CHK)
@R14
D=M
@ALIVE
D;JNE

(DEAD)
@R12
D=M
@R1
A=D+M
M=0
@CELL_DONE
0;JMP

(ALIVE)
@R12
D=M
@R1
A=D+M
M=1

(CELL_DONE)
// ── Advance column ──────────────────────────────────────
@R1
MD=M+1
@32
D=D-A
@COL_LOOP
D;JLT

// ── Advance row ─────────────────────────────────────────
@R0
MD=M+1
@16
D=D-A
@ROW_LOOP
D;JLT

// ═════════════════════════════════════════════════════════
// COPY next gen → current gen (RAM[768..1279] → [256..767])
// ═════════════════════════════════════════════════════════
@R5
M=0
(COPY)
@768
D=A
@R5
A=D+M
D=M
@R6
M=D
@256
D=A
@R5
D=D+M
@R7
M=D
@R6
D=M
@R7
A=M
M=D
@R5
MD=M+1
@512
D=D-A
@COPY
D;JLT

// ═════════════════════════════════════════════════════════
// RENDER grid to screen
// ═════════════════════════════════════════════════════════
@R0
M=0

(RROW)
// R9 = 256 + R0*32
@R0
D=M
@R15
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
@256
D=D+A
@R9
M=D

// R8 = screen row base = 12288 + R9*16
@R9
D=M
@R15
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
M=D
D=D+M
@12288
D=D+A
@R8
M=D

@R1
M=0

(RCOL)
// Cell value: RAM[R9 + R1] → pixel: 0→white(0), 1→black(-1)
@R9
D=M
@R1
A=D+M
D=-M
@R14
M=D

// Screen address = R8 + R1
@R8
D=M
@R1
D=D+M
@R13
M=D

// Write 16 pixel rows
@16
D=A
@R15
M=D
(RPIX)
@R14
D=M
@R13
A=M
M=D
@32
D=A
@R13
M=D+M
@R15
MD=M-1
@RPIX
D;JGT

@R1
MD=M+1
@32
D=D-A
@RCOL
D;JLT

@R0
MD=M+1
@16
D=D-A
@RROW
D;JLT

// ── Next generation ─────────────────────────────────────
@GEN
0;JMP
