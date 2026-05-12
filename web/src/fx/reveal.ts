import { prefersReducedMotion } from "./reduced-motion";

export function initReveal(): () => void {
  if (typeof window === "undefined") return () => {};
  const els = document.querySelectorAll<HTMLElement>("[data-reveal], .reveal");
  if (!els.length) return () => {};
  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add("is-revealed"));
    return () => {};
  }

  els.forEach((el) => {
    const variant = el.getAttribute("data-reveal") || "fade";
    if (variant === "chars" && !el.dataset.split) {
      const text = el.textContent ?? "";
      el.dataset.split = "1";
      el.innerHTML = text
        .split("")
        .map((c, i) =>
          c === " "
            ? " "
            : `<span class="rv-c" style="display:inline-block;transform:translateY(.6em);opacity:0;transition:transform .7s cubic-bezier(.2,.8,.2,1) ${
                i * 0.018
              }s, opacity .6s ease ${i * 0.018}s">${c}</span>`
        )
        .join("");
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          if ((e.target as HTMLElement).dataset.split) {
            e.target.querySelectorAll<HTMLElement>(".rv-c").forEach((c) => {
              c.style.transform = "translateY(0)";
              c.style.opacity = "1";
            });
          }
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));

  return () => io.disconnect();
}
