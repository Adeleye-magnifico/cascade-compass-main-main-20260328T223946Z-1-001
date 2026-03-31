import type { JobAnalysisInput } from "../cascade-compass-main-main/cascade-compass-main-main/src/types/jobAnalysis";

const cors = (res: { setHeader: (n: string, v: string) => void }) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vercel Node handler
export default async function handler(req: any, res: any) {
  cors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const formData = body?.formData as JobAnalysisInput | undefined;
    if (!formData || typeof formData !== "object") {
      return res.status(400).json({ error: "Missing formData in request body" });
    }

    // Dynamic import avoids ERR_REQUIRE_ESM: Vercel bundles api/*.ts as CJS but src/ is ESM.
    const { runCascadeAi } = await import(
      "../cascade-compass-main-main/cascade-compass-main-main/src/lib/generateCascadeAi.js"
    );
    const output = await runCascadeAi(formData);
    return res.status(200).json(output);
  } catch (e) {
    console.error("generate-cascade:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("Rate limit")) {
      return res.status(429).json({ error: msg });
    }
    if (msg.includes("GEMINI_API_KEY is not configured")) {
      return res.status(503).json({
        error:
          "AI is not configured on this deployment. Add GEMINI_API_KEY from https://aistudio.google.com/apikey to Vercel project environment variables and redeploy.",
      });
    }
    return res.status(500).json({ error: msg });
  }
}
