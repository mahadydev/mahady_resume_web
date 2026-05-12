import styles from "@/styles/previews.module.css";

const NBSP = " ";

export function PreviewTerminal() {
  return (
    <div className={styles.pv2}>
      <div className={styles.lights}>
        <i style={{ background: "#ff5f56" }} />
        <i style={{ background: "#ffbd2e" }} />
        <i style={{ background: "#27c93f" }} />
      </div>
      <div>
        <span className={styles.pmt}>mahady@dev</span>
        <span className={styles.dim}>:</span>
        <span style={{ color: "#5cd5ff" }}>~</span>
        <span className={styles.dim}>$ </span>
        cat about.md
      </div>
      <div className={styles.dim}>{"// senior_engineer.dart"}</div>
      <div>{"{"}</div>
      <div>
        {NBSP}
        {NBSP}
        <span className={styles.key}>&quot;role&quot;</span>:{" "}
        <span className={styles.str}>&quot;Senior Engineer&quot;</span>,
      </div>
      <div>
        {NBSP}
        {NBSP}
        <span className={styles.key}>&quot;years&quot;</span>:{" "}
        <span style={{ color: "#ff5e7e" }}>8</span>,
      </div>
      <div>
        {NBSP}
        {NBSP}
        <span className={styles.key}>&quot;users&quot;</span>:{" "}
        <span style={{ color: "#ff5e7e" }}>1_000_000</span>,
      </div>
      <div>
        {NBSP}
        {NBSP}
        <span className={styles.key}>&quot;stack&quot;</span>: [
        <span className={styles.str}>&quot;flutter&quot;</span>,{" "}
        <span className={styles.str}>&quot;bloc&quot;</span>]
      </div>
      <div>{"}"}</div>
      <div style={{ marginTop: 6 }}>
        <span className={styles.pmt}>mahady@dev</span>
        <span className={styles.dim}>:</span>
        <span style={{ color: "#5cd5ff" }}>~</span>
        <span className={styles.dim}>$ </span>
        <span className={styles.caret} />
      </div>
    </div>
  );
}
