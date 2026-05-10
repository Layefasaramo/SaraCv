import { useState } from "react";
import {
  Download,
  AlertTriangle,
  Search,
  ChevronRight,
  Target,
  MessageSquareQuote,
  Briefcase,
  Sparkles,
} from "lucide-react";
import DropZone from "../ui/DropZone";
import AtsScoreRing from "../ui/AtsScoreRing";
import type { ResumeAnalysis, AppView } from "../../types";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  analysis: ResumeAnalysis | null;
  status: string;
  resumeText: string;
  onFile: (file: File) => Promise<void>;
  onAnalyze: () => void;
  setView: (view: AppView) => void;
}

export default function Dashboard({
  analysis,
  status,
  resumeText,
  onFile,
  onAnalyze,
  setView,
}: DashboardProps) {
  const loading =
    status === "parsing" || status === "uploading" || status === "analyzing";

  const exportReport = () => {
    if (!analysis) return;
    const json = JSON.stringify({ analysis }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saracv-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        {analysis && (
          <button className={styles.downloadBtn} onClick={exportReport}>
            <Download size={14} />
            Download Report
          </button>
        )}
      </div>

      <div className={styles.grid}>
        <section className={styles.uploadSection}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNum}>1</span>
            <div>
              <h2 className={styles.stepTitle}>Upload & Analyze</h2>
              <p className={styles.stepSub}>
                Step 1: Drop file. Step 2: Click Analyze.
              </p>
            </div>
          </div>

          <DropZone
            onFile={onFile}
            onAnalyze={onAnalyze}
            loading={status === "analyzing" || status === "parsing"}
          />

          <div className={styles.actionWrapper}>
            {analysis && (
              <button
                className={styles.matchBtn}
                onClick={() => setView("analysis")}
                disabled={loading}
              >
                <Target size={16} />
                Check Job Fit
              </button>
            )}
          </div>
        </section>

        <section className={styles.resultsSection}>
          <div className={styles.stepHeader}>
            <span className={styles.stepNum}>2</span>
            <div>
              <h2 className={styles.stepTitle}>Analysis Results</h2>
              <p className={styles.stepSub}>
                AI-Powered insights for your career journey
              </p>
            </div>
          </div>

          {!analysis ? (
            <div className={styles.emptyState}>
              <p>
                {resumeText
                  ? "Resume content loaded. Press 'Analyze Resume' to generate your report!"
                  : "Upload a resume to generate your score and potential job roles."}
              </p>
            </div>
          ) : (
            <div className={styles.resultsGrid}>
              <div className={styles.scoreCard}>
                <h3 className={styles.cardTitle}>GENERAL ATS SCORE</h3>
                <AtsScoreRing
                  score={analysis.atsScore}
                  percentileBeat={analysis.percentileBeat}
                />
              </div>

              <div className={styles.jobsCard}>
                <div className={styles.cardHeaderRow}>
                  <div className={styles.cardHeaderLeft}>
                    <Briefcase size={14} className={styles.cardIconMatch} />
                    <h3 className={styles.cardTitle}>POSSIBLE JOB ROLES</h3>
                  </div>
                </div>
                <div className={styles.jobList}>
                  {analysis.recommendedRoles?.slice(0, 4).map((job, i) => (
                    <div key={i} className={styles.jobTag}>
                      <ChevronRight size={12} />
                      <span>{job}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.keywordsCard}>
                <div className={styles.cardHeaderRow}>
                  <div className={styles.cardHeaderLeft}>
                    <Search size={14} className={styles.cardIcon} />
                    <h3 className={styles.cardTitle}>MISSING KEYWORDS</h3>
                  </div>
                </div>
                <div className={styles.keywordTags}>
                  {analysis.missingKeywords?.slice(0, 6).map((kw) => (
                    <span key={kw} className={styles.keyword}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.weaknessCard}>
                <div className={styles.cardHeaderLeft}>
                  <AlertTriangle size={14} className={styles.cardIconWarn} />
                  <h3 className={styles.cardTitle}>IMPROVEMENT AREAS</h3>
                </div>
                <div className={styles.weaknessList}>
                  {analysis.weaknesses?.slice(0, 2).map((w, i) => (
                    <div key={i} className={styles.weaknessItem}>
                      <div className={styles.weaknessMeta}>
                        <span
                          className={styles.weaknessDot}
                          style={{
                            background:
                              w.severity === "high" ? "#ef4444" : "#eab308",
                          }}
                        />
                        <div>
                          <p className={styles.weaknessTitle}>{w.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.interviewCard}>
                <div className={styles.cardHeaderLeft}>
                  <MessageSquareQuote size={14} className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>PREP PREVIEW</h3>
                </div>
                <div className={styles.questionList}>
                  {analysis.interviewQuestions?.slice(0, 1).map((q, i) => (
                    <div key={i} className={styles.questionItem}>
                      <p className={styles.questionText}>{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
