"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { cn } from "@/lib/utils";
import type { Version, Project, ConfidenceSummary as ConfidenceSummaryType } from "@/data/types";

/** Compact inline confidence bar for headers — stacked colored segments */
function InlineConfidenceBar({ data }: { data: ConfidenceSummaryType }) {
  if (data.total === 0) return null;
  const paPct = Math.round((data.preApproved / data.total) * 100);
  const rrPct = Math.round((data.reviewRequired / data.total) * 100);
  const amPct = Math.round((data.actionMandatory / data.total) * 100);

  const scoreColor =
    data.overallConfidence >= 80
      ? "text-status-pre-approved"
      : data.overallConfidence >= 60
        ? "text-status-review-required"
        : "text-status-action-mandatory";

  return (
    <div className="flex items-center gap-2 shrink-0" aria-label={`Confidence ${data.overallConfidence}%`}>
      <span className={cn("text-xs font-bold tabular-nums", scoreColor)}>
        {data.overallConfidence}%
      </span>
      <div className="flex h-1.5 w-16 rounded-full overflow-hidden bg-muted">
        {paPct > 0 && (
          <div
            className="bg-status-pre-approved transition-all"
            style={{ width: `${paPct}%` }}
          />
        )}
        {rrPct > 0 && (
          <div
            className="bg-status-review-required transition-all"
            style={{ width: `${rrPct}%` }}
          />
        )}
        {amPct > 0 && (
          <div
            className="bg-status-action-mandatory transition-all"
            style={{ width: `${amPct}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function VersionInfoHeader({
  version,
  project,
  onProjectNameClick,
  actions,
  backHref,
}: {
  version: Version;
  project: Project;
  onProjectNameClick?: () => void;
  /** Optional action buttons rendered on the right side */
  actions?: React.ReactNode;
  /** Override back button destination (defaults to "/projects") */
  backHref?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
          <Link href={backHref ?? "/projects"} aria-label="Back to projects">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="text-sm font-semibold truncate hover:underline hover:text-nav-accent transition-colors cursor-pointer"
            onClick={() => onProjectNameClick?.()}
            aria-label={`View details for ${project.name}`}
          >
            {project.name}
          </button>
          <StatusIndicator status={version.status} />
          <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">|</span>
          <span className="text-xs text-muted-foreground truncate shrink-0">
            {project.client}
          </span>
          <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">|</span>
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            {project.jobId}
          </span>
          {version.confidenceSummary.total > 0 && (
            <>
              <span className="text-[11px] text-muted-foreground/60 hidden sm:inline">|</span>
              <InlineConfidenceBar data={version.confidenceSummary} />
            </>
          )}
        </div>
      </div>
      {actions && (
        <div className="shrink-0 ml-4 flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
