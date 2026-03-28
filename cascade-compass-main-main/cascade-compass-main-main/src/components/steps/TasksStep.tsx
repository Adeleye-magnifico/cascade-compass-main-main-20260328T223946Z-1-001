import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps } from "@/types/jobAnalysis";

const TasksStep = ({ data, update }: StepProps) => {
  const updateTask = (index: number, field: "description" | "percentTime", value: string | number) => {
    const tasks = [...data.tasks];
    tasks[index] = { ...tasks[index], [field]: value };
    update("tasks", tasks);
  };

  const totalPercent = data.tasks.reduce((sum, t) => sum + (t.percentTime || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Key Tasks</CardTitle>
        <CardDescription>
          List the main tasks with percentage of time spent.
          <span className={totalPercent !== 100 && totalPercent > 0 ? " text-destructive font-medium" : " text-accent font-medium"}>
            {" "}Total: {totalPercent}%{totalPercent !== 100 && totalPercent > 0 ? " (should equal 100%)" : ""}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.tasks.map((task, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex-shrink-0 mt-1">
              {i + 1}
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Task {i + 1}</Label>
              <Input
                placeholder={`e.g., Compliance Checks, System Monitoring...`}
                value={task.description}
                onChange={e => updateTask(i, "description", e.target.value)}
              />
            </div>
            <div className="w-24 space-y-1">
              <Label className="text-xs text-muted-foreground">% Time</Label>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="%"
                value={task.percentTime || ""}
                onChange={e => updateTask(i, "percentTime", Number(e.target.value))}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TasksStep;
