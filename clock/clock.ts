class Clock extends EventTarget {
  tick(this: EventTarget) {
    this.dispatchEvent(new CustomEvent("tick"));
  }

  tock(this: EventTarget) {
    this.dispatchEvent(new CustomEvent("tock"));
  }
}

export default new Clock();
