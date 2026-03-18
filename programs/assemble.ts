/**
 * @module programs/assemble
 *
 * Thin CLI wrapper around the `Assembler` class.
 * Reads a `.asm` file, assembles it, and writes the binary lines to a `.hack`
 * file with the same base name.
 *
 * Usage:
 *   deno run --allow-read --allow-write programs/assemble.ts programs/lol.asm
 *
 * Output: programs/lol.hack  (each line is a 16-character binary string)
 */

import Assembler from "../assembler/assembler.ts";

if (import.meta.main) {
  const inputPath = Deno.args[0];
  if (!inputPath) {
    console.error("Usage: assemble.ts <input.asm>");
    Deno.exit(1);
  }

  // Feed the .asm file into the assembler line by line.
  const source = Deno.readTextFileSync(inputPath);
  const inputStream = new ReadableStream<string>({
    start(controller) {
      source.split("\n").forEach((line) => controller.enqueue(line));
      controller.close();
    },
  });

  const assembler = new Assembler(inputStream);
  const outputStream = await assembler.assemble();

  // Collect assembled binary lines.
  const reader = outputStream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }

  // Write to a .hack file beside the .asm source.
  const outputPath = inputPath.replace(/\.asm$/, ".hack");
  Deno.writeTextFileSync(outputPath, result);
  const count = result.split("\n").filter(Boolean).length;
  console.log(`Assembled → ${outputPath} (${count} instructions)`);
}
