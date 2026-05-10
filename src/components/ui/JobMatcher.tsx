import { useState } from "react";
import { Target, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { JobMatchResult } from "../../types";
import styles from "./JobMatcher.module.css";

interface JobMatcherProps {
  resumeText: string;
  matchResult: JobMatchResult | null;
  onCheckMatch: (jd: string) => Promise<void>;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
}

export default function JobMatcher({
  matchResult,
  onCheckMatch,
  jobDescription,
  setJobDescription,
}: JobMatcherProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleMatchClick = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      await onCheckMatch(jobDescription);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputArea}>
        <div className={styles.header}>
          <Target size={18} className={styles.icon} />
          <h3 className={styles.headerTitle}>Target Job Description</h3>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Paste the job description you're targeting here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button
          className={`${styles.button} ${isAnalyzing || !jobDescription.trim() ? styles.buttonDisabled : ""}`}
          onClick={handleMatchClick}
          disabled={isAnalyzing || !jobDescription.trim()}
        >
          <Sparkles size={16} />
          {isAnalyzing ? "ANALYZING MATCH..." : "GET MATCH FIT"}
        </button>
      </div>

      {matchResult && (
        <div className={styles.results}>
          <div className={styles.matchStats}>
            <div className={styles.scoreSection}>
              <div className={styles.scoreRing}>
                <span className={styles.scoreValue}>
                  {Math.round(matchResult.matchRate)}%
                </span>
                <span className={styles.scoreLabel}>Match Rate</span>
              </div>
            </div>

            <div className={styles.adviceSection}>
              <h4 className={styles.adviceTitle}>Sara's Strategic Advice</h4>
              <p className={styles.adviceText}>{matchResult.interviewAdvice}</p>
            </div>
          </div>

          <div className={styles.keywordsGrid}>
            <div className={styles.keywordCard}>
              <div className={styles.kwHeader}>
                <CheckCircle2 size={14} className={styles.matchIcon} />
                <span>Matched Skills</span>
              </div>
              <div className={styles.tagCloud}>
                {matchResult.matchedKeywords.map((kw, i) => (
                  <span key={i} className={styles.matchTag}>
                    {kw}
                  </span>
                ))}
                {matchResult.matchedKeywords.length === 0 && (
                  <span className={styles.emptyText}>
                    No direct matches found yet.
                  </span>
                )}
              </div>
            </div>

            <div className={styles.keywordCard}>
              <div className={styles.kwHeader}>
                <AlertCircle size={14} className={styles.missingIcon} />
                <span>Missing Keywords</span>
              </div>
              <div className={styles.tagCloud}>
                {matchResult.missingKeywords.map((kw, i) => (
                  <span key={i} className={styles.missingTag}>
                    {kw}
                  </span>
                ))}
                {matchResult.missingKeywords.length === 0 && (
                  <span className={styles.emptyText}>
                    You've got all the bases covered!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
