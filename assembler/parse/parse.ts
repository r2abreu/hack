export default class Parser {
  currentInstruction = "";
  hasMoreLines = true;
  #streamReader: ReadableStreamDefaultReader<string>;

  constructor(streamReader: ReadableStreamDefaultReader<string>) {
    this.#streamReader = streamReader;
  }

  get dest(): string {
    if (this.instructionType !== "C_INSTRUCTION") return "";

    if (this.currentInstruction.includes("=")) {
      return this.currentInstruction.split("=")[0];
    } else {
      return "null";
    }
  }

  get symbol(): string {
    if (this.instructionType === "C_INSTRUCTION") return "";

    if (this.instructionType === "A_INSTRUCTION") {
      return this.currentInstruction.split("@")[1];
    } else {
      return this.currentInstruction.replace(/\(|\)/g, "");
    }
  }

  get comp(): string {
    if (this.instructionType !== "C_INSTRUCTION") return "";

    // dest=comp;jump
    // "D=M+1;JGT"

    const nosemi = this.currentInstruction.split(";")[0];
    const equal = nosemi.split("=");

    return equal.length === 1 ? equal[0] : equal[1];
  }

  get jump(): string {
    if (this.instructionType !== "C_INSTRUCTION") return "";

    return this.currentInstruction.split(";")[1] || "null";
  }

  get instructionType(): "A_INSTRUCTION" | "C_INSTRUCTION" | "L_INSTRUCTION" {
    switch (this.currentInstruction[0]) {
      case "@":
        return "A_INSTRUCTION";
      case "(":
        return "L_INSTRUCTION";
      default:
        return "C_INSTRUCTION";
    }
  }

  async advance() {
    const { value, done } = await this.#streamReader.read();
    this.hasMoreLines = !done;

    if (done) {
      this.currentInstruction = "";
      return;
    }

    const trimmed = value?.trim();

    if (!trimmed || trimmed.startsWith("//")) {
      await this.advance();
      return;
    }

    this.currentInstruction = trimmed;
  }
}
