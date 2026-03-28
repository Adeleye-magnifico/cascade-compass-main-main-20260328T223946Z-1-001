import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps } from "@/types/jobAnalysis";

const ToolsStep = ({ data, update }: StepProps) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Tools & Systems</CardTitle>
        <CardDescription>Tools they use daily</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., Core banking software, Google Workspace, Jira, Salesforce, Interswitch..."
          value={data.tools}
          onChange={e => update("tools", e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Work Guides & References</CardTitle>
        <CardDescription>List the work guides and references this role refers to in performing duties</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="e.g., CBN guidelines, ISO 27001, Internal SOPs, Risk policy manuals..."
          value={data.workGuides}
          onChange={e => update("workGuides", e.target.value)}
          rows={4}
        />
      </CardContent>
    </Card>
  </div>
);

export default ToolsStep;
