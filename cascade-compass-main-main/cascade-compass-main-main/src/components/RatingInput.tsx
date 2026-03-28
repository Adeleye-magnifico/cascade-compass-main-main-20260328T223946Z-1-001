import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}

const RatingInput = ({ value, onChange, label }: RatingInputProps) => (
  <div className="flex items-center gap-3">
    {label && <span className="text-sm text-muted-foreground min-w-[140px]">{label}</span>}
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            "w-8 h-8 rounded-md text-sm font-semibold transition-all duration-150",
            value >= n
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

export default RatingInput;
