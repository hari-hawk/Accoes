"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { ConfidenceSummary } from "@/components/shared/confidence-summary";
import { DateDisplay } from "@/components/shared/date-display";
import type { Version, Project } from "@/data/types";

export function VersionInfoHeader({
  version,
  project,
  onProjectNameClick,
  actions,
}: {
  version: Version;
  project: Project;
  onProjectNameClick?: () => void;
  /** Optional action buttons rendered on the right side */
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
          <Link href="/projects" aria-label="Back to projects">
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <button
            type="button"
            className="text-sm font-semibold truncate hover:underline hover:text-nav-accent transition-colors cursor-pointer"
            onClick={() => onProjectNameClick?.()}
            aria-label={`View details for ${project.name}`}
          >
            {project.name}
          </button>
          <StatusIndicator status={version.status} />
          <span className="text-[10px] text-muted-foreground/40 hidden sm:inline">|</span>
          <span className="text-xs text-muted-foreground truncate shrink-0">
            {project.client}
          </span>
          <span className="text-xs font-mono text-muted-foreground shrink-0">
            {project.jobId}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <FileText className="h-3 w-3" />
            {version.documentIds.length} docs
          </div>
          <DateDisplay date={version.updatedAt} className="text-xs shrink-0" />
          {version.confidenceSummary.total > 0 && (
            <>
              <span className="text-[10px] text-muted-foreground/40 hidden sm:inline">|</span>
              <ConfidenceSummary data={version.confidenceSummary} size="sm" />
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
