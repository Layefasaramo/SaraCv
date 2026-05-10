import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BookmarkCheck, User, Settings } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import AnalysisPage from "./components/dashboard/AnalysisPage";
import ToolsPage from "./components/dashboard/ToolsPage";
import InterviewPage from "./components/dashboard/InterviewPage";
import HistoryPage from "./components/dashboard/HistoryPage";
import PlaceholderPage from "./components/dashboard/PlaceholderPage";
import { useResumeAnalysis } from "./hooks/useResumeAnalysis";
import type { AppView } from "./types";
import styles from "./App.module.css";

export default function App() {
  const [view, setView] = useState<AppView>("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  const {
    status,
    analysis,
    matchResult,
    jobDescription,
    resumeText,
    setJobDescription,
    handleFileUpload,
    runFullAnalysis,
    checkMatch,
  } = useResumeAnalysis();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    } else {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const renderPage = () => {
    switch (view) {
      case "dashboard":
        return (
          <Dashboard
            analysis={analysis}
            status={status}
            resumeText={resumeText}
            onFile={handleFileUpload}
            onAnalyze={runFullAnalysis}
            setView={setView}
          />
        );
      case "analysis":
        return (
          <AnalysisPage
            analysis={analysis}
            matchResult={matchResult}
            onCheckMatch={checkMatch}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        );
      case "tools":
        return <ToolsPage />;
      case "interview":
        return <InterviewPage analysis={analysis} />;
      case "history":
        return <HistoryPage />;
      case "saved":
        return (
          <PlaceholderPage
            title="Saved Reports"
            description="Save and revisit your past analyses. Organize reports by job role or company."
            icon={<BookmarkCheck size={40} strokeWidth={1} />}
          />
        );
      case "profile":
        return (
          <PlaceholderPage
            title="Your Profile"
            description="Manage your preferences, career goals, and target industries."
            icon={<User size={40} strokeWidth={1} />}
          />
        );
      case "settings":
        return (
          <PlaceholderPage
            title="Settings"
            description="Customize notifications, AI model preferences, and privacy controls."
            icon={<Settings size={40} strokeWidth={1} />}
          />
        );
    }
  };

  return (
    <div className={styles.app}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? "#111a14" : "#f0fdf4",
            color: darkMode ? "#e8f5ec" : "#111a14",
            border: darkMode ? "1px solid #1e3024" : "1px solid #dcfce7",
            fontSize: "13px",
            fontFamily: '"DM Sans", sans-serif',
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: darkMode ? "#080d0a" : "#ffffff",
            },
          },
        }}
      />
      <Sidebar
        activeView={view}
        onNavigate={setView}
        darkMode={darkMode}
        onToggleDark={toggleDarkMode}
      />
      <main className={styles.main}>{renderPage()}</main>
    </div>
  );
}
