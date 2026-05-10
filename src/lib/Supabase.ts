import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadResumePdf(file: File): Promise<string | null> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const { error } = await supabase.storage
    .from("Resume")
    .upload(fileName, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    return null;
  }

  return fileName;
}
