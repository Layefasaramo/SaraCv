import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { extractTextFromPdf } from "../lib/pdfParser";
import { analyzeResume, matchJobDescription } from "../lib/gemini";
import { uploadResumePdf } from "../lib/Supabase";
import { saveAnalysis, getLastAnalysis } from "../lib/storage";
import type {
  ResumeAnalysis,
  JobMatchResult,
  InterviewQuestion,
} from "../types";

type AnalysisStatus =
  | "idle"
  | "parsing"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

export function useResumeAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [resumeText, setResumeText] = useState<string>(
    () => localStorage.getItem("sara_raw_text") || "",
  );
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(() => {
    return getLastAnalysis();
  });
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(() => {
    const savedMatch = localStorage.getItem("sara_last_match");
    return savedMatch ? JSON.parse(savedMatch) : null;
  });
  const [fileName, setFileName] = useState<string>(() => {
    return localStorage.getItem("sara_file_name") || "";
  });
  const [jobDescription, setJobDescription] = useState<string>(() => {
    return localStorage.getItem("sara_current_jd") || "";
  });

  // Helper to ensure 0.85 becomes 85 and is rounded
  const normalizeScore = (s: number) => {
    const val = s <= 1 ? s * 100 : s;
    return Math.round(val);
  };

  useEffect(() => {
    if (analysis) saveAnalysis(analysis);
  }, [analysis]);

  useEffect(() => {
    localStorage.setItem("sara_raw_text", resumeText);
    localStorage.setItem("sara_file_name", fileName);
    localStorage.setItem("sara_current_jd", jobDescription);
    if (matchResult) {
      localStorage.setItem("sara_last_match", JSON.stringify(matchResult));
    }
  }, [resumeText, fileName, jobDescription, matchResult]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Sara only accepts PDF files.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max 5MB please.");
      return;
    }

    setFileName(file.name);
    setStatus("parsing");
    const parsingToast = toast.loading("Reading your resume...");

    try {
      const text = await extractTextFromPdf(file);
      if (text.length < 100) {
        toast.dismiss(parsingToast);
        toast.error("Couldn't extract text. Is this a scanned PDF?");
        setStatus("error");
        return;
      }

      setResumeText(text);
      await uploadResumePdf(file).catch(() => null);

      setStatus("idle");
      toast.dismiss(parsingToast);
      toast.success("Resume loaded. Ready to analyze!");
    } catch (err) {
      console.error(err);
      toast.dismiss(parsingToast);
      toast.error("Failed to process PDF.");
      setStatus("error");
    }
  }, []);

  const runFullAnalysis = useCallback(async () => {
    if (!resumeText) {
      toast.error("Upload your resume first!");
      return;
    }

    setStatus("analyzing");
    const analysisToast = toast.loading("Running ATS simulation...");

    try {
      const result = await analyzeResume(resumeText);

      // Normalize score here
      const finalScore = normalizeScore(result.atsScore);
      const normalizedResult = { ...result, atsScore: finalScore };

      setAnalysis(normalizedResult);
      setStatus("done");
      toast.dismiss(analysisToast);
      toast.success(`Score: ${finalScore}% — Analysis complete!`, {
        duration: 4000,
      });
    } catch (err) {
      console.error(err);
      toast.dismiss(analysisToast);
      toast.error("Analysis failed. Check your connection.");
      setStatus("error");
    }
  }, [resumeText]);

  const checkMatch = useCallback(
    async (jd: string) => {
      if (!resumeText) {
        toast.error("Upload your resume first!");
        return;
      }

      if (!jd.trim()) {
        toast.error("Please provide a job description first.");
        return;
      }

      setJobDescription(jd);
      setStatus("analyzing");
      const matchToast = toast.loading("Matching your profile to the role...");

      try {
        const result = await matchJobDescription(resumeText, jd);

        // Normalize match rate
        const finalMatchRate = normalizeScore(result.matchRate);
        const normalizedMatch = { ...result, matchRate: finalMatchRate };

        setMatchResult(normalizedMatch);

        const newQuestions: InterviewQuestion[] =
          result.interviewQuestions || [];

        setAnalysis((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            interviewQuestions:
              newQuestions.length > 0 ? newQuestions : prev.interviewQuestions,
          };
        });

        setStatus("done");
        toast.dismiss(matchToast);
        toast.success(`Match Rate: ${finalMatchRate}%! Check Interview Prep.`, {
          icon: "🎯",
          duration: 5000,
        });
      } catch (err) {
        console.error(err);
        toast.dismiss(matchToast);
        toast.error("Match analysis failed.");
        setStatus("error");
      }
    },
    [resumeText],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setAnalysis(null);
    setMatchResult(null);
    setFileName("");
    setJobDescription("");
    setResumeText("");
    localStorage.removeItem("sara_last_match");
    localStorage.removeItem("sara_file_name");
    localStorage.removeItem("sara_current_jd");
    localStorage.removeItem("sara_last_analysis");
    localStorage.removeItem("sara_raw_text");
  }, []);

  return {
    status,
    analysis,
    matchResult,
    fileName,
    jobDescription,
    resumeText,
    setJobDescription,
    handleFileUpload,
    runFullAnalysis,
    checkMatch,
    reset,
  };
}
