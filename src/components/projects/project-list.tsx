"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderKanban,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  Loader2,
  ChevronDown,
  X,
  RotateCcw,
  Clock,
  Users,
  Layers,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { cn } from "@/lib/utils";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { ProjectDetailSheet } from "./project-detail-sheet";
import { GenerateSubmittalSheet } from "./generate-submittal-sheet";
import { TeamAccessSheet } from "./team-access-sheet";
// CreateProjectDialog replaced by /projects/create page
import { useProjects } from "@/hooks/use-projects";
import { useMaterials } from "@/hooks/use-materials";
import { mockProjects } from "@/data/mock-projects";
import { getProjectOverviewData } from "@/data/mock-project-data";
import { mockUsers } from "@/data/mock-users";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { getVersionsByProject } from "@/data/mock-versions";
import type { Project } from "@/data/types";

/* HIDDEN: Generate Submittal — re-enable when needed */
const SHOW_GENERATE_SUBMITTAL = false;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* -------------------------------------------------------------------------- */
/*  Hero Section — with business-impact metric cards                           */
/* -------------------------------------------------------------------------- */

function HeroSection({ createHref = "/projects/create" }: { createHref?: string }) {
  /* ---- Computed metrics ---- */
  const activeCount = mockProjects.filter((p) => p.status === "active").length;
  const inProgressCount = mockProjects.filter((p) => p.status === "in_progress").length;
  const completedCount = mockProjects.filter((p) => p.status === "completed").length;
  const onHoldCount = mockProjects.filter((p) => p.status === "on_hold").length;
  const totalProjects = mockProjects.length;

  // Overall Confidence — average across scored projects
  const projectsWithConfidence = mockProjects.filter(
    (p) => p.confidenceSummary.overallConfidence > 0
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
  const pipelineBarTotal = totalProjects || 1;

  return (
    <section
      className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up"
      aria-label="Projects overview"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/3 translate-y-1/2 -translate-x-1/4" aria-hidden="true" />
      <div className="absolute inset-0 dot-pattern opacity-40" aria-hidden="true" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Projects</h1>
          <p className="text-white/70 mt-0.5 text-sm">
            Manage and review your submittal validation projects
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/60">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export
          </Button>
          <Link
            href={createHref}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md text-xs font-semibold gradient-action text-white border-0 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New Project
          </Link>
        </div>
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
                  className="h-full"
                  style={{
                    width: `${(activeCount / pipelineBarTotal) * 100}%`,
                    backgroundColor: "var(--chart-1)",
                  }}
                />
              )}
              {inProgressCount > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(inProgressCount / pipelineBarTotal) * 100}%`,
                    backgroundColor: "var(--nav-gold)",
                  }}
                />
              )}
              {completedCount > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(completedCount / pipelineBarTotal) * 100}%`,
                    backgroundColor: "var(--status-pre-approved)",
                  }}
                />
              )}
              {onHoldCount > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${(onHoldCount / pipelineBarTotal) * 100}%`,
                    backgroundColor: "var(--ds-neutral-600, #787878)",
                  }}
                />
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
                Active
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--nav-gold)" }} />
                In Progress
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--status-pre-approved)" }} />
                Completed
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--ds-neutral-600, #787878)" }} />
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
            <p className="text-[11px] text-white/70 mt-1.5 text-right">
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
  onGenerateSubmittal,
  onManageTeam,
  isAdmin = false,
  overviewHrefOverride,
}: {
  project: Project;
  onNameClick: (project: Project) => void;
  onDownloadReport: (project: Project) => void;
  onGenerateSubmittal?: (project: Project) => void;
  onManageTeam?: (project: Project) => void;
  isAdmin?: boolean;
  /** Override the default overview navigation href */
  overviewHrefOverride?: string;
}) {
  const router = useRouter();
  const confidence = project.confidenceSummary.overallConfidence;

  const hasVersions = !!project.latestVersionId;
  const overviewHref = overviewHrefOverride ?? `/projects/${project.id}/versions/${project.latestVersionId}`;

  // Check if project has documents in its latest version
  const hasDocuments = hasVersions && getDocumentsByVersion(
    getVersionsByProject(project.id).find((v) => v.id === project.latestVersionId)?.id ?? ""
  ).length > 0;

  // Resolve member IDs to user objects (show max 3)
  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);
  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  const handleRowClick = () => {
    if (hasVersions) {
      router.push(overviewHref);
    } else {
      onNameClick(project);
    }
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <tr
      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={handleRowClick}
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
      <td className="px-3 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
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
      </td>

      {/* Type */}
      <td className="px-3 py-3">
        <span className="text-xs text-foreground whitespace-nowrap">
          {project.projectType === "dr" ? "Discrepancy Report" : "Design Job"}
        </span>
      </td>

      {/* Location */}
      <td className="px-3 py-3">
        <span className="text-xs text-foreground truncate block max-w-[140px]" title={project.location}>
          {project.location}
        </span>
      </td>

      {/* Company */}
      <td className="px-3 py-3">
        <div className="min-w-0">
          <p className="text-xs text-foreground truncate max-w-[140px]" title={project.client}>{project.client}</p>
          {project.owner && (
            <p className="text-[11px] text-muted-foreground truncate max-w-[140px]" title={project.owner}>
              {project.owner}
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-3">
        <StatusIndicator status={project.status} />
      </td>

      {/* Priority */}
      <td className="px-3 py-3">
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", priorityColors[project.priority] ?? "bg-muted text-muted-foreground")}>
          {project.priority}
        </span>
      </td>

      {/* Team */}
      <td className="px-3 py-3">
        <AvatarGroup>
          {visibleMembers.map((user) => (
            <Avatar key={user!.id} size="sm">
              {user!.avatarUrl && <AvatarImage src={user!.avatarUrl} alt={user!.name} />}
              <AvatarFallback className="text-[9px] font-medium">{getInitials(user!.name)}</AvatarFallback>
            </Avatar>
          ))}
          {overflowCount > 0 && (
            <AvatarGroupCount className="text-[9px]">+{overflowCount}</AvatarGroupCount>
          )}
        </AvatarGroup>
      </td>

      {/* Confidence */}
      <td className="px-3 py-3 text-right">
        <span className={cn("text-sm font-medium tabular-nums", confidence > 0 ? "text-foreground" : "text-muted-foreground")} aria-label={confidence > 0 ? `${confidence}% confidence` : "Pending"}>
          {confidence > 0 ? `${confidence}%` : "\u2014"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <div
          className="flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="group"
          aria-label="Project actions"
        >
          {/* Download Report */}
          {hasVersions ? (
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none",
                hasDocuments
                  ? "text-muted-foreground hover:text-nav-accent hover:bg-muted/50"
                  : "text-muted-foreground/60 cursor-not-allowed"
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
              className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/60 cursor-not-allowed"
              role="img"
              aria-label="Download report unavailable — no versions"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </span>
          )}

          {/* HIDDEN: Generate Submittal — re-enable when needed */}
          {SHOW_GENERATE_SUBMITTAL && (hasVersions ? (
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none",
                hasDocuments
                  ? "text-muted-foreground hover:text-nav-accent hover:bg-muted/50"
                  : "text-muted-foreground/60 cursor-not-allowed"
              )}
              aria-label={
                hasDocuments
                  ? `Generate submittal for ${project.name}`
                  : `No documents available for ${project.name}`
              }
              disabled={!hasDocuments}
              onClick={() => {
                if (hasDocuments) onGenerateSubmittal?.(project);
              }}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <span
              className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/60 cursor-not-allowed"
              role="img"
              aria-label="Generate submittal unavailable — no versions"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
            </span>
          ))}

          {/* Manage Team (admin only) */}
          {isAdmin && (
            <button
              type="button"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none text-muted-foreground hover:text-nav-accent hover:bg-muted/50"
              aria-label={`Manage team for ${project.name}`}
              title="Manage team"
              onClick={() => onManageTeam?.(project)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/*  Download Report Sheet (Right-side panel)                                   */
/* -------------------------------------------------------------------------- */

/** Score chip for report items — displays "PS: 98%" or "PI: 74%" in neutral style */
function ReportScoreChip({ label, score }: { label: string; score: number | undefined }) {
  if (score === undefined) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground">
      {label}: {score}%
    </span>
  );
}

/** Status filter options — validation statuses + decision statuses */
const REPORT_STATUS_OPTIONS: {
  key: string;
  label: string;
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  dotColor: string;
  kind: "validation" | "decision";
}[] = [
  { key: "pre_approved", label: "Pre-Approved (80-100%)", icon: CheckCircle2, color: "text-status-pre-approved", bgColor: "bg-status-pre-approved-bg", dotColor: "bg-status-pre-approved", kind: "validation" },
  { key: "review_required", label: "Review Required (70-79%)", icon: AlertTriangle, color: "text-status-review-required", bgColor: "bg-status-review-required-bg", dotColor: "bg-status-review-required", kind: "validation" },
  { key: "action_mandatory", label: "Action Required (0-69%)", icon: XCircle, color: "text-status-action-mandatory", bgColor: "bg-status-action-mandatory-bg", dotColor: "bg-status-action-mandatory", kind: "validation" },
  { key: "approved", label: "Approved (100%)", icon: CheckCircle2, color: "text-status-pre-approved", bgColor: "bg-status-pre-approved-bg", dotColor: "bg-status-pre-approved", kind: "decision" },
  { key: "revisit", label: "Revisit", icon: RotateCcw, color: "text-status-review-required", bgColor: "bg-status-review-required-bg", dotColor: "bg-status-review-required", kind: "decision" },
];

/* Mock project specification documents — matching overview page */
const mockReportProjectSpecs = [
  { id: "ps-1", fileName: "UCD_Project9592330_Project_Specification_Volume_1_2026-02.pdf", fileType: "pdf" as const, fileSize: 16482304, uploadedAt: "2026-02-05T09:00:00Z", totalPages: 342 },
  { id: "ps-2", fileName: "UCD_Project9592330_Project_Specification_Volume_2_2026-02.pdf", fileType: "pdf" as const, fileSize: 13107200, uploadedAt: "2026-02-05T09:05:00Z", totalPages: 278 },
];

/* Mock generated materials — revision tracking with download history */
const mockGeneratedMaterials = [
  {
    id: "gen-1",
    name: "UCD_HobbsVet_Plumbing_Submittal_Rev1",
    matrixSource: "Plumbing Matrix Index Grid v3",
    revision: "Rev 1",
    generatedAt: "2026-03-08T14:30:00Z",
    generatedBy: "Sarah Wilson",
    materialCount: 6,
    downloads: [
      { at: "2026-03-08T15:00:00Z", by: "Sarah Wilson" },
      { at: "2026-03-09T09:30:00Z", by: "James Chen" },
    ],
  },
  {
    id: "gen-2",
    name: "UCD_HobbsVet_Heating_Submittal_Rev1",
    matrixSource: "Heating Matrix Index Grid v3",
    revision: "Rev 1",
    generatedAt: "2026-03-08T14:35:00Z",
    generatedBy: "Sarah Wilson",
    materialCount: 5,
    downloads: [
      { at: "2026-03-08T16:00:00Z", by: "Sarah Wilson" },
    ],
  },
  {
    id: "gen-3",
    name: "UCD_HobbsVet_Mechanical_Submittal_Rev1",
    matrixSource: "Mechanical Matrix Index Grid v3",
    revision: "Rev 1",
    generatedAt: "2026-03-08T14:40:00Z",
    generatedBy: "Sarah Wilson",
    materialCount: 5,
    downloads: [],
  },
];

function formatReportFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DownloadReportSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  /* ---- All useState hooks MUST be before any early returns (React 19 strict) ---- */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "xlsx">("pdf");
  const [matrixHistoryOpen, setMatrixHistoryOpen] = useState(false);

  /* ---- Data from hook ---- */
  // TODO: Phase 2 — extract a lighter read-only hook to avoid unused internal state
  const versionId = project?.latestVersionId ?? "";
  const { allMaterials } = useMaterials(versionId);

  /* ---- Material matrix files (per-project) ---- */
  const projData = project ? getProjectOverviewData(project.id) : null;
  const currentMatrixFiles = projData?.currentMaterialFiles ?? [];
  const historicalMatrixFiles = projData?.historicalMaterialFiles ?? [];

  /* ---- Local filtering ---- */
  const filteredMaterials = allMaterials.filter((m) => {
    // Search filter
    if (search) {
      const lower = search.toLowerCase();
      const matchesSearch =
        m.document.fileName.toLowerCase().includes(lower) ||
        m.document.specSection.toLowerCase().includes(lower) ||
        m.document.specSectionTitle.toLowerCase().includes(lower);
      if (!matchesSearch) return false;
    }
    // Status filter — check both validation status and decision status
    if (statusFilter.size > 0) {
      if (m.validation?.status && statusFilter.has(m.validation.status)) return true;
      const decision = m.validation?.decision;
      if (decision && statusFilter.has(decision)) return true;
      return false;
    }
    return true;
  });

  /* ---- Status counts (from ALL materials, not filtered) ---- */
  const statusCountMap: Record<string, number> = {
    pre_approved: allMaterials.filter((m) => m.validation?.status === "pre_approved").length,
    review_required: allMaterials.filter((m) => m.validation?.status === "review_required").length,
    action_mandatory: allMaterials.filter((m) => m.validation?.status === "action_mandatory").length,
    approved: allMaterials.filter((m) => m.validation?.decision === "approved").length,
    revisit: allMaterials.filter((m) => m.validation?.decision === "revisit").length,
  };

  /* ---- Selection helpers ---- */
  const allSelected =
    filteredMaterials.length > 0 &&
    filteredMaterials.every((m) => selectedIds.has(m.document.id));

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      // Deselect all filtered items
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMaterials.forEach((m) => next.delete(m.document.id));
        return next;
      });
    } else {
      // Select all filtered items
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredMaterials.forEach((m) => next.add(m.document.id));
        return next;
      });
    }
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const handleExport = (format: "pdf" | "xlsx") => {
    setExportFormat(format);
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      toast.success(`Report exported as ${format === "pdf" ? "PDF" : "Excel"}`, {
        description: `${selectedIds.size} document${selectedIds.size !== 1 ? "s" : ""} included in the report.`,
      });
    }, 1500);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset ALL state when closing
      setSelectedIds(new Set());
      setSearch("");
      setStatusFilter(new Set());
      setStatusPopoverOpen(false);
      setExporting(false);
      setExportComplete(false);
      setExportFormat("pdf");
      setMatrixHistoryOpen(false);
    }
    onOpenChange(isOpen);
  };

  const activeFilterCount = statusFilter.size;
  const formatLabel = exportFormat === "pdf" ? "PDF" : "Excel";

  /* ---- Early return after all hooks ---- */
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="sm:max-w-[50vw] lg:max-w-2xl w-full flex flex-col p-0"
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
                  {selectedIds.size} document{selectedIds.size !== 1 ? "s" : ""} exported
                  successfully as {formatLabel}
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
          <Tabs defaultValue="material-matrix" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-3 shrink-0">
              <TabsList className="grid grid-cols-3 h-9 w-full">
                <TabsTrigger value="material-matrix" className="text-xs">Material Matrix</TabsTrigger>
                <TabsTrigger value="project-specs" className="text-xs">Project Specs</TabsTrigger>
                <TabsTrigger value="generated-materials" className="text-xs">Generated</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Material Matrix — overall matrix files with version history */}
            <TabsContent value="material-matrix" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
              {/* Header with select-all */}
              <div className="px-4 pt-3 pb-2 border-b shrink-0 bg-muted/20">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-semibold">Material Matrix Files</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
                    {currentMatrixFiles.length} {currentMatrixFiles.length === 1 ? "file" : "files"}
                  </Badge>
                </div>
                {currentMatrixFiles.length > 0 && (
                  <label className="flex items-center gap-1.5 mt-2 cursor-pointer">
                    <Checkbox
                      checked={currentMatrixFiles.length > 0 && currentMatrixFiles.every((f) => selectedIds.has(f.id))}
                      onCheckedChange={() => {
                        const allChecked = currentMatrixFiles.every((f) => selectedIds.has(f.id));
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          currentMatrixFiles.forEach((f) => allChecked ? next.delete(f.id) : next.add(f.id));
                          return next;
                        });
                      }}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-xs text-muted-foreground">Select all</span>
                  </label>
                )}
              </div>

              {/* File list — scrollable */}
              <ScrollArea className="flex-1 min-h-0">
                <div role="list" aria-label="Material matrix files">
                  {currentMatrixFiles.length > 0 ? (
                    <>
                      {/* Current files */}
                      {currentMatrixFiles.map((file) => {
                        const isChecked = selectedIds.has(file.id);
                        return (
                        <label
                          key={file.id}
                          role="listitem"
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-colors",
                            isChecked ? "bg-nav-accent/5 border-l-2 border-l-nav-accent" : "hover:bg-muted/30 border-l-2 border-l-transparent"
                          )}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleItem(file.id)}
                            className="shrink-0"
                          />
                          <div className="h-9 w-9 rounded-lg bg-status-pre-approved-bg flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-status-pre-approved" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate leading-tight">{file.fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{formatReportFileSize(file.fileSize)}</span>
                              {file.processedAt && (
                                <span className="text-xs text-muted-foreground">
                                  · {new Date(file.processedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {file.trade && (
                              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:ring-slate-700">
                                {file.trade}
                              </span>
                            )}
                            {file.version && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                {file.version}
                              </Badge>
                            )}
                            {file.confidence != null && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px] px-1.5 py-0 h-4",
                                  file.confidence >= 80
                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    : file.confidence >= 70
                                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                                      : "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                                )}
                              >
                                {file.confidence}%
                              </Badge>
                            )}
                          </div>
                        </label>
                        );
                      })}

                      {/* History section */}
                      {historicalMatrixFiles.length > 0 && (
                        <div className="border-b">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-muted/30 transition-colors text-left"
                            onClick={() => setMatrixHistoryOpen((prev) => !prev)}
                            aria-expanded={matrixHistoryOpen}
                          >
                            <span className="flex items-center gap-2">
                              <History className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-xs font-semibold text-muted-foreground">Version History</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                {historicalMatrixFiles.length}
                              </Badge>
                            </span>
                            <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", matrixHistoryOpen && "rotate-180")} aria-hidden="true" />
                          </button>

                          {matrixHistoryOpen && (
                            <div className="bg-muted/10">
                              {historicalMatrixFiles.map((file) => (
                                <div
                                  key={file.id}
                                  role="listitem"
                                  className="flex items-center gap-3 px-4 py-2.5 border-t border-border/30 hover:bg-muted/20 transition-colors"
                                >
                                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate text-muted-foreground leading-tight">{file.fileName}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[11px] text-muted-foreground">{formatReportFileSize(file.fileSize)}</span>
                                      {file.confidence != null && (
                                        <span className="text-[11px] text-muted-foreground font-medium">{file.confidence}%</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {file.version && (
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground">
                                        {file.version}
                                      </Badge>
                                    )}
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "text-[10px] px-1.5 py-0 h-4",
                                        file.approved
                                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {file.approved ? "Approved" : "Superseded"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                        <Layers className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No matrix files available</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-[220px]">
                        Material matrix files will appear here once uploaded and processed
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer — export */}
              <SheetFooter className="px-6 py-4 border-t shrink-0">
                <div className="flex items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => handleExport("xlsx")}
                    disabled={selectedIds.size === 0 || exporting}
                    className="flex-1"
                    aria-label={selectedIds.size === 0 ? "Select files to export as Excel" : `Export ${selectedIds.size} file${selectedIds.size !== 1 ? "s" : ""} as Excel`}
                  >
                    {exporting && exportFormat === "xlsx" ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        Exporting…
                      </>
                    ) : (
                      <>
                        <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Export Excel{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    disabled={selectedIds.size === 0 || exporting}
                    className="flex-1 gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity"
                    aria-label={selectedIds.size === 0 ? "Select files to export as PDF" : `Export ${selectedIds.size} file${selectedIds.size !== 1 ? "s" : ""} as PDF`}
                  >
                    {exporting && exportFormat === "pdf" ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        Exporting…
                      </>
                    ) : (
                      <>
                        <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                        Export PDF{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                      </>
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </TabsContent>

            {/* Tab 2: Project Specifications */}
            <TabsContent value="project-specs" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
              {/* Select all header */}
              <div className="px-4 pt-3 pb-2 border-b shrink-0 bg-muted/20">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={mockReportProjectSpecs.length > 0 && mockReportProjectSpecs.every((s) => selectedIds.has(s.id))}
                    onCheckedChange={() => {
                      const allChecked = mockReportProjectSpecs.every((s) => selectedIds.has(s.id));
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        mockReportProjectSpecs.forEach((s) => allChecked ? next.delete(s.id) : next.add(s.id));
                        return next;
                      });
                    }}
                    className="h-3.5 w-3.5"
                  />
                  <span className="text-xs text-muted-foreground">Select all</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
                    {mockReportProjectSpecs.length} {mockReportProjectSpecs.length === 1 ? "file" : "files"}
                  </Badge>
                </label>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="divide-y" role="list" aria-label="Project specification documents">
                  {mockReportProjectSpecs.map((spec) => {
                    const isChecked = selectedIds.has(spec.id);
                    return (
                    <label
                      key={spec.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                        isChecked ? "bg-nav-accent/5 border-l-2 border-l-nav-accent" : "hover:bg-muted/30 border-l-2 border-l-transparent"
                      )}
                      role="listitem"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(spec.id)}
                        className="shrink-0"
                      />
                      <div className="h-9 w-9 rounded-lg bg-ds-primary-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-ds-primary-800" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{spec.fileName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-muted-foreground">{formatReportFileSize(spec.fileSize)}</span>
                          <span className="text-[11px] text-muted-foreground">{spec.totalPages} pages</span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(spec.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </label>
                    );
                  })}
                </div>
              </ScrollArea>
              <SheetFooter className="px-6 py-4 border-t shrink-0">
                <div className="flex items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const count = selectedIds.size > 0 ? selectedIds.size : mockReportProjectSpecs.length;
                      toast.success("Project specifications downloaded", { description: `${count} file${count !== 1 ? "s" : ""} exported.` });
                    }}
                    disabled={selectedIds.size === 0}
                    className="flex-1"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Export Excel{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                  </Button>
                  <Button
                    className="flex-1 gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity"
                    disabled={selectedIds.size === 0}
                    onClick={() => {
                      const count = selectedIds.size > 0 ? selectedIds.size : mockReportProjectSpecs.length;
                      toast.success("Project specifications downloaded", { description: `${count} file${count !== 1 ? "s" : ""} exported as PDF.` });
                    }}
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Export PDF{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                  </Button>
                </div>
              </SheetFooter>
            </TabsContent>

            {/* Tab 3: Generated Materials */}
            <TabsContent value="generated-materials" className="flex-1 min-h-0 flex flex-col mt-0 data-[state=inactive]:hidden">
              {/* Select all header */}
              {mockGeneratedMaterials.length > 0 && (
                <div className="px-4 pt-3 pb-2 border-b shrink-0 bg-muted/20">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={mockGeneratedMaterials.length > 0 && mockGeneratedMaterials.every((g) => selectedIds.has(g.id))}
                      onCheckedChange={() => {
                        const allChecked = mockGeneratedMaterials.every((g) => selectedIds.has(g.id));
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          mockGeneratedMaterials.forEach((g) => allChecked ? next.delete(g.id) : next.add(g.id));
                          return next;
                        });
                      }}
                      className="h-3.5 w-3.5"
                    />
                    <span className="text-xs text-muted-foreground">Select all</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 ml-auto">
                      {mockGeneratedMaterials.length} {mockGeneratedMaterials.length === 1 ? "file" : "files"}
                    </Badge>
                  </label>
                </div>
              )}
              <ScrollArea className="flex-1 min-h-0">
                <div className="divide-y" role="list" aria-label="Generated submittal materials">
                  {mockGeneratedMaterials.length > 0 ? (
                    mockGeneratedMaterials.map((gen) => {
                      const isChecked = selectedIds.has(gen.id);
                      return (
                      <label
                        key={gen.id}
                        className={cn(
                          "block px-4 py-3 cursor-pointer transition-colors",
                          isChecked ? "bg-nav-accent/5 border-l-2 border-l-nav-accent" : "hover:bg-muted/30 border-l-2 border-l-transparent"
                        )}
                        role="listitem"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleItem(gen.id)}
                            className="shrink-0"
                          />
                          <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-white" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{gen.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                              Source: {gen.matrixSource}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                            {gen.revision}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 ml-[4.25rem] text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {new Date(gen.generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                          <span>{gen.materialCount} materials</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" aria-hidden="true" />
                            {gen.generatedBy}
                          </span>
                          {gen.downloads.length > 0 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                              {gen.downloads.length} download{gen.downloads.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </label>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No generated materials yet</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                        Generate a submittal to see revision history here
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              {mockGeneratedMaterials.length > 0 && (
                <SheetFooter className="px-6 py-4 border-t shrink-0">
                  <div className="flex items-center gap-3 w-full">
                    <Button
                      variant="outline"
                      disabled={selectedIds.size === 0}
                      onClick={() => toast.success(`Exporting ${selectedIds.size} generated material${selectedIds.size !== 1 ? "s" : ""} as Excel`)}
                      className="flex-1"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Export Excel{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                    </Button>
                    <Button
                      className="flex-1 gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity"
                      disabled={selectedIds.size === 0}
                      onClick={() => toast.success(`Exporting ${selectedIds.size} generated material${selectedIds.size !== 1 ? "s" : ""} as PDF`)}
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Export PDF{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export function ProjectList({
  overviewBasePath,
  createHref,
  showPriority = false,
}: {
  /** When provided, project cards navigate to `${overviewBasePath}/${projectId}/overview` */
  overviewBasePath?: string;
  /** Override the "Create New Project" link href (defaults to "/projects/create") */
  createHref?: string;
  /** Show priority badge on project cards (V4 only) */
  showPriority?: boolean;
} = {}) {
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

  // Generate Submittal sheet
  const [submittalSheetOpen, setSubmittalSheetOpen] = useState(false);
  const [submittalProject, setSubmittalProject] = useState<Project | null>(null);

  // Team Access sheet
  const [teamSheetOpen, setTeamSheetOpen] = useState(false);
  const [teamProject, setTeamProject] = useState<Project | null>(null);


  // TODO: Phase 2 — replace with real extraction status polling
  const [completedExtractions, setCompletedExtractions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const extractingIds = projects
      .filter((p) => p.status === "extracting" && !completedExtractions.has(p.id))
      .map((p) => p.id);

    if (extractingIds.length === 0) return;

    const timer = setTimeout(() => {
      setCompletedExtractions((prev) => {
        const next = new Set(prev);
        extractingIds.forEach((id) => next.add(id));
        return next;
      });

      // Fire a toast for each newly completed extraction
      extractingIds.forEach((id) => {
        const project = projects.find((p) => p.id === id);
        if (project) {
          toast.success(`${project.name} is ready for review!`, {
            description: "Document extraction complete. You can now access the project.",
          });
        }
      });
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [projects, completedExtractions]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  const handleDownloadReport = (project: Project) => {
    setReportProject(project);
    setReportSheetOpen(true);
  };

  const handleGenerateSubmittal = (project: Project) => {
    setSubmittalProject(project);
    setSubmittalSheetOpen(true);
  };

  const handleManageTeam = (project: Project) => {
    setTeamProject(project);
    setTeamSheetOpen(true);
  };

  // Override extracting → active for completed extractions
  const enrichedProjects = projects.map((p) =>
    completedExtractions.has(p.id) ? { ...p, status: "active" as const } : p
  );

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero section */}
      <HeroSection createHref={createHref} />

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
      {enrichedProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try adjusting your search or filters, or create a new project to get started."
        >
          <Link
            href={createHref ?? "/projects/create"}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-sm font-semibold gradient-action text-white border-0 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Project
          </Link>
        </EmptyState>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {enrichedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onNameClick={handleCardClick}
              onDownloadReport={handleDownloadReport}
              onGenerateSubmittal={handleGenerateSubmittal}
              onManageTeam={handleManageTeam}
              isAdmin={true}
              overviewHrefOverride={overviewBasePath ? `${overviewBasePath}/${project.id}/overview` : undefined}
              showPriority={showPriority}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <table className="w-full table-fixed" aria-label="Projects list">
            <colgroup>
              <col className="w-[18%]" /> {/* Project */}
              <col className="w-[12%]" /> {/* Type */}
              <col className="w-[11%]" /> {/* Location */}
              <col className="w-[13%]" /> {/* Company */}
              <col className="w-[10%]" /> {/* Status */}
              <col className="w-[8%]" />  {/* Priority */}
              <col className="w-[10%]" /> {/* Team */}
              <col className="w-[7%]" />  {/* Confidence */}
              <col className="w-[11%]" /> {/* Actions */}
            </colgroup>
            <thead>
              <tr className="border-b bg-muted/30 text-xs font-medium text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">Project</th>
                <th className="px-3 py-2.5 text-left font-medium">Type</th>
                <th className="px-3 py-2.5 text-left font-medium">Location</th>
                <th className="px-3 py-2.5 text-left font-medium">Company</th>
                <th className="px-3 py-2.5 text-left font-medium">Status</th>
                <th className="px-3 py-2.5 text-left font-medium">Priority</th>
                <th className="px-3 py-2.5 text-left font-medium">Team</th>
                <th className="px-3 py-2.5 text-right font-medium">Conf.</th>
                <th className="px-3 py-2.5 text-left font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {enrichedProjects.map((project) => (
                <ProjectListRow
                  key={project.id}
                  project={project}
                  onNameClick={handleCardClick}
                  onDownloadReport={handleDownloadReport}
                  onGenerateSubmittal={handleGenerateSubmittal}
                  onManageTeam={handleManageTeam}
                  isAdmin={true}
                  overviewHrefOverride={overviewBasePath ? `${overviewBasePath}/${project.id}/overview` : undefined}
                />
              ))}
            </tbody>
          </table>
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

      {/* HIDDEN: Generate Submittal Sheet — re-enable when needed */}
      {SHOW_GENERATE_SUBMITTAL && (
        <GenerateSubmittalSheet
          project={submittalProject}
          open={submittalSheetOpen}
          onOpenChange={setSubmittalSheetOpen}
        />
      )}

      {/* Team Access Sheet */}
      <TeamAccessSheet
        project={teamProject}
        open={teamSheetOpen}
        onOpenChange={setTeamSheetOpen}
      />
    </div>
  );
}
