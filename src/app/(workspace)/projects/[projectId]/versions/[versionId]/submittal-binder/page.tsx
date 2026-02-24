"use client";

import { BookOpen, FileStack, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/providers/workspace-provider";

export default function SubmittalBinderPage() {
  const { project, version } = useWorkspace();
  const totalDocs = version.documentIds.length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-fade-up">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Submittal Binder
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Compiled submittal package for {project.name} — {version.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button size="sm" className="gap-1.5 gradient-action text-white border-0">
              <Download className="h-3.5 w-3.5" />
              Export Binder
            </Button>
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border bg-card shadow-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{totalDocs}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Documents</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-status-pre-approved">
                {version.confidenceSummary.preApproved}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pre-Approved</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">
                {version.confidenceSummary.overallConfidence}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Overall Confidence</p>
            </div>
          </div>
        </div>

        {/* Binder sections */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
            <FileStack className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Binder Sections</h2>
            <Badge variant="secondary" className="text-[10px] ml-auto">
              {version.status === "complete" ? "Ready" : "In Progress"}
            </Badge>
          </div>

          <div className="divide-y">
            {[
              { section: "Cover Sheet", desc: "Project identification and submittal metadata", status: "complete" },
              { section: "Table of Contents", desc: "Auto-generated index of all submittal sections", status: "complete" },
              { section: "Material Matrix Summary", desc: "Conformance results for all material line items", status: "complete" },
              { section: "Specification Cross-Reference", desc: "Mapping of materials to specification sections", status: "complete" },
              { section: "Supporting Documentation", desc: "Cut sheets, certifications, and test reports", status: version.status === "complete" ? "complete" : "pending" },
              { section: "Appendices", desc: "AI reasoning logs and evidence summaries", status: version.status === "complete" ? "complete" : "pending" },
            ].map((item) => (
              <div
                key={item.section}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    item.status === "complete"
                      ? "bg-status-pre-approved"
                      : "bg-muted-foreground/30"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.section}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    item.status === "complete"
                      ? "bg-status-pre-approved-bg text-status-pre-approved"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.status === "complete" ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
