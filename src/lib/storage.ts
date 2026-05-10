import type { ResumeAnalysis } from "../types";

const STORAGE_KEY = "saracv_last_scan";
const HISTORY_KEY = "saracv_history";

export function saveAnalysis(analysis: ResumeAnalysis): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analysis));

    const history = getHistory();
    history.unshift(analysis);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

export function getLastAnalysis(): ResumeAnalysis | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ResumeAnalysis) : null;
  } catch {
    return null;
  }
}

export function getHistory(): ResumeAnalysis[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ResumeAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HISTORY_KEY);
}
