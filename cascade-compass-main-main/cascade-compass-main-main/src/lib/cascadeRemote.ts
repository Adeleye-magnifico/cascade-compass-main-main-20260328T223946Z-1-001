import { supabase } from "@/integrations/supabase/client";
import type { CascadeOutput, JobAnalysisInput } from "@/types/jobAnalysis";

function hasSupabaseConfig(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && url !== "undefined" && key !== "undefined");
}

/**
 * 1) Same-origin /api/generate-cascade (Vercel serverless) when deployed with GEMINI_API_KEY
 * 2) Supabase Edge Function generate-cascade (when project + function are configured)
 */
export async function fetchCascadeFromRemote(formData: JobAnalysisInput): Promise<CascadeOutput> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  let vercelError: string | null = null;

  try {
    const res = await fetch(`${origin}/api/generate-cascade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData }),
    });

    if (res.ok) {
      const data = (await res.json()) as CascadeOutput & { error?: string };
      if (data?.error) throw new Error(data.error);
      return data as CascadeOutput;
    }

    if (res.status === 404) {
      vercelError = "No /api/generate-cascade route (normal for local Vite dev).";
    } else {
      try {
        const j = (await res.json()) as { error?: string };
        vercelError = j?.error || `Vercel API HTTP ${res.status}`;
      } catch {
        vercelError = `Vercel API HTTP ${res.status}`;
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message !== "Failed to fetch") {
      vercelError = e.message;
    }
  }

  if (!hasSupabaseConfig()) {
    throw new Error(
      vercelError
        ? `${vercelError} Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, or deploy with GEMINI_API_KEY on Vercel.`
        : "AI endpoint unavailable: add GEMINI_API_KEY from Google AI Studio on Vercel (Project → Settings → Environment Variables) and redeploy.",
    );
  }

  const { data, error } = await supabase.functions.invoke("generate-cascade", {
    body: { formData },
  });

  if (error) {
    const errBody =
      data && typeof data === "object" && data !== null && "error" in data
        ? String((data as { error?: string }).error)
        : "";
    const combined = [error.message || "Supabase Edge Function failed", errBody, vercelError].filter(Boolean).join(" | ");
    throw new Error(combined);
  }

  const payload = data as CascadeOutput & { error?: string };
  if (payload?.error) {
    throw new Error([payload.error, vercelError].filter(Boolean).join(" | "));
  }

  return payload as CascadeOutput;
}
