import { assertEquals } from "jsr:@std/assert";
import Code from "./code.ts";

Deno.test("Code.dest returns correct binary codes", () => {
  const code = new Code();

  assertEquals(code.dest("null"), "000");
  assertEquals(code.dest("M"), "001");
  assertEquals(code.dest("D"), "010");
  assertEquals(code.dest("MD"), "011");
  assertEquals(code.dest("A"), "100");
  assertEquals(code.dest("AM"), "101");
  assertEquals(code.dest("AD"), "110");
  assertEquals(code.dest("ADM"), "111");

  // Invalid input
  assertEquals(code.dest("X"), "");
  assertEquals(code.dest(""), "");
});

Deno.test("Code.comp returns correct binary codes", () => {
  const code = new Code();

  assertEquals(code.comp("0"), "0101010");
  assertEquals(code.comp("1"), "0111111");
  assertEquals(code.comp("-1"), "0111010");
  assertEquals(code.comp("D"), "0001100");
  assertEquals(code.comp("A"), "0110000");
  assertEquals(code.comp("M"), "1110000");
  assertEquals(code.comp("!D"), "0001101");
  assertEquals(code.comp("!A"), "0110001");
  assertEquals(code.comp("!M"), "1110001");
  assertEquals(code.comp("-D"), "0001111");
  assertEquals(code.comp("-A"), "0110011");
  assertEquals(code.comp("-M"), "1110011");
  assertEquals(code.comp("D+1"), "0011111");
  assertEquals(code.comp("A+1"), "0110111");
  assertEquals(code.comp("M+1"), "1110111");
  assertEquals(code.comp("D-1"), "0001110");
  assertEquals(code.comp("A-1"), "0110010");
  assertEquals(code.comp("M-1"), "1110010");
  assertEquals(code.comp("D+A"), "0000010");
  assertEquals(code.comp("D+M"), "1000010");
  assertEquals(code.comp("D-A"), "0010011");
  assertEquals(code.comp("D-M"), "1010011");
  assertEquals(code.comp("A-D"), "0000111");
  assertEquals(code.comp("M-D"), "1000111");
  assertEquals(code.comp("D&A"), "0000000");
  assertEquals(code.comp("D&M"), "1000000");
  assertEquals(code.comp("D|A"), "0010101");
  assertEquals(code.comp("D|M"), "1010101");

  // Invalid input
  assertEquals(code.comp("X"), "");
  assertEquals(code.comp(""), "");
});

Deno.test("Code.jump returns correct binary codes", () => {
  const code = new Code();

  assertEquals(code.jump("null"), "000");
  assertEquals(code.jump("JGT"), "001");
  assertEquals(code.jump("JEQ"), "010");
  assertEquals(code.jump("JGE"), "011");
  assertEquals(code.jump("JLT"), "100");
  assertEquals(code.jump("JNE"), "101");
  assertEquals(code.jump("JLE"), "110");
  assertEquals(code.jump("JMP"), "111");

  // Invalid input
  assertEquals(code.jump("X"), "");
  assertEquals(code.jump(""), "");
});
