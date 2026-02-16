"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Users,
  Play,
  FileBarChart,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { ConfidenceSummary } from "@/components/shared/confidence-summary";
import { DateDisplay } from "@/components/shared/date-display";
import { getVersionsByProject } from "@/data/mock-versions";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/types";

export function ProjectCard({
  project,
  onCardClick,
}: {
  project: Project;
  onCardClick?: (project: Project) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const versions = getVersionsByProject(project.id);

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

  const openHref = project.latestVersionId
    ? `/projects/${project.id}/versions/${project.latestVersionId}`
    : `/projects/${project.id}`;

  const reportHref = project.latestVersionId
    ? `/projects/${project.id}/versions/${project.latestVersionId}/export`
    : `/projects/${project.id}`;

  return (
    <div className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover overflow-hidden">
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
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold truncate group-hover:text-nav-accent transition-colors">
              {project.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground truncate">
              {project.client}
            </p>
          </div>
          <StatusIndicator status={project.status} />
        </div>

        {/* Confidence bar — always shown */}
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

        {/* Breakdown mini-badges — always shown */}
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

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{project.memberIds.length} members</span>
          </div>
          <div className="ml-auto">
            <DateDisplay date={project.updatedAt} />
          </div>
        </div>

        {/* Actions — stop propagation so card click doesn't trigger */}
        <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-8 rounded-lg"
          >
            <Link href={openHref}>
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              Open
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 rounded-lg">
            <Play className="mr-1 h-3.5 w-3.5" />
            New Run
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs h-8 rounded-lg"
          >
            <Link href={reportHref}>
              <FileBarChart className="mr-1 h-3.5 w-3.5" />
              Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Version History */}
      {versions.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between border-t px-5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
              <span>
                {versions.length} version{versions.length !== 1 ? "s" : ""}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t">
              {versions.map((version) => (
                <Link
                  key={version.id}
                  href={`/projects/${project.id}/versions/${version.id}`}
                  className="flex items-center justify-between px-5 py-2.5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{version.name}</span>
                    <StatusIndicator status={version.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    {version.confidenceSummary.total > 0 && (
                      <ConfidenceSummary
                        data={version.confidenceSummary}
                        size="sm"
                      />
                    )}
                    <DateDisplay date={version.createdAt} />
                  </div>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
