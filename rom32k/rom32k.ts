/**
 * 32,768-register (16-bit) read-only memory (ROM32K).
 *
 * - 15-bit address selects one of 32,768 registers.
 * - Returns the 16-bit value stored at the given address, or undefined if out of range.
 * - Contents are fixed at initialization (read-only).
 *
 * @param {number} address - 15-bit address (0 to 32767)
 * @returns {number | undefined} - 16-bit data output (binary number) or undefined if invalid address
 */
export default function rom32k(): (
  address: number,
) => number | undefined {
  const rom = Deno.readTextFileSync(`${import.meta.dirname}/instructions.txt`)
    .split("\n");

  return (instructionNumber) => {
    const foo = parseInt(rom[instructionNumber], 2);
    return foo;
  };
}
