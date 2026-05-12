import { prefersReducedMotion } from "./reduced-motion";

interface TypewriterOpts {
  speed?: number;
  onDone?: () => void;
}

export function typewriter(
  el: HTMLElement,
  text: string,
  { speed = 30, onDone }: TypewriterOpts = {}
): () => void {
  if (prefersReducedMotion()) {
    el.textContent = text;
    onDone?.();
    return () => {};
  }
  el.textContent = "";
  let i = 0;
  let cancelled = false;
  function step() {
    if (cancelled) return;
    el.textContent = text.slice(0, i);
    if (i < text.length) {
      i++;
      setTimeout(step, speed);
    } else {
      onDone?.();
    }
  }
  step();
  return () => {
    cancelled = true;
  };
}
