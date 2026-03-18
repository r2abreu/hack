import computer from "./computer/computer.ts";

// Test: increment R1 in a loop (no screen writes)
// R0=5, R1=100, loop 5 times incrementing R1
const program = [
  0b0000000000000101, // @5
  0b1110110000010000, // D=A
  0b0000000000000000, // @0
  0b1110001100001000, // M=D     (R0=5)

  0b0000000001100100, // @100
  0b1110110000010000, // D=A
  0b0000000000000001, // @1
  0b1110001100001000, // M=D     (R1=100)

  // LOOP (addr 8)
  0b0000000000000001, // @1
  0b1111110111001000, // M=M+1   (R1++)

  0b0000000000000000, // @0
  0b1111110010011000, // MD=M-1  (R0--, D=R0)

  0b0000000000001000, // @8
  0b1110001100000001, // D;JGT

  // END (addr 14)
  0b0000000000001110, // @14
  0b1110101010000111, // 0;JMP
];

const hack = computer(program);
hack.reset = 1; hack.tick(); hack.tock(); hack.reset = 0;

for (let i = 0; i < 100; i++) {
  hack.tick();
  hack.tock();
}

console.log("R0:", hack.peek(0), "(should be 0)");
console.log("R1:", hack.peek(1), "(should be 105)");

// Render screen (first 32 rows, downsampled)
const SCREEN = 16384;
console.log("┌" + "─".repeat(32) + "┐");
for (let row = 0; row < 32; row++) {
  let line = "│";
  for (let col = 0; col < 32; col++) {
    const word = hack.peek(SCREEN + row * 32 + col);
    line += word ? "█" : " ";
  }
  console.log(line + "│");
}
console.log("└" + "─".repeat(32) + "┘");

console.log("\nFirst 4 screen words:");
for (let i = 0; i < 4; i++) {
  const addr = SCREEN + i;
  console.log("  [" + addr + "]: " + hack.peek(addr).toString(2).padStart(16, "0"));
}
