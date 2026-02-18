"use client";

import Link from "next/link";
import {
  Download,
  MapPin,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProjectCard({
  project,
  onNameClick,
  onDownloadReport,
}: {
  project: Project;
  onNameClick?: (project: Project) => void;
  onDownloadReport?: (project: Project) => void;
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

  const barColor =
    confidence >= 80
      ? "bg-status-pre-approved"
      : confidence >= 60
        ? "bg-status-review-required"
        : confidence > 0
          ? "bg-status-action-mandatory"
          : "bg-muted-foreground/30";

  const hasVersions = !!project.latestVersionId;

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

  // Navigation href — always goes to overview page when versions exist
  const overviewHref = hasVersions
    ? `/projects/${project.id}/versions/${project.latestVersionId}`
    : "#";

  // Card content (shared between Link and div wrappers)
  const cardContent = (
    <>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />

      <div className="px-4 pt-3.5 pb-3">
        {/* Row 1: Name + Job ID + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
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
              <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                {project.jobId}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{project.location}</span>
            </div>
          </div>
          <StatusIndicator status={project.status} />
        </div>

        {/* Row 2: Confidence bar + percentage */}
        <div className="mt-2.5" aria-label={`Confidence: ${confidence > 0 ? `${confidence}%` : "Pending"}`}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Confidence
            </span>
            <span className={cn("font-bold text-xs", confidenceColor)}>
              {confidence > 0 ? `${confidence}%` : "Pending"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={confidence} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={cn("h-full rounded-full transition-all duration-500", barColor)}
              style={{ width: confidence > 0 ? `${confidence}%` : "0%" }}
            />
          </div>
        </div>

        {/* Row 3: Breakdown badges + Avatar stack */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[11px]" aria-label="Validation breakdown">
            <div className="flex items-center gap-0.5 text-status-pre-approved" aria-label={`${project.confidenceSummary.preApproved} pre-approved`}>
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              <span className="font-medium">{project.confidenceSummary.preApproved}</span>
            </div>
            <div className="flex items-center gap-0.5 text-status-review-required" aria-label={`${project.confidenceSummary.reviewRequired} review required`}>
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              <span className="font-medium">{project.confidenceSummary.reviewRequired}</span>
            </div>
            <div className="flex items-center gap-0.5 text-status-action-mandatory" aria-label={`${project.confidenceSummary.actionMandatory} action mandatory`}>
              <XCircle className="h-3 w-3" aria-hidden="true" />
              <span className="font-medium">{project.confidenceSummary.actionMandatory}</span>
            </div>
          </div>
          <AvatarGroup>
            {visibleMembers.map((user) => (
              <Avatar key={user!.id} size="sm">
                {user!.avatarUrl && (
                  <AvatarImage src={user!.avatarUrl} alt={user!.name} />
                )}
                <AvatarFallback className="text-[9px] font-medium">
                  {getInitials(user!.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflowCount > 0 && (
              <AvatarGroupCount className="text-[9px]">
                +{overflowCount}
              </AvatarGroupCount>
            )}
          </AvatarGroup>
        </div>
      </div>

      {/* Footer: Download Report action */}
      <div
        className="px-4 py-2 border-t bg-muted/20 flex items-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="group"
        aria-label="Quick actions"
      >
        {hasVersions ? (
          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 rounded-sm outline-none px-0.5",
              hasDocuments
                ? "text-muted-foreground hover:text-nav-accent"
                : "text-muted-foreground/40 cursor-not-allowed"
            )}
            disabled={!hasDocuments}
            onClick={(e) => {
              e.preventDefault();
              if (hasDocuments) onDownloadReport?.(project);
            }}
            aria-label={
              hasDocuments
                ? `Download report for ${project.name}`
                : `No documents available for ${project.name}`
            }
          >
            <Download className="h-3 w-3" aria-hidden="true" />
            Download Report
          </button>
        ) : (
          <span
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 font-medium cursor-not-allowed"
            aria-label="Download report unavailable — no versions"
          >
            <Download className="h-3 w-3" aria-hidden="true" />
            Download Report
          </span>
        )}
      </div>
    </>
  );

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
