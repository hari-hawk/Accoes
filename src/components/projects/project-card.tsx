"use client";

import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  FileBarChart,
  MapPin,
  Calendar,
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
import { PROJECT_STAGE_CONFIG } from "@/lib/constants";
import { mockUsers } from "@/data/mock-users";
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
  onCardClick,
}: {
  project: Project;
  onCardClick?: (project: Project) => void;
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
  const stageConfig = PROJECT_STAGE_CONFIG[project.stage];

  // Resolve member IDs to user objects (show max 3)
  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);
  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  // Action link hrefs
  const overviewHref = `/projects/${project.id}/versions/${project.latestVersionId}`;
  const conformanceHref = `/projects/${project.id}/versions/${project.latestVersionId}/review`;
  const reportHref = `/projects/${project.id}/versions/${project.latestVersionId}/export`;

  return (
    <div className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover-lift overflow-hidden animate-fade-up">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Clickable card body */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => onCardClick?.(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCardClick?.(project);
          }
        }}
      >
        {/* Row 1: Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold truncate group-hover:text-nav-accent transition-colors">
              {project.name}
            </h3>
            <p className="mt-0.5 text-xs font-mono text-muted-foreground">
              {project.jobId}
            </p>
          </div>
          <StatusIndicator status={project.status} />
        </div>

        {/* Row 2: Location + Created date */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(project.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Row 3: Stage as text field + Avatar stack */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">Stage:</span>
            <span className={cn("font-medium", stageConfig.color)}>
              {stageConfig.label}
            </span>
          </div>

          {/* Avatar stack with mock profile images */}
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

        {/* Row 4: Confidence bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Confidence
            </span>
            <span className={cn("font-bold", confidenceColor)}>
              {confidence > 0 ? `${confidence}%` : "Pending"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", barColor)}
              style={{ width: confidence > 0 ? `${confidence}%` : "0%" }}
            />
          </div>
        </div>

        {/* Row 5: Breakdown mini-badges */}
        <div className="mt-3 flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-status-pre-approved">
            <CheckCircle2 className="h-3 w-3" />
            <span className="font-medium">{project.confidenceSummary.preApproved}</span>
          </div>
          <div className="flex items-center gap-1 text-status-review-required">
            <AlertTriangle className="h-3 w-3" />
            <span className="font-medium">{project.confidenceSummary.reviewRequired}</span>
          </div>
          <div className="flex items-center gap-1 text-status-action-mandatory">
            <XCircle className="h-3 w-3" />
            <span className="font-medium">{project.confidenceSummary.actionMandatory}</span>
          </div>
        </div>

        {/* Row 6: 3 icon+text action links */}
        <div
          className="mt-4 pt-3 border-t flex items-center gap-4"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {hasVersions ? (
            <>
              <Link
                href={overviewHref}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-nav-accent transition-colors font-medium"
              >
                <Eye className="h-3.5 w-3.5" />
                Overview
              </Link>
              <Link
                href={conformanceHref}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-nav-accent transition-colors font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Conformance
              </Link>
              <Link
                href={reportHref}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-nav-accent transition-colors font-medium"
              >
                <FileBarChart className="h-3.5 w-3.5" />
                Report
              </Link>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50 font-medium cursor-not-allowed">
                <Eye className="h-3.5 w-3.5" />
                Overview
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50 font-medium cursor-not-allowed">
                <ShieldCheck className="h-3.5 w-3.5" />
                Conformance
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50 font-medium cursor-not-allowed">
                <FileBarChart className="h-3.5 w-3.5" />
                Report
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
