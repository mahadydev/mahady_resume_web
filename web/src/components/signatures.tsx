import styles from "@/styles/page.module.css";

const SIGS: Array<{ label: string; body: string }> = [
  {
    label: "Custom cursor",
    body: "Dot + ring, blends with content. Hover-aware on any interactive element.",
  },
  {
    label: "Sound",
    body: "Subtle clicks on taps, drags, and command runs. Mute toggle in each direction.",
  },
  {
    label: "Konami code",
    body: "↑↑↓↓←→←→BA unlocks something different in each direction. Find them.",
  },
  {
    label: "Draggable cards",
    body: "Project decks let you rearrange the work. Spatial memory, not lists.",
  },
];

export function Signatures() {
  return (
    <div className={styles.sigs}>
      {SIGS.map((s) => (
        <div key={s.label} className={styles.sig}>
          <b>{s.label}</b>
          {s.body}
        </div>
      ))}
    </div>
  );
}
