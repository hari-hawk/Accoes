"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  FolderKanban,
  Activity,
  Eye,
  ShieldCheck,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { ProjectDetailSheet } from "./project-detail-sheet";
import { CreateProjectDialog } from "./create-project-dialog";
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

function HeroSection({ onNewProject }: { onNewProject: () => void }) {
  const activeCount = mockProjects.filter((p) => p.status === "active").length;

  return (
    <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Welcome back, Sarah</h1>
          <p className="text-white/70 mt-0.5 text-sm">
            Here&apos;s an overview of your submittal validation projects
          </p>
        </div>
        <Button
          className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
          onClick={onNewProject}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Inline compact stats */}
      <div className="relative flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        {[
          { label: "Total Projects", value: mockProjects.length, icon: FolderKanban },
          { label: "Active", value: activeCount, icon: Activity },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-nav-gold" />
              <div>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  List View Row                                                              */
/* -------------------------------------------------------------------------- */

function ProjectListRow({
  project,
  onClick,
  onDownloadReport,
}: {
  project: Project;
  onClick: (project: Project) => void;
  onDownloadReport: (project: Project) => void;
}) {
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

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
    >
      {/* Name + Job ID */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{project.name}</p>
        <p className="text-xs font-mono text-muted-foreground truncate">{project.jobId}</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusIndicator status={project.status} />
      </div>

      {/* Confidence */}
      <div className="shrink-0 w-16 text-right">
        <span className={`text-sm font-bold ${confidenceColor}`}>
          {confidence > 0 ? `${confidence}%` : "—"}
        </span>
      </div>

      {/* Created date */}
      <div className="shrink-0 w-24 text-right text-xs text-muted-foreground hidden lg:block">
        {new Date(project.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* 3 action icons */}
      <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        {hasVersions ? (
          <>
            <Link
              href={`/projects/${project.id}/versions/${project.latestVersionId}`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Overview"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/projects/${project.id}/versions/${project.latestVersionId}/review`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Conformance"
            >
              <ShieldCheck className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Download Report"
              onClick={() => onDownloadReport(project)}
            >
              <Download className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Overview">
              <Eye className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Conformance">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Download Report">
              <Download className="h-4 w-4" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Download Report Dialog                                                     */
/* -------------------------------------------------------------------------- */

function DownloadReportDialog({
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

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setSelectedDocIds(new Set());
      setExporting(false);
      setExportComplete(false);
    }
    onOpenChange(open);
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </DialogTitle>
          <DialogDescription>
            Select documents from {project.name} to include in the export.
          </DialogDescription>
        </DialogHeader>

        {exportComplete ? (
          <div className="rounded-lg border border-status-pre-approved/30 bg-status-pre-approved-bg/30 p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div className="rounded-full bg-status-pre-approved/10 p-3">
                <Check className="h-6 w-6 text-status-pre-approved" />
              </div>
            </div>
            <p className="text-sm font-medium">Report generated successfully!</p>
            <p className="text-xs text-muted-foreground">
              {selectedDocIds.size} document{selectedDocIds.size !== 1 ? "s" : ""} exported as PDF
            </p>
            <Button variant="outline" size="sm" onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 pt-1">
              {/* Select all toggle */}
              {documents.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <button
                    type="button"
                    className="text-xs font-medium text-nav-accent hover:underline"
                    onClick={toggleAll}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                  <Badge variant="secondary" className="text-xs">
                    {selectedDocIds.size} of {documents.length} selected
                  </Badge>
                </div>
              )}

              {/* Document list */}
              <ScrollArea className={documents.length > 5 ? "h-[300px]" : ""}>
                <div className="space-y-1 pr-2">
                  {documents.length > 0 ? (
                    documents.map((doc) => {
                      const validation = validations.find((v) => v.documentId === doc.id);
                      const config = validation ? statusConfig[validation.status] : null;
                      const StatusIcon = config?.icon;
                      const FileIcon = fileIconMap[doc.fileType] ?? FileText;
                      const isChecked = selectedDocIds.has(doc.id);

                      return (
                        <label
                          key={doc.id}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors",
                            isChecked
                              ? "border-nav-accent/40 bg-nav-accent/5"
                              : "border-transparent hover:bg-muted/30"
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleDoc(doc.id)}
                          />
                          <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                            <FileIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-mono font-semibold text-nav-accent">
                                {doc.specSection}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {formatFileSize(doc.fileSize)}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {config && StatusIcon ? (
                              <Badge variant="secondary" className={cn("text-[10px]", config.color)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                            )}
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">No documents available</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Upload documents to this project first
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedDocIds.size === 0 || exporting}
                className="gradient-gold text-white border-0"
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Export {selectedDocIds.size > 0 ? `(${selectedDocIds.size})` : ""}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
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
    jobFilter,
    setJobFilter,
    locationFilter,
    setLocationFilter,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
  } = useProjects();

  // Sheet state for project detail panel
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Create project dialog
  const [createOpen, setCreateOpen] = useState(false);

  // Download Report dialog
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportProject, setReportProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  const handleDownloadReport = (project: Project) => {
    setReportProject(project);
    setReportDialogOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero section */}
      <HeroSection onNewProject={() => setCreateOpen(true)} />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        jobFilter={jobFilter}
        onJobChange={setJobFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
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
          <Button className="gradient-gold text-white border-0" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Button>
        </EmptyState>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onCardClick={handleCardClick}
              onDownloadReport={handleDownloadReport}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b bg-muted/30 text-xs font-medium text-muted-foreground">
            <div className="flex-1">Project</div>
            <div className="shrink-0">Status</div>
            <div className="shrink-0 w-16 text-right">Conf.</div>
            <div className="shrink-0 w-24 text-right hidden lg:block">Created</div>
            <div className="shrink-0 w-[104px]" />
          </div>
          {projects.map((project) => (
            <ProjectListRow
              key={project.id}
              project={project}
              onClick={handleCardClick}
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

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {/* Download Report Dialog */}
      <DownloadReportDialog
        project={reportProject}
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />
    </div>
  );
}
