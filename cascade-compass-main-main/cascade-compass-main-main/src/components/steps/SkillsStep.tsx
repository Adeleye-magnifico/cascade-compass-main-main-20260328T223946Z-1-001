import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps } from "@/types/jobAnalysis";
import RatingInput from "@/components/RatingInput";

const SkillsStep = ({ data, update }: StepProps) => {
  const updateFunctional = (index: number, field: "name" | "rating", value: string | number) => {
    const skills = [...data.functionalSkills];
    skills[index] = { ...skills[index], [field]: value };
    update("functionalSkills", skills);
  };

  const updateBehavioral = (index: number, rating: number) => {
    const skills = [...data.behavioralSkills];
    skills[index] = { ...skills[index], rating };
    update("behavioralSkills", skills);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Functional Skills (Job Skills)</CardTitle>
          <CardDescription>Enter up to 7 key skills for this role and rate their importance (1-5). All fields are optional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {data.functionalSkills.map((skill, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-muted-foreground w-5 flex-shrink-0">{i + 1}.</span>
                <Input
                  placeholder={`Skill name (e.g., Data Analysis, Payments Systems...)`}
                  value={skill.name}
                  onChange={e => updateFunctional(i, "name", e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="sm:ml-auto">
                <RatingInput value={skill.rating} onChange={v => updateFunctional(i, "rating", v)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavioral Skills & Personal Traits</CardTitle>
          <CardDescription>Soft skills that make them great at the job (1-5)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.behavioralSkills.map((skill, i) => (
            <RatingInput key={i} label={skill.name} value={skill.rating} onChange={v => updateBehavioral(i, v)} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why Are These Soft Skills Important?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Explain why the selected behavioral skills are critical for this role..."
            value={data.softSkillsImportance}
            onChange={e => update("softSkillsImportance", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsStep;
