import { tap, pop } from "./sound";

export interface PaletteItem {
  icon?: string;
  label: string;
  hint?: string;
  action: string | (() => void);
}

const PALETTE_HTML = `
  <style>
    #fx-palette { position: fixed; inset: 0; z-index: 100000; display: none; align-items: flex-start; justify-content: center; padding-top: 14vh; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); font-family: ui-sans-serif, system-ui, sans-serif; }
    #fx-palette.open { display: flex; animation: fxpFade .18s ease; }
    @keyframes fxpFade { from { opacity: 0; } to { opacity: 1; } }
    #fx-palette .fxp-box { width: min(560px, 92vw); background: #0d0f14; border: 1px solid #25292f; border-radius: 14px; overflow: hidden; box-shadow: 0 30px 80px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04); animation: fxpRise .25s cubic-bezier(.2,.8,.2,1); }
    @keyframes fxpRise { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    #fx-palette input { width: 100%; padding: 18px 22px; background: transparent; border: 0; outline: 0; color: #ecedf0; font-size: 16px; border-bottom: 1px solid #1a1d24; font-family: inherit; }
    #fx-palette input::placeholder { color: #5a5c66; }
    #fx-palette .fxp-list { max-height: 380px; overflow-y: auto; padding: 6px; scrollbar-width: thin; }
    #fx-palette .fxp-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 8px; cursor: pointer; color: #c0c4cc; font-size: 14px; }
    #fx-palette .fxp-item.active { background: rgba(0, 229, 160, 0.08); color: #ecedf0; }
    #fx-palette .fxp-item .fxp-hint { margin-left: auto; font-size: 11px; color: #6c7079; font-family: "JetBrains Mono", ui-monospace, monospace; }
    #fx-palette .fxp-item .fxp-icon { width: 22px; height: 22px; display: grid; place-items: center; color: var(--fx-accent, #00e5a0); font-family: "JetBrains Mono", monospace; font-size: 13px; flex-shrink: 0; }
    #fx-palette .fxp-foot { padding: 10px 18px; border-top: 1px solid #1a1d24; font-size: 11px; color: #5a5c66; display: flex; justify-content: space-between; font-family: "JetBrains Mono", monospace; letter-spacing: 0.04em; }
    #fx-palette kbd { padding: 2px 6px; border-radius: 4px; background: #1a1d24; color: #c0c4cc; font-size: 10px; font-family: inherit; }
    #fx-palette .empty { padding: 36px; text-align: center; color: #5a5c66; font-size: 13px; }
  </style>
  <div class="fxp-box" role="dialog">
    <input type="text" placeholder="Jump to a section, project, or command…" />
    <div class="fxp-list"></div>
    <div class="fxp-foot">
      <span><kbd>↑↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>esc</kbd> close</span>
      <span>⌘K palette</span>
    </div>
  </div>`;

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function initPalette(items: PaletteItem[]): () => void {
  if (typeof window === "undefined") return () => {};
  const existing = document.getElementById("fx-palette");
  if (existing) existing.remove();

  const ov = document.createElement("div");
  ov.id = "fx-palette";
  ov.innerHTML = PALETTE_HTML;
  document.body.appendChild(ov);

  const input = ov.querySelector("input") as HTMLInputElement;
  const list = ov.querySelector(".fxp-list") as HTMLDivElement;
  let filtered: PaletteItem[] = items;
  let active = 0;
  let prevFocus: HTMLElement | null = null;

  function render() {
    if (!filtered.length) {
      list.innerHTML = '<div class="empty">No matches.</div>';
      return;
    }
    list.innerHTML = filtered
      .map(
        (it, i) => `
        <div class="fxp-item ${i === active ? "active" : ""}" data-i="${i}">
          <span class="fxp-icon">${escape(it.icon || "→")}</span>
          <span>${escape(it.label)}</span>
          <span class="fxp-hint">${escape(it.hint || "")}</span>
        </div>`
      )
      .join("");
    list.querySelectorAll<HTMLElement>(".fxp-item").forEach((node) => {
      node.addEventListener("mouseenter", () => {
        active = +(node.dataset.i || "0");
        render();
      });
      node.addEventListener("click", () => choose(+(node.dataset.i || "0")));
    });
  }

  function filter(q: string) {
    const lq = q.toLowerCase();
    filtered = items.filter(
      (it) =>
        !lq ||
        it.label.toLowerCase().includes(lq) ||
        (it.hint || "").toLowerCase().includes(lq)
    );
    active = 0;
    render();
  }

  function choose(i: number) {
    const it = filtered[i];
    if (!it) return;
    close();
    if (typeof it.action === "function") it.action();
    else if (typeof it.action === "string") window.location.href = it.action;
  }

  function open() {
    prevFocus = (document.activeElement as HTMLElement) ?? null;
    ov.classList.add("open");
    input.value = "";
    filter("");
    setTimeout(() => input.focus(), 30);
    tap();
  }

  function close() {
    ov.classList.remove("open");
    pop();
    prevFocus?.focus?.();
  }

  function onInput() {
    filter(input.value);
  }

  function onInputKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      active = Math.min(filtered.length - 1, active + 1);
      render();
      list.querySelector(".active")?.scrollIntoView({ block: "nearest" });
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      active = Math.max(0, active - 1);
      render();
      list.querySelector(".active")?.scrollIntoView({ block: "nearest" });
      e.preventDefault();
    } else if (e.key === "Enter") {
      choose(active);
      e.preventDefault();
    } else if (e.key === "Escape") {
      close();
      e.preventDefault();
    }
  }

  function onOverlayClick(e: MouseEvent) {
    if (e.target === ov) close();
  }

  function onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (ov.classList.contains("open")) close();
      else open();
    }
  }

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onInputKey);
  ov.addEventListener("click", onOverlayClick);
  window.addEventListener("keydown", onGlobalKey);

  render();

  return () => {
    input.removeEventListener("input", onInput);
    input.removeEventListener("keydown", onInputKey);
    ov.removeEventListener("click", onOverlayClick);
    window.removeEventListener("keydown", onGlobalKey);
    ov.remove();
  };
}
