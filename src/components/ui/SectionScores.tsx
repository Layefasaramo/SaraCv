import type { SectionScore } from "../../types";
import styles from "./SectionScores.module.css";

interface SectionScoresProps {
  sections: SectionScore[];
}

export default function SectionScores({ sections }: SectionScoresProps) {
  return (
    <div className={styles.wrapper}>
      {sections.map((s) => {
        const pct = (s.score / s.max) * 100;
        const color =
          pct >= 80 ? "var(--green)" : pct >= 50 ? "#eab308" : "#ef4444";
        return (
          <div key={s.name} className={styles.row}>
            <div className={styles.meta}>
              <span className={styles.name}>{s.name}</span>
              <span className={styles.score} style={{ color }}>
                {s.score}/{s.max}
              </span>
            </div>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
