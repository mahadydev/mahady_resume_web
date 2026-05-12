"use client";

import { useEffect } from "react";
import { initCursor } from "./cursor";
import { initKonami } from "./konami";
import { mintRain } from "./mint-rain";
import { initReveal } from "./reveal";
import { initCounters } from "./counters";
import { initMagnetic } from "./magnetic";
import { initPalette } from "./palette";
import { wakeAudio } from "./sound";
import { resumePaletteItems } from "@/lib/palette-items";

type CursorMode = "default" | "tap" | "hover" | "code" | "quill" | "grab" | "grabbing";

interface Props {
  accent?: string;
  /** Initial cursor mode. Sub-directions use "tap" / "code" / "quill". */
  cursorMode?: CursorMode;
  /** Override the default Konami callback. Default = mint rain in `accent`. */
  onKonami?: () => void;
}

export function FxProvider({
  accent = "#00e5a0",
  cursorMode = "default",
  onKonami,
}: Props) {
  useEffect(() => {
    document.documentElement.style.setProperty("--fx-accent", accent);
    const cleanups: Array<() => void> = [
      initCursor({ accent, mode: cursorMode }),
      initKonami(onKonami ?? (() => mintRain(accent))),
      initReveal(),
      initCounters(),
      initMagnetic(),
      initPalette(resumePaletteItems),
      wakeAudio(),
    ];
    return () => cleanups.forEach((fn) => fn?.());
  }, [accent, cursorMode, onKonami]);
  return null;
}
