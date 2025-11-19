import Parser from "./parse/parse.ts";
import Code from "./code/code.ts";
import SymbolTable from "./symbol_table/symbol_table.ts";

export default class Assembler {
  #labelResolutionParser: InstanceType<typeof Parser>;
  #codeGenerationParser: InstanceType<typeof Parser>;
  #input: ReadableStream<string>;
  #code = new Code();
  symbolTable: SymbolTable = new SymbolTable();

  constructor(input: ReadableStream<string>) {
    this.#input = input;

    const [firstReader, secondReader] = this.#input.tee();

    this.#labelResolutionParser = new Parser(firstReader.getReader());
    this.#codeGenerationParser = new Parser(secondReader.getReader());
  }

  async assemble(): Promise<ReadableStream> {
    const output = new TransformStream();
    await this.#firstPass();
    await this.#secondPass(output.writable.getWriter());

    return output.readable;
  }

  async #firstPass() {
    let lInstructions = 0;
    for (let i = 0;; i++) {
      await this.#labelResolutionParser.advance();
      if (!this.#labelResolutionParser.hasMoreLines) break;
      if (this.#labelResolutionParser.instructionType !== "L_INSTRUCTION") {
        continue;
      }
      const symbol = this.#labelResolutionParser.symbol;

      if (symbol) this.symbolTable.addEntry(symbol, i - lInstructions);
      lInstructions++;
    }
  }

  async #secondPass(streamWriter: WritableStreamDefaultWriter) {
    while (true) {
      await this.#codeGenerationParser.advance();
      if (!this.#codeGenerationParser.hasMoreLines) break;
      if (!this.#codeGenerationParser.currentInstruction) continue;

      let output = undefined;

      if (this.#codeGenerationParser.instructionType === "A_INSTRUCTION") {
        if (!this.#codeGenerationParser.symbol) break;

        // Label
        let symbolValue;
        const parsed = parseInt(this.#codeGenerationParser.symbol);
        if (Number.isNaN(parsed)) {
          if (this.symbolTable.contains(this.#codeGenerationParser.symbol)) {
            symbolValue = this.symbolTable.getAddress(
              this.#codeGenerationParser.symbol,
            );
          } else {
            this.symbolTable.addEntry(this.#codeGenerationParser.symbol);
            symbolValue = this.symbolTable.getAddress(
              this.#codeGenerationParser.symbol,
            );
          }
        } else {
          symbolValue = parsed;
        }

        output = symbolValue.toString(2).padStart(16, "0");
      } else if (
        this.#codeGenerationParser.instructionType === "C_INSTRUCTION"
      ) {
        const comp = this.#code.comp(this.#codeGenerationParser.comp);
        const dest = this.#code.dest(this.#codeGenerationParser.dest);
        const jump = this.#code.jump(this.#codeGenerationParser.jump);
        output = `111${comp}${dest}${jump}`;
      }

      if (output) streamWriter.write(new TextEncoder().encode(output + "\n"));
    }
    streamWriter.close();
  }
}
