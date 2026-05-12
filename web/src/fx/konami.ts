const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function initKonami(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  let i = 0;
  const onKey = (e: KeyboardEvent) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = SEQUENCE[i].length === 1 ? SEQUENCE[i].toLowerCase() : SEQUENCE[i];
    if (k === expected) {
      i++;
      if (i === SEQUENCE.length) {
        i = 0;
        cb();
      }
    } else {
      const first = SEQUENCE[0].length === 1 ? SEQUENCE[0].toLowerCase() : SEQUENCE[0];
      i = k === first ? 1 : 0;
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
