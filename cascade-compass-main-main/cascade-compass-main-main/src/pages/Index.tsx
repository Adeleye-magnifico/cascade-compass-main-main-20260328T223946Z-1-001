import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import StepIndicator from "@/components/StepIndicator";
import BasicInfoStep from "@/components/steps/BasicInfoStep";
import TasksStep from "@/components/steps/TasksStep";
import RequirementsStep from "@/components/steps/RequirementsStep";
import SkillsStep from "@/components/steps/SkillsStep";
import KPIsStep from "@/components/steps/KPIsStep";
import ToolsStep from "@/components/steps/ToolsStep";
import AutonomyStep from "@/components/steps/AutonomyStep";
import CascadeResults from "@/components/CascadeResults";
import { type JobAnalysisInput, type CascadeOutput, DEFAULT_FORM_DATA } from "@/types/jobAnalysis";
import { generateCascade, mergeCompetencyProficiencyLevels } from "@/lib/cascadeEngine";
import { fetchCascadeFromRemote } from "@/lib/cascadeRemote";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Basic Info", "Tasks", "Requirements", "Skills", "KPIs & Risks", "Tools", "Autonomy"];

type View = "hero" | "form" | "results";

const Index = () => {
  const [view, setView] = useState<View>("hero");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<JobAnalysisInput>({ ...DEFAULT_FORM_DATA });
  const [output, setOutput] = useState<CascadeOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const update = useCallback(<K extends keyof JobAnalysisInput>(field: K, value: JobAnalysisInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = async () => {
    if (!formData.functionName.trim() || !formData.jobTitle.trim()) {
      toast({ title: "Missing fields", description: "Function Name and Job Title are required.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const data = await fetchCascadeFromRemote(formData);
      setOutput(mergeCompetencyProficiencyLevels(data as CascadeOutput, formData));
      setView("results");
    } catch (err: unknown) {
      console.error("Generation failed:", err);
      const message = err instanceof Error ? err.message : "Remote generation failed.";
      toast({
        title: "AI unavailable — using offline cascade",
        description: `${message} Showing the built-in template engine output.`,
        variant: "default",
      });
      const result = generateCascade(formData);
      setOutput(mergeCompetencyProficiencyLevels(result, formData));
      setView("results");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM_DATA });
    setStep(0);
    setOutput(null);
    setView("hero");
  };

  if (view === "hero") {
    return <HeroSection onStart={() => setView("form")} />;
  }

  if (view === "results" && output) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <CascadeResults output={output} functionName={formData.functionName} onReset={handleReset} />
        </div>
      </div>
    );
  }

  const stepProps = { data: formData, update };
  const stepComponents = [
    <BasicInfoStep key={0} {...stepProps} />,
    <TasksStep key={1} {...stepProps} />,
    <RequirementsStep key={2} {...stepProps} />,
    <SkillsStep key={3} {...stepProps} />,
    <KPIsStep key={4} {...stepProps} />,
    <ToolsStep key={5} {...stepProps} />,
    <AutonomyStep key={6} {...stepProps} />,
  ];

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-foreground">
            Job Analysis <span className="text-accent">Cascade</span>
          </h1>
          <StepIndicator steps={STEPS} current={step} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {stepComponents[step]}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => step === 0 ? setView("hero") : setStep(s => s - 1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {step === 0 ? "Home" : "Back"}
          </Button>

          {isLast ? (
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is Analyzing — This takes 30-60s...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Cascade
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => setStep(s => s + 1)}>
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
