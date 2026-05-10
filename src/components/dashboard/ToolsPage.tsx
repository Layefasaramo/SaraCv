import BulletRewriter from "../ui/BulletRewriter";
import styles from "./ToolsPage.module.css";

export default function ToolsPage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Tools</h1>
        <p className={styles.sub}>
          Powerful AI utilities to supercharge your resume
        </p>
      </header>
      <div className={styles.grid}>
        <BulletRewriter />
        <div className={styles.comingSoon}>
          <p className={styles.comingTitle}>More tools coming soon</p>
          <p className={styles.comingSub}>
            Cover letter generator, LinkedIn optimizer, and skill gap analyzer
            are on the roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
