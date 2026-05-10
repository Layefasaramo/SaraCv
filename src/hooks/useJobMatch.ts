import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { matchJobDescription } from "../lib/gemini";
import type { JobMatchResult } from "../types";

export function useJobMatch() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const match = useCallback(
    async (resumeText: string, jobDescription: string) => {
      if (!jobDescription.trim()) {
        toast.error("Paste a job description first.");
        return;
      }

      setLoading(true);
      const t = toast.loading("Matching your resume to the job...");

      try {
        const data = await matchJobDescription(resumeText, jobDescription);
        setResult(data);
        toast.dismiss(t);
        toast.success(`${data.matchRate}% match found!`);
      } catch {
        toast.dismiss(t);
        toast.error("Match failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, result, match, clearResult: () => setResult(null) };
}
