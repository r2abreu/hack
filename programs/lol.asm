// LOL — draws "LOL" on the Hack screen (512 × 256 pixels).
//
// Character layout (8 px wide, 12 px tall, rows 100–111):
//
//   ■□□□□□□□   □■■■■■□□   ■□□□□□□□     ← row 100
//   ■□□□□□□□   ■□□□□□■□   ■□□□□□□□     ← rows 101–110
//   ■■■■■■□□   □■■■■■□□   ■■■■■■□□     ← row 111
//      L              O              L
//
// Pixel → bit mapping inside a 16-bit screen word:
//   bit 0 = leftmost pixel, bit 15 = rightmost pixel.
//
// Word values used:
//   1  = 0b00000001  → bit 0 only          (L vertical stroke)
//  63  = 0b00111111  → bits 0-5            (L bottom bar)
//  62  = 0b00111110  → bits 1-5            (O top/bottom arc)
//  65  = 0b01000001  → bits 0 and 6        (O left/right sides)
//
// Screen word address formula:
//   address = 16384 + row * 32 + wordInRow
//
//   L1 column-group  4 → columns 64–79
//   O  column-group  7 → columns 112–127
//   L2 column-group 10 → columns 160–175
//
// Row 100 base addresses:
//   16384 + 100*32 = 19584
//   L1: 19584 + 4  = 19588
//   O:  19584 + 7  = 19591
//   L2: 19584 + 10 = 19594

// ── Draw L1 (left L) ──────────────────────────────────────────────────────
// Rows 100–110: left column only → value = 1 (bit 0)
@1
D=A
@19588
M=D
@19620
M=D
@19652
M=D
@19684
M=D
@19716
M=D
@19748
M=D
@19780
M=D
@19812
M=D
@19844
M=D
@19876
M=D
@19908
M=D
// Row 111: bottom bar → value = 63 (bits 0–5)
@63
D=A
@19940
M=D

// ── Draw O (middle letter) ────────────────────────────────────────────────
// Row 100: top arc → value = 62 (bits 1–5)
@62
D=A
@19591
M=D
// Rows 101–110: side columns → value = 65 (bits 0 and 6)
@65
D=A
@19623
M=D
@19655
M=D
@19687
M=D
@19719
M=D
@19751
M=D
@19783
M=D
@19815
M=D
@19847
M=D
@19879
M=D
@19911
M=D
// Row 111: bottom arc → value = 62 (bits 1–5)
@62
D=A
@19943
M=D

// ── Draw L2 (right L) ─────────────────────────────────────────────────────
// Rows 100–110: left column only → value = 1 (bit 0)
@1
D=A
@19594
M=D
@19626
M=D
@19658
M=D
@19690
M=D
@19722
M=D
@19754
M=D
@19786
M=D
@19818
M=D
@19850
M=D
@19882
M=D
@19914
M=D
// Row 111: bottom bar → value = 63 (bits 0–5)
@63
D=A
@19946
M=D

// ── Infinite loop — keeps the emulator alive after drawing ────────────────
(END)
@END
0;JMP
