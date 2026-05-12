import styles from "@/styles/page.module.css";
import { cv } from "@/data/cv";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 MD MAHADY HASAN · DHAKA</span>
      <span>
        <a href={`mailto:${cv.email}`} data-cursor="hover">
          {cv.email}
        </a>
        &nbsp;·&nbsp;
        <a
          href={`https://${cv.links.linkedin}`}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
        >
          linkedin
        </a>
        &nbsp;·&nbsp;
        <a
          href={`https://${cv.links.github}`}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
        >
          github
        </a>
      </span>
    </footer>
  );
}
