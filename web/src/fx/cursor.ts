type CursorMode = "default" | "tap" | "hover" | "code" | "quill" | "grab" | "grabbing";

const HOVER_SEL = 'a, button, [role="button"], [data-cursor="hover"], .hoverable, [data-cursor]';

interface CursorOpts {
  accent?: string;
  mode?: CursorMode;
}

export function initCursor({ accent = "#00e5a0", mode: initialMode = "default" }: CursorOpts = {}): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(pointer: coarse)").matches) return () => {};
  if (document.getElementById("fx-cursor-dot")) return () => {};

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.id = "fx-cursor-dot";
  ring.id = "fx-cursor-ring";
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  const baseStyle: Partial<CSSStyleDeclaration> = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "99999",
    transform: "translate(-50%, -50%)",
    transition:
      "width .2s ease, height .2s ease, background .2s ease, border-color .2s ease, border-radius .2s ease, opacity .2s ease",
  };
  Object.assign(dot.style, baseStyle, {
    width: "6px",
    height: "6px",
    background: accent,
    borderRadius: "50%",
    mixBlendMode: "difference",
    zIndex: "99999",
  });
  Object.assign(ring.style, baseStyle, {
    width: "34px",
    height: "34px",
    border: `1.5px solid ${accent}`,
    borderRadius: "50%",
    zIndex: "99998",
    opacity: "0.85",
  });

  const prevCursor = document.documentElement.style.cursor;
  document.documentElement.style.cursor = "none";

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let rx = tx;
  let ry = ty;
  let mag: { cx: number; cy: number; strength: number } | null = null;
  const mode: CursorMode = initialMode;
  let rafId = 0;

  function onMouseMove(e: MouseEvent) {
    tx = e.clientX;
    ty = e.clientY;
    if (mag) {
      tx = tx + (mag.cx - tx) * mag.strength;
      ty = ty + (mag.cy - ty) * mag.strength;
    }
    dot.style.left = tx + "px";
    dot.style.top = ty + "px";
  }

  function raf() {
    rx += (tx - rx) * 0.18;
    ry += (ty - ry) * 0.18;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);
  window.addEventListener("mousemove", onMouseMove);

  function apply(modeName: CursorMode) {
    ring.style.borderRadius = "50%";
    ring.style.background = "transparent";
    ring.style.borderColor = accent;
    ring.innerHTML = "";
    dot.style.opacity = "1";
    switch (modeName) {
      case "hover":
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.background = accent + "22";
        dot.style.width = "0px";
        dot.style.height = "0px";
        break;
      case "tap":
        ring.style.width = "44px";
        ring.style.height = "44px";
        ring.style.background = accent + "33";
        ring.innerHTML = `<div style="position:absolute;inset:0;display:grid;place-items:center;font:600 8px 'JetBrains Mono',monospace;letter-spacing:.1em;color:${accent}">TAP</div>`;
        dot.style.opacity = "0";
        break;
      case "code":
        ring.style.width = "16px";
        ring.style.height = "22px";
        ring.style.borderRadius = "2px";
        ring.style.background = accent + "55";
        dot.style.opacity = "0";
        break;
      case "quill":
        ring.style.width = "10px";
        ring.style.height = "30px";
        ring.style.borderRadius = "1px";
        ring.style.background = accent;
        ring.style.borderColor = "transparent";
        ring.style.transform = "translate(-50%, -50%) rotate(35deg)";
        dot.style.opacity = "0";
        break;
      case "grab":
        ring.style.width = "44px";
        ring.style.height = "44px";
        ring.innerHTML = `<div style="position:absolute;inset:0;display:grid;place-items:center;font:600 9px 'JetBrains Mono',monospace;letter-spacing:.1em;color:${accent}">GRAB</div>`;
        dot.style.opacity = "0";
        break;
      case "grabbing":
        ring.style.width = "38px";
        ring.style.height = "38px";
        ring.style.background = accent + "44";
        dot.style.opacity = "0";
        break;
      default:
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.transform = "translate(-50%, -50%)";
        dot.style.width = "6px";
        dot.style.height = "6px";
    }
  }

  function onMouseOver(e: Event) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const t = target.closest(HOVER_SEL);
    if (!t) return;
    const m = (t.getAttribute("data-cursor") as CursorMode | null) || "hover";
    apply(m);
    if (t.hasAttribute("data-magnetic")) {
      const r = t.getBoundingClientRect();
      mag = {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        strength: parseFloat(t.getAttribute("data-magnetic") || "0.25") || 0.25,
      };
    }
  }

  function onMouseOut(e: Event) {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const t = target.closest(HOVER_SEL);
    if (!t) return;
    mag = null;
    apply(mode);
  }

  function onPointerDown() {
    if (!mag) return;
    mag = null;
  }

  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mouseout", onMouseOut, true);
  window.addEventListener("pointerdown", onPointerDown);

  apply(mode);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseover", onMouseOver, true);
    document.removeEventListener("mouseout", onMouseOut, true);
    window.removeEventListener("pointerdown", onPointerDown);
    dot.remove();
    ring.remove();
    document.documentElement.style.cursor = prevCursor;
  };
}
