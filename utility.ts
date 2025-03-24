export type bit = 1 | 0;
// https://stackoverflow.com/questions/52489261/can-i-define-an-n-length-tuple-type
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

export type BitTuple<N extends number> = Tuple<bit, N>;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;
