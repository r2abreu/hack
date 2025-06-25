import { TextLineStream } from "jsr:@std/streams";

export default class Parser {
  currentInstruction = "";
  hasMoreLines = true;
  #reader: ReadableStreamDefaultReader<string>;
  #path;

  constructor(path: string) {
    this.#path = path;
    this.#reader = this.#openFile();
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
    if (this.currentInstruction.includes("=")) {
      return this.currentInstruction.split("=")[1];
    } else {
      return this.currentInstruction.split(";")[0];
    }
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
    const { value, done } = await this.#reader.read();
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

  #openFile() {
    const file = Deno.openSync(this.#path);

    return file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream())
      .getReader();
  }
}
