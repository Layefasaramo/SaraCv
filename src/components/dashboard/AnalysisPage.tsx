import { BarChart3, FileText, TrendingUp } from "lucide-react";
import SectionScores from "../ui/SectionScores";
import RawTextToggle from "../ui/RawTextToggle";
import JobMatcher from "./../ui/JobMatcher";
import type { ResumeAnalysis, JobMatchResult } from "../../types";
import styles from "./AnalysisPage.module.css";

interface AnalysisPageProps {
  analysis: ResumeAnalysis | null;
  matchResult: JobMatchResult | null;
  onCheckMatch: (jd: string) => Promise<void>;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
}

export default function AnalysisPage({
  analysis,
  matchResult,
  onCheckMatch,
  jobDescription,
  setJobDescription,
}: AnalysisPageProps) {
  if (!analysis) {
    return (
      <div className={styles.empty}>
        <FileText size={40} strokeWidth={1} />
        <p>No analysis yet. Upload your resume from the Dashboard.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resume Analysis</h1>
        <p className={styles.sub}>
          Analyzed on {new Date(analysis.analyzedAt).toLocaleDateString()}
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <BarChart3 size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Section-by-Section Score</h2>
          </div>
          <SectionScores sections={analysis.sectionScores} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TrendingUp size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Industry Benchmark</h2>
          </div>
          <p className={styles.benchmark}>{analysis.industryBenchmark}</p>
          <div className={styles.overallScore}>
            <span className={styles.overallNum}>{analysis.atsScore}</span>
            <span className={styles.overallLabel}>/100 ATS Score</span>
          </div>
        </div>

        <div className={`${styles.card} ${styles.fullWidth}`}>
          <JobMatcher
            resumeText={analysis.rawText}
            matchResult={matchResult}
            onCheckMatch={onCheckMatch}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        </div>

        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.cardHeader}>
            <FileText size={15} className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Raw Text Preview</h2>
          </div>
          <RawTextToggle text={analysis.rawText} />
        </div>
      </div>
    </div>
  );
}
