import { prefersReducedMotion } from "./reduced-motion";

function format(n: number, mode?: string): string {
  if (mode === "m") {
    return (n / 1_000_000).toFixed(n >= 1_000_000 ? 1 : 2).replace(/\.0$/, "") + "M";
  }
  if (mode === "k") return Math.round(n / 1000) + "K";
  if (Number.isInteger(n)) return Math.round(n).toString();
  return n.toFixed(1);
}

export function initCounters(): () => void {
  if (typeof window === "undefined") return () => {};
  const els = document.querySelectorAll<HTMLElement>("[data-count]");
  if (!els.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.countSuffix || "";
        const prefix = el.dataset.countPrefix || "";
        const dur = parseInt(el.dataset.countDur || "1500", 10);
        const fmt = el.dataset.countFmt;
        if (prefersReducedMotion()) {
          el.textContent = prefix + format(target, fmt) + suffix;
          io.unobserve(el);
          return;
        }
        const start = performance.now();
        function step(now: number) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + format(target * eased, fmt) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
