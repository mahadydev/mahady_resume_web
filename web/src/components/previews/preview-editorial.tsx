import styles from "@/styles/previews.module.css";

export function PreviewEditorial() {
  return (
    <div className={styles.pv3}>
      <div>
        <div className={styles.eb}>— Senior Engineer · Flutter</div>
        <h3>
          I build for
          <br />
          the <i>pocket.</i>
        </h3>
      </div>
      <div className={styles.row}>
        <span>
          <b>8+</b>years
        </span>
        <span>
          <b>1M+</b>users
        </span>
        <span>
          <b>200+</b>clients
        </span>
      </div>
    </div>
  );
}
