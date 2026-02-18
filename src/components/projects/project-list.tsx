"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderKanban,
  Download,
  FileText,
  FileSpreadsheet,
  FileType,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { ProjectDetailSheet } from "./project-detail-sheet";
// CreateProjectDialog replaced by /projects/create page
import { useProjects } from "@/hooks/use-projects";
import { mockProjects } from "@/data/mock-projects";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { getValidationsByVersion } from "@/data/mock-validations";
import { getVersionsByProject } from "@/data/mock-versions";
import type { Project, Document as DocType, ValidationResult } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Status config for badges inside Download Report dialog                     */
/* -------------------------------------------------------------------------- */
const statusConfig = {
  pre_approved: { label: "Pre-Approved", color: "bg-status-pre-approved-bg text-status-pre-approved", icon: CheckCircle2 },
  review_required: { label: "Review Required", color: "bg-status-review-required-bg text-status-review-required", icon: AlertTriangle },
  action_mandatory: { label: "Action Mandatory", color: "bg-status-action-mandatory-bg text-status-action-mandatory", icon: XCircle },
};

const fileIconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileType,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  /* ---- Computed metrics ---- */
  const activeCount = mockProjects.filter((p) => p.status === "active").length;
  const inProgressCount = mockProjects.filter((p) => p.status === "in_progress").length;
  const completedCount = mockProjects.filter((p) => p.status === "completed").length;
  const onHoldCount = mockProjects.filter((p) => p.status === "on_hold").length;
  const totalProjects = mockProjects.length;

  // Overall Confidence — average across scored projects
  const projectsWithConfidence = mockProjects.filter(
    (p) => p.confidenceSummary.total > 0 && p.confidenceSummary.overallConfidence > 0
  );
  const avgConfidence =
    projectsWithConfidence.length > 0
      ? Math.round(
          projectsWithConfidence.reduce(
            (sum, p) => sum + p.confidenceSummary.overallConfidence,
            0
          ) / projectsWithConfidence.length
        )
      : 0;

  // Compliance Rate — pre-approved vs total items across ALL projects
  const totalPreApproved = mockProjects.reduce(
    (sum, p) => sum + p.confidenceSummary.preApproved,
    0
  );
  const totalItems = mockProjects.reduce(
    (sum, p) => sum + p.confidenceSummary.total,
    0
  );
  const compliancePct = totalItems > 0 ? Math.round((totalPreApproved / totalItems) * 100) : 0;

  // SVG ring dimensions
  const ringRadius = 52;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - avgConfidence / 100);

  // Pipeline bar segment widths
  const pipelineBarTotal = totalProjects || 1; // avoid /0

  return (
    <section
      className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up"
      aria-label="Projects overview"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/3 translate-y-1/2 -translate-x-1/4" aria-hidden="true" />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />

      <div className="relative">
        <h1 className="text-xl font-bold tracking-tight">Welcome back, Sarah</h1>
        <p className="text-white/70 mt-0.5 text-sm">
          Here&apos;s an overview of your submittal validation projects
        </p>
      </div>

      {/* 3 Business-Impact Metric Cards */}
      <div
        className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10"
        role="group"
        aria-label="Business impact metrics"
      >
        {/* Card 1 — Overall Confidence */}
        <div
          className="rounded-xl bg-white/[0.06] backdrop-blur-sm p-5 flex items-center gap-4"
          aria-label={`Overall confidence: ${avgConfidence}%`}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="shrink-0"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r={ringRadius}
              fill="none"
              stroke="var(--nav-gold)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 60 60)"
              className="transition-all duration-700"
            />
            <text
              x="60"
              y="55"
              textAnchor="middle"
              className="fill-white font-bold"
              fontSize="28"
            >
              {avgConfidence}%
            </text>
            <text
              x="60"
              y="75"
              textAnchor="middle"
              className="fill-white/50"
              fontSize="10"
            >
              CONFIDENCE
            </text>
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Overall Confidence
            </p>
            <p className="text-3xl font-bold mt-1">{avgConfidence}%</p>
            <p className="text-xs text-white/50 mt-1">
              Across {projectsWithConfidence.length} scored project{projectsWithConfidence.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Card 2 — Review Pipeline */}
        <div
          className="rounded-xl bg-white/[0.06] backdrop-blur-sm p-5 flex flex-col justify-between"
          aria-label={`Review pipeline: ${activeCount + inProgressCount} projects`}
        >
          <div>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Review Pipeline
            </p>
            <p className="text-3xl font-bold mt-1">
              {activeCount + inProgressCount}
            </p>
            <p className="text-xs text-white/50 mt-1">
              {activeCount} Active + {inProgressCount} In Progress
            </p>
          </div>

          {/* Mini stacked bar */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden bg-white/10" aria-hidden="true">
              {activeCount > 0 && (
                <div
                  className="h-full bg-chart-1"
                  style={{ width: `${(activeCount / pipelineBarTotal) * 100}%` }}
                />
              )}
              {inProgressCount > 0 && (
                <div
                  className="h-full bg-chart-5"
                  style={{ width: `${(inProgressCount / pipelineBarTotal) * 100}%` }}
                />
              )}
              {completedCount > 0 && (
                <div
                  className="h-full bg-chart-3"
                  style={{ width: `${(completedCount / pipelineBarTotal) * 100}%` }}
                />
              )}
              {onHoldCount > 0 && (
                <div
                  className="h-full bg-muted-foreground"
                  style={{ width: `${(onHoldCount / pipelineBarTotal) * 100}%` }}
                />
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] text-white/50">
                <span className="inline-block w-2 h-2 rounded-full bg-chart-1" />
                Active
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/50">
                <span className="inline-block w-2 h-2 rounded-full bg-chart-5" />
                In Progress
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/50">
                <span className="inline-block w-2 h-2 rounded-full bg-chart-3" />
                Completed
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/50">
                <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" />
                On Hold
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 — Compliance Rate */}
        <div
          className="rounded-xl bg-white/[0.06] backdrop-blur-sm p-5 flex flex-col justify-between"
          aria-label={`Compliance rate: ${totalPreApproved} of ${totalItems} items pre-approved (${compliancePct}%)`}
        >
          <div>
            <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              Compliance Rate
            </p>
            <p className="text-3xl font-bold mt-1">
              {totalPreApproved}{" "}
              <span className="text-lg font-normal text-white/50">/ {totalItems}</span>
            </p>
            <p className="text-xs text-white/50 mt-1">
              Pre-approved items — {compliancePct}%
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden bg-white/10" aria-hidden="true">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${compliancePct}%`,
                  backgroundColor: "var(--nav-gold)",
                }}
              />
            </div>
            <p className="text-[10px] text-white/50 mt-1.5 text-right">
              {compliancePct}% compliant
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  List View Row                                                              */
/* -------------------------------------------------------------------------- */

function ProjectListRow({
  project,
  onNameClick,
  onDownloadReport,
}: {
  project: Project;
  onNameClick: (project: Project) => void;
  onDownloadReport: (project: Project) => void;
}) {
  const router = useRouter();
  const confidence = project.confidenceSummary.overallConfidence;
  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-muted-foreground";

  const hasVersions = !!project.latestVersionId;
  const overviewHref = `/projects/${project.id}/versions/${project.latestVersionId}`;

  // Check if project has documents in its latest version
  const hasDocuments = hasVersions && getDocumentsByVersion(
    getVersionsByProject(project.id).find((v) => v.id === project.latestVersionId)?.id ?? ""
  ).length > 0;

  const handleRowClick = () => {
    if (hasVersions) {
      router.push(overviewHref);
    } else {
      onNameClick(project);
    }
  };

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={handleRowClick}
      role="row"
      tabIndex={0}
      aria-label={`${project.name}, Job ${project.jobId}, ${confidence > 0 ? `${confidence}% confidence` : "Pending"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleRowClick();
        }
      }}
    >
      {/* Name + Job ID */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">
          <button
            type="button"
            className="hover:underline hover:text-nav-accent cursor-pointer transition-colors text-left"
            onClick={(e) => {
              e.stopPropagation();
              onNameClick(project);
            }}
          >
            {project.name}
          </button>
        </p>
        <p className="text-xs font-mono text-muted-foreground truncate">{project.jobId}</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusIndicator status={project.status} />
      </div>

      {/* Confidence */}
      <div className="shrink-0 w-16 text-right">
        <span className={`text-sm font-bold ${confidenceColor}`} aria-label={confidence > 0 ? `${confidence}% confidence` : "Pending"}>
          {confidence > 0 ? `${confidence}%` : "—"}
        </span>
      </div>

      {/* Created date */}
      <div className="shrink-0 w-24 text-right text-xs text-muted-foreground hidden lg:block">
        <time dateTime={project.createdAt}>
          {new Date(project.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>

      {/* Download action */}
      <div
        className="shrink-0 flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="group"
        aria-label="Project actions"
      >
        {hasVersions ? (
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none",
              hasDocuments
                ? "text-muted-foreground hover:text-nav-accent hover:bg-muted/50"
                : "text-muted-foreground/30 cursor-not-allowed"
            )}
            aria-label={
              hasDocuments
                ? `Download report for ${project.name}`
                : `No documents available for ${project.name}`
            }
            disabled={!hasDocuments}
            onClick={() => {
              if (hasDocuments) onDownloadReport(project);
            }}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <span
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed"
            role="img"
            aria-label="Download report unavailable — no versions"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Download Report Sheet (Right-side panel)                                   */
/* -------------------------------------------------------------------------- */

function DownloadReportSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Get documents for this project's latest version
  const documents: DocType[] = project?.latestVersionId
    ? getDocumentsByVersion(
        getVersionsByProject(project.id).find((v) => v.id === project.latestVersionId)?.id ?? ""
      )
    : [];

  const validations: ValidationResult[] = project?.latestVersionId
    ? getValidationsByVersion(
        getVersionsByProject(project.id).find((v) => v.id === project.latestVersionId)?.id ?? ""
      )
    : [];

  const allSelected = documents.length > 0 && selectedDocIds.size === documents.length;

  const toggleDoc = (docId: string) => {
    setSelectedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedDocIds(new Set());
    } else {
      setSelectedDocIds(new Set(documents.map((d) => d.id)));
    }
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
    }, 1500);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setSelectedDocIds(new Set());
      setExporting(false);
      setExportComplete(false);
    }
    onOpenChange(isOpen);
  };

  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col p-0"
        aria-label={`Download report for ${project.name}`}
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg gradient-gold flex items-center justify-center shrink-0">
              <Download className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">Download Report</SheetTitle>
              <SheetDescription className="text-xs mt-0.5 truncate">
                {project.name} — {project.jobId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        {exportComplete ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center space-y-4 max-w-xs">
              <div className="mx-auto w-16 h-16 rounded-full bg-status-pre-approved/10 flex items-center justify-center">
                <Check className="h-7 w-7 text-status-pre-approved" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold">Report Generated</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDocIds.size} document{selectedDocIds.size !== 1 ? "s" : ""} exported
                  successfully as PDF
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                className="mt-2"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-4">
                {/* Select all / count header */}
                {documents.length > 0 && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-xs font-medium text-nav-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
                      onClick={toggleAll}
                      aria-label={allSelected ? "Deselect all documents" : "Select all documents"}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                    <Badge variant="secondary" className="text-xs tabular-nums">
                      {selectedDocIds.size} / {documents.length} selected
                    </Badge>
                  </div>
                )}

                {/* Document list */}
                {documents.length > 0 ? (
                  <div className="space-y-1.5" role="group" aria-label="Available documents for export">
                    {documents.map((doc) => {
                      const validation = validations.find((v) => v.documentId === doc.id);
                      const config = validation ? statusConfig[validation.status] : null;
                      const StatusIcon = config?.icon;
                      const FileIcon = fileIconMap[doc.fileType] ?? FileText;
                      const isChecked = selectedDocIds.has(doc.id);

                      return (
                        <label
                          key={doc.id}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-all",
                            "focus-within:ring-2 focus-within:ring-nav-accent focus-within:ring-offset-1",
                            isChecked
                              ? "border-nav-accent/40 bg-nav-accent/5 shadow-sm"
                              : "border-border/50 hover:border-border hover:bg-muted/20"
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleDoc(doc.id)}
                            aria-label={`Select ${doc.fileName}`}
                            className="shrink-0"
                          />
                          <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            <FileIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-semibold text-nav-accent">
                                {doc.specSection}
                              </span>
                              <span className="text-[11px] text-muted-foreground" aria-label={`File size: ${formatFileSize(doc.fileSize)}`}>
                                {formatFileSize(doc.fileSize)}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {config && StatusIcon ? (
                              <Badge variant="secondary" className={cn("text-[10px]", config.color)}>
                                <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                                {config.label}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                      <FileText className="h-6 w-6 text-muted-foreground/40" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No documents available</p>
                    <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                      Upload documents to this project&apos;s latest version first
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <SheetFooter className="px-6 py-4 border-t shrink-0">
              <div className="flex items-center gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => handleClose(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={selectedDocIds.size === 0 || exporting}
                  className="flex-1 gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity"
                  aria-label={
                    selectedDocIds.size === 0
                      ? "Select documents to export"
                      : `Export ${selectedDocIds.size} document${selectedDocIds.size !== 1 ? "s" : ""}`
                  }
                >
                  {exporting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Exporting…
                    </>
                  ) : (
                    <>
                      <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Export{selectedDocIds.size > 0 ? ` (${selectedDocIds.size})` : ""}
                    </>
                  )}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export function ProjectList() {
  const {
    projects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
  } = useProjects();

  // Sheet state for project detail panel
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Download Report sheet
  const [reportSheetOpen, setReportSheetOpen] = useState(false);
  const [reportProject, setReportProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  const handleDownloadReport = (project: Project) => {
    setReportProject(project);
    setReportSheetOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero section */}
      <HeroSection />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try adjusting your search or filters, or create a new project to get started."
        >
          <Link
            href="/projects/create"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-sm font-semibold gradient-gold text-white border-0 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Project
          </Link>
        </EmptyState>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onNameClick={handleCardClick}
              onDownloadReport={handleDownloadReport}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border bg-card shadow-card overflow-hidden" role="table" aria-label="Projects list">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b bg-muted/30 text-xs font-medium text-muted-foreground" role="row" aria-label="Column headers">
            <div className="flex-1" role="columnheader">Project</div>
            <div className="shrink-0" role="columnheader">Status</div>
            <div className="shrink-0 w-16 text-right" role="columnheader" aria-label="Confidence">Conf.</div>
            <div className="shrink-0 w-24 text-right hidden lg:block" role="columnheader">Created</div>
            <div className="shrink-0 w-10" role="columnheader" aria-label="Actions" />
          </div>
          {projects.map((project) => (
            <ProjectListRow
              key={project.id}
              project={project}
              onNameClick={handleCardClick}
              onDownloadReport={handleDownloadReport}
            />
          ))}
        </div>
      )}

      {/* Project Detail Sheet */}
      <ProjectDetailSheet
        project={selectedProject}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      {/* Download Report Sheet */}
      <DownloadReportSheet
        project={reportProject}
        open={reportSheetOpen}
        onOpenChange={setReportSheetOpen}
      />
    </div>
  );
}
