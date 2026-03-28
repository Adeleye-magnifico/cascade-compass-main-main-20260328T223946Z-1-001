export type GradeLevel = 1 | 2 | 3 | 4;

/** Organisational proficiency tiers (distinct from grade / job level). */
export type ProficiencyLevelKey = "basic" | "intermediate" | "advanced" | "expert";

export const PROFICIENCY_ORDER: ProficiencyLevelKey[] = ["basic", "intermediate", "advanced", "expert"];

export const PROFICIENCY_LABELS: Record<ProficiencyLevelKey, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

/** Standard proficiency rubric for cascading competencies (organisational design baseline). */
export const PROFICIENCY_RUBRIC: Record<
  ProficiencyLevelKey,
  { title: string; bullets: string[] }
> = {
  basic: {
    title: "Basic",
    bullets: [
      "Able to list, recall, recognise, and identify key concepts for a competency.",
      "Exhibits basic familiarity with concepts and areas of knowledge for a competency.",
      "Able to apply the competency with frequent guidance.",
    ],
  },
  intermediate: {
    title: "Intermediate",
    bullets: [
      "Able to explain how, define, and describe the competency.",
      "Able to translate the competency into practical application.",
      "Applies the competency under normal business situations.",
      "Requires occasional guidance.",
      "May have limited formal responsibility for providing oversight to less experienced team members in applying the competency.",
    ],
  },
  advanced: {
    title: "Advanced",
    bullets: [
      "Demonstrates proven ability to plan, apply, evaluate others, and create policies and processes around the use of a competency.",
      "Applies the competency in difficult situations.",
      "Generally requires little or no guidance.",
      "Provides leadership, coaching, and builds the culture around this competency for the function or department.",
      "Has formal responsibility for colleagues and their actions with regard to the competency.",
    ],
  },
  expert: {
    title: "Expert",
    bullets: [
      "Demonstrates proven ability to adapt, troubleshoot, originate, innovate, develop, and implement leading practices and processes on a competency.",
      "Applies the competency in considerably or exceptionally difficult situations.",
      "Provides leadership, coaching, and champions adoption of the competency organisation-wide.",
    ],
  },
};

export const GRADE_LABELS: Record<GradeLevel, string> = {
  1: "Professional Staff",
  2: "Supervisory",
  3: "Management",
  4: "Executive Management",
};

export const GRADE_FOCUS: Record<GradeLevel, string> = {
  1: "Delivers high-quality work through specialist expertise, collaboration, and consistent execution",
  2: "Drives team performance through technical leadership, coordination, coaching, and quality delivery of work",
  3: "Translates strategy into business results by leading functions, delivering outcomes, and building organisational capability",
  4: "Sets enterprise direction, owns long-term strategy and culture, and is accountable for organisational performance and sustainability",
};

export interface TaskItem {
  description: string;
  percentTime: number;
}

export interface RatedItem {
  name: string;
  rating: number;
}

export interface DecisionTypes {
  operational: boolean;
  tactical: boolean;
  strategic: boolean;
  financial: boolean;
  peopleRelated: boolean;
  other: string;
}

export interface ExperienceRange {
  from: string;
  to: string;
}

export interface JobAnalysisInput {
  functionName: string;
  anchorGrade: GradeLevel;
  yourName: string;
  jobTitle: string;
  directReportTitle: string;
  jobMatch: string;
  mainJobGoal: string;
  tasks: TaskItem[];
  education: string;
  fieldOfStudy: string;
  yearsExperience: ExperienceRange;
  fintechExperience: ExperienceRange;
  technicalQuals: string;
  requirementRatings: {
    education: number;
    fieldOfStudy: number;
    yearsExperience: number;
    fintechExperience: number;
    technicalQuals: number;
  };
  certifications: RatedItem[];
  customCertification: RatedItem;
  functionalSkills: RatedItem[];
  behavioralSkills: RatedItem[];
  softSkillsImportance: string;
  kpis: string[];
  risks: string[];
  tools: string;
  workGuides: string;
  autonomyLevel: string;
  decisionTypes: DecisionTypes;
  directReports: string;
  stakeholders: string;
}

export interface StepProps {
  data: JobAnalysisInput;
  update: <K extends keyof JobAnalysisInput>(field: K, value: JobAnalysisInput[K]) => void;
}

export interface GeneratedJD {
  level: GradeLevel;
  levelLabel: string;
  rolePurpose: string;
  responsibilities: Array<{ area: string; percentage: number; description: string }>;
  requirements: { education: string; experience: string; fintechExp: string; certifications: string[] };
  decisionMaking: string;
  kpis: string[];
  risks: string[];
}

export interface CompetencyRow {
  skill: string;
  type: "functional" | "behavioral";
  /** Behavioural indicators mapped to organisational job grades (tiers). */
  levels: Record<GradeLevel, string>;
  /** Same competency cascaded across standard proficiency levels (Basic → Expert). */
  proficiencyLevels?: Record<ProficiencyLevelKey, string>;
}

export interface TemplateCompetency {
  name: string;
  category: "functional" | "behavioral" | "personal" | "technical";
  proficiencyLevel: string;
  priority: string;
}

export interface TemplateJD {
  level?: number;
  levelLabel?: string;
  position: string;
  department: string;
  jobSummary: string;
  reportingRelationship: string;
  keyResultAreas: Array<{
    title: string;
    bullets: string[];
  }>;
  kpis: string[];
  benefits: string[];
  criticalCompetencies: TemplateCompetency[];
  qualificationAndExperience: string[];
  specialDuties: string;
  workEnvironment: string;
  physicalDemands: string;
  positionType: string;
  travel: string;
}

export interface CascadeOutput {
  jds: GeneratedJD[];
  competencyFramework: CompetencyRow[];
  executiveSummary: string;
  functionName: string;
  jobTitle: string;
  templateJDs?: TemplateJD[];
  templateJD?: TemplateJD; // legacy single-JD support
}

export const EXPERIENCE_OPTIONS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+", "15+", "20+"];

export const DEFAULT_FORM_DATA: JobAnalysisInput = {
  functionName: "",
  anchorGrade: 3 as GradeLevel,
  yourName: "",
  jobTitle: "",
  directReportTitle: "",
  jobMatch: "",
  mainJobGoal: "",
  tasks: Array.from({ length: 5 }, () => ({ description: "", percentTime: 0 })),
  education: "",
  fieldOfStudy: "",
  yearsExperience: { from: "", to: "" },
  fintechExperience: { from: "", to: "" },
  technicalQuals: "",
  requirementRatings: { education: 3, fieldOfStudy: 3, yearsExperience: 3, fintechExperience: 3, technicalQuals: 3 },
  certifications: [
    { name: "AWS/Google Cloud", rating: 1 },
    { name: "CISSP/CISA", rating: 1 },
    { name: "PMP/Agile", rating: 1 },
    { name: "CBN/NDIC", rating: 1 },
  ],
  customCertification: { name: "", rating: 1 },
  functionalSkills: Array.from({ length: 7 }, () => ({ name: "", rating: 1 })),
  behavioralSkills: [
    { name: "Problem-solving", rating: 1 },
    { name: "Teamwork", rating: 1 },
    { name: "Handles Stress Well", rating: 1 },
    { name: "Honest & Ethical", rating: 1 },
    { name: "Learns Fast", rating: 1 },
    { name: "Leads Others", rating: 1 },
  ],
  softSkillsImportance: "",
  kpis: ["", "", ""],
  risks: ["", "", "", "", ""],
  tools: "",
  workGuides: "",
  autonomyLevel: "",
  decisionTypes: { operational: false, tactical: false, strategic: false, financial: false, peopleRelated: false, other: "" },
  directReports: "",
  stakeholders: "",
};
