export default class SymbolTable {
  #nextAvailableSymbolAddress = 0b10000;

  #map = new Map<string, number>([
    ["R0", 0],
    ["R1", 0b1],
    ["R2", 0b10],
    ["R3", 0b11],
    ["R4", 0b100],
    ["R5", 0b101],
    ["R6", 0b110],
    ["R7", 0b111],
    ["R8", 0b1000],
    ["R9", 0b1001],
    ["R10", 0b1010],
    ["R11", 0b1011],
    ["R12", 0b1100],
    ["R13", 0b1101],
    ["R14", 0b1110],
    ["R15", 0b1111],
    ["SP", 0],
    ["LCL", 0b1],
    ["ARG", 0b10],
    ["THIS", 0b11],
    ["THAT", 0b100],
    ["SCREEN", 0b100000000000000],
    ["KBD", 0b110000000000000],
  ]);

  contains(symbol: string): boolean {
    return this.#map.has(symbol);
  }

  addEntry(symbol: string, address?: number): void {
    if (address) {
      this.#map.set(symbol, address);
    } else {
      this.#map.set(symbol, this.#nextAvailableSymbolAddress++);
    }
  }

  getAddress(symbol: string): number {
    return this.#map.get(symbol) ?? -1;
  }
}
