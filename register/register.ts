export interface Register {
  in: number;
  value: number;
  load: number;
  tock: () => void;
  tick: () => void;
}

/**
 * 16-bit register (storage element).
 *
 * - Stores a 16-bit value (binary number).
 * - On tick(), loads input value if load is 1; otherwise holds current value.
 * - On tock(), updates output to current state.
 *
 * @interface Register
 * @property {number} in - 16-bit data input (binary number)
 * @property {number} load - Load signal (1: store input, 0: preserve)
 * @property {number} value - 16-bit data output (binary number)
 * @property {function} tick - Latch input if load is 1
 * @property {function} tock - Update output to reflect current state
 */
export default function register(): Register {
  let state = 0;
  let next = 0;
  let input = 0;
  let load = 0;

  return {
    get in() {
      return input;
    },
    set in(val) {
      input = val;
    },
    get load() {
      return load;
    },
    set load(val) {
      load = val;
    },
    get value() {
      return state;
    },
    tick() {
      if (load) {
        next = input;
      } else {
        next = state;
      }
    },
    tock() {
      state = next;
    },
  };
}
