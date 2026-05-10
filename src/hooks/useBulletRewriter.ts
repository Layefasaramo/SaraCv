import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { rewriteBulletPoint } from "../lib/gemini";
import type { BulletRewrite } from "../types";

export function useBulletRewriter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulletRewrite | null>(null);

  const rewrite = useCallback(async (bullet: string) => {
    if (!bullet.trim()) {
      toast.error("Paste a bullet point first.");
      return;
    }

    setLoading(true);
    const t = toast.loading("Sara is polishing your bullet...");

    try {
      const data = await rewriteBulletPoint(bullet);
      setResult(data);
      toast.dismiss(t);
      toast.success("Bullet rewritten!");
    } catch {
      toast.dismiss(t);
      toast.error("Rewrite failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, rewrite, clearResult: () => setResult(null) };
}
