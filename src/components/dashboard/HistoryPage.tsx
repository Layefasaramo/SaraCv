import { Clock, Trash2 } from "lucide-react";
import { getHistory, clearHistory } from "../../lib/storage";
import { useState } from "react";
import styles from "./HistoryPage.module.css";

export default function HistoryPage() {
  const [history, setHistory] = useState(getHistory());

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  // Helper for reactive coloring (matching your Dashboard)
  const getStatusColors = (score: number) => {
    const s = Math.round(score);
    if (s <= 30)
      return { color: "#ef4444", border: "#dc262622", bg: "#ef444411" }; // Red
    if (s <= 40)
      return { color: "#eab308", border: "#ca8a0422", bg: "#eab30811" }; // Yellow
    return { color: "#22c55e", border: "#16a34a22", bg: "#22c55e11" }; // Green
  };

  if (history.length === 0) {
    return (
      <div className={styles.empty}>
        <Clock size={40} strokeWidth={1} />
        <p>No scan history yet. Analyze your first resume to see it here.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>History</h1>
          <p className={styles.sub}>{history.length} past scans</p>
        </div>
        <button className={styles.clearBtn} onClick={handleClear}>
          <Trash2 size={13} />
          Clear All
        </button>
      </header>

      <div className={styles.list}>
        {history.map((scan, i) => {
          const colors = getStatusColors(scan.atsScore);
          const displayScore = Math.round(scan.atsScore);

          return (
            <div key={i} className={styles.item}>
              <div className={styles.itemLeft}>
                <span
                  className={styles.scoreChip}
                  style={{
                    color: colors.color,
                    borderColor: colors.border,
                    backgroundColor: colors.bg,
                  }}
                >
                  {displayScore}%
                </span>
                <div className={styles.itemText}>
                  <p className={styles.date}>
                    {new Date(scan.analyzedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className={styles.benchmark}>{scan.industryBenchmark}</p>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.metaChip}>
                  <strong>{scan.weaknesses?.length || 0}</strong> weaknesses
                </span>
                <span className={styles.metaChip}>
                  <strong>{scan.missingKeywords?.length || 0}</strong> missing
                  keywords
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
