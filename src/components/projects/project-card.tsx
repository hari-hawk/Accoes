"use client";

import Link from "next/link";
import {
  Download,
  Loader2,
  Plus,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { mockUsers } from "@/data/mock-users";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { getVersionsByProject } from "@/data/mock-versions";
import { cn } from "@/lib/utils";
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

const PRIORITY_PILL_CONFIG: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40" },
  medium: { label: "Medium", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40" },
  low: { label: "Low", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
};

export function ProjectCard({
  project,
  onNameClick,
  onDownloadReport,
  onGenerateSubmittal,
  onManageTeam,
  isAdmin = false,
  overviewHrefOverride,
  showPriority = false,
}: {
  project: Project;
  onNameClick?: (project: Project) => void;
  onDownloadReport?: (project: Project) => void;
  onGenerateSubmittal?: (project: Project) => void;
  onManageTeam?: (project: Project) => void;
  isAdmin?: boolean;
  /** Override the default overview navigation href */
  overviewHrefOverride?: string;
  /** Show priority badge on the card (V4 only) */
  showPriority?: boolean;
}) {
  const { preApproved, reviewRequired, actionMandatory, total } = project.confidenceSummary;

  const hasVersions = !!project.latestVersionId;

  // Check if project has documents in its latest version
  const hasDocuments = hasVersions && getDocumentsByVersion(
    getVersionsByProject(project.id).find((v) => v.id === project.latestVersionId)?.id ?? ""
  ).length > 0;

  const isExtracting = project.status === "extracting";

  // Resolve member IDs to user objects (show max 3)
  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);
  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  // Navigation href — always goes to overview page when versions exist
  const overviewHref = overviewHrefOverride ?? (hasVersions
    ? `/projects/${project.id}/versions/${project.latestVersionId}`
    : "#");

  // Card content (shared between Link and div wrappers)
  const cardContent = (
    <>
      {/* Top accent line */}
      {isExtracting ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-100 dark:bg-amber-900/30 overflow-hidden" aria-label="Extraction in progress">
          <div className="h-full w-1/3 bg-amber-400 dark:bg-amber-500 rounded-full animate-indeterminate" />
        </div>
      ) : (
        <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      )}

      <div className="px-4 py-4">
        {/* Row 1: Name + Job ID + Status Pill */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate transition-colors">
              <button
                type="button"
                className="hover:underline hover:text-nav-accent cursor-pointer transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onNameClick?.(project);
                }}
              >
                {project.name}
              </button>
            </h3>
            <p className="mt-1 text-xs font-mono text-muted-foreground">
              {project.jobId}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {showPriority && project.priority && (
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                PRIORITY_PILL_CONFIG[project.priority]?.className ?? ""
              )}>
                {PRIORITY_PILL_CONFIG[project.priority]?.label ?? project.priority}
              </span>
            )}
            <StatusIndicator status={project.status} />
          </div>
        </div>

        {/* Row 2: 2-column metadata grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-3 gap-x-5">
          <div>
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Type</div>
            <div className="text-xs text-foreground">
              {project.projectType === "dr" ? "Discrepancy Report" : "Design Job"}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Company</div>
            <div className="text-xs text-foreground truncate" title={project.client}>{project.client}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Location</div>
            <div className="text-xs text-foreground">{project.location}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground font-medium mb-0.5">Team</div>
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
              {isAdmin && (
                <button
                  type="button"
                  className="size-6 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-nav-accent hover:bg-nav-accent/5 transition-colors ml-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onManageTeam?.(project);
                  }}
                  aria-label={`Add team member to ${project.name}`}
                  title="Manage team"
                >
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </AvatarGroup>
          </div>
        </div>

        {/* Row 3: Status counts */}
        <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center gap-4 flex-wrap" aria-label="Validation breakdown">
          {isExtracting ? (
            <span className="text-xs text-muted-foreground italic">Processing documents...</span>
          ) : total > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`${preApproved} pre-approved`}>
                <span className="h-2 w-2 rounded-full bg-status-pre-approved shrink-0" aria-hidden="true" />
                <span className="font-bold text-sm text-foreground">{preApproved}</span>
                Pre-Approved
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`${reviewRequired} review required`}>
                <span className="h-2 w-2 rounded-full bg-status-review-required shrink-0" aria-hidden="true" />
                <span className="font-bold text-sm text-foreground">{reviewRequired}</span>
                Review Required
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`${actionMandatory} action required`}>
                <span className="h-2 w-2 rounded-full bg-status-action-mandatory shrink-0" aria-hidden="true" />
                <span className="font-bold text-sm text-foreground">{actionMandatory}</span>
                Action Required
              </span>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground italic">No documents</span>
          )}
        </div>
      </div>

      {/* Footer: Download Report | Generate Submittal */}
      <div
        className="px-4 py-2 border-t bg-muted/20 flex items-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="group"
        aria-label="Quick actions"
      >
        {/* Three-way: extracting -> processing text, no versions -> disabled spans, normal -> active buttons */}
        {isExtracting ? (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Processing documents...
          </span>
        ) : !hasVersions ? (
          <>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-medium cursor-not-allowed">
              <Download className="h-3 w-3" aria-hidden="true" />
              Download Report
            </span>
            {/* HIDDEN: Generate Submittal — re-enable when needed */}
            {SHOW_GENERATE_SUBMITTAL && (
              <>
                <div className="w-px h-3.5 bg-border mx-3" aria-hidden="true" />
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-medium cursor-not-allowed">
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  Generate Submittal
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 rounded-sm outline-none px-0.5",
                hasDocuments
                  ? "text-muted-foreground hover:text-nav-accent"
                  : "text-muted-foreground/60 cursor-not-allowed"
              )}
              disabled={!hasDocuments}
              onClick={(e) => {
                e.preventDefault();
                if (hasDocuments) onDownloadReport?.(project);
              }}
              aria-label={hasDocuments ? `Download report for ${project.name}` : `No documents available for ${project.name}`}
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              Download Report
            </button>
            {/* HIDDEN: Generate Submittal — re-enable when needed */}
            {SHOW_GENERATE_SUBMITTAL && (
              <>
                {/* Pipe separator */}
                <div className="w-px h-3.5 bg-border mx-3" aria-hidden="true" />
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 rounded-sm outline-none px-0.5",
                    hasDocuments
                      ? "text-muted-foreground hover:text-nav-accent"
                      : "text-muted-foreground/60 cursor-not-allowed"
                  )}
                  disabled={!hasDocuments}
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasDocuments) onGenerateSubmittal?.(project);
                  }}
                  aria-label={hasDocuments ? `Generate submittal for ${project.name}` : `No documents available for ${project.name}`}
                >
                  <FileText className="h-3 w-3" aria-hidden="true" />
                  Generate Submittal
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );

  // Wrapper: extracting state — non-navigable, shows toast
  if (isExtracting) {
    return (
      <article
        className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 overflow-hidden animate-fade-up opacity-90 cursor-not-allowed"
        aria-label={`${project.name} — Extracting documents`}
        onClick={() => {
          toast.warning("Document extraction & conformance report in progress.", {
            description: "We'll notify you once it's ready.",
          });
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toast.warning("Document extraction & conformance report in progress.", {
              description: "We'll notify you once it's ready.",
            });
          }
        }}
      >
        {cardContent}
      </article>
    );
  }

  // Wrapper: <Link> for navigable cards, <div> with click handler for non-version cards
  if (hasVersions) {
    return (
      <article
        className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover-lift overflow-hidden animate-fade-up"
        aria-label={`${project.name} — ${project.jobId}`}
      >
        <Link
          href={overviewHref}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-inset"
          aria-label={`Open overview for ${project.name}`}
        >
          {cardContent}
        </Link>
      </article>
    );
  }

  return (
    <article
      className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover-lift overflow-hidden animate-fade-up cursor-pointer"
      aria-label={`${project.name} — ${project.jobId}`}
      onClick={() => onNameClick?.(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNameClick?.(project);
        }
      }}
    >
      {cardContent}
    </article>
  );
}
