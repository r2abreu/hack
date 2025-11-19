import add16 from "../add16/add16.ts";

/**
 * @module inc16
 *
 * @param {number} _in - a 16-bit binary number to increment
 * @returns {number} - the result of adding 1 to the input (as a 16-bit binary number)
 *
 * The inc16 function returns the input value incremented by one.
 * it uses add16 to perform the addition.
 */
export default function inc16(_in: number): number {
  return add16(_in, 0b01);
}
