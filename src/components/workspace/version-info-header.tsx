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
}: {
  version: Version;
  project: Project;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
          <Link href="/projects" aria-label="Back to projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold truncate">{project.name}</h1>
            <span className="text-muted-foreground shrink-0">/</span>
            <span className="text-sm font-medium truncate">{version.name}</span>
            <StatusIndicator status={version.status} />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground truncate">
              {version.specificationRef}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <FileText className="h-3 w-3" />
              {version.documentIds.length} docs
            </div>
            <DateDisplay date={version.updatedAt} className="text-xs shrink-0" />
          </div>
        </div>
      </div>
      {version.confidenceSummary.total > 0 && (
        <div className="shrink-0 ml-4">
          <ConfidenceSummary data={version.confidenceSummary} size="md" />
        </div>
      )}
    </div>
  );
}
