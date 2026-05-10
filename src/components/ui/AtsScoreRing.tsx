import styles from "./AtsScoreRing.module.css";

interface AtsScoreRingProps {
  score: number;
}

export default function AtsScoreRing({ score }: AtsScoreRingProps) {
  const displayScore = Math.round(score);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const progress = (displayScore / 100) * circumference;
  const gap = circumference - progress;

  const getScoreColor = (s: number) => {
    if (s <= 30) return "#ef4444"; // Red
    if (s <= 40) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  const scoreColor = getScoreColor(displayScore);

  const label =
    displayScore >= 85
      ? "Excellent"
      : displayScore >= 70
        ? "Good Score"
        : displayScore >= 50
          ? "Fair"
          : "Needs Work";

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.ring}
        viewBox="0 0 180 180"
        style={{ color: scoreColor }}
      >
        <circle
          className={styles.trackCircle}
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          strokeWidth="8"
        />
        <circle
          className={styles.progressCircle}
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          strokeWidth="8"
          stroke="currentColor"
          strokeDasharray={`${progress} ${gap}`}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dasharray 0.8s ease, stroke 0.5s ease" }}
        />
        <text
          x="90"
          y="84"
          className={styles.scoreText}
          textAnchor="middle"
          fill="currentColor"
        >
          {displayScore}%
        </text>
        <text
          x="90"
          y="104"
          className={styles.labelText}
          textAnchor="middle"
          fill="currentColor"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
