import { assertEquals } from "jsr:@std/assert";
import Parser from "./parse.ts";

// Helper to create a temp file with given content
async function createTempFile(content: string, filename = "test.asm") {
  const tempDir = await Deno.makeTempDir();
  const filePath = `${tempDir}/${filename}`;
  await Deno.writeTextFile(filePath, content);
  console.log(Deno.readTextFileSync(filePath));
  return { filePath, tempDir };
}

Deno.test("Parser parses A, C, and L instructions correctly", async () => {
  const asmContent = String.raw`// This is a comment
    @2
    D=A
    @3
    D=D+A
    @0
    M=D
    (LOOP)
    @LOOP
    0;JMP
  `;

  const { filePath, tempDir } = await createTempFile(asmContent);

  const parser = new Parser(filePath);

  // @2
  await parser.advance();
  assertEquals(parser.currentInstruction, "@2");
  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "2");
  assertEquals(parser.dest, "");
  assertEquals(parser.comp, "");
  assertEquals(parser.jump, "");

  // D=A
  await parser.advance();
  assertEquals(parser.currentInstruction, "D=A");
  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "D");
  assertEquals(parser.comp, "A");
  assertEquals(parser.jump, "null");
  assertEquals(parser.symbol, "");

  // @3
  await parser.advance();
  assertEquals(parser.currentInstruction, "@3");
  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "3");

  // D=D+A
  await parser.advance();
  assertEquals(parser.currentInstruction, "D=D+A");
  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "D");
  assertEquals(parser.comp, "D+A");
  assertEquals(parser.jump, "null");

  // @0
  await parser.advance();
  assertEquals(parser.currentInstruction, "@0");
  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "0");

  // M=D
  await parser.advance();
  assertEquals(parser.currentInstruction, "M=D");
  assertEquals(parser.dest, "M");
  assertEquals(parser.comp, "D");
  assertEquals(parser.jump, "null");

  // (LOOP)
  await parser.advance();
  assertEquals(parser.currentInstruction, "(LOOP)");
  assertEquals(parser.instructionType, "L_INSTRUCTION");
  assertEquals(parser.symbol, "LOOP");

  // @LOOP
  await parser.advance();
  assertEquals(parser.currentInstruction, "@LOOP");
  assertEquals(parser.instructionType, "A_INSTRUCTION");
  assertEquals(parser.symbol, "LOOP");

  // 0;JMP
  await parser.advance();
  assertEquals(parser.currentInstruction, "0;JMP");
  assertEquals(parser.instructionType, "C_INSTRUCTION");
  assertEquals(parser.dest, "null");
  assertEquals(parser.comp, "0");
  assertEquals(parser.jump, "JMP");

  // End of file
  await parser.advance();
  // assert(!parser.hasMoreLines);

  // Clean up
  await Deno.remove(tempDir, { recursive: true });
});
