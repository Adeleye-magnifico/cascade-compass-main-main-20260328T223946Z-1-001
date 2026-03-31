import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a Senior Organizational Design Consultant with 20+ years of experience across Fintech, Financial Services, and Human Resources. Your expertise spans job evaluation (Hay, Mercer IPE, Paterson), competency architecture, workforce planning, and organizational scaling. You are analytical, precise, and uncompromising in output quality.

CORE REASONING RULE — MANDATORY:
Before generating any section, you MUST internally reason through:
1. What function and seniority level is this role operating at?
2. What does excellence look like in this function, in a global Fintech or financial services context?
3. What would a world-class organization expect from someone in this role — beyond what the user has written?
4. Where are the gaps, risks, or underdeveloped areas in the input that need to be surfaced?
5. What industry-specific vocabulary, frameworks, and standards apply here?

You do NOT summarize what the user told you — you interpret it, stress-test it, and elevate it into a professional-grade deliverable that the user could not have written themselves.

GRADE LEVEL SCALING LOGIC — Apply to ALL job descriptions:
- Professional Staff (Level 1) — "Doing": 70%+ time on technical execution. Decisions are routine and SOP-driven. Success = accuracy, speed, volume. Risks = errors and rework.
- Supervisory (Level 2) — "Coaching & Checking": 50% execution, 50% coordination and quality control. Decisions are tactical. Success = team output and quality consistency. Risks = process breakdown and team underperformance.
- Management (Level 3) — "Results & Capability": Translates strategy into functional results. Decisions are tactical-to-strategic. Success = functional KPIs, talent development, process improvement. Risks = missed targets and capability gaps.
- Executive Management (Level 4) — "Strategy & Enterprise": Owns long-term vision, culture, and P&L. Decisions are strategic and financial. Success = ROI, EBITDA impact, regulatory standing, enterprise sustainability. Risks = regulatory fines, reputational damage, company-level failure.

CONTENT GENERATION RULES:
- KPIs: Scale by grade. Level 1 = uptime, accuracy, turnaround time. Level 4 = ROI, EBITDA contribution, enterprise risk exposure, regulatory compliance scores.
- Risks: Level 1 = errors and rework. Level 4 = regulatory sanctions (CBN, NDIC, SEC), reputational damage, financial loss, operational collapse.
- Autonomy: Level 1 follows SOPs. Level 2 enforces SOPs. Level 3 refines SOPs. Level 4 creates, approves, and retires SOPs.
- Stakeholders: Level 1 = peers and team leads. Level 2 = cross-functional teams. Level 3 = senior leadership and external partners. Level 4 = Board, Investors, Regulators (CBN, NDIC, SEC, FIRS).
- Certifications: Do NOT default to generic certifications like PMP. Derive certifications from the role's function, industry, and seniority. HR = SHRM-CP, PHR, CIPM. Finance = ACCA, CFA, CPA, ICAN. Technology = AWS, CISSP, TOGAF. Operations = Six Sigma, CIPS. Always validate relevance to Fintech/Financial Services.
- Functional Competencies: NEVER produce generic leadership competencies. Use Fintech-native vocabulary: straight-through processing, settlement cycles, agile delivery, API integration, regulatory compliance, AML/KYC frameworks, core banking systems, digital lending, payment infrastructure. Apply contextually.

COMPETENCY FRAMEWORK — Two related mappings (both required for every skill):

(A) ORGANISATIONAL JOB GRADES (levels 1–4) — Behavioral indicator matrix aligned to grade bands:
- Level 1 Professional Staff: Foundational proficiency; applies skill to routine tasks with supervision.
- Level 2 Supervisory: Applies independently to complex problems; coaches team members.
- Level 3 Management: Strategically deploys to optimize functional performance; builds capability.
- Level 4 Executive Management: Sets organizational standard; shapes enterprise strategy and drives institution-wide value.

(B) STANDARD PROFICIENCY CASCADE (Basic → Expert) — Map EACH competency across these four proficiency tiers using observable, role-specific language. Anchor definitions (do not copy verbatim; apply to the named skill):
- Basic: Able to list, recall, recognise, and identify key concepts; basic familiarity; applies with frequent guidance.
- Intermediate: Explain, define, describe; translate into practical application; normal business situations; occasional guidance; may have limited oversight of less experienced colleagues.
- Advanced: Plan, apply, evaluate others; create policies and processes; difficult situations; little or no guidance; leadership and coaching for the function/department; formal responsibility for colleagues’ application of the competency.
- Expert: Adapt, troubleshoot, originate, innovate; leading practices; considerably or exceptionally difficult situations; champion adoption organisation-wide.

The proficiency cascade (B) is distinct from job grade (A): (A) is tiered by role seniority; (B) describes depth of mastery of the same competency. Both must be coherent and specific to the function and Fintech context.

REPORT STRUCTURE — Return valid JSON matching this exact schema:
{
  "executiveSummary": "Sharp, insight-driven overview (3-4 paragraphs). NOT a copy of the form. This is a consultant's briefing note on the role's strategic importance, organizational fit, and key design considerations.",
  "jds": [
    {
      "level": 1,
      "levelLabel": "Professional Staff",
      "rolePurpose": "2-3 paragraph analytical statement of why this role exists and what organizational problem it solves at this level.",
      "responsibilities": [
        {
          "area": "Responsibility cluster name",
          "percentage": 30,
          "description": "Detailed, grade-appropriate description (3-5 sentences minimum)"
        }
      ],
      "requirements": {
        "education": "Grade-appropriate education requirement",
        "experience": "Years range",
        "fintechExp": "Fintech-specific years",
        "certifications": ["Function-specific, NOT generic"]
      },
      "decisionMaking": "Detailed autonomy statement (3-5 sentences) covering what they decide independently, what requires escalation, approval authority.",
      "kpis": ["Specific, measurable, grade-appropriate KPIs"],
      "risks": ["Grade-appropriate risk domains with consequences"],
      "stakeholders": "Internal and external stakeholders appropriate for this grade level"
}
  ],
  "competencyFramework": [
    {
      "skill": "Skill name",
      "type": "functional or behavioral",
      "levels": {
        "1": "Professional Staff — behavioral descriptor (2-3 sentences)",
        "2": "Supervisory — behavioral descriptor (2-3 sentences)",
        "3": "Management — behavioral descriptor (2-3 sentences)",
        "4": "Executive Management — behavioral descriptor (2-3 sentences)"
      },
      "proficiencyLevels": {
        "basic": "Basic proficiency — specific to this skill (2-3 sentences)",
        "intermediate": "Intermediate proficiency — specific to this skill (2-3 sentences)",
        "advanced": "Advanced proficiency — specific to this skill (2-3 sentences)",
        "expert": "Expert proficiency — specific to this skill (2-3 sentences)"
      }
    }
  ],
  "templateJDs": [
    {
      "level": 1,
      "levelLabel": "Professional Staff",
      "position": "Full role title for this grade level",
      "department": "Function/Department name",
      "jobSummary": "3-4 paragraph professional summary of the role at THIS grade level — its strategic importance, organizational fit, and expected impact. Written as it would appear in a formal JD document.",
      "reportingRelationship": "Reports to: [title]. Direct reports supervised by this role: [titles/count or N/A]. Dotted-line relationships if any.",
      "keyResultAreas": [
        {
          "title": "Key Result Area name (e.g., Compliance & Contracting)",
          "bullets": ["Specific responsibility bullet 1", "Specific responsibility bullet 2", "..."]
        }
      ],
      "kpis": ["Measurable KPI 1", "Measurable KPI 2"],
      "benefits": ["Benefit offered to the role holder"],
      "criticalCompetencies": [
        {
          "name": "Competency name",
          "category": "functional | behavioral | personal | technical",
          "proficiencyLevel": "Learning/Basic, Applying/Intermediate, or Mastering/Advanced",
          "priority": "High, Medium, or Low"
        }
      ],
      "qualificationAndExperience": [
        "Education requirement paragraph",
        "Experience requirement paragraph",
        "Skills requirement paragraph",
        "Attributes paragraph"
      ],
      "specialDuties": "Any other duties as assigned or special responsibilities.",
      "workEnvironment": "Description of work setting — office, client site, hybrid, tools used.",
      "physicalDemands": "Physical requirements of the role.",
      "positionType": "Full Time / Part Time, expected working hours.",
      "travel": "Travel expectations and frequency."
    }
  ]

IMPORTANT NOTES ON THE TEMPLATE JDs:
- The templateJDs array is a THIRD, separate deliverable — formal Job Description documents for ALL 4 grade levels (Professional Staff, Supervisory, Management, Executive Management).
- Generate exactly 4 templateJD objects in the array, one per level (1-4), each with a "level" and "levelLabel" field.
- Each templateJD follows the structure of a professional JD template used in HR consulting firms: Position, Job Summary, Reporting Relationship, Key Result Areas (with sub-bullets), KPIs, Benefits, Critical Competencies (table with proficiency levels and priority), Qualification & Experience, Special Duties, Work Environment, Physical Demands, Position Type, Travel.
- Key Result Areas should have 5-8 areas with 2-4 bullets each. Be specific and actionable.
- Critical Competencies should include 10-14 competencies across functional, behavioral, personal, and technical categories. Of these, AT LEAST 6 must be functional/technical competencies. Do NOT cap functional competencies at 2 — functional depth is essential.
- Scale each templateJD appropriately: Level 1 is execution-focused with basic proficiency; Level 4 is enterprise-strategy-focused with mastering-level proficiency.
- The "Direct Reports" field from user input means the roles/people who are SUPERVISED BY and REPORT TO the anchor role. Factor this into reporting relationships across levels.

PEOPLE OPERATIONS WORKFLOW LOGIC — MANDATORY:
Follow this causal chain: Competencies (including proficiency depth) → Key Result Areas → KPIs.
- Competencies define what the role holder must KNOW and BE ABLE TO DO; proficiencyLevels (Basic–Expert) clarify expected depth for talent and OD use.
- Key Result Areas (KRAs) define the OUTCOMES those competencies are applied to achieve.
- KPIs are the MEASURABLE OBJECTIVES that track whether KRAs are being delivered.
Every KRA must trace back to one or more competencies. Every KPI must trace back to a KRA. This chain must be coherent and auditable across all 4 job grades and consistent with the proficiency cascade where relevant.

Generate exactly 4 JDs (levels 1-4). Generate 4-5 responsibility clusters per JD with percentages totaling 100%. Generate 4-6 KPIs per level. Generate 3-5 risks per level. Include stakeholder mapping per level. Generate exactly 4 templateJDs (levels 1-4).

QUALITY CONSTRAINTS — NON-NEGOTIABLE:
- Do not hallucinate tools, certifications, or software not relevant to Fintech/Financial Services.
- Do not mirror the user's input back. Transform it. Elevate it. Add the expertise they are paying for.
- Do not produce vague, generic, or filler content. Every sentence must earn its place.
- The tone must be authoritative, precise, and professional throughout.
- Do not reference, mention, or use the branding of any consulting firm.
- Return ONLY the JSON object. No markdown fences. No explanatory text before or after.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    const geminiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("GOOGLE_GENERATIVE_AI_API_KEY");
    if (!geminiKey) throw new Error("GEMINI_API_KEY is not configured");

    const userPrompt = buildUserPrompt(formData);
    const model = (Deno.env.get("GEMINI_CASCADE_MODEL") || "gemini-2.0-flash").trim();
    const base = "https://generativelanguage.googleapis.com/v1beta";
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`;

    const jsonBody = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    };

    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonBody),
    });

    if (!response.ok && response.status === 400) {
      const errText = await response.text();
      if (errText.includes("responseMimeType") || errText.includes("responseSchema")) {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        });
      } else {
        console.error("Gemini API error:", 400, errText);
        return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!response.ok) {
      const status = response.status;
      const body = await response.text();
      console.error("Gemini API error:", status, body);

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 403 || status === 401) {
        return new Response(JSON.stringify({ error: "Invalid or missing Gemini API key. Set GEMINI_API_KEY in Supabase Edge Function secrets." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];
    if (!candidate) {
      throw new Error("AI returned no output (request may have been blocked). Please adjust inputs and try again.");
    }
    if (candidate.finishReason === "MAX_TOKENS") {
      throw new Error("AI output was truncated. Try a smaller form or set GEMINI_CASCADE_MODEL to a model with a higher output limit.");
    }

    const parts = candidate.content?.parts;
    const content = parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";

    if (!content.trim()) {
      throw new Error("No content returned from AI model");
    }

    // Parse the JSON from the AI response
    let parsed;
    try {
      // Strip markdown fences if present
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    // Validate structure
    if (!parsed.executiveSummary || !parsed.jds || !Array.isArray(parsed.jds)) {
      throw new Error("AI response missing required fields");
    }

    // Normalize the output to match CascadeOutput
    const output: any = {
      executiveSummary: parsed.executiveSummary,
      jds: parsed.jds.map((jd: any) => ({
        level: jd.level,
        levelLabel: jd.levelLabel,
        rolePurpose: jd.rolePurpose,
        responsibilities: jd.responsibilities || [],
        requirements: jd.requirements || {},
        decisionMaking: jd.decisionMaking,
        kpis: jd.kpis || [],
        risks: jd.risks || [],
      })),
      competencyFramework: (parsed.competencyFramework || []).map((row: any) => ({
        skill: row.skill,
        type: row.type,
        levels: {
          1: row.levels?.["1"] || row.levels?.[1] || "",
          2: row.levels?.["2"] || row.levels?.[2] || "",
          3: row.levels?.["3"] || row.levels?.[3] || "",
          4: row.levels?.["4"] || row.levels?.[4] || "",
        },
        proficiencyLevels: {
          basic: row.proficiencyLevels?.basic || row.proficiencyLevels?.["basic"] || "",
          intermediate: row.proficiencyLevels?.intermediate || row.proficiencyLevels?.["intermediate"] || "",
          advanced: row.proficiencyLevels?.advanced || row.proficiencyLevels?.["advanced"] || "",
          expert: row.proficiencyLevels?.expert || row.proficiencyLevels?.["expert"] || "",
        },
      })),
      functionName: formData.functionName,
      jobTitle: formData.jobTitle,
    };

    // Include templateJDs array if generated (new: all 4 levels)
    const normalizeTemplateJD = (t: any, fallbackTitle: string, fallbackDept: string) => ({
      level: t.level,
      levelLabel: t.levelLabel || "",
      position: t.position || fallbackTitle,
      department: t.department || fallbackDept,
      jobSummary: t.jobSummary || "",
      reportingRelationship: t.reportingRelationship || "",
      keyResultAreas: t.keyResultAreas || [],
      kpis: t.kpis || [],
      benefits: t.benefits || [],
      criticalCompetencies: t.criticalCompetencies || [],
      qualificationAndExperience: t.qualificationAndExperience || [],
      specialDuties: t.specialDuties || "",
      workEnvironment: t.workEnvironment || "",
      physicalDemands: t.physicalDemands || "",
      positionType: t.positionType || "",
      travel: t.travel || "",
    });

    if (parsed.templateJDs && Array.isArray(parsed.templateJDs)) {
      output.templateJDs = parsed.templateJDs.map((t: any) => normalizeTemplateJD(t, formData.jobTitle, formData.functionName));
    } else if (parsed.templateJD) {
      // Legacy single templateJD fallback
      output.templateJDs = [normalizeTemplateJD({ ...parsed.templateJD, level: formData.anchorGrade || 3, levelLabel: "" }, formData.jobTitle, formData.functionName)];
    }

    return new Response(JSON.stringify(output), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-cascade error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildUserPrompt(data: any): string {
  const sections: string[] = [];

  sections.push(`=== ROLE CONTEXT ===
Function/Department: ${data.functionName || "Not specified"}
Job Title (Anchor Role): ${data.jobTitle || "Not specified"}
Anchor Grade Level: ${data.anchorGrade || 3} (${data.anchorGrade === 1 ? "Professional Staff" : data.anchorGrade === 2 ? "Supervisory" : data.anchorGrade === 3 ? "Management" : "Executive Management"})
Reports To: ${data.directReportTitle || "Not specified"}
Direct Reports (people supervised by this role): ${data.directReports || "Not specified"}
Job Match/Benchmark: ${data.jobMatch || "Not specified"}
Main Job Goal: ${data.mainJobGoal || "Not specified"}`);

  sections.push(`IMPORTANT: The "Direct Reports" field above lists the roles/people who are SUPERVISED BY and REPORT TO this anchor role. This role has managerial authority over them. Factor this into reporting relationships, autonomy, KRAs, and competencies across all outputs.`);
  // Tasks
  const tasks = (data.tasks || []).filter((t: any) => t.description);
  if (tasks.length > 0) {
    sections.push(`=== KEY TASKS & TIME ALLOCATION ===
${tasks.map((t: any, i: number) => `${i + 1}. ${t.description} (${t.percentTime}% of time)`).join("\n")}`);
  }

  // Education & Experience
  sections.push(`=== QUALIFICATIONS & EXPERIENCE ===
Education: ${data.education || "Not specified"}
Field of Study: ${data.fieldOfStudy || "Not specified"}
Years of Experience: ${data.yearsExperience?.from || "?"} to ${data.yearsExperience?.to || "?"} years
Fintech Experience: ${data.fintechExperience?.from || "?"} to ${data.fintechExperience?.to || "?"} years
Technical Qualifications: ${data.technicalQuals || "Not specified"}`);

  // Certifications
  const certs = (data.certifications || []).filter((c: any) => c.rating >= 2);
  if (certs.length > 0 || (data.customCertification?.name && data.customCertification.rating >= 2)) {
    const certList = [...certs.map((c: any) => `${c.name} (importance: ${c.rating}/5)`)];
    if (data.customCertification?.name && data.customCertification.rating >= 2) {
      certList.push(`${data.customCertification.name} (importance: ${data.customCertification.rating}/5)`);
    }
    sections.push(`=== CERTIFICATIONS (user-rated) ===\n${certList.join("\n")}`);
  }

  // Skills
  const funcSkills = (data.functionalSkills || []).filter((s: any) => s.name?.trim() && s.rating >= 2);
  if (funcSkills.length > 0) {
    sections.push(`=== FUNCTIONAL SKILLS (user-rated) ===
${funcSkills.map((s: any) => `- ${s.name} (importance: ${s.rating}/5)`).join("\n")}`);
  }

  const behSkills = (data.behavioralSkills || []).filter((s: any) => s.rating >= 2);
  if (behSkills.length > 0) {
    sections.push(`=== BEHAVIORAL COMPETENCIES (user-rated) ===
${behSkills.map((s: any) => `- ${s.name} (importance: ${s.rating}/5)`).join("\n")}`);
  }

  // KPIs
  const kpis = (data.kpis || []).filter((k: string) => k.trim());
  if (kpis.length > 0) {
    sections.push(`=== KEY PERFORMANCE INDICATORS ===\n${kpis.map((k: string, i: number) => `${i + 1}. ${k}`).join("\n")}`);
  }

  // Risks
  const risks = (data.risks || []).filter((r: string) => r.trim());
  if (risks.length > 0) {
    sections.push(`=== KEY RISK DOMAINS ===\n${risks.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}`);
  }

  // Tools & Guides
  if (data.tools) {
    sections.push(`=== TOOLS & SYSTEMS ===\n${data.tools}`);
  }
  if (data.workGuides) {
    sections.push(`=== WORK GUIDES & REFERENCES ===\n${data.workGuides}`);
  }

  // Autonomy & Decisions
  if (data.autonomyLevel) {
    sections.push(`=== AUTONOMY LEVEL ===\n${data.autonomyLevel}`);
  }
  const decTypes = data.decisionTypes || {};
  const activeDecisions = Object.entries(decTypes)
    .filter(([k, v]) => v && k !== "other")
    .map(([k]) => k);
  if (decTypes.other) activeDecisions.push(decTypes.other);
  if (activeDecisions.length > 0) {
    sections.push(`=== DECISION TYPES ===\n${activeDecisions.join(", ")}`);
  }

  // Stakeholders & Reports
  if (data.directReports) {
    sections.push(`=== DIRECT REPORTS ===\n${data.directReports}`);
  }
  if (data.stakeholders) {
    sections.push(`=== KEY STAKEHOLDERS ===\n${data.stakeholders}`);
  }

  sections.push(`
=== INSTRUCTION ===
Analyze the above inputs as raw material. DO NOT parrot them back. Apply your expertise as a Senior Organizational Design Consultant to produce a comprehensive Job Analysis Cascade Report with:
1. An executive summary that reads like a senior consultant's briefing note
2. Four complete job descriptions (Levels 1-4) with genuine analytical differentiation across grades
3. A competency framework with (i) job-grade behavioural indicators (levels 1–4) and (ii) a Basic–Expert proficiency cascade per skill, aligned to the organisational proficiency definitions in the system prompt
4. Function-specific certifications relevant to Fintech/Financial Services
5. Grade-appropriate KPIs, risks, autonomy statements, and stakeholder maps

Transform this input into something the user could not have written themselves. Every section must reflect deep domain expertise.`);

  return sections.join("\n\n");
}
