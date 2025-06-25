import Parser from "./parse/parse.ts";
import Code from "./code/code.ts";
import SymbolTable from "./symbol_table/symbol_table.ts";
import * as path from "jsr:@std/path";

const prog = Deno.args[0];
if (!prog) Deno.exit(1);

const file = await Deno.open(
  `${import.meta.dirname}/${prog.replace("asm", "hack")}`,
  {
    write: true,
    create: true,
  },
);

const symbolTable = new SymbolTable();
const code = new Code();

let parser = new Parser(path.join(import.meta.dirname!, prog));
let lInstructions = 0;
for (let i = 0;; i++) {
  await parser.advance();
  if (!parser.hasMoreLines) break;
  if (!parser.currentInstruction) continue;

  if (parser.instructionType === "L_INSTRUCTION") {
    const symbol = parser.symbol;

    if (symbol) symbolTable.addEntry(symbol, i - lInstructions);
    lInstructions++;
  }
}

const writer = file.writable.getWriter();
// Second Pass

parser = new Parser(path.join(import.meta.dirname!, prog));
while (true) {
  await parser.advance();
  if (!parser.hasMoreLines) break;
  if (!parser.currentInstruction) continue;

  let output = undefined;

  if (parser.instructionType === "A_INSTRUCTION") {
    if (!parser.symbol) break;

    // Label
    let symbolValue;
    const parsed = parseInt(parser.symbol);
    if (Number.isNaN(parsed)) {
      if (symbolTable.contains(parser.symbol)) {
        symbolValue = symbolTable.getAddress(parser.symbol);
      } else {
        symbolTable.addEntry(parser.symbol);
        symbolValue = symbolTable.getAddress(parser.symbol);
      }
    } else {
      symbolValue = parsed;
    }

    output = symbolValue.toString(2).padStart(16, "0");
  } else if (parser.instructionType === "C_INSTRUCTION") {
    const comp = code.comp(parser.comp);
    const dest = code.dest(parser.dest);
    const jump = code.jump(parser.jump);
    output = `111${comp}${dest}${jump}`;
  }

  if (output) writer.write(new TextEncoder().encode(output + "\n"));
}
