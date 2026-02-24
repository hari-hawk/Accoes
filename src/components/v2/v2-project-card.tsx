"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import type { Project } from "@/data/types";

/* Left-edge color based on project stage */
const STAGE_BORDER_COLOR: Record<string, string> = {
  pre_approved: "border-l-status-pre-approved",
  approved: "border-l-status-pre-approved",
  review_required: "border-l-status-review-required",
  action_mandatory: "border-l-status-action-mandatory",
};

interface V2ProjectCardProps {
  project: Project;
  index: number;
}

export function V2ProjectCard({ project, index }: V2ProjectCardProps) {
  const router = useRouter();
  const confidence = project.confidenceSummary.overallConfidence;
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  const overviewHref = project.latestVersionId
    ? `/projects/${project.id}/versions/${project.latestVersionId}`
    : `/projects/create`;

  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-ds-neutral-600";

  const borderColor = STAGE_BORDER_COLOR[project.stage] ?? "border-l-ds-primary-500";

  const handleClick = () => {
    router.push(overviewHref);
  };

  const updatedDate = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { preApproved, reviewRequired, actionMandatory, total } = project.confidenceSummary;
  const reviewedCount = preApproved + reviewRequired + actionMandatory;

  return (
    <div
      className={cn(
        "group bg-card border border-ds-neutral-200 rounded-lg border-l-[3px] cursor-pointer",
        "transition-all duration-150 ease-out",
        "hover:border-ds-neutral-300 hover:bg-ds-neutral-100/50 hover:shadow-sm",
        "focus-visible:ring-2 focus-visible:ring-ds-primary-500 focus-visible:ring-offset-1 outline-none",
        borderColor,
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleClick}
      role="article"
      tabIndex={0}
      aria-label={`${project.name} — ${statusConfig.label}, ${confidence > 0 ? `${confidence}% confidence` : "pending review"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="px-5 py-4">
        {/* Line 1: Project name + Status badge */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-foreground truncate">
            {project.name}
          </h3>
          <Badge
            variant="secondary"
            className={cn(
              "rounded-md text-[11px] font-medium border-0 shrink-0 uppercase tracking-wide",
              statusConfig.color
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Line 2: Client • Job ID • Location */}
        <p className="text-xs text-ds-neutral-500 mt-1 truncate">
          {project.client}
          <span className="mx-1.5 text-ds-neutral-300">•</span>
          {project.jobId}
          <span className="mx-1.5 text-ds-neutral-300">•</span>
          {project.location}
        </p>

        {/* Line 3: Metrics row + Open action */}
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-ds-neutral-100">
          <div className="flex items-center gap-6">
            {/* Confidence */}
            <div>
              <p className={cn("text-lg font-semibold leading-tight", confidenceColor)}>
                {confidence > 0 ? `${confidence}%` : "—"}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ds-neutral-600 mt-0.5">
                Confidence
              </p>
            </div>
            {/* Items */}
            <div>
              <p className="text-lg font-semibold leading-tight text-foreground">
                {total > 0 ? reviewedCount : "—"}
                {total > 0 && (
                  <span className="text-sm font-normal text-ds-neutral-600">
                    /{total}
                  </span>
                )}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ds-neutral-600 mt-0.5">
                Reviewed
              </p>
            </div>
            {/* Updated */}
            <div>
              <p className="text-sm font-medium leading-tight text-foreground">
                {updatedDate}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ds-neutral-600 mt-0.5">
                Updated
              </p>
            </div>
          </div>

          {/* Open action — visible on hover */}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-ds-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            Open
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
