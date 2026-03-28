import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps } from "@/types/jobAnalysis";

const KPIsStep = ({ data, update }: StepProps) => {
  const updateKPI = (index: number, value: string) => {
    const kpis = [...data.kpis];
    kpis[index] = value;
    update("kpis", kpis);
  };

  const updateRisk = (index: number, value: string) => {
    const risks = [...data.risks];
    risks[index] = value;
    update("risks", risks);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>How we measure success for this role (3 KPIs)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.kpis.map((kpi, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <Input
                placeholder={`e.g., 95% uptime, <2hr resolution time...`}
                value={kpi}
                onChange={e => updateKPI(i, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Risks</CardTitle>
          <CardDescription>5 significant risks if this role underperforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.risks.map((risk, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10 text-destructive font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <Input
                placeholder={`Risk ${i + 1} — e.g., Regulatory fines, Data breach...`}
                value={risk}
                onChange={e => updateRisk(i, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIsStep;
