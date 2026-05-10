export interface SectionScore {
  name: string;
  score: number;
  max: number;
}

export interface ResumeWeakness {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface InterviewQuestion {
  question: string;
  type: "behavioral" | "technical";
  suggestedAnswer: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  percentileBeat: number;
  missingKeywords: string[];
  weaknesses: ResumeWeakness[];
  sectionScores: SectionScore[];
  interviewQuestions: InterviewQuestion[];
  industryBenchmark: string;
  rawText: string;
  analyzedAt: string;
  recommendedRoles: string[];
}

export interface BulletRewrite {
  original: string;
  rewritten: string;
}

export interface JobMatchResult {
  matchRate: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  interviewAdvice?: string;
}

export type AppView =
  | "dashboard"
  | "analysis"
  | "tools"
  | "interview"
  | "history"
  | "saved"
  | "profile"
  | "settings";
