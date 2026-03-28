import {
  type JobAnalysisInput,
  type GradeLevel,
  type GeneratedJD,
  type CompetencyRow,
  type CascadeOutput,
  type ProficiencyLevelKey,
  GRADE_LABELS,
} from "@/types/jobAnalysis";

// ─── Certification intelligence by function/role ───────────────────────────
const CERT_MAP: Record<string, string[]> = {
  "human resources": ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR", "CHRP", "CIPD", "CIPM"],
  "hr": ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR", "CHRP", "CIPD", "CIPM"],
  "people": ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR", "CIPD", "CIPM"],
  "talent": ["SHRM-CP", "SHRM-SCP", "PHR", "CIPD", "ATD CPTD"],
  "finance": ["CFA", "CPA", "ACCA", "FRM", "CIMA", "ICAN", "FMVA"],
  "accounting": ["CPA", "ACCA", "ICAN", "CIMA", "ACA", "FMVA"],
  "treasury": ["CTP", "ACT", "CFA", "FRM", "ACCA"],
  "risk": ["FRM", "PRM", "CISA", "CRISC", "CISSP", "ERM"],
  "compliance": ["CAMS", "CRCM", "ICA", "CCEP", "CFE", "ACAMS"],
  "aml": ["CAMS", "ACAMS", "ICA", "CFE", "CCEP"],
  "engineering": ["AWS Solutions Architect", "Google Cloud Professional", "Azure Solutions Architect", "Kubernetes (CKA)", "Terraform Associate", "TOGAF"],
  "software": ["AWS Solutions Architect", "Google Cloud Professional", "Kubernetes (CKA)", "TOGAF", "Scrum Master (CSM)"],
  "technology": ["AWS Solutions Architect", "Google Cloud Professional", "CISSP", "TOGAF", "ITIL", "CompTIA Security+"],
  "information security": ["CISSP", "CISM", "CISA", "CEH", "CompTIA Security+", "ISO 27001 Lead Auditor"],
  "cybersecurity": ["CISSP", "CISM", "CEH", "OSCP", "CompTIA Security+", "CISA"],
  "data": ["Google Data Analytics", "AWS Data Analytics", "Databricks", "Snowflake", "Microsoft Power BI", "CDMP"],
  "analytics": ["Google Data Analytics", "AWS Data Analytics", "CDMP", "SAS Certified", "Microsoft Power BI"],
  "product": ["CSPO", "SAFe Product Owner", "Pragmatic Institute", "AIPMM", "Scrum Master (CSM)"],
  "marketing": ["Google Analytics", "HubSpot Inbound", "Meta Blueprint", "Google Ads", "CIM"],
  "digital": ["Google Analytics", "HubSpot", "Meta Blueprint", "Google Ads"],
  "sales": ["Salesforce Admin", "HubSpot Sales", "SPIN Selling", "Challenger Sales"],
  "operations": ["PMP", "Six Sigma Green Belt", "Six Sigma Black Belt", "ITIL", "Lean", "CIPS"],
  "project management": ["PMP", "PRINCE2", "Agile Certified Practitioner (PMI-ACP)", "Scrum Master (CSM)", "SAFe Agilist"],
  "legal": ["BL (Barrister at Law)", "ICSAN", "Chartered Mediator", "ACIS"],
  "audit": ["CIA", "CISA", "CFE", "ACCA", "CPA", "CRISC"],
  "internal audit": ["CIA", "CISA", "CFE", "CRISC", "ACCA"],
  "payments": ["PCI DSS", "SWIFT CSP", "Certified Payments Professional (CPP)", "CAMS"],
  "growth": ["Google Analytics", "HubSpot Growth", "CXL Growth Marketing", "Meta Blueprint"],
  "design": ["Google UX Design", "Interaction Design Foundation", "Adobe Certified Expert", "Nielsen Norman UX"],
  "customer": ["CCXP", "HDI Support Center", "ITIL", "Salesforce Admin"],
  "strategy": ["CFA", "PMP", "McKinsey Forward", "TOGAF"],
  "procurement": ["CIPS", "CSCP", "CPM", "Six Sigma Green Belt"],
  "supply chain": ["CSCP", "CIPS", "CPIM", "Six Sigma Green Belt", "Lean"],
};

function inferCertifications(input: JobAnalysisInput): string[] {
  const context = `${input.functionName} ${input.jobTitle} ${input.jobMatch}`.toLowerCase();
  const matched = new Set<string>();

  for (const [keyword, certs] of Object.entries(CERT_MAP)) {
    if (context.includes(keyword)) {
      certs.forEach(c => matched.add(c));
    }
  }

  // Add user-entered certs
  input.certifications.filter(c => c.rating >= 2).forEach(c => matched.add(c.name));
  if (input.customCertification.name.trim() && input.customCertification.rating >= 2) {
    matched.add(input.customCertification.name.trim());
  }

  return Array.from(matched).slice(0, 10);
}

// ─── Experience scaling ────────────────────────────────────────────────────
const EXPERIENCE_MAP: Record<GradeLevel, { total: string; fintech: string }> = {
  1: { total: "2–4 years", fintech: "1–2 years" },
  2: { total: "5–7 years", fintech: "3–4 years" },
  3: { total: "8–12 years", fintech: "5–7 years" },
  4: { total: "12+ years", fintech: "8+ years" },
};

function scaleExperience(input: JobAnalysisInput, level: GradeLevel): { total: string; fintech: string } {
  const hasInput = input.yearsExperience.from && input.yearsExperience.to;
  if (!hasInput) return EXPERIENCE_MAP[level];

  const anchorLevel = input.anchorGrade;
  if (level === anchorLevel) {
    return {
      total: `${input.yearsExperience.from}–${input.yearsExperience.to} years`,
      fintech: input.fintechExperience.from && input.fintechExperience.to
        ? `${input.fintechExperience.from}–${input.fintechExperience.to} years`
        : EXPERIENCE_MAP[level].fintech,
    };
  }
  return EXPERIENCE_MAP[level];
}

const EDUCATION_MAP: Record<GradeLevel, string> = {
  1: "Bachelor's degree in a relevant field (e.g., Computer Science, Finance, Business Administration, or equivalent discipline)",
  2: "Bachelor's degree in a relevant field (Master's degree or professional qualification preferred)",
  3: "Master's degree, MBA, or equivalent professional qualification with demonstrated domain expertise",
  4: "Master's degree, MBA, or equivalent executive education; advanced professional certifications strongly preferred",
};

// ─── Autonomy with Fintech-specific decision frameworks ────────────────────
const AUTONOMY_MAP: Record<GradeLevel, string> = {
  1: "Operates within established Standard Operating Procedures (SOPs), regulatory guidelines, and defined quality standards. Makes routine decisions independently within the scope of assigned work — including transaction processing, data validation, and standard compliance checks. Escalates non-standard issues, exceptions, policy ambiguities, and any matter with potential regulatory or financial exposure to the direct supervisor for resolution. Does not have authority to approve expenditure, modify process workflows, or engage external parties independently.",
  2: "Manages day-to-day operations with moderate autonomy within functional parameters and approved SOPs. Makes tactical decisions on process improvements, resource allocation within budget, team coordination, and quality assurance interventions. Has authority to enforce SOPs, reassign tasks, and make time-sensitive operational calls within defined thresholds. Escalates strategic matters, cross-functional disputes, budget requests exceeding approved limits, and issues with potential regulatory implications to management.",
  3: "Exercises significant autonomy in directing the functional area with accountability for measurable outcomes. Makes strategic decisions regarding department direction, resource investment, vendor selection, process redesign, and talent management. Has authority to approve expenditure within delegated limits, restructure team workflows, and represent the function in cross-organisational forums. Escalates enterprise-level matters, decisions with organisation-wide policy implications, and items exceeding financial delegation to executive leadership.",
  4: "Full strategic autonomy with enterprise-wide accountability and fiduciary responsibility. Makes high-stakes decisions on organisational direction, capital allocation, market positioning, strategic partnerships, organisational design, and regulatory response strategy. Has authority to commit the organisation to strategic initiatives, approve significant expenditure within board-delegated limits, and engage regulators, investors, and strategic partners. Accountable to the Board and CEO for sustainable performance, risk posture, regulatory standing, and stakeholder value creation.",
};

// ─── Task weight distribution by grade ─────────────────────────────────────
const TASK_WEIGHTS: Record<GradeLevel, { strategy: number; leadership: number; execution: number; governance: number }> = {
  1: { strategy: 0, leadership: 5, execution: 80, governance: 15 },
  2: { strategy: 10, leadership: 25, execution: 45, governance: 20 },
  3: { strategy: 25, leadership: 25, execution: 30, governance: 20 },
  4: { strategy: 40, leadership: 30, execution: 10, governance: 20 },
};

// ─── Fintech-specific vocabulary helper ────────────────────────────────────
function getFintechContext(fn: string): string {
  const lower = fn.toLowerCase();
  const contextMap: Record<string, string> = {
    "engineering": "API integration, microservices architecture, payment gateway reliability, straight-through processing, and platform scalability",
    "software": "API integration, microservices architecture, CI/CD pipelines, straight-through processing, and digital platform development",
    "technology": "core banking systems, API ecosystems, cloud infrastructure, cybersecurity posture, and digital transformation",
    "payments": "payment infrastructure, settlement cycles, switching networks, PCI DSS compliance, and transaction processing integrity",
    "risk": "AML/KYC frameworks, fraud detection systems, credit risk modelling, regulatory capital adequacy, and enterprise risk management",
    "compliance": "CBN regulatory requirements, NDIC guidelines, AML/CFT frameworks, sanctions screening, and regulatory reporting",
    "finance": "financial reporting standards (IFRS), regulatory capital management, treasury operations, and financial planning & analysis",
    "hr": "workforce planning, talent acquisition in competitive Fintech markets, compensation benchmarking, and organisational design",
    "human resources": "workforce planning, talent acquisition in competitive Fintech markets, compensation benchmarking, and organisational design",
    "product": "digital product lifecycle management, user experience optimisation, agile delivery, product-market fit, and feature prioritisation",
    "data": "data governance frameworks, real-time analytics pipelines, business intelligence, data-driven decision-making, and regulatory data requirements",
    "operations": "operational resilience, business continuity planning, process automation, SLA management, and operational risk mitigation",
    "marketing": "digital customer acquisition, brand positioning in financial services, regulatory-compliant marketing, and customer lifecycle management",
    "customer": "customer experience management, digital onboarding, complaint resolution frameworks, and Net Promoter Score optimisation",
    "audit": "internal control frameworks, regulatory audit readiness, SOX compliance, risk-based audit methodology, and control testing",
    "legal": "fintech regulatory landscape, licensing requirements, contract management, intellectual property, and regulatory liaison",
  };

  for (const [key, value] of Object.entries(contextMap)) {
    if (lower.includes(key)) return value;
  }
  return "operational excellence, regulatory compliance, digital transformation, and stakeholder value creation";
}

// ─── Role purpose — consultant-grade, analytical ───────────────────────────
function generateRolePurpose(input: JobAnalysisInput, level: GradeLevel): string {
  const fn = input.functionName || "the function";
  const goal = input.mainJobGoal || "core operational objectives";
  const fintechCtx = getFintechContext(fn);
  const tools = input.tools ? input.tools.split(",").slice(0, 3).map(t => t.trim()).join(", ") : "";
  const toolsClause = tools ? `, leveraging platforms including ${tools}` : "";
  const stakeholders = input.stakeholders ? input.stakeholders.split(",").slice(0, 3).map(s => s.trim()).join(", ") : "";

  const templates: Record<GradeLevel, string> = {
    1: `This role serves as the technical execution backbone of the ${fn} function, delivering high-quality, accurate, and timely outputs that directly underpin the organisation's ${fintechCtx}. The incumbent is responsible for ${goal}${toolsClause}, operating within established SOPs and quality frameworks. The role demands specialist proficiency, meticulous attention to detail, and the ability to maintain consistent output quality under operational pressure. As a Professional Staff member, the role holder is expected to develop deep domain expertise, identify and flag process inefficiencies, and contribute to the team's collective knowledge base — serving as a reliable operational resource that enables the broader function to deliver on its commitments.`,

    2: `This role provides the critical operational leadership layer within the ${fn} function, bridging the gap between strategic intent and ground-level execution. The incumbent coordinates team activities, enforces quality standards, and ensures that ${goal} is achieved through disciplined execution and continuous capability development${toolsClause}. The Supervisory role demands a combination of technical credibility and people leadership — the ability to coach team members, troubleshoot complex operational issues, and maintain service delivery standards in the context of ${fintechCtx}. The role holder acts as the primary escalation point for operational exceptions, translates management directives into actionable team priorities, and is accountable for team productivity, quality metrics, and developmental progress.`,

    3: `This role carries functional leadership accountability for the ${fn} function, with a mandate to translate organisational strategy into measurable operational and commercial outcomes. The incumbent is responsible for ${goal} through strategic resource deployment, capability architecture, cross-functional collaboration, and performance optimisation${toolsClause}. Operating at the intersection of strategy and execution, the role requires the ability to anticipate market and regulatory shifts in the Fintech landscape — particularly in ${fintechCtx} — and proactively position the function to respond. ${stakeholders ? `The role engages directly with ${stakeholders} to align priorities, negotiate resources, and drive cross-functional initiatives.` : ""} The Management-level incumbent establishes performance frameworks, builds organisational capability, drives continuous improvement, and ensures the function's output is fully aligned with enterprise objectives, regulatory requirements, and competitive positioning.`,

    4: `This role holds enterprise-wide strategic accountability for the ${fn} function, with direct responsibility for shaping the organisation's long-term direction in ${fintechCtx}. The incumbent is accountable for ${goal} at the highest organisational level, encompassing P&L oversight, enterprise risk governance, regulatory strategy, and stakeholder value creation. The Executive Management role demands visionary leadership combined with commercial acumen — the ability to set multi-year strategic roadmaps, allocate capital against competing priorities, and build enduring organisational capabilities that create sustainable competitive advantage. ${stakeholders ? `The role maintains strategic relationships with ${stakeholders}, regulatory bodies (including CBN, NDIC, SEC, and FIRS where applicable), and industry forums.` : ""} The incumbent shapes organisational culture, drives innovation, champions ethical governance, and ensures the ${fn} function delivers measurable, sustainable value to all stakeholders — including shareholders, regulators, employees, and customers.`,
  };
  return templates[level];
}

// ─── Responsibilities — deeply scaled with analytical depth ─────────────────
function generateResponsibilities(input: JobAnalysisInput, level: GradeLevel) {
  const w = TASK_WEIGHTS[level];
  const fn = input.functionName || "the function";
  const taskSummary = input.tasks.filter(t => t.description).map(t => t.description).join("; ") || "core functional deliverables";
  const guides = input.workGuides ? input.workGuides.split(",").slice(0, 3).map(g => g.trim()).join(", ") : "";
  const guidesClause = guides ? ` in accordance with ${guides}` : "";
  const stakeholders = input.stakeholders ? input.stakeholders.split(",").slice(0, 3).map(s => s.trim()).join(", ") : "key stakeholders";
  const fintechCtx = getFintechContext(fn);

  const strategyDesc: Record<GradeLevel, string> = {
    1: `Support strategic initiatives by providing accurate operational data, ground-level insights, and execution feedback that informs ${fn} planning efforts. Participate in team planning sessions and contribute observations on process effectiveness, workload patterns, and emerging operational challenges. While not responsible for setting strategy, the role holder is expected to understand how their work connects to broader functional and organisational objectives.`,

    2: `Contribute to tactical planning by analysing team performance data, identifying improvement opportunities, and proposing evidence-based process enhancements for ${fn} operations. Translate management directives into structured team work plans with clear milestones, resource assignments, and quality checkpoints. Provide regular upward reporting on team capacity, delivery risks, and operational trends. Participate in cross-functional coordination meetings and represent the team's capabilities and constraints in resource planning discussions.`,

    3: `Define and drive the strategic direction for the ${fn} function, translating enterprise objectives into departmental roadmaps, resource plans, and measurable milestones. Conduct environmental scanning — monitoring regulatory developments, competitive dynamics, and technology trends in ${fintechCtx} — to identify strategic opportunities and threats. Engage with ${stakeholders} to align priorities, negotiate resources, and drive cross-functional initiatives. Develop and present business cases for investment in capability, technology, and talent. Establish strategic performance frameworks that link functional output to enterprise value creation.`,

    4: `Set enterprise-wide ${fn} strategy, including multi-year roadmaps, capital allocation priorities, market positioning, and organisational design decisions. Drive board-level reporting on functional performance, risk posture, and strategic progress. Champion the function's strategic agenda across the executive committee, ensuring alignment with enterprise objectives, regulatory requirements, and shareholder expectations. Lead strategic scenario planning, M&A due diligence (where applicable), and partnership evaluations that extend the organisation's competitive position in ${fintechCtx}. Shape the organisation's long-term talent and capability strategy to ensure readiness for market evolution.`,
  };

  const leadershipDesc: Record<GradeLevel, string> = {
    1: "Collaborate effectively with peers, contribute to knowledge sharing, and support the onboarding and integration of new team members through structured buddy programmes and documentation of standard procedures. Actively seek and provide constructive feedback within the team. Demonstrate professional development initiative by pursuing relevant certifications, attending training programmes, and sharing learnings with colleagues. Build and maintain productive working relationships across the immediate team and adjacent functions.",

    2: `Lead day-to-day team coordination with accountability for productivity, quality, and morale. Conduct regular one-on-one performance check-ins, provide structured technical coaching, and facilitate skills development through on-the-job training, knowledge transfer sessions, and mentoring. Identify and address performance gaps early through coaching conversations and, where necessary, formal performance improvement plans. Drive team engagement by creating a psychologically safe environment where team members feel empowered to raise concerns, propose ideas, and take ownership of their professional growth. Manage workload distribution to ensure equitable allocation and prevent burnout.`,

    3: `Build and sustain high-performing teams through structured talent development, succession planning, and robust performance management. Establish competency frameworks, career pathways, and development programmes that attract, retain, and grow top talent within the ${fn} function. Foster a culture of accountability, continuous improvement, and intellectual rigour. Lead organisational design discussions for the function — including span of control, reporting structures, and role architecture. Drive diversity, equity, and inclusion within the team and ensure that leadership development pipelines reflect the organisation's values and strategic needs.`,

    4: `Shape the organisation's enterprise talent strategy, drive executive-level succession planning, and champion leadership development programmes that build the next generation of organisational leaders. Build an enduring culture of excellence, innovation, ethical practice, and commercial discipline. Serve as an executive sponsor for talent initiatives, diversity programmes, and organisational development efforts. Model the leadership behaviours that define the organisation's values — setting the standard for integrity, accountability, strategic thinking, and stakeholder orientation. Ensure that the ${fn} function's leadership bench is deep, diverse, and equipped to navigate the complexities of the Fintech landscape.`,
  };

  const executionDesc: Record<GradeLevel, string> = {
    1: `Execute and deliver core operational outputs with precision, speed, and consistent quality: ${taskSummary}${guidesClause}. Maintain meticulous documentation and audit trails for all work products. Apply established tools and methodologies to complete assigned tasks within agreed timelines and quality thresholds. Proactively identify and escalate process bottlenecks, system issues, and potential compliance risks. Ensure that all deliverables meet internal quality standards and, where applicable, regulatory requirements governing ${fintechCtx}.`,

    2: `Oversee the execution and delivery of team outputs, ensuring quality, timeliness, and compliance: ${taskSummary}${guidesClause}. Conduct quality reviews on team deliverables, implement corrective actions for recurring errors, and drive process standardisation. Manage operational exceptions and serve as the first escalation point for complex issues. Maintain operational dashboards and reporting mechanisms that provide visibility into team performance, workload distribution, and delivery risks. Ensure that the team operates within established SLAs, regulatory guidelines, and internal control frameworks.`,

    3: `Direct the execution of functional deliverables through structured delegation, performance monitoring, and outcome accountability: ${taskSummary}${guidesClause}. Establish operational excellence frameworks that drive efficiency, reduce error rates, and improve throughput. Lead process improvement initiatives — including automation, technology adoption, and workflow redesign — that enhance the function's capacity and capability. Ensure that delivery standards are aligned with industry best practices in ${fintechCtx} and that the function maintains a reputation for reliability, precision, and innovation.`,

    4: `Provide executive oversight of enterprise-wide delivery standards, ensuring that the ${fn} function's output creates measurable organisational value. Set performance expectations and accountability frameworks that cascade through all levels of the function. Drive strategic investments in technology, process, and capability that transform delivery capacity and competitive positioning. Review and approve significant operational decisions, policy changes, and delivery commitments. Ensure that the function's operational model is resilient, scalable, and aligned with the organisation's growth trajectory and regulatory obligations.`,
  };

  const governanceDesc: Record<GradeLevel, string> = {
    1: `Manage operational documentation, compliance checklists, and administrative requirements with accuracy and timeliness. Maintain audit-ready records for all assigned work — including transaction logs, process documentation, and quality records. Complete all mandatory regulatory and internal reporting within established deadlines. Adhere to internal control procedures, data protection requirements, and information security policies. Support internal and external audit processes by providing requested documentation and evidence promptly.`,

    2: `Ensure team compliance with governance frameworks, regulatory requirements, and internal control procedures. Manage operational reporting — including productivity metrics, quality reports, and compliance dashboards — for management review. Coordinate the team's participation in audit processes, regulatory reviews, and compliance assessments. Identify and escalate control weaknesses, process gaps, and emerging compliance risks. Maintain up-to-date process documentation and standard operating procedures for all team activities.`,

    3: `Oversee governance frameworks, regulatory compliance, and risk management for the ${fn} function. Ensure audit readiness across all functional processes and maintain a robust internal control environment. Drive the development and maintenance of policies, procedures, and control frameworks that meet regulatory expectations — particularly those of CBN, NDIC, and other relevant supervisory bodies. Lead the function's response to regulatory examinations, internal audit findings, and compliance reviews. Ensure timely, accurate, and insightful management reporting that supports executive decision-making.`,

    4: `Champion enterprise governance, regulatory strategy, and risk culture across the organisation. Represent the function in board-level risk and audit committee discussions. Oversee the development of enterprise policies, governance frameworks, and risk appetite statements. Ensure the organisation's regulatory posture is proactive — anticipating regulatory change and positioning the organisation to respond effectively. Drive a culture of ethical conduct, regulatory compliance, and transparent reporting. Maintain strategic relationships with regulators (CBN, NDIC, SEC, FIRS) and ensure the organisation's regulatory standing is a source of competitive advantage.`,
  };

  return [
    { area: "Strategic Planning & Direction", percentage: w.strategy, description: strategyDesc[level] },
    { area: "Team Leadership & People Development", percentage: w.leadership, description: leadershipDesc[level] },
    { area: "Core Execution & Operational Delivery", percentage: w.execution, description: executionDesc[level] },
    { area: "Governance, Risk & Regulatory Compliance", percentage: w.governance, description: governanceDesc[level] },
  ];
}

// ─── KPI scaling — grade-appropriate, measurable, analytical ───────────────
function scaleKPIs(kpis: string[], level: GradeLevel, fn: string): string[] {
  const fintechCtx = getFintechContext(fn);
  const validKpis = kpis.filter(k => k.trim());

  if (validKpis.length === 0) {
    // Generate sensible defaults based on level
    const defaults: Record<GradeLevel, string[]> = {
      1: [
        "Task completion accuracy rate ≥ 98% across all assigned deliverables",
        "Adherence to SLA turnaround times for 95% of operational requests",
        "Zero critical compliance exceptions in assigned work products",
      ],
      2: [
        "Team productivity metrics within 10% of target across all delivery areas",
        "Quality assurance pass rate ≥ 95% on first review for team deliverables",
        "Team capability development: 100% of team members with completed individual development plans",
        "Operational incident resolution within agreed SLA timelines",
      ],
      3: [
        "Achievement of 100% of functional KPI targets as defined in the annual operating plan",
        "Year-on-year improvement in functional efficiency metrics (cost-per-transaction, cycle time, error rate)",
        "Talent retention rate ≥ 90% for high-performing team members",
        "Successful delivery of strategic initiatives within approved budget and timeline",
        "Regulatory compliance score: zero material findings in internal/external audits",
      ],
      4: [
        "Enterprise-level financial performance: achievement of EBITDA, revenue, and cost targets for the function",
        "Regulatory standing: zero material regulatory sanctions, fines, or adverse findings",
        "Strategic initiative delivery: on-time, on-budget completion of board-approved strategic programmes",
        "Organisational health metrics: employee engagement, leadership bench strength, and diversity indices",
        "Stakeholder satisfaction: positive ratings from Board, investors, regulators, and key partners",
      ],
    };
    return defaults[level];
  }

  const levelTransformations: Record<GradeLevel, (kpi: string) => string> = {
    1: (kpi) => `Consistently achieve and maintain ${kpi.trim().toLowerCase()} through accurate, timely execution of assigned tasks and adherence to established quality standards`,
    2: (kpi) => `Monitor, analyse, and drive team performance in ${kpi.trim().toLowerCase()} through structured coaching, quality reviews, and proactive identification of improvement opportunities`,
    3: (kpi) => `Design measurement frameworks and drive continuous improvement in ${kpi.trim().toLowerCase()} across the function, ensuring alignment with enterprise targets and industry benchmarks`,
    4: (kpi) => `Set enterprise-level targets for ${kpi.trim().toLowerCase()}, establish accountability frameworks, and drive organisational performance through strategic investment and capability development`,
  };

  const scaled = validKpis.map(k => levelTransformations[level](k));

  // Add level-appropriate supplementary KPIs
  if (level === 1) {
    scaled.push("Process adherence and documentation completeness: ≥ 98% compliance with SOPs and audit requirements");
  }
  if (level === 2) {
    scaled.push("Team development: completion of quarterly skill assessments and individual development plan milestones for all direct reports");
  }
  if (level >= 3) {
    scaled.push(`Drive continuous improvement and operational excellence across all ${fn.toLowerCase()} performance domains, with measurable year-on-year efficiency gains`);
  }
  if (level === 4) {
    scaled.push("Ensure alignment of functional KPIs with enterprise strategic objectives, regulatory requirements, and long-term shareholder value creation");
    scaled.push("Maintain enterprise risk exposure within board-approved risk appetite parameters");
  }
  return scaled;
}

// ─── Risk scaling — grade-specific consequences and domain ─────────────────
function scaleRisks(risks: string[], level: GradeLevel, fn: string): string[] {
  const validRisks = risks.filter(r => r.trim());

  if (validRisks.length === 0) {
    const defaults: Record<GradeLevel, string[]> = {
      1: [
        "Data entry errors or processing inaccuracies leading to rework, delayed deliverables, and potential downstream compliance issues",
        "Failure to follow established SOPs resulting in control exceptions and audit findings",
        "Missed deadlines on time-sensitive tasks impacting team SLAs and client service levels",
      ],
      2: [
        "Process breakdown or quality failures within the team leading to SLA breaches and client impact",
        "Team underperformance due to inadequate coaching, unclear priorities, or poor workload management",
        "Failure to escalate operational exceptions in a timely manner, resulting in compounded risk exposure",
        "Erosion of team morale and capability due to insufficient development investment or poor leadership practices",
      ],
      3: [
        "Missed functional targets resulting in revenue impact, cost overruns, or strategic initiative delays",
        "Capability gaps within the function leading to single points of failure and succession risk",
        "Regulatory compliance failures resulting in audit findings, remediation costs, and supervisory scrutiny",
        "Failure to anticipate market or technology shifts, leaving the function misaligned with enterprise needs",
      ],
      4: [
        "Regulatory sanctions from CBN, NDIC, SEC, or other supervisory bodies resulting in fines, licence restrictions, or reputational damage",
        "Strategic misalignment leading to erosion of competitive position, market share loss, or shareholder value destruction",
        "Enterprise-level operational failure or business continuity breach impacting customers, partners, and regulatory standing",
        "Reputational damage from governance failures, ethical lapses, or public incidents that undermine stakeholder trust",
        "Talent attrition at senior levels creating leadership vacuum and institutional knowledge loss",
      ],
    };
    return defaults[level];
  }

  const levelTransformations: Record<GradeLevel, (risk: string) => string> = {
    1: (risk) => `Operational execution risk: ${risk.trim().toLowerCase()} — at this level, manifesting as errors, rework, missed deadlines, and potential downstream quality or compliance impact within the immediate work scope`,
    2: (risk) => `Team-level operational risk: ${risk.trim().toLowerCase()} — at this level, manifesting as process breakdowns, team underperformance, SLA breaches, and failure to maintain quality standards across the team's delivery portfolio`,
    3: (risk) => `Functional risk: ${risk.trim().toLowerCase()} — at this level, manifesting as missed functional targets, regulatory findings, capability gaps, and failure to deliver on strategic commitments with potential cross-organisational impact`,
    4: (risk) => `Enterprise strategic risk: ${risk.trim().toLowerCase()} — at this level, manifesting as regulatory sanctions, reputational damage, shareholder value erosion, and potential systemic impact on the organisation's licence to operate and competitive positioning`,
  };

  return validRisks.map(r => levelTransformations[level](r));
}

// ─── Function-specific competency generation with depth ────────────────────
function generateCompetencies(input: JobAnalysisInput): CompetencyRow[] {
  const fn = input.functionName.toLowerCase() || "the function";
  const tools = input.tools || "";
  const guides = input.workGuides || "";
  const fintechCtx = getFintechContext(input.functionName);

  const funcTemplates: Record<GradeLevel, (name: string) => string> = {
    1: (n) => `Demonstrates foundational proficiency in ${n}, applying this skill to complete routine, defined tasks with accuracy and consistency under structured guidance. ${tools ? `Utilises ${tools.split(",").slice(0, 2).map(t => t.trim()).join(" and ")} effectively for standard operational activities.` : "Applies established tools and methodologies competently."} Follows documented procedures and quality standards. Seeks feedback proactively and demonstrates a trajectory of growing independence and technical depth. Able to identify when situations fall outside standard parameters and escalates appropriately.`,

    2: (n) => `Applies ${n} independently to solve complex, non-routine problems and coaches team members in its correct application. Conducts quality reviews on team outputs related to this competency, identifies recurring skill gaps, and implements targeted coaching interventions. ${tools ? `Demonstrates advanced proficiency in ${tools.split(",").slice(0, 2).map(t => t.trim()).join(" and ")}, serving as a technical reference for the team.` : "Serves as the team's technical reference point."} Contributes to process improvement by identifying inefficiencies and proposing evidence-based enhancements. Ensures consistent application of this skill across all team deliverables in the context of ${fintechCtx}.`,

    3: (n) => `Strategically deploys ${n} to optimise functional performance, build organisational capability, and drive innovation. Designs methodologies, frameworks, and quality benchmarks for this competency across the ${input.functionName} function. ${guides ? `Ensures alignment with ${guides.split(",").slice(0, 2).map(g => g.trim()).join(" and ")} and evolving industry standards.` : "Ensures alignment with industry best practices and regulatory requirements."} Identifies capability gaps and builds development programmes to address them. Evaluates emerging tools, technologies, and approaches that could enhance the function's application of this skill. Able to make strategic trade-offs and resource allocation decisions informed by deep expertise in this domain.`,

    4: (n) => `Sets the enterprise standard for ${n}, shaping organisational strategy, investment priorities, and capability architecture around this competency. Builds institutional excellence that creates sustainable competitive advantage in ${fintechCtx}. Influences industry standards and best practices through thought leadership, regulatory engagement, and strategic partnerships. Ensures this competency is embedded in hiring criteria, succession planning, performance management, and organisational design. Drives innovation by connecting this skill to emerging market opportunities, technology trends, and regulatory developments. The organisation's reputation in this domain reflects this leader's strategic vision and sustained investment.`,
  };

  const funcProficiency: Record<ProficiencyLevelKey, (name: string) => string> = {
    basic: (n) =>
      `Lists, recognises, and identifies core concepts for ${n}; shows basic familiarity with relevant knowledge areas. Applies ${n} to routine tasks with frequent guidance and escalates non-standard situations appropriately. ${tools ? `Uses ${tools.split(",").slice(0, 2).map(t => t.trim()).join(" and ")} for standard tasks under direction.` : ""}`,

    intermediate: (n) =>
      `Explains, defines, and describes ${n} clearly; translates it into practical application in normal business situations within ${fintechCtx}. Works with occasional guidance; may provide limited oversight to less experienced colleagues on standard applications of ${n}.`,

    advanced: (n) =>
      `Plans and applies ${n} at depth; evaluates others' work, and contributes to policies and processes governing ${n} in the function. Operates in difficult situations with little or no guidance; provides coaching and reinforces culture around ${n}. Has formal accountability for colleagues' correct application of ${n} where relevant.`,

    expert: (n) =>
      `Adapts, troubleshoots, originates, and innovates on ${n}; develops and implements leading practices and processes. Applies ${n} in exceptionally difficult situations. Champions organisation-wide adoption of ${n} through leadership, coaching, and thought leadership in ${fintechCtx}.`,
  };

  const behProficiency: Record<ProficiencyLevelKey, (name: string) => string> = {
    basic: (n) =>
      `Recognises and describes behaviours associated with ${n.toLowerCase()}; demonstrates basic familiarity and applies it with frequent guidance in day-to-day work.`,

    intermediate: (n) =>
      `Explains and describes ${n.toLowerCase()} in context; applies it consistently in normal business situations with occasional guidance. May coach less experienced peers on routine demonstrations of this competency.`,

    advanced: (n) =>
      `Plans development of ${n.toLowerCase()} in others; evaluates and reinforces this competency across difficult situations. Provides leadership and coaching; shapes team culture around ${n.toLowerCase()} and holds formal responsibility for how others demonstrate it.`,

    expert: (n) =>
      `Originates and innovates on how ${n.toLowerCase()} is embedded in leadership practices; champions it organisation-wide in the most challenging contexts. Drives adoption, coaching, and standards at enterprise level.`,
  };

  const behTemplates: Record<GradeLevel, (name: string) => string> = {
    1: (n) => `Demonstrates ${n.toLowerCase()} consistently in daily work, applying this competency with growing confidence and independence. Responds constructively to feedback, adapts approach based on guidance, and actively seeks opportunities to develop this behaviour. Recognised by peers as reliable and consistent in demonstrating this trait under normal operating conditions. Beginning to apply this competency in moderately challenging situations with appropriate support.`,

    2: (n) => `Models ${n.toLowerCase()} for the team, creating an environment where this behaviour is valued, recognised, and reinforced. Actively coaches team members in developing this competency, providing specific feedback and developmental opportunities. Demonstrates this behaviour consistently even under pressure, ambiguity, or operational stress. Addresses instances where this competency is not being demonstrated within the team and takes corrective action. Recognised as a role model for this behaviour within the immediate work group.`,

    3: (n) => `Embeds ${n.toLowerCase()} into the function's culture, talent development frameworks, and performance management systems. Sets explicit expectations for this competency across all levels of the function, measures progress, and holds leaders accountable for its demonstration. Champions this behaviour in cross-functional settings and organisational change initiatives. Uses this competency to navigate complex stakeholder dynamics, drive difficult decisions, and build organisational resilience. Recognised as an exemplar of this behaviour at the organisational level.`,

    4: (n) => `Champions ${n.toLowerCase()} as a defining characteristic of the organisation's culture and leadership brand. Shapes enterprise values, leadership development frameworks, and hiring standards around this competency. Demonstrates this behaviour at the highest level — in board interactions, regulatory engagements, crisis situations, and strategic decision-making. Ensures this competency is embedded in succession planning, executive assessment, and organisational development. The organisation's external reputation and internal culture reflect this leader's sustained commitment to this behaviour.`,
  };

  const rows: CompetencyRow[] = [];

  input.functionalSkills.filter(s => s.name.trim() && s.rating >= 2).forEach(s => {
    rows.push({
      skill: s.name,
      type: "functional",
      levels: {
        1: funcTemplates[1](s.name),
        2: funcTemplates[2](s.name),
        3: funcTemplates[3](s.name),
        4: funcTemplates[4](s.name),
      },
      proficiencyLevels: {
        basic: funcProficiency.basic(s.name),
        intermediate: funcProficiency.intermediate(s.name),
        advanced: funcProficiency.advanced(s.name),
        expert: funcProficiency.expert(s.name),
      },
    });
  });

  input.behavioralSkills.filter(s => s.rating >= 2).forEach(s => {
    rows.push({
      skill: s.name,
      type: "behavioral",
      levels: {
        1: behTemplates[1](s.name),
        2: behTemplates[2](s.name),
        3: behTemplates[3](s.name),
        4: behTemplates[4](s.name),
      },
      proficiencyLevels: {
        basic: behProficiency.basic(s.name),
        intermediate: behProficiency.intermediate(s.name),
        advanced: behProficiency.advanced(s.name),
        expert: behProficiency.expert(s.name),
      },
    });
  });

  return rows;
}

// ─── Executive summary — consultant-grade analytical briefing ──────────────
function generateExecutiveSummary(input: JobAnalysisInput): string {
  const fn = input.functionName || "the function";
  const title = input.jobTitle || "the role";
  const taskCount = input.tasks.filter(t => t.description).length;
  const skillCount = input.functionalSkills.filter(s => s.name.trim() && s.rating >= 2).length;
  const behCount = input.behavioralSkills.filter(s => s.rating >= 2).length;
  const kpiCount = input.kpis.filter(k => k.trim()).length;
  const riskCount = input.risks.filter(r => r.trim()).length;
  const fintechCtx = getFintechContext(fn);
  const anchorLabel = GRADE_LABELS[input.anchorGrade];

  return `This document presents a comprehensive Job Description Suite and Competency Framework for the ${fn} function, developed through systematic analysis of the ${anchorLabel}-level role (${title}) and cascaded across four organisational tiers — from Professional Staff through Executive Management.

The analysis is grounded in a structured assessment of ${taskCount} core responsibility areas, ${skillCount} functional competencies, ${behCount} behavioural competencies, and ${kpiCount} key performance indicators. Each job description has been independently calibrated to reflect the appropriate scope of autonomy, strategic accountability, technical depth, and leadership expectation for its respective grade level — ensuring that the output is not a simple scaling exercise but a genuine differentiation of role expectations across the organisational hierarchy.

${riskCount > 0 ? `The analysis identifies ${riskCount} critical risk domains, each contextualised to the appropriate level of organisational exposure — from operational execution risk at the Professional Staff level through to enterprise strategic risk and regulatory exposure at the Executive Management level.` : ""}

The Competency Framework provides a unified behavioural indicator matrix mapped to each job grade (Professional Staff through Executive Management), plus a parallel cascade across standard proficiency levels — Basic, Intermediate, Advanced, and Expert — so each skill can be assessed for depth of mastery as well as role tier. Together, these views support talent acquisition, performance management, succession planning, learning and development, and organisational design decisions.

The entire suite has been developed with reference to the Fintech and Financial Services operating context — incorporating relevant regulatory frameworks (CBN, NDIC, SEC), industry-specific terminology (${fintechCtx}), and professional standards applicable to the ${fn} function. The deliverable is intended for use by HR Business Partners, Talent Acquisition teams, Line Managers, and Organisational Design practitioners as a reference-grade resource for role definition and workforce planning.`;
}

// ─── Main cascade function ─────────────────────────────────────────────────
export function generateCascade(input: JobAnalysisInput): CascadeOutput {
  const levels: GradeLevel[] = [1, 2, 3, 4];
  const relevantCerts = inferCertifications(input);

  const jds: GeneratedJD[] = levels.map(level => {
    const exp = scaleExperience(input, level);
    // More certs for senior levels, fewer for junior
    const levelCerts = level === 1
      ? relevantCerts.slice(0, 2)
      : level === 2
        ? relevantCerts.slice(0, 4)
        : level === 3
          ? relevantCerts.slice(0, 6)
          : relevantCerts.slice(0, 8);

    return {
      level,
      levelLabel: GRADE_LABELS[level],
      rolePurpose: generateRolePurpose(input, level),
      responsibilities: generateResponsibilities(input, level),
      requirements: {
        education: EDUCATION_MAP[level],
        experience: exp.total,
        fintechExp: exp.fintech,
        certifications: levelCerts,
      },
      decisionMaking: AUTONOMY_MAP[level],
      kpis: scaleKPIs(input.kpis, level, input.functionName),
      risks: scaleRisks(input.risks, level, input.functionName),
    };
  });

  const competencyFramework = generateCompetencies(input);

  return {
    jds,
    competencyFramework,
    executiveSummary: generateExecutiveSummary(input),
    functionName: input.functionName,
    jobTitle: input.jobTitle,
  };
}

const PROF_KEYS: ProficiencyLevelKey[] = ["basic", "intermediate", "advanced", "expert"];

/** Backfills proficiency cascade from the local engine when AI output omits or blanks any tier. */
export function mergeCompetencyProficiencyLevels(output: CascadeOutput, input: JobAnalysisInput): CascadeOutput {
  const localRows = generateCascade(input).competencyFramework;
  const byKey = new Map(localRows.map(r => [`${r.type}|${r.skill.trim().toLowerCase()}`, r]));

  const merged = output.competencyFramework.map(row => {
    const key = `${row.type}|${row.skill.trim().toLowerCase()}`;
    const local = byKey.get(key);
    if (!local) return row;

    const pl = row.proficiencyLevels;
    const missing = !pl || PROF_KEYS.some(k => !pl[k]?.trim());
    if (!missing) return row;

    return {
      ...row,
      proficiencyLevels: {
        basic: pl?.basic?.trim() || local.proficiencyLevels.basic,
        intermediate: pl?.intermediate?.trim() || local.proficiencyLevels.intermediate,
        advanced: pl?.advanced?.trim() || local.proficiencyLevels.advanced,
        expert: pl?.expert?.trim() || local.proficiencyLevels.expert,
      },
    };
  });

  return { ...output, competencyFramework: merged };
}
