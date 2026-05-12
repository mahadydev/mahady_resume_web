import styles from "@/styles/previews.module.css";

const ICONS = [
  "linear-gradient(140deg, #00e5a0, #009168)",
  "linear-gradient(140deg, #9d8cff, #5a4ed4)",
  "linear-gradient(140deg, #ff9b6b, #d65a2a)",
  "linear-gradient(140deg, #ffc266, #d68a2a)",
  "linear-gradient(140deg, #ff6f9c, #c4356b)",
  "linear-gradient(140deg, #6bd0ff, #2f7fc4)",
  "linear-gradient(140deg, #1a1d24, #0a0b10)",
  "linear-gradient(140deg, #00e5a0, #00b483)",
  "rgba(255,255,255,0.05)",
];

export function PreviewPhone() {
  return (
    <div className={styles.pv1}>
      <div className={styles.ph}>
        <div className={styles.scr}>
          {ICONS.map((bg, i) => (
            <i key={i} style={{ background: bg }} />
          ))}
        </div>
      </div>
      <svg
        className={styles.shape}
        style={{ top: 20, left: 20, width: 50 }}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <circle cx="50" cy="50" r="40" stroke="#00e5a0" strokeWidth="1" opacity="0.5" />
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#00e5a0"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          opacity="0.4"
        />
      </svg>
      <svg
        className={styles.shape}
        style={{ bottom: 14, right: 18, width: 60 }}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path d="M50 8 L88 30 L88 70 L50 92 L12 70 L12 30 Z" stroke="#9d8cff" strokeWidth="0.8" />
        <path
          d="M50 8 L50 50 M50 50 L88 30 M50 50 L12 30"
          stroke="#9d8cff"
          strokeWidth="0.6"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
