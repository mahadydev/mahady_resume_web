import styles from "@/styles/page.module.css";
import { cv } from "@/data/cv";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.brandDot} aria-hidden />
        <span>MAHADYDEV — resume v1.0 · 3 directions</span>
      </div>
      <div className={styles.actions}>
        <a className={styles.btn} href={`mailto:${cv.email}`} data-cursor="hover">
          ✉ EMAIL
        </a>
        <a
          className={`${styles.btn} ${styles.btnPrimary}`}
          href="/assets/Mahady_Hasan_CV.pdf"
          download
          data-cursor="hover"
        >
          ↓ RESUME.PDF
        </a>
      </div>
    </header>
  );
}
