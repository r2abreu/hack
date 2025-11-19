import { assertEquals } from "jsr:@std/assert";
import Parser from "./parse.ts";

// Helper: Convert array of strings to ReadableStream<string>
function linesToStream(lines: string[]): ReadableStream<string> {
  return new ReadableStream({
    start(controller) {
      lines.forEach((line) => controller.enqueue(line));
      controller.close();
    },
  });
}

Deno.test("Parser correctly handles A-instruction", async () => {
  const stream = linesToStream(["@123"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "123");
  assertEquals(parser.dest, "");
  assertEquals(parser.comp, "");
  assertEquals(parser.jump, "");
});

Deno.test("Parser correctly handles C-instruction with dest=comp;jump", async () => {
  const stream = linesToStream(["D=M+1;JGT"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "D");
  assertEquals(parser.comp, "M+1");
  assertEquals(parser.jump, "JGT");
  assertEquals(parser.symbol, "");
});

Deno.test("Parser correctly handles C-instruction with comp;jump only", async () => {
  const stream = linesToStream(["0;JMP"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "null");
  assertEquals(parser.comp, "0");
  assertEquals(parser.jump, "JMP");
  assertEquals(parser.symbol, "");
});

Deno.test("Parser correctly handles C-instruction with dest=comp only", async () => {
  const stream = linesToStream(["M=1"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "M");
  assertEquals(parser.comp, "1");
  assertEquals(parser.jump, "null");
  assertEquals(parser.symbol, "");
});

Deno.test("Parser correctly handles L-instruction", async () => {
  const stream = linesToStream(["(LOOP)"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "L_INSTRUCTION");
  assertEquals(parser.symbol, "LOOP");
  assertEquals(parser.dest, "");
  assertEquals(parser.comp, "");
  assertEquals(parser.jump, "");
});

Deno.test("Parser skips blank lines and comments", async () => {
  const stream = linesToStream([
    "",
    "   ",
    "// this is a comment",
    "   // indented comment",
    "@42",
  ]);
  const parser = new Parser(stream.getReader());

  await parser.advance();

  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "42");
});

Deno.test("Parser sets hasMoreLines to false at end of stream", async () => {
  const stream = linesToStream(["@1"]);
  const parser = new Parser(stream.getReader());

  await parser.advance();
  assertEquals(parser.hasMoreLines, true);

  await parser.advance();
  assertEquals(parser.hasMoreLines, false);
  assertEquals(parser.currentInstruction, "");
});

Deno.test("Parser handles multiple instructions in sequence", async () => {
  const stream = linesToStream([
    "@2",
    "D=A",
    "(END)",
    "0;JMP",
  ]);
  const parser = new Parser(stream.getReader());

  await parser.advance();
  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "2");

  await parser.advance();
  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "D");
  assertEquals(parser.comp, "A");
  assertEquals(parser.jump, "null");

  await parser.advance();
  assertEquals(parser.instructionType, "L_INSTRUCTION");
  assertEquals(parser.symbol, "END");

  await parser.advance();
  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.comp, "0");
  assertEquals(parser.jump, "JMP");
});
