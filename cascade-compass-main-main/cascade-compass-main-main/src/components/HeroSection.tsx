import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, FileText, BarChart3 } from "lucide-react";
import heroImg from "@/assets/hero-pattern.jpg";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.07]">
      <img src={heroImg} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8">
        <Layers className="h-4 w-4" />
        HR Analytics Tool
      </div>
      <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground text-center mb-6 leading-[1.1] tracking-tight">
        Job Analysis
        <br />
        <span className="text-accent">Cascade Generator</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-12 leading-relaxed">
        Transform a single job analysis into four grade level Job Descriptions
        and a unified Competency Framework — automatically.
      </p>
      <Button size="lg" onClick={onStart} className="text-base px-8 h-14 rounded-xl shadow-lg">
        Start Job Analysis
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
        {[
          { icon: FileText, title: "21-Point Analysis", desc: "Comprehensive job data capture" },
          { icon: Layers, title: "4-Level Cascade", desc: "Auto-scaled across grade levels" },
          { icon: BarChart3, title: "Competency Framework", desc: "Unified skills mapping" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50">
            <Icon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HeroSection;
