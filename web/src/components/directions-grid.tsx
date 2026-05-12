import styles from "@/styles/page.module.css";
import { DirectionCard } from "./direction-card";
import { PreviewPhone } from "./previews/preview-phone";
import { PreviewTerminal } from "./previews/preview-terminal";
import { PreviewEditorial } from "./previews/preview-editorial";

export function DirectionsGrid() {
  return (
    <main id="directions" className={styles.grid}>
      <DirectionCard
        href="/career-app"
        tone="mint"
        num="01 · BOLD · MOTION"
        name={
          <>
            Career<i>.app</i>
          </>
        }
        tagline="The site IS a phone. Tap apps for sections. Drag, parallax 3D background, mint accent."
      >
        <PreviewPhone />
      </DirectionCard>

      <DirectionCard
        href="/terminal"
        tone="green"
        num="02 · BOLDEST · CODE"
        name={
          <>
            Terminal<i>OS</i>
          </>
        }
        tagline="File explorer + tabs + syntax highlighting. Boots, types, scans. Konami → matrix rain."
      >
        <PreviewTerminal />
      </DirectionCard>

      <DirectionCard
        href="/studio"
        tone="amber"
        num="03 · SAFE · EDITORIAL"
        name={
          <>
            The <i>Studio</i>
          </>
        }
        tagline="Magazine scroll. Big italic serif, parallax shapes, draggable project deck. Marigold accent."
      >
        <PreviewEditorial />
      </DirectionCard>
    </main>
  );
}
