import {
  LayoutDashboard,
  FileSearch,
  Wrench,
  Mic2,
  Clock,
  BookmarkCheck,
  User,
  Settings,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import type { AppView } from "../../types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "analysis", label: "Resume Analysis", icon: <FileSearch size={16} /> },
  { id: "tools", label: "AI Tools", icon: <Wrench size={16} /> },
  { id: "interview", label: "Interview Prep", icon: <Mic2 size={16} /> },
  { id: "history", label: "History", icon: <Clock size={16} /> },
  { id: "saved", label: "Saved Reports", icon: <BookmarkCheck size={16} /> },
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

export default function Sidebar({
  activeView,
  onNavigate,
  darkMode,
  onToggleDark,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Sara</span>
        <span className={styles.logoCv}>Cv</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeView === item.id ? styles.active : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.premiumCard}>
        <p className={styles.premiumTitle}>Go Premium</p>
        <p className={styles.premiumSub}>
          Unlimited scans, advanced AI insights.
        </p>
        <button className={styles.premiumBtn}>Upgrade Now</button>
      </div>

      <div className={styles.themeToggle}>
        <button
          className={`${styles.themeBtn} ${darkMode ? styles.themeActive : ""}`}
          onClick={onToggleDark} // Just toggle it
          title="Switch to Dark Mode"
        >
          <Moon size={13} />
        </button>
        <button
          className={`${styles.themeBtn} ${!darkMode ? styles.themeActive : ""}`}
          onClick={onToggleDark} // Just toggle it
          title="Switch to Light Mode"
        >
          <Sun size={13} />
        </button>
      </div>
    </aside>
  );
}
