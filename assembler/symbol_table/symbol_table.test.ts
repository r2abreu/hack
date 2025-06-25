import { assert, assertEquals } from "jsr:@std/assert";
import SymbolTable from "./symbol_table.ts";

Deno.test("SymbolTable: built-in symbols are present with correct addresses", () => {
  const table = new SymbolTable();

  assertEquals(table.getAddress("R0"), 0);
  assertEquals(table.getAddress("R1"), 1);
  assertEquals(table.getAddress("R2"), 2);
  assertEquals(table.getAddress("R3"), 3);
  assertEquals(table.getAddress("R4"), 4);
  assertEquals(table.getAddress("R5"), 5);
  assertEquals(table.getAddress("R6"), 6);
  assertEquals(table.getAddress("R7"), 7);
  assertEquals(table.getAddress("R8"), 8);
  assertEquals(table.getAddress("R9"), 9);
  assertEquals(table.getAddress("R10"), 10);
  assertEquals(table.getAddress("R11"), 11);
  assertEquals(table.getAddress("R12"), 12);
  assertEquals(table.getAddress("R13"), 13);
  assertEquals(table.getAddress("R14"), 14);
  assertEquals(table.getAddress("R15"), 15);

  assertEquals(table.getAddress("SP"), 0);
  assertEquals(table.getAddress("LCL"), 1);
  assertEquals(table.getAddress("ARG"), 2);
  assertEquals(table.getAddress("THIS"), 3);
  assertEquals(table.getAddress("THAT"), 4);
  assertEquals(table.getAddress("SCREEN"), 16384);
  assertEquals(table.getAddress("KBD"), 24576);
});

Deno.test("SymbolTable: contains() works for present and missing symbols", () => {
  const table = new SymbolTable();
  assert(table.contains("R0"));
  assert(!table.contains("FOO"));
});

Deno.test("SymbolTable: addEntry() adds new symbol with explicit address", () => {
  const table = new SymbolTable();
  assert(!table.contains("FOO"));
  table.addEntry("FOO", 1234);
  assert(table.contains("FOO"));
  assertEquals(table.getAddress("FOO"), 1234);
});

Deno.test("SymbolTable: addEntry() adds new symbol with auto-incremented address", () => {
  const table = new SymbolTable();
  table.addEntry("BAR");
  assert(table.contains("BAR"));
  // First available address is 16 (0b10000)
  assertEquals(table.getAddress("BAR"), 16);

  table.addEntry("BAZ");
  assertEquals(table.getAddress("BAZ"), 17);
});

Deno.test("SymbolTable: getAddress() returns -1 for missing symbol", () => {
  const table = new SymbolTable();
  assertEquals(table.getAddress("DOES_NOT_EXIST"), -1);
});
