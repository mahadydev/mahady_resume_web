import { prefersReducedMotion } from "./reduced-motion";

export function initMagnetic(): () => void {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) return () => {};

  const cleanups: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>("[data-magnetic-el]").forEach((el) => {
    const strength = parseFloat(el.dataset.magneticEl || "0.3") || 0.3;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.transform = "";
    });
  });
  return () => cleanups.forEach((fn) => fn());
}
