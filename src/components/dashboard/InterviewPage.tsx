import { useState } from "react";
import { Mic2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import type { ResumeAnalysis } from "../../types";
import styles from "./InterviewPage.module.css";

interface InterviewPageProps {
  analysis: ResumeAnalysis | null;
}

export default function InterviewPage({ analysis }: InterviewPageProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!analysis) {
    return (
      <div className={styles.empty}>
        <Mic2 size={40} strokeWidth={1} />
        <p>Upload your resume first to generate interview questions.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Interview Prep</h1>
        <p className={styles.sub}>
          {analysis.interviewQuestions.length} questions specifically tailored
          to your experience and skills
        </p>
      </header>

      <div className={styles.list}>
        {analysis.interviewQuestions.map((q, i) => (
          <div key={i} className={styles.item}>
            <button
              className={styles.question}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div className={styles.qLeft}>
                <span className={styles.qDot} />
                <span className={styles.qType}>{q.type}</span>
                <span className={styles.qText}>{q.question}</span>
              </div>
              {openIdx === i ? (
                <ChevronUp size={14} className={styles.chevron} />
              ) : (
                <ChevronDown size={14} className={styles.chevron} />
              )}
            </button>

            {openIdx === i && (
              <div className={styles.answer}>
                <div className={styles.answerHeader}>
                  <Sparkles size={14} className={styles.sparkleIcon} />
                  <p className={styles.answerLabel}>
                    Recommended Response (First Person)
                  </p>
                </div>
                <div className={styles.answerText}>
                  <p className={styles.scriptText}>"{q.suggestedAnswer}"</p>
                </div>
                <div className={styles.tip}>
                  <p>
                    Tip: Practice saying this naturally and adjust the tone to
                    fit your personality.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
