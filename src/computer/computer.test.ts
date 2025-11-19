import Computer from "./computer.ts";

Deno.test("Computer: can be constructed and ticked/tocked", () => {
  const comp = Computer();
  comp.reset = 0;
  comp.tick();
  comp.tock();
  comp.reset = 1;
  comp.tick();
  comp.tock();
  comp.reset = 0;
  comp.tick();
  comp.tock();
  comp.tick();
  comp.tock();
  comp.tick();
  comp.tock();
  comp.tick();
  comp.tock();
  comp.tick();
  comp.tock();
  comp.tick();
  comp.tock();
});
