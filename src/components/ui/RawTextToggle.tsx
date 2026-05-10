import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./RawTextToggle.module.css";

interface RawTextToggleProps {
  text: string;
}

export default function RawTextToggle({ text }: RawTextToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button className={styles.toggle} onClick={() => setOpen((p) => !p)}>
        {open ? <EyeOff size={14} /> : <Eye size={14} />}
        {open ? "Hide" : "Show"} what the ATS sees
      </button>

      {open && (
        <div className={styles.preview}>
          <p className={styles.hint}>
            This is the raw text extracted from your PDF. Formatting errors or
            missing content here means ATS systems may also miss them.
          </p>
          <pre className={styles.text}>{text}</pre>
        </div>
      )}
    </div>
  );
}
