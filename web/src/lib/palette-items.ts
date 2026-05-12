import type { PaletteItem } from "@/fx/palette";
import { cv } from "@/data/cv";

export const resumePaletteItems: PaletteItem[] = [
  { icon: "◇", label: "Direction · Index hub", hint: "/", action: "/" },
  { icon: "①", label: "Direction · Career.app", hint: "01", action: "/career-app" },
  { icon: "②", label: "Direction · TerminalOS", hint: "02", action: "/terminal" },
  { icon: "③", label: "Direction · The Studio", hint: "03", action: "/studio" },
  {
    icon: "↓",
    label: "Download Resume.pdf",
    hint: "PDF",
    action: () => {
      window.location.href = "/assets/Mahady_Hasan_CV.pdf";
    },
  },
  {
    icon: "✉",
    label: `Email ${cv.firstName}`,
    hint: "mail",
    action: () => {
      window.location.href = `mailto:${cv.email}`;
    },
  },
  {
    icon: "in",
    label: "LinkedIn — mahadydev",
    hint: "open",
    action: () => window.open(`https://${cv.links.linkedin}`, "_blank"),
  },
  {
    icon: "gh",
    label: "GitHub — mahadydev",
    hint: "open",
    action: () => window.open(`https://${cv.links.github}`, "_blank"),
  },
  {
    icon: "↗",
    label: "Portfolio — mahadydev.vercel.app",
    hint: "open",
    action: () => window.open(`https://${cv.links.site}`, "_blank"),
  },
  {
    icon: "✦",
    label: "Konami code hint",
    hint: "↑↑↓↓←→←→BA",
    action: () => alert("Try it now ;) ↑↑↓↓←→←→BA"),
  },
];
