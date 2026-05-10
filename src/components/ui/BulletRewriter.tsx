import { useState } from "react";
import { ArrowDown, Wand2 } from "lucide-react";
import { useBulletRewriter } from "../../hooks/useBulletRewriter";
import styles from "./BulletRewriter.module.css";

export default function BulletRewriter() {
  const [input, setInput] = useState("");
  const { loading, result, rewrite } = useBulletRewriter();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Wand2 size={16} className={styles.icon} />
        <h3 className={styles.title}>AI Bullet Rewriter</h3>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <label className={styles.label}>BEFORE</label>
          <textarea
            className={styles.textarea}
            placeholder="Paste your weak bullet point here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
        </div>

        <button
          className={styles.rewriteBtn}
          onClick={() => rewrite(input)}
          disabled={loading || !input.trim()}
        >
          {loading ? "Rewriting..." : "Rewrite with Sara →"}
        </button>

        {result && (
          <>
            <div className={styles.arrow}>
              <ArrowDown size={16} />
            </div>
            <div className={styles.section}>
              <label className={`${styles.label} ${styles.labelGreen}`}>
                AFTER (OPTIMIZED)
              </label>
              <div className={styles.resultBox}>
                <p>{result.rewritten}</p>
                <span className={styles.badge}> Rewritten by SaraCv</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
