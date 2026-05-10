import { useCallback, useState } from "react";
import { Upload, FileText, ShieldCheck, CheckCircle } from "lucide-react";
import styles from "./DropZone.module.css";

interface DropZoneProps {
  onFile: (file: File) => Promise<void>; // Changed to Promise to await the upload
  onAnalyze: () => void;
  loading: boolean;
}

export default function DropZone({
  onFile,
  onAnalyze,
  loading,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const handleSelect = async (file: File | undefined) => {
    if (file) {
      setPendingFile(file);
      // Automatically "load" the file (parse text) so it's ready
      await onFile(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleSelect(e.dataTransfer.files[0]);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelect(e.target.files?.[0]);
    e.target.value = "";
  };

  const triggerAnalysis = () => {
    if (pendingFile && !loading) {
      onAnalyze(); // This triggers the AI immediately
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ""} ${loading ? styles.disabled : ""} ${pendingFile ? styles.hasFile : ""}`}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
      >
        <div className={styles.iconWrap}>
          {pendingFile ? (
            <CheckCircle
              size={40}
              strokeWidth={1.2}
              className={styles.successIcon}
            />
          ) : (
            <FileText size={40} strokeWidth={1.2} />
          )}
        </div>

        {loading ? (
          <p className={styles.hint}>Processing...</p>
        ) : (
          <>
            <p className={styles.label}>
              {pendingFile ? pendingFile.name : "Drag & Drop your resume here"}
            </p>
            {!pendingFile && (
              <>
                <p className={styles.or}>or</p>
                <label className={styles.browseBtn}>
                  <Upload size={14} />
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={onInputChange}
                    className={styles.hiddenInput}
                  />
                </label>
              </>
            )}
            {pendingFile && (
              <button
                className={styles.changeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingFile(null);
                }}
              >
                Change File
              </button>
            )}
          </>
        )}
      </div>

      <p className={styles.security}>
        <ShieldCheck size={12} />
        Your data is secure and confidential
      </p>

      <div className={styles.ctaCard}>
        <p className={styles.ctaText}>
          {pendingFile ? (
            "File ready! Click analyze to see your results."
          ) : (
            <>
              Drop your resume, and{" "}
              <span className={styles.ctaBrand}>SaraCv</span> will show you what
              recruiters see.
            </>
          )}
        </p>
        <button
          className={`${styles.analyzeBtn} ${loading || !pendingFile ? styles.analyzeBtnDisabled : ""}`}
          onClick={triggerAnalysis}
          disabled={loading || !pendingFile}
        >
          {loading ? "ANALYZING..." : "ANALYZE NOW »"}
        </button>
        <p className={styles.formats}>Supported formats: PDF</p>
      </div>
    </div>
  );
}
