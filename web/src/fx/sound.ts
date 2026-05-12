import { store } from "./store";
import { prefersReducedMotion } from "./reduced-motion";

let actx: AudioContext | null = null;
let muted = false;

if (typeof window !== "undefined") {
  muted = store.get<boolean>("muted", false);
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!actx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    actx = new Ctor();
  }
  if (actx.state === "suspended") void actx.resume();
  return actx;
}

type Wave = "sine" | "triangle" | "square" | "sawtooth";

export function tone(freq = 720, dur = 0.06, type: Wave = "sine", gain = 0.04): void {
  if (muted || prefersReducedMotion()) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.01);
  } catch {
    // ignore audio failures
  }
}

export const click = () => tone(880, 0.05, "triangle", 0.05);
export const tap = () => tone(1400, 0.04, "sine", 0.03);
export const pop = () => tone(420, 0.12, "square", 0.025);
export const hoverTone = () => tone(1800, 0.025, "sine", 0.015);
export const swipe = () => {
  tone(600, 0.06, "sine", 0.03);
  setTimeout(() => tone(900, 0.06, "sine", 0.03), 35);
};
export const errorTone = () => {
  tone(220, 0.1, "sawtooth", 0.04);
  setTimeout(() => tone(180, 0.12, "sawtooth", 0.04), 100);
};
export const success = () => {
  [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.1, "triangle", 0.04), i * 60));
};
export const chord = () => {
  if (muted || prefersReducedMotion()) return;
  [523, 659, 784, 1046].forEach((f, i) =>
    setTimeout(() => tone(f, 0.18, "triangle", 0.04), i * 70)
  );
};

export const setMuted = (v: boolean): void => {
  muted = !!v;
  store.set("muted", muted);
};

export const isMuted = (): boolean => muted;

/** Resume the AudioContext on first user interaction. Returns cleanup. */
export function wakeAudio(): () => void {
  if (typeof window === "undefined") return () => {};
  const wake = () => {
    ensureCtx();
    window.removeEventListener("pointerdown", wake);
    window.removeEventListener("keydown", wake);
  };
  window.addEventListener("pointerdown", wake);
  window.addEventListener("keydown", wake);
  return () => {
    window.removeEventListener("pointerdown", wake);
    window.removeEventListener("keydown", wake);
  };
}
