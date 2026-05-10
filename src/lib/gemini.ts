import Groq from "groq-sdk";
import type { ResumeAnalysis, BulletRewrite, JobMatchResult } from "../types";

const apiKey = import.meta.env.VITE_GROQ_API_KEY as string;

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function safeParseJson<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function rewriteBulletPoint(
  bullet: string,
): Promise<BulletRewrite> {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          'You are a professional resume writer. Return JSON: {"original": "...", "rewritten": "..."}',
      },
      { role: "user", content: `Rewrite this: ${bullet}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });
  const text = response.choices[0].message.content || "";
  return safeParseJson<BulletRewrite>(text, {
    original: bullet,
    rewritten: bullet,
  });
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string = "",
): Promise<ResumeAnalysis> {
  const prompt = `Analyze this resume carefully. 
  
  For the "interviewQuestions" field:
  - Task: Compare the Resume to the Job Description (JD) provided.
    1. Calculate Match Rate between Resume and JD.
    2. Identify Missing Keywords from the JD.
    3. Generate 3 specific interview questions this employer would likely ask based on the JD requirements.
    4. For each question, provide a suggested verbatim FIRST-PERSON answer (using "I", "me", "my") that is ready to speak, using the candidate's actual experience from the resume.

  Return a JSON object:
  {
    "atsScore": number,
    "percentileBeat": number,
    "missingKeywords": string[],
    "weaknesses": [{"title": string, "description": string, "severity": "high"|"medium"|"low"}],
    "sectionScores": [{"name": string, "score": number, "max": number}],
    "interviewQuestions": [
      {
        "question": string, 
        "type": "technical"|"behavioral",
        "suggestedAnswer": "The full, ready-to-speak first-person response based on the resume and JD."
      }
    ],
    "recommendedRoles": string[],
    "industryBenchmark": string
  }
  
  Resume Text: """${resumeText.slice(0, 6000)}"""
  Job Description: """${jobDescription || "General career analysis"}"""`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career coach and ATS specialist. You only respond in JSON. Your goal is to provide deeply personalized interview preparation. Never return generic placeholders.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const text = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(text);

    return {
      atsScore: parsed.atsScore ?? 0,
      percentileBeat: parsed.percentileBeat ?? 0,
      missingKeywords: parsed.missingKeywords ?? [],
      weaknesses: parsed.weaknesses ?? [],
      sectionScores: parsed.sectionScores ?? [],
      interviewQuestions: parsed.interviewQuestions ?? [],
      recommendedRoles: parsed.recommendedRoles ?? [],
      industryBenchmark: parsed.industryBenchmark || "Ready for applications.",
      rawText: resumeText,
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Groq Analysis Failed:", error);
    return {
      atsScore: 0,
      percentileBeat: 0,
      missingKeywords: [],
      weaknesses: [],
      sectionScores: [],
      interviewQuestions: [],
      recommendedRoles: [],
      industryBenchmark: "Analysis failed.",
      rawText: resumeText,
      analyzedAt: new Date().toISOString(),
    };
  }
}

export async function matchJobDescription(
  resumeText: string,
  jobDescription: string,
): Promise<JobMatchResult & { interviewQuestions?: any[] }> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          'Compare resume to JD. Return JSON: {"matchRate": number, "matchedKeywords": string[], "missingKeywords": string[], "interviewAdvice": string, "interviewQuestions": [{"question": string, "type": "technical"|"behavioral", "suggestedAnswer": string}]}',
      },
      {
        role: "user",
        content: `Resume: ${resumeText.slice(0, 4000)}\nJD: ${jobDescription}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const text = response.choices[0].message.content || "";
  return safeParseJson(text, {
    matchRate: 0,
    matchedKeywords: [],
    missingKeywords: [],
    interviewAdvice: "",
    interviewQuestions: [],
  });
}
