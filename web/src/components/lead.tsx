import styles from "@/styles/page.module.css";

export function Lead() {
  return (
    <div className={styles.lead}>
      <div className={styles.eyebrow}>Three explorations</div>
      <h1 className={styles.leadTitle}>
        Pick your <i>flavor.</i>
      </h1>
      <p className={styles.leadText}>
        <b>MD Mahady Hasan</b> — Senior Software Engineer · Flutter Architect · Dhaka.
        Three takes on the same résumé, each leaning into a different aesthetic.
        Same career data, three personalities. Open any direction full-screen below.
      </p>
    </div>
  );
}
