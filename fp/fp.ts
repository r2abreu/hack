type Head = <T>(xs: T[]) => T;
export const head: Head = ([x, ..._]) => x;
type Tail = <T>(xs: T[]) => T[];
export const tail: Tail = ([_, ...xs]) => xs;

export const filter = <T>(fn: (x: T) => boolean) => (xs: T[]): T[] =>
  !xs.length
    ? []
    : fn(head(xs))
    ? [head(xs), ...filter(fn)(tail(xs))]
    : [...filter(fn)(tail(xs))];

// deno-lint-ignore ban-types
export const pipe = (...fns: Function[]) => (...args: unknown[]) =>
  fns.reduce((prev, curr) => [curr(...prev)], args)[0];
// deno-lint-ignore ban-types
export const compose = (...fns: Function[]) => (...args: unknown[]) =>
  fns.reduceRight((prev, curr) => [curr(...prev)], args)[0];

export const split = (separator: string) => (string: string) => string.split(separator);