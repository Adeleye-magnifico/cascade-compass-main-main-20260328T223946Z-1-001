import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, RotateCcw, BarChart3, Shield, Target, Users, Briefcase, ClipboardList } from "lucide-react";
import {
  type CascadeOutput,
  type GeneratedJD,
  type CompetencyRow,
  GRADE_LABELS,
  type GradeLevel,
  PROFICIENCY_ORDER,
  PROFICIENCY_LABELS,
  PROFICIENCY_RUBRIC,
  type ProficiencyLevelKey,
} from "@/types/jobAnalysis";
import TemplateJDReport from "@/components/TemplateJDReport";

interface CascadeResultsProps {
  output: CascadeOutput;
  functionName: string;
  onReset: () => void;
}

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h4 className="font-semibold text-sm text-foreground tracking-wide uppercase">{title}</h4>
  </div>
);

const JDCard = ({ jd }: { jd: GeneratedJD }) => (
  <Card className="border-l-4 border-l-primary/60">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">Grade Level {jd.level}</Badge>
          <CardTitle className="text-xl font-display">{jd.levelLabel}</CardTitle>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-8">
      {/* Role Purpose */}
      <div>
        <SectionHeader icon={Target} title="Role Purpose" />
        <p className="text-sm text-muted-foreground leading-relaxed pl-9">{jd.rolePurpose}</p>
      </div>

      <Separator />

      {/* Key Responsibilities */}
      <div>
        <SectionHeader icon={Briefcase} title="Key Responsibilities & Time Allocation" />
        <div className="space-y-3 pl-9">
          {jd.responsibilities.map((r, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm text-foreground">{r.area}</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${r.percentage}%` }} />
                  </div>
                  <span className="text-xs font-bold text-primary min-w-[32px] text-right">{r.percentage}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Requirements */}
      <div>
        <SectionHeader icon={Users} title="Minimum Requirements" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-9">
          <div className="p-4 rounded-lg border border-border bg-card">
            <h5 className="font-semibold text-xs text-accent uppercase tracking-wide mb-1">Education</h5>
            <p className="text-sm text-foreground">{jd.requirements.education}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <h5 className="font-semibold text-xs text-accent uppercase tracking-wide mb-1">Total Experience</h5>
            <p className="text-sm text-foreground">{jd.requirements.experience}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card">
            <h5 className="font-semibold text-xs text-accent uppercase tracking-wide mb-1">Fintech Experience</h5>
            <p className="text-sm text-foreground">{jd.requirements.fintechExp}</p>
          </div>
        </div>

        {jd.requirements.certifications.length > 0 && (
          <div className="pl-9 mt-3">
            <h5 className="font-semibold text-xs text-accent uppercase tracking-wide mb-2">Professional Certifications</h5>
            <div className="flex flex-wrap gap-2">
              {jd.requirements.certifications.map((c, i) => (
                <Badge key={i} variant="outline" className="text-xs font-medium">{c}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Decision-Making */}
      <div>
        <SectionHeader icon={Shield} title="Decision-Making Authority & Autonomy" />
        <p className="text-sm text-muted-foreground leading-relaxed pl-9">{jd.decisionMaking}</p>
      </div>

      <Separator />

      {/* KPIs */}
      <div>
        <SectionHeader icon={BarChart3} title="Key Performance Indicators" />
        <ul className="space-y-2 pl-9">
          {jd.kpis.map((kpi, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              {kpi}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      {jd.risks && jd.risks.length > 0 && (
        <>
          <Separator />
          <div>
            <SectionHeader icon={Shield} title="Key Risk Domains" />
            <ul className="space-y-2 pl-9">
              {jd.risks.map((risk, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const CompetencyTable = ({ rows }: { rows: CompetencyRow[] }) => {
  const levels: GradeLevel[] = [1, 2, 3, 4];
  const functional = rows.filter(r => r.type === "functional");
  const behavioral = rows.filter(r => r.type === "behavioral");

  const renderSection = (title: string, items: CompetencyRow[]) => (
    <>
      <TableRow>
        <TableCell colSpan={5} className="bg-primary/5 font-semibold text-primary text-sm uppercase tracking-wide">{title}</TableCell>
      </TableRow>
      {items.map((row, i) => (
        <TableRow key={i}>
          <TableCell className="font-medium text-sm min-w-[140px] align-top">{row.skill}</TableCell>
          {levels.map(l => (
            <TableCell key={l} className="text-xs text-muted-foreground leading-relaxed align-top">{row.levels[l]}</TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">Job-grade competency matrix</CardTitle>
        <p className="text-sm text-muted-foreground">
          Behavioural indicators mapped to organisational job grades (Professional Staff through Executive Management). This is distinct from the proficiency-depth cascade below (Basic through Expert).
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px] font-semibold">Competency</TableHead>
                {levels.map(l => (
                  <TableHead key={l} className="min-w-[220px] font-semibold">
                    <div className="flex flex-col">
                      <span>Grade level {l}</span>
                      <span className="text-xs font-normal text-muted-foreground">{GRADE_LABELS[l]}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {functional.length > 0 && renderSection("Functional competencies", functional)}
              {behavioral.length > 0 && renderSection("Behavioural competencies", behavioral)}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No competencies rated ≥ 2. Please go back and rate skills higher to include them.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const ProficiencyRubricCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="font-display text-xl">Proficiency level definitions</CardTitle>
      <p className="text-sm text-muted-foreground">
        Standard organisational rubric for assessing depth of mastery on any competency. Descriptors in the cascade table are written to align with these tiers.
      </p>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary border-0">
              <TableHead className="min-w-[140px] text-primary-foreground font-semibold rounded-tl-md">Proficiency level</TableHead>
              <TableHead className="min-w-[320px] text-primary-foreground font-semibold rounded-tr-md">Proficiency description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROFICIENCY_ORDER.map(key => (
              <TableRow key={key}>
                <TableCell className="font-medium text-sm align-top">{PROFICIENCY_LABELS[key]}</TableCell>
                <TableCell className="text-sm text-muted-foreground align-top">
                  <ul className="list-disc pl-4 space-y-1.5">
                    {PROFICIENCY_RUBRIC[key].bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);

const cellForProficiency = (row: CompetencyRow, key: ProficiencyLevelKey) =>
  row.proficiencyLevels?.[key]?.trim() || "—";

const ProficiencyCascadeTable = ({ rows }: { rows: CompetencyRow[] }) => {
  const functional = rows.filter(r => r.type === "functional");
  const behavioral = rows.filter(r => r.type === "behavioral");

  const renderSection = (title: string, items: CompetencyRow[]) => (
    <>
      <TableRow>
        <TableCell
          colSpan={1 + PROFICIENCY_ORDER.length}
          className="bg-primary/5 font-semibold text-primary text-sm uppercase tracking-wide"
        >
          {title}
        </TableCell>
      </TableRow>
      {items.map((row, i) => (
        <TableRow key={i}>
          <TableCell className="font-medium text-sm min-w-[140px] align-top">{row.skill}</TableCell>
          {PROFICIENCY_ORDER.map(k => (
            <TableCell key={k} className="text-xs text-muted-foreground leading-relaxed align-top min-w-[200px]">
              {cellForProficiency(row, k)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">Competency cascade by proficiency depth</CardTitle>
        <p className="text-sm text-muted-foreground">
          Each functional and behavioural competency is expressed across Basic, Intermediate, Advanced, and Expert — from recall and guided application through to organisation-wide leadership and innovation.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px] font-semibold">Competency</TableHead>
                {PROFICIENCY_ORDER.map(k => (
                  <TableHead key={k} className="min-w-[200px] font-semibold">
                    <div className="flex flex-col">
                      <span>{PROFICIENCY_LABELS[k]}</span>
                      <span className="text-xs font-normal text-muted-foreground">Proficiency depth</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {functional.length > 0 && renderSection("Functional competencies", functional)}
              {behavioral.length > 0 && renderSection("Behavioural competencies", behavioral)}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No competencies rated ≥ 2. Please go back and rate skills higher to include them.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const CascadeResults = ({ output, functionName, onReset }: CascadeResultsProps) => {
  const handleExport = () => {
    const text = generateExportText(output, functionName);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${functionName || "Job"}_Cascade_Report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">Job Analysis Cascade Report</p>
            <h2 className="font-display text-3xl font-bold text-foreground">{functionName} Function</h2>
            {output.jobTitle && <p className="text-sm text-muted-foreground mt-1">Anchor Role: {output.jobTitle}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> New Analysis
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" /> Export Report
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-primary mb-3">Executive Summary</h3>
            <p className="text-sm text-foreground leading-relaxed">{output.executiveSummary}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jds">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="jds" className="gap-1"><FileText className="h-4 w-4" /> Job Description Suite</TabsTrigger>
          <TabsTrigger value="competency" className="gap-1"><BarChart3 className="h-4 w-4" /> Competency Framework</TabsTrigger>
          {(output.templateJDs || output.templateJD) && (
            <TabsTrigger value="templatejd" className="gap-1"><ClipboardList className="h-4 w-4" /> Formal JD Documents</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="jds" className="space-y-8 mt-6">
          {output.jds.map(jd => (
            <JDCard key={jd.level} jd={jd} />
          ))}
        </TabsContent>

        <TabsContent value="competency" className="mt-6 space-y-8">
          <CompetencyTable rows={output.competencyFramework} />
          <ProficiencyRubricCard />
          <ProficiencyCascadeTable rows={output.competencyFramework} />
        </TabsContent>

        {(output.templateJDs || output.templateJD) && (
          <TabsContent value="templatejd" className="mt-6">
            <TemplateJDReport templateJDs={output.templateJDs || (output.templateJD ? [output.templateJD] : [])} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

function generateExportText(output: CascadeOutput, functionName: string): string {
  let text = `${"═".repeat(70)}\n`;
  text += `  JOB ANALYSIS CASCADE REPORT\n`;
  text += `  ${functionName} Function${output.jobTitle ? ` — Anchor: ${output.jobTitle}` : ""}\n`;
  text += `${"═".repeat(70)}\n\n`;

  text += `EXECUTIVE SUMMARY\n${"─".repeat(50)}\n${output.executiveSummary}\n\n`;

  text += `\n${"═".repeat(70)}\n  PART A: JOB DESCRIPTION SUITE\n${"═".repeat(70)}\n\n`;

  output.jds.forEach(jd => {
    text += `${"━".repeat(50)}\n  GRADE LEVEL ${jd.level}: ${jd.levelLabel.toUpperCase()}\n${"━".repeat(50)}\n\n`;

    text += `ROLE PURPOSE\n${jd.rolePurpose}\n\n`;

    text += `KEY RESPONSIBILITIES & TIME ALLOCATION\n`;
    jd.responsibilities.forEach(r => {
      text += `  ▸ ${r.area} (${r.percentage}%)\n    ${r.description}\n\n`;
    });

    text += `MINIMUM REQUIREMENTS\n`;
    text += `  Education:        ${jd.requirements.education}\n`;
    text += `  Total Experience: ${jd.requirements.experience}\n`;
    text += `  Fintech:          ${jd.requirements.fintechExp}\n`;
    if (jd.requirements.certifications.length) {
      text += `  Certifications:   ${jd.requirements.certifications.join(", ")}\n`;
    }

    text += `\nDECISION-MAKING AUTHORITY & AUTONOMY\n${jd.decisionMaking}\n\n`;

    text += `KEY PERFORMANCE INDICATORS\n`;
    jd.kpis.forEach((k, i) => { text += `  ${i + 1}. ${k}\n`; });

    if (jd.risks && jd.risks.length > 0) {
      text += `\nKEY RISK DOMAINS\n`;
      jd.risks.forEach((r, i) => { text += `  ${i + 1}. ${r}\n`; });
    }
    text += "\n\n";
  });

  text += `\n${"═".repeat(70)}\n  PART B: COMPETENCY FRAMEWORK\n${"═".repeat(70)}\n\n`;
  text += `B1 — JOB GRADE MATRIX (Professional Staff → Executive Management)\n${"─".repeat(50)}\n`;
  output.competencyFramework.forEach(row => {
    text += `${row.skill.toUpperCase()} (${row.type === "functional" ? "Functional" : "Behavioural"})\n`;
    ([1, 2, 3, 4] as const).forEach(l => {
      text += `  Grade ${l} (${GRADE_LABELS[l]}): ${row.levels[l]}\n`;
    });
    text += "\n";
  });

  text += `\nB2 — PROFICIENCY LEVEL DEFINITIONS (BASELINE)\n${"─".repeat(50)}\n`;
  PROFICIENCY_ORDER.forEach(k => {
    text += `${PROFICIENCY_LABELS[k].toUpperCase()}\n`;
    PROFICIENCY_RUBRIC[k].bullets.forEach(b => {
      text += `  • ${b}\n`;
    });
    text += "\n";
  });

  text += `B3 — COMPETENCY CASCADE BY PROFICIENCY DEPTH (BASIC → EXPERT)\n${"─".repeat(50)}\n`;
  output.competencyFramework.forEach(row => {
    text += `${row.skill.toUpperCase()} (${row.type === "functional" ? "Functional" : "Behavioural"})\n`;
    PROFICIENCY_ORDER.forEach(k => {
      const desc = row.proficiencyLevels?.[k]?.trim() || "—";
      text += `  ${PROFICIENCY_LABELS[k]}: ${desc}\n`;
    });
    text += "\n";
  });

  const allTemplateJDs = output.templateJDs || (output.templateJD ? [output.templateJD] : []);
  if (allTemplateJDs.length > 0) {
    text += `\n${"═".repeat(70)}\n  PART C: FORMAL JOB DESCRIPTION DOCUMENTS\n${"═".repeat(70)}\n\n`;
    allTemplateJDs.forEach((t) => {
      text += `${"━".repeat(50)}\n`;
      if (t.level) text += `  GRADE LEVEL ${t.level}: ${t.levelLabel || ""}\n`;
      text += `  POSITION: ${t.position}\n  DEPARTMENT: ${t.department}\n${"━".repeat(50)}\n\n`;
      text += `JOB SUMMARY\n${"─".repeat(50)}\n${t.jobSummary}\n\n`;
      text += `REPORTING RELATIONSHIP\n${"─".repeat(50)}\n${t.reportingRelationship}\n\n`;
      text += `KEY RESULT AREAS\n${"─".repeat(50)}\n`;
      t.keyResultAreas.forEach((kra, i) => {
        text += `${i + 1}. ${kra.title}\n`;
        kra.bullets.forEach(b => { text += `   • ${b}\n`; });
        text += "\n";
      });
      text += `KEY PERFORMANCE INDICATORS\n${"─".repeat(50)}\n`;
      t.kpis.forEach((k, i) => { text += `${i + 1}. ${k}\n`; });
      text += `\nCRITICAL COMPETENCIES\n${"─".repeat(50)}\n`;
      t.criticalCompetencies.forEach((c, i) => {
        text += `${i + 1}. ${c.name} — ${c.proficiencyLevel} (${c.priority})\n`;
      });
      text += `\nQUALIFICATION AND EXPERIENCE\n${"─".repeat(50)}\n`;
      t.qualificationAndExperience.forEach(q => { text += `• ${q}\n`; });
      text += `\nWORK ENVIRONMENT: ${t.workEnvironment}\n`;
      text += `POSITION TYPE: ${t.positionType}\n`;
      text += `TRAVEL: ${t.travel}\n\n`;
    });
  }

  text += `\n${"═".repeat(70)}\n  END OF REPORT\n${"═".repeat(70)}\n`;
  return text;
}

export default CascadeResults;
