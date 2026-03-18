/**
 * @module web/main
 *
 * Browser entry point for the Hack emulator.
 */

import { createFastEmulatorComputer } from "../emulator/fast_emulator_computer.ts";
import { HackEmulator } from "../emulator/hack_emulator.ts";
import { CanvasDisplayDriver } from "../emulator/drivers/canvas_display.ts";

import lolHack from "../programs/lol.hack?raw";
import pixelHack from "../programs/pixel.hack?raw";
import lifeHack from "../programs/life.hack?raw";

const programs: Record<string, string> = {
  lol: lolHack,
  pixel: pixelHack,
  life: lifeHack,
};

function parseRom(hack: string): (address: number) => number | undefined {
  const lines = hack.split("\n").filter((l) => l.trim().length > 0);
  return (address) => {
    const line = lines[address];
    return line !== undefined ? parseInt(line.trim(), 2) : undefined;
  };
}

const canvas = document.getElementById("screen") as HTMLCanvasElement;
const display = new CanvasDisplayDriver(canvas);

let emulator: HackEmulator | null = null;

function run(name: string) {
  if (emulator) emulator.stop();

  const rom = parseRom(programs[name]);
  const computer = createFastEmulatorComputer(rom);
  emulator = new HackEmulator(computer, display);
  const cycles = name === "life" ? 100_000 : 10_000;
  emulator.start(cycles);

  document.querySelectorAll("#controls button").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.program === name);
  });
}

document.querySelectorAll("#controls button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = (btn as HTMLElement).dataset.program!;
    run(name);
  });
});

run("lol");
