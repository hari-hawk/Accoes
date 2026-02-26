"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileStack,
  Download,
  Printer,
  ArrowLeft,
  Eye,
  ChevronRight,
  FileText,
  ClipboardList,
  BarChart3,
  GitCompareArrows,
  FolderOpen,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/providers/workspace-provider";
import { FullScreenPdfViewer } from "@/components/documents/full-screen-pdf-viewer";

/* -------------------------------------------------------------------------- */
/*  Binder section definitions                                                 */
/* -------------------------------------------------------------------------- */

interface BinderSection {
  key: string;
  section: string;
  desc: string;
  icon: typeof FileText;
  pages: number;
  status: "complete" | "pending";
}

export default function SubmittalBinderPage() {
  const { project, version } = useWorkspace();
  const totalDocs = version.documentIds.length;

  /* Preview state */
  const [previewSection, setPreviewSection] = useState<BinderSection | null>(null);

  /* Build sections list with dynamic statuses */
  const sections: BinderSection[] = [
    {
      key: "cover-sheet",
      section: "Cover Sheet",
      desc: "Project identification and submittal metadata",
      icon: FileText,
      pages: 1,
      status: "complete",
    },
    {
      key: "transmittal",
      section: "Transmittal",
      desc: "Transmittal form with approval workflow and review stamps",
      icon: ClipboardList,
      pages: 1,
      status: "complete",
    },
    {
      key: "material-matrix",
      section: "Material Matrix Summary",
      desc: "Conformance results for all material line items",
      icon: BarChart3,
      pages: 4,
      status: "complete",
    },
    {
      key: "spec-cross-ref",
      section: "Specification Cross-Reference",
      desc: "Mapping of materials to specification sections",
      icon: GitCompareArrows,
      pages: 3,
      status: "complete",
    },
    {
      key: "supporting-docs",
      section: "Supporting Documentation",
      desc: "Cut sheets, certifications, and test reports",
      icon: FolderOpen,
      pages: 8,
      status: version.status === "complete" ? "complete" : "pending",
    },
    {
      key: "appendices",
      section: "Appendices",
      desc: "AI reasoning logs and evidence summaries",
      icon: Brain,
      pages: 2,
      status: version.status === "complete" ? "complete" : "pending",
    },
  ];

  const completeSections = sections.filter((s) => s.status === "complete").length;
  const totalPages = sections.reduce((sum, s) => sum + s.pages, 0);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-fade-up">
        {/* Back navigation */}
        <Link
          href={`/projects/${project.id}/versions/${version.id}/preview-cover`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Preview Cover Page
        </Link>

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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
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
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{totalPages}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Pages</p>
            </div>
          </div>
        </div>

        {/* Binder sections — clickable */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
            <FileStack className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Binder Sections</h2>
            <span className="text-xs text-muted-foreground ml-1">
              {completeSections}/{sections.length} complete
            </span>
            <Badge variant="secondary" className="text-[10px] ml-auto">
              {completeSections === sections.length ? "Ready" : "In Progress"}
            </Badge>
          </div>

          <div className="divide-y">
            {sections.map((item, index) => {
              const SectionIcon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  className="flex items-center gap-4 px-6 py-4 w-full text-left hover:bg-muted/20 transition-colors cursor-pointer group"
                  onClick={() => setPreviewSection(item)}
                >
                  {/* Section number */}
                  <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === "complete"
                        ? "bg-status-pre-approved/10"
                        : "bg-muted/30"
                    }`}
                  >
                    <SectionIcon
                      className={`h-4 w-4 ${
                        item.status === "complete"
                          ? "text-status-pre-approved"
                          : "text-muted-foreground/60"
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                      {item.section}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>

                  {/* Page count */}
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {item.pages} {item.pages === 1 ? "page" : "pages"}
                  </span>

                  {/* Status + preview hint */}
                  <Badge
                    variant="secondary"
                    className={`text-[10px] shrink-0 ${
                      item.status === "complete"
                        ? "bg-status-pre-approved-bg text-status-pre-approved"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status === "complete" ? "Complete" : "Pending"}
                  </Badge>

                  <div className="flex items-center gap-1 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors shrink-0">
                    <Eye className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finalize message */}
        <div className="rounded-2xl border bg-card shadow-card p-6 text-center">
          <div className="h-12 w-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-sm font-semibold">
            {completeSections === sections.length
              ? "Binder Ready for Export"
              : "Binder Assembly In Progress"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            {completeSections === sections.length
              ? "All sections are complete. Use the Export Binder button above to download the assembled PDF package."
              : `${completeSections} of ${sections.length} sections complete. Complete all sections to finalize the binder.`}
          </p>
        </div>
      </div>

      {/* Full-screen PDF preview dialog */}
      <FullScreenPdfViewer
        open={!!previewSection}
        onOpenChange={(open) => {
          if (!open) setPreviewSection(null);
        }}
        title={previewSection?.section ?? ""}
        subtitle={`Submittal Binder — ${project.name}`}
        totalPages={previewSection?.pages ?? 1}
      />
    </div>
  );
}
