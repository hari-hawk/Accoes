"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CheckStep = "upload" | "checking" | "results";

interface CheckResult {
  requirement: string;
  status: "pass" | "fail" | "warning";
  detail: string;
  specRef: string;
}

const mockResults: CheckResult[] = [
  { requirement: "Material specification meets ASTM C150 Type I/II", status: "pass", detail: "Portland cement Type I/II confirmed in submittal data sheet", specRef: "03 31 00 - 2.1.A" },
  { requirement: "Compressive strength >= 4,000 PSI at 28 days", status: "pass", detail: "Tested at 4,500 PSI — exceeds minimum requirement", specRef: "03 31 00 - 2.2.B" },
  { requirement: "Air content range 4-7%", status: "warning", detail: "Reported at 3.8% — marginally below specification minimum", specRef: "03 31 00 - 2.3.A" },
  { requirement: "Water-cement ratio max 0.45", status: "pass", detail: "w/c ratio of 0.42 documented in mix design", specRef: "03 31 00 - 2.2.C" },
  { requirement: "Admixture compatibility certification", status: "fail", detail: "No manufacturer compatibility certificate provided", specRef: "03 31 00 - 2.4.D" },
  { requirement: "Aggregate gradation per ASTM C33", status: "pass", detail: "Sieve analysis report confirms ASTM C33 compliance", specRef: "03 31 00 - 2.1.B" },
];

export default function CheckConformancePage() {
  const [step, setStep] = useState<CheckStep>("upload");
  const [project, setProject] = useState("");
  const [specSection, setSpecSection] = useState("");

  const startCheck = () => {
    setStep("checking");
    setTimeout(() => setStep("results"), 3000);
  };

  const passCount = mockResults.filter((r) => r.status === "pass").length;
  const warnCount = mockResults.filter((r) => r.status === "warning").length;
  const failCount = mockResults.filter((r) => r.status === "fail").length;

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Check Conformance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Run an AI-powered conformance check against project specifications
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[
          { key: "upload", label: "1. Select & Upload", icon: Upload },
          { key: "checking", label: "2. AI Analysis", icon: Zap },
          { key: "results", label: "3. Results", icon: CheckCircle2 },
        ].map((s, i) => {
          const Icon = s.icon;
          const isActive = s.key === step;
          const isDone =
            (s.key === "upload" && step !== "upload") ||
            (s.key === "checking" && step === "results");
          return (
            <div key={s.key} className="flex items-center gap-3">
              {i > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "gradient-accent text-white shadow-glow"
                    : isDone
                      ? "bg-status-pre-approved-bg text-status-pre-approved"
                      : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload step */}
      {step === "upload" && (
        <div className="rounded-xl border bg-card shadow-card p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proj-1">Riverside Commercial Tower</SelectItem>
                  <SelectItem value="proj-2">Harbor District Mixed Use</SelectItem>
                  <SelectItem value="proj-3">Metro Line Extension Phase 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Spec Section</label>
              <Select value={specSection} onValueChange={setSpecSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="03-31">03 31 00 - Structural Concrete</SelectItem>
                  <SelectItem value="05-12">05 12 00 - Structural Steel</SelectItem>
                  <SelectItem value="23-34">23 34 00 - HVAC Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-12 text-center hover:border-nav-accent/40 transition-colors cursor-pointer">
            <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Drop submittal documents here</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, XLSX, DOCX up to 50MB each
            </p>
          </div>

          {/* Mock uploaded file */}
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="rounded-lg bg-muted p-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Concrete_Mix_Design_Rev3.pdf</p>
              <p className="text-xs text-muted-foreground">2.4 MB</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-status-pre-approved" />
          </div>

          <Button
            className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
            onClick={startCheck}
            disabled={!project || !specSection}
          >
            <Zap className="mr-1.5 h-4 w-4" />
            Run Conformance Check
          </Button>
        </div>
      )}

      {/* Checking step */}
      {step === "checking" && (
        <div className="rounded-xl border bg-card shadow-card p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-nav-accent mx-auto mb-6" />
          <h3 className="text-lg font-semibold">Analyzing Document</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            AI is comparing your submittal against specification requirements. This
            typically takes 10-15 seconds.
          </p>
          <div className="mt-6 space-y-2 max-w-xs mx-auto">
            <div className="flex items-center gap-2 text-sm text-status-pre-approved">
              <CheckCircle2 className="h-4 w-4" />
              Document parsed successfully
            </div>
            <div className="flex items-center gap-2 text-sm text-nav-accent">
              <Loader2 className="h-4 w-4 animate-spin" />
              Matching against spec requirements...
            </div>
          </div>
        </div>
      )}

      {/* Results step */}
      {step === "results" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-status-pre-approved-bg p-2.5">
                  <CheckCircle2 className="h-5 w-5 text-status-pre-approved" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{passCount}</p>
                  <p className="text-xs text-muted-foreground">Passed</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-status-review-required-bg p-2.5">
                  <AlertTriangle className="h-5 w-5 text-status-review-required" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{warnCount}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-status-action-mandatory-bg p-2.5">
                  <AlertTriangle className="h-5 w-5 text-status-action-mandatory" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{failCount}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results list */}
          <div className="rounded-xl border bg-card shadow-card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Conformance Results</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                03 31 00 - Structural Concrete vs Concrete_Mix_Design_Rev3.pdf
              </p>
            </div>
            <div className="divide-y">
              {mockResults.map((result, i) => (
                <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "rounded-lg p-1.5 mt-0.5",
                      result.status === "pass" ? "bg-status-pre-approved-bg" :
                      result.status === "warning" ? "bg-status-review-required-bg" :
                      "bg-status-action-mandatory-bg"
                    )}>
                      {result.status === "pass" ? (
                        <CheckCircle2 className="h-4 w-4 text-status-pre-approved" />
                      ) : result.status === "warning" ? (
                        <AlertTriangle className="h-4 w-4 text-status-review-required" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-status-action-mandatory" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.requirement}</p>
                      <p className="text-xs text-muted-foreground mt-1">{result.detail}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">
                      {result.specRef}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep("upload")}>
              New Check
            </Button>
            <Button className="gradient-accent text-white border-0">
              Export Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
