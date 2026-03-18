// PIXEL — moves a single pixel across the Hack screen infinitely.
//
// The pixel starts at the top-left corner and moves right one pixel per
// iteration. When it reaches the end of a row (column 511) it wraps to
// the start of the next row. After the last row (255) it wraps back to
// the top-left.
//
// Variables:
//   R0 = word offset (0..8191)
//   R1 = bit index (0..15)
//   R2 = previous word offset
//   R3 = bit mask scratch
//   R4 = shift counter
//   R5 = bit mask saved
//   R6 = screen address saved
//   R7 = delay counter

// Initialise: start at word 0, bit 0
@0
D=A
@R0
M=D
@R1
M=D
@R2
M=D

// Main loop
(LOOP)

// Clear the previous pixel: screen[16384 + R2] = 0
@16384
D=A
@R2
A=D+M
M=0

// Save current offset as previous
@R0
D=M
@R2
M=D

// Compute bit mask: R3 = 1 << R1
@1
D=A
@R3
M=D
@R1
D=M
@DRAW
D;JEQ
@R4
M=D
(SHIFT)
@R3
D=M
D=D+M
@R3
M=D
@R4
MD=M-1
@SHIFT
D;JGT

// Draw the pixel: screen[16384 + R0] = R3
(DRAW)
@R3
D=M
@R5
M=D
@16384
D=A
@R0
A=D+M
D=A
@R6
M=D
@R5
D=M
@R6
A=M
M=D

// Advance bit index
@R1
MD=M+1
@16
D=D-A
@DELAY
D;JLT

// Bit reached 16: next word, reset bit
@0
D=A
@R1
M=D
@R0
MD=M+1
@8192
D=D-A
@DELAY
D;JLT

// Word reached 8192: wrap to start
@0
D=A
@R0
M=D

// Delay loop so the pixel is visible
(DELAY)
@500
D=A
@R7
M=D
(DWAIT)
@R7
MD=M-1
@DWAIT
D;JGT

@LOOP
0;JMP
