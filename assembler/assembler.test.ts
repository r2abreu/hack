import { assertEquals } from "jsr:@std/assert";
import Assembler from "./assembler.ts";

// Helper: Convert string to ReadableStream<string>
function stringToStream(str: string): ReadableStream<string> {
  return new ReadableStream({
    start(controller) {
      str.split("\n").forEach((line) => controller.enqueue(line));
      controller.close();
    },
  });
}

async function collectStream(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  let result = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += new TextDecoder().decode(value);
  }
  return result;
}

// Sample Mult.asm (simple version)
const MULT_ASM = `
@R1
D=M
@diff
M=D
@product
M=0
(LOOP)
  @diff
  D=M
  @STOP
  D;JLE
  @diff
  M=D-1
  @product
  D=M
  @R0
  D=D+M
  @product
  M=D
  @LOOP
  0;JMP
(STOP)
  @product
  D=M
  @R2
  M=D
(END)
  @END
  0;JMP
`.trim();

const MULT_HACK = `
0000000000000001
1111110000010000
0000000000010000
1110001100001000
0000000000010001
1110101010001000
0000000000010000
1111110000010000
0000000000010100
1110001100000110
0000000000010000
1110001110001000
0000000000010001
1111110000010000
0000000000000000
1111000010010000
0000000000010001
1110001100001000
0000000000000110
1110101010000111
0000000000010001
1111110000010000
0000000000000010
1110001100001000
0000000000011000
1110101010000111
`.trim() + "\n";

Deno.test("Assembler produces correct output for Mult.asm", async () => {
  const inputStream = stringToStream(MULT_ASM);
  const assembler = new Assembler(inputStream);

  const output = await collectStream(await assembler.assemble());

  assertEquals(output, MULT_HACK);
});

// Additional tests (optional)
Deno.test("Assembler handles empty input", async () => {
  const inputStream = stringToStream("");
  const assembler = new Assembler(inputStream);

  const output = await collectStream(await assembler.assemble());

  assertEquals(output, "");
});

Deno.test("Assembler handles only labels", async () => {
  const inputStream = stringToStream("(LOOP)\n(END)");
  const assembler = new Assembler(inputStream);

  await assembler.assemble();

  const output = await collectStream(await assembler.assemble());

  assertEquals(output, "");
});
