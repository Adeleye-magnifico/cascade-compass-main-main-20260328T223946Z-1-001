import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps } from "@/types/jobAnalysis";

const DECISION_TYPES = [
  { key: "operational" as const, label: "Operational (daily tasks)" },
  { key: "tactical" as const, label: "Tactical (process improvements)" },
  { key: "strategic" as const, label: "Strategic (budget input)" },
  { key: "financial" as const, label: "Financial (approvals)" },
  { key: "peopleRelated" as const, label: "People-Related (team assignments)" },
];

const AutonomyStep = ({ data, update }: StepProps) => {
  const toggleDecision = (key: keyof typeof data.decisionTypes, value: boolean) => {
    update("decisionTypes", { ...data.decisionTypes, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Level of Autonomy</CardTitle>
          <CardDescription>Describe the level of autonomy in this role</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Independent decisions on routine transactions up to NGN 1M; escalates high-risk cases."
            value={data.autonomyLevel}
            onChange={e => update("autonomyLevel", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Types of Decisions Made</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DECISION_TYPES.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <Checkbox
                checked={data.decisionTypes[key] as boolean}
                onCheckedChange={v => toggleDecision(key, v === true)}
              />
              <Label className="text-sm cursor-pointer">{label}</Label>
            </div>
          ))}
          <div className="space-y-2 pt-2">
            <Label className="text-sm text-muted-foreground">Other decisions</Label>
            <Input
              placeholder="Any other decision types..."
              value={data.decisionTypes.other}
              onChange={e => update("decisionTypes", { ...data.decisionTypes, other: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team & Stakeholders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Direct Reports (Number and Roles)</Label>
            <Input
              placeholder="e.g., 3 — 2 Analysts, 1 Associate"
              value={data.directReports}
              onChange={e => update("directReports", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Key Internal/External Stakeholders</Label>
            <Textarea
              placeholder="e.g., CFO, CBN, Compliance team, Payment partners..."
              value={data.stakeholders}
              onChange={e => update("stakeholders", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutonomyStep;
