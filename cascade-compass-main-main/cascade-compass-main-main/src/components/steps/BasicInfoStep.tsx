import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps, type GradeLevel, GRADE_LABELS, GRADE_FOCUS } from "@/types/jobAnalysis";

const BasicInfoStep = ({ data, update }: StepProps) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Identify the role and its position in the hierarchy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Function Name *</Label>
            <Input placeholder="e.g., Engineering, Risk, Growth" value={data.functionName} onChange={e => update("functionName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Anchor Grade Level *</Label>
            <Select value={String(data.anchorGrade)} onValueChange={v => update("anchorGrade", Number(v) as GradeLevel)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {([1, 2, 3, 4] as GradeLevel[]).map(g => (
                  <SelectItem key={g} value={String(g)}>{`Level ${g}: ${GRADE_LABELS[g]}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{GRADE_FOCUS[data.anchorGrade]}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input placeholder="Analyst name" value={data.yourName} onChange={e => update("yourName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Job Title *</Label>
            <Input placeholder="e.g., Senior Risk Analyst" value={data.jobTitle} onChange={e => update("jobTitle", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Direct Report Job Title</Label>
            <Input placeholder="e.g., Head of Risk" value={data.directReportTitle} onChange={e => update("directReportTitle", e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Role Overview</CardTitle>
        <CardDescription>Define the core purpose and match for this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Best Match for This Job (Q4)</Label>
          <Textarea placeholder="Pick or describe the best match for this job. This guides what to rate." value={data.jobMatch} onChange={e => update("jobMatch", e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label>Main Job Goal (1-2 sentences) *</Label>
          <Textarea placeholder="What does this role do every day?" value={data.mainJobGoal} onChange={e => update("mainJobGoal", e.target.value)} rows={3} />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default BasicInfoStep;
