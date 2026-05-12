import { prefersReducedMotion } from "./reduced-motion";
import { success } from "./sound";

export function mintRain(accent = "#00e5a0"): void {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const layer = document.createElement("div");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "99997",
    overflow: "hidden",
  } as Partial<CSSStyleDeclaration>);
  document.body.appendChild(layer);

  const N = 80;
  for (let n = 0; n < N; n++) {
    const p = document.createElement("div");
    const sz = 6 + Math.random() * 10;
    Object.assign(p.style, {
      position: "absolute",
      left: Math.random() * 100 + "%",
      top: "-20px",
      width: sz + "px",
      height: sz + "px",
      background: accent,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      opacity: "0.9",
      transform: `rotate(${Math.random() * 360}deg)`,
      transition: `transform ${2.5 + Math.random() * 2}s cubic-bezier(.2,.8,.2,1), top ${
        2.5 + Math.random() * 2
      }s cubic-bezier(.2,.8,.2,1), opacity 1s linear ${2 + Math.random()}s`,
    } as Partial<CSSStyleDeclaration>);
    layer.appendChild(p);
    requestAnimationFrame(() => {
      p.style.top = "110%";
      p.style.transform = `rotate(${Math.random() * 720}deg) translateX(${
        (Math.random() - 0.5) * 200
      }px)`;
      p.style.opacity = "0";
    });
  }
  success();
  setTimeout(() => layer.remove(), 6000);
}
