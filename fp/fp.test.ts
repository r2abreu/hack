import { assertEquals } from "jsr:@std/assert";
import { compose, filter, head, pipe, split, tail } from "./fp.ts";

Deno.test("head: returns first element", () => {
  assertEquals(head([1, 2, 3]), 1);
  assertEquals(head(["a", "b"]), "a");
});

Deno.test("tail: returns all elements except first", () => {
  assertEquals(tail([1, 2, 3]), [2, 3]);
  assertEquals(tail([1]), []);
});

Deno.test("filter: keeps elements matching predicate", () => {
  assertEquals(filter((x: number) => x > 2)([1, 2, 3, 4]), [3, 4]);
  assertEquals(filter((s: string) => s.length > 0)(["a", "", "b"]), ["a", "b"]);
  assertEquals(filter((x: number) => x > 10)([1, 2, 3]), []);
});

Deno.test("pipe: applies functions left to right", () => {
  const double = (x: number) => x * 2;
  const addOne = (x: number) => x + 1;
  assertEquals(pipe(double, addOne)(3), 7); // (3*2)+1
  assertEquals(pipe(addOne, double)(3), 8); // (3+1)*2
});

Deno.test("compose: applies functions right to left", () => {
  const double = (x: number) => x * 2;
  const addOne = (x: number) => x + 1;
  assertEquals(compose(addOne, double)(3), 7); // addOne(double(3))
  assertEquals(compose(double, addOne)(3), 8); // double(addOne(3))
});

Deno.test("split: splits string by separator", () => {
  assertEquals(split("\n")("a\nb\nc"), ["a", "b", "c"]);
  assertEquals(split(",")("x,y,z"), ["x", "y", "z"]);
});

Deno.test("pipe + split + filter: compose into a ROM-like pipeline", () => {
  const parse = pipe(
    split("\n"),
    filter((line: string) => line.trim().length > 0),
  );
  assertEquals(parse("foo\n\nbar\n"), ["foo", "bar"]);
});
