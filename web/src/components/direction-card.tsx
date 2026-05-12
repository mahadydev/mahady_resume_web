import type { ReactNode } from "react";
import styles from "@/styles/card.module.css";

export type Tone = "mint" | "green" | "amber";

interface Props {
  href: string;
  tone: Tone;
  num: string;
  name: ReactNode;
  tagline: string;
  children: ReactNode;
}

export function DirectionCard({ href, tone, num, name, tagline, children }: Props) {
  return (
    <a className={styles.card} data-tone={tone} href={href} data-cursor="hover">
      <div className={styles.preview}>{children}</div>
      <div className={styles.meta}>
        <div className={styles.num}>{num}</div>
        <div className={styles.name}>{name}</div>
        <div className={styles.tagline}>{tagline}</div>
        <div className={styles.open}>Open ↗</div>
      </div>
    </a>
  );
}
