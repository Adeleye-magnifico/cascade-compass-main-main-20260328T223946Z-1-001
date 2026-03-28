import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

const StepIndicator = ({ steps, current }: StepIndicatorProps) => (
  <div className="flex items-center gap-1 overflow-x-auto pb-2">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center gap-1 flex-shrink-0">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          i === current && "bg-primary text-primary-foreground",
          i < current && "bg-accent text-accent-foreground",
          i > current && "bg-secondary text-muted-foreground"
        )}>
          <span className="font-bold">{i + 1}</span>
          <span className="hidden sm:inline">{label}</span>
        </div>
        {i < steps.length - 1 && <div className="w-4 h-px bg-border" />}
      </div>
    ))}
  </div>
);

export default StepIndicator;
