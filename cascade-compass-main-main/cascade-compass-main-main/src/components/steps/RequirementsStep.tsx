import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type StepProps, EXPERIENCE_OPTIONS } from "@/types/jobAnalysis";
import RatingInput from "@/components/RatingInput";

const RequirementsStep = ({ data, update }: StepProps) => {
  const updateRating = (field: keyof typeof data.requirementRatings, value: number) => {
    update("requirementRatings", { ...data.requirementRatings, [field]: value });
  };

  const updateCert = (index: number, rating: number) => {
    const certs = [...data.certifications];
    certs[index] = { ...certs[index], rating };
    update("certifications", certs);
  };

  const experienceFromNum = (val: string) => {
    if (!val) return -1;
    if (val === "10+") return 10;
    if (val === "15+") return 15;
    if (val === "20+") return 20;
    return parseInt(val);
  };

  const isValidRange = (from: string, to: string) => {
    if (!from || !to) return true;
    return experienceFromNum(to) >= experienceFromNum(from);
  };

  const yearsValid = isValidRange(data.yearsExperience.from, data.yearsExperience.to);
  const fintechValid = isValidRange(data.fintechExperience.from, data.fintechExperience.to);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What This Role Needs to Succeed</CardTitle>
          <CardDescription>Education, experience, and qualifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Input placeholder="e.g., Bachelor's, Master's" value={data.education} onChange={e => update("education", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input placeholder="e.g., Computer Science, Finance" value={data.fieldOfStudy} onChange={e => update("fieldOfStudy", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Years of Experience (Range)</Label>
            <div className="flex items-center gap-3">
              <Select
                value={data.yearsExperience.from}
                onValueChange={v => update("yearsExperience", { ...data.yearsExperience, from: v })}
              >
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="From" /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o}>{o} {o.includes("+") ? "" : "years"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground font-medium">to</span>
              <Select
                value={data.yearsExperience.to}
                onValueChange={v => update("yearsExperience", { ...data.yearsExperience, to: v })}
              >
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="To" /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o}>{o} {o.includes("+") ? "" : "years"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!yearsValid && (
              <p className="text-xs text-destructive">"To" must be greater than or equal to "From"</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fintech Experience (Range)</Label>
            <div className="flex items-center gap-3">
              <Select
                value={data.fintechExperience.from}
                onValueChange={v => update("fintechExperience", { ...data.fintechExperience, from: v })}
              >
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="From" /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o}>{o} {o.includes("+") ? "" : "years"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground font-medium">to</span>
              <Select
                value={data.fintechExperience.to}
                onValueChange={v => update("fintechExperience", { ...data.fintechExperience, to: v })}
              >
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="To" /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map(o => (
                    <SelectItem key={o} value={o}>{o} {o.includes("+") ? "" : "years"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!fintechValid && (
              <p className="text-xs text-destructive">"To" must be greater than or equal to "From"</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Technical Qualifications</Label>
            <Input placeholder="e.g., coding bootcamp, cloud certifications" value={data.technicalQuals} onChange={e => update("technicalQuals", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate Requirements (1-5)</CardTitle>
          <CardDescription>1 = Not needed, 5 = Must have for top performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <RatingInput label="Education" value={data.requirementRatings.education} onChange={v => updateRating("education", v)} />
          <RatingInput label="Field of Study" value={data.requirementRatings.fieldOfStudy} onChange={v => updateRating("fieldOfStudy", v)} />
          <RatingInput label="Years Experience" value={data.requirementRatings.yearsExperience} onChange={v => updateRating("yearsExperience", v)} />
          <RatingInput label="Fintech Exp." value={data.requirementRatings.fintechExperience} onChange={v => updateRating("fintechExperience", v)} />
          <RatingInput label="Technical Quals" value={data.requirementRatings.technicalQuals} onChange={v => updateRating("technicalQuals", v)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications Needed</CardTitle>
          <CardDescription>Rate each 1-5</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.certifications.map((cert, i) => (
            <RatingInput key={i} label={cert.name} value={cert.rating} onChange={v => updateCert(i, v)} />
          ))}

          <div className="pt-4 border-t border-border mt-4">
            <Label className="text-sm font-semibold text-foreground mb-3 block">Other Certification (specify)</Label>
            <div className="flex items-center gap-3">
              <Input
                className="flex-1"
                placeholder="Type a certification not listed above..."
                value={data.customCertification.name}
                onChange={e => update("customCertification", { ...data.customCertification, name: e.target.value })}
              />
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground mr-2">Importance: 1–5</span>
              <RatingInput
                value={data.customCertification.rating}
                onChange={v => update("customCertification", { ...data.customCertification, rating: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsStep;
