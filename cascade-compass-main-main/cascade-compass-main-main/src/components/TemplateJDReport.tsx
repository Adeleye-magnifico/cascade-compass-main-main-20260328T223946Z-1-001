import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type TemplateJD, GRADE_LABELS, type GradeLevel } from "@/types/jobAnalysis";
import { Briefcase, Users, Target, BarChart3, Award, GraduationCap, Building2, Clock, Plane } from "lucide-react";

interface TemplateJDReportProps {
  templateJDs: TemplateJD[];
}

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h4 className="font-semibold text-sm text-foreground tracking-wide uppercase">{title}</h4>
  </div>
);

const categoryLabel: Record<string, string> = {
  functional: "Functional Competencies",
  behavioral: "Behavioural Competencies",
  personal: "Personal Attributes",
  technical: "Technical Skills",
};

const SingleTemplateJD = ({ templateJD }: { templateJD: TemplateJD }) => {
  const groupedCompetencies = templateJD.criticalCompetencies.reduce((acc, comp) => {
    const cat = comp.category || "functional";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(comp);
    return acc;
  }, {} as Record<string, typeof templateJD.criticalCompetencies>);

  return (
    <Card className="border-l-4 border-l-accent/60">
      <CardHeader className="pb-4">
        <div>
          {templateJD.level && (
            <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              Grade Level {templateJD.level}
            </Badge>
          )}
          <Badge className="mb-2 ml-2 bg-accent/10 text-accent border-accent/20 hover:bg-accent/15">
            Structured Job Description
          </Badge>
          <CardTitle className="text-2xl font-display">{templateJD.position}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{templateJD.department}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div>
          <SectionHeader icon={Target} title="Job Summary" />
          <p className="text-sm text-muted-foreground leading-relaxed pl-9">{templateJD.jobSummary}</p>
        </div>
        <Separator />
        <div>
          <SectionHeader icon={Users} title="Reporting Relationship" />
          <p className="text-sm text-muted-foreground leading-relaxed pl-9">{templateJD.reportingRelationship}</p>
        </div>
        <Separator />
        <div>
          <SectionHeader icon={Briefcase} title="Key Result Areas" />
          <div className="space-y-4 pl-9">
            {templateJD.keyResultAreas.map((kra, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-sm text-foreground mb-2">{i + 1}. {kra.title}</p>
                <ul className="space-y-1.5">
                  {kra.bullets.map((bullet, j) => (
                    <li key={j} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>{bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <SectionHeader icon={BarChart3} title="Key Performance Indicators (KPIs)" />
          <ul className="space-y-2 pl-9">
            {templateJD.kpis.map((kpi, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {kpi}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        {templateJD.benefits.length > 0 && (
          <>
            <div>
              <SectionHeader icon={Award} title="Benefits" />
              <ul className="space-y-2 pl-9">
                {templateJD.benefits.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>{b}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}
        <div>
          <SectionHeader icon={Target} title="Critical Competencies" />
          <div className="overflow-x-auto pl-9">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">S/N</TableHead>
                  <TableHead className="font-semibold min-w-[200px]">Competency</TableHead>
                  <TableHead className="font-semibold">Proficiency Level</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedCompetencies).map(([category, comps]) => (
                  <>{/* Fragment wrapper */}
                    <TableRow key={`cat-${category}`}>
                      <TableCell colSpan={4} className="bg-primary/5 font-semibold text-primary text-sm uppercase tracking-wide">
                        {categoryLabel[category] || category}
                      </TableCell>
                    </TableRow>
                    {comps.map((comp, i) => (
                      <TableRow key={`${category}-${i}`}>
                        <TableCell className="text-sm text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="text-sm font-medium">{comp.name}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{comp.proficiencyLevel}</Badge></TableCell>
                        <TableCell>
                          <Badge className={
                            comp.priority.toLowerCase() === "high"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : comp.priority.toLowerCase() === "medium"
                              ? "bg-accent/10 text-accent border-accent/20"
                              : "bg-muted text-muted-foreground border-border"
                          }>{comp.priority}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Separator />
        <div>
          <SectionHeader icon={GraduationCap} title="Qualification and Experience" />
          <ul className="space-y-2 pl-9">
            {templateJD.qualificationAndExperience.map((q, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="text-primary mt-1">•</span>{q}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
          {templateJD.specialDuties && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <h5 className="font-semibold text-xs text-accent uppercase tracking-wide">Special & Other Duties</h5>
              </div>
              <p className="text-sm text-muted-foreground">{templateJD.specialDuties}</p>
            </div>
          )}
          {templateJD.workEnvironment && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-accent" />
                <h5 className="font-semibold text-xs text-accent uppercase tracking-wide">Work Environment</h5>
              </div>
              <p className="text-sm text-muted-foreground">{templateJD.workEnvironment}</p>
            </div>
          )}
          {templateJD.positionType && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <h5 className="font-semibold text-xs text-accent uppercase tracking-wide">Position Type / Hours</h5>
              </div>
              <p className="text-sm text-muted-foreground">{templateJD.positionType}</p>
            </div>
          )}
          {templateJD.travel && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-4 w-4 text-accent" />
                <h5 className="font-semibold text-xs text-accent uppercase tracking-wide">Travel</h5>
              </div>
              <p className="text-sm text-muted-foreground">{templateJD.travel}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TemplateJDReport = ({ templateJDs }: TemplateJDReportProps) => {
  if (templateJDs.length === 1) {
    return <SingleTemplateJD templateJD={templateJDs[0]} />;
  }

  return (
    <Tabs defaultValue={String(templateJDs[0]?.level || 1)}>
      <TabsList className="w-full justify-start mb-4">
        {templateJDs.map(t => (
          <TabsTrigger key={t.level} value={String(t.level)}>
            Level {t.level}: {t.levelLabel || GRADE_LABELS[t.level as GradeLevel] || ""}
          </TabsTrigger>
        ))}
      </TabsList>
      {templateJDs.map(t => (
        <TabsContent key={t.level} value={String(t.level)}>
          <SingleTemplateJD templateJD={t} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TemplateJDReport;
