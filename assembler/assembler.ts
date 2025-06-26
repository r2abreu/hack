import Parser from "./parse/parse.ts";
import Code from "./code/code.ts";
import SymbolTable from "./symbol_table/symbol_table.ts";

const symbolTable = new SymbolTable();
const code = new Code();

export default class Assembler {
  #firstParser: InstanceType<typeof Parser>;
  #secondParser: InstanceType<typeof Parser>;
  #input: ReadableStream<string>;
  output: TransformStream;

  constructor(input: ReadableStream<string>) {
    this.#input = input;

    const [firstReader, secondReader] = this.#input.tee();

    this.#firstParser = new Parser(firstReader.getReader());
    this.#secondParser = new Parser(secondReader.getReader());

    this.output = new TransformStream();
  }

  async init() {
    await this.#firstPass();

    await this.#secondPass(this.output.writable.getWriter());
  }

  async #firstPass() {
    let lInstructions = 0;
    for (let i = 0;; i++) {
      await this.#firstParser.advance();
      if (!this.#firstParser.hasMoreLines) break;
      if (this.#firstParser.instructionType !== "L_INSTRUCTION") continue;
      const symbol = this.#firstParser.symbol;

      if (symbol) symbolTable.addEntry(symbol, i - lInstructions);
      lInstructions++;
    }
  }

  async #secondPass(streamWriter: WritableStreamDefaultWriter) {
    while (true) {
      await this.#secondParser.advance();
      if (!this.#secondParser.hasMoreLines) break;
      if (!this.#secondParser.currentInstruction) continue;

      let output = undefined;

      if (this.#secondParser.instructionType === "A_INSTRUCTION") {
        if (!this.#secondParser.symbol) break;

        // Label
        let symbolValue;
        const parsed = parseInt(this.#secondParser.symbol);
        if (Number.isNaN(parsed)) {
          if (symbolTable.contains(this.#secondParser.symbol)) {
            symbolValue = symbolTable.getAddress(this.#secondParser.symbol);
          } else {
            symbolTable.addEntry(this.#secondParser.symbol);
            symbolValue = symbolTable.getAddress(this.#secondParser.symbol);
          }
        } else {
          symbolValue = parsed;
        }

        output = symbolValue.toString(2).padStart(16, "0");
      } else if (this.#secondParser.instructionType === "C_INSTRUCTION") {
        const comp = code.comp(this.#secondParser.comp);
        const dest = code.dest(this.#secondParser.dest);
        const jump = code.jump(this.#secondParser.jump);
        output = `111${comp}${dest}${jump}`;
      }

      if (output) console.log(output);
      if (output) streamWriter.write(new TextEncoder().encode(output + "\n"));
    }
    streamWriter.close();
  }
}
