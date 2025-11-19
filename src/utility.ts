/**
 * Represents a single binary digit (bit), either 0 or 1.
 * @typedef {0 | 1} bit
 */
export type bit = 1 | 0;

/**
 * Creates a tuple (fixed-length array) of type `T` with exactly `N` elements.
 *
 * @template T The type of each element in the tuple.
 * @template N The number of elements in the tuple.
 *
 * @see https://stackoverflow.com/questions/52489261/can-i-define-an-n-length-tuple-type
 *
 * @example
 * type ThreeNumbers = Tuple<number, 3>; // [number, number, number]
 */
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[]
  : _TupleOf<T, N, []>
  : never;

/**
 * Creates a tuple of bits (0 or 1) with exactly `N` elements.
 *
 * @template N The number of bits in the tuple.
 * @example
 * type FourBits = BitTuple<4>; // [bit, bit, bit, bit]
 */
export type BitTuple<N extends number> = Tuple<bit, N>;

/**
 * Helper type for recursively building a tuple of type `T` with length `N`.
 *
 * @template T The type of each element in the tuple.
 * @template N The desired tuple length.
 * @template R The accumulator array used in recursion (do not use directly).
 * @private
 */
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

/**
 * Masks a number to its least significant 16 bits.
 *
 * @param {number} _in The input number to mask.
 * @returns {number} The masked number, with only the lowest 16 bits retained.
 *
 * @example
 * mask(0x12345); // 0x2345
 */
export function mask(_in: number): number {
  return _in & 0b1111111111111111;
}

/**
 * Retrieves the bit at a specific index from a number.
 *
 * @param {number} n The number from which to extract the bit.
 * @param {number} i The zero-based index of the bit to extract (0 = least significant bit).
 * @returns {0 | 1} The bit value (0 or 1) at the specified index.
 *
 * @example
 * index(0b1010, 1); // 1
 * index(0b1010, 0); // 0
 */
export const index = (n: number, i: number) => (n >> i) & 1;

/**
 * Extracts a sequence of bits from a number.
 *
 * @param {number} n The number from which to extract bits.
 * @param {number} start The starting bit index (0 = least significant bit).
 * @param {number} len The number of bits to extract.
 * @returns {number} The extracted bits as a number, right-aligned.
 *
 * @example
 * sliceBits(0b110110, 1, 3); // 0b101 (5)
 */
export function sliceBits(n: number, start: number, len: number): number {
  return (n >> start) & ((1 << len) - 1);
}
