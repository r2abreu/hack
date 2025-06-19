import type { BitTuple } from "../utility.ts";

export default function (): (
  address: BitTuple<16>,
) => BitTuple<16> | undefined {
  const rom = Deno.readTextFileSync(`${import.meta.dirname}/instructions.txt`)
    .split("\n");

  return (instructionNumber) => {
    // Note: We reverse the address bits here because JavaScript arrays are typically
    // indexed with the most significant bit first, while Hack instructions expect
    // the least significant bit first (different endianness).
    // Not good.

    const instructionIndex = parseInt(instructionNumber.reverse().join(""), 2);
    console.log(instructionIndex);

    const foo = rom[instructionIndex].trim().split("").reverse().map(
      Number,
    ) as unknown as BitTuple<16>;

    return foo;
  };
}
