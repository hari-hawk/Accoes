"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, FolderKanban, Grid3X3, BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStage } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Milestone definitions                                                      */
/* -------------------------------------------------------------------------- */

interface Milestone {
  key: string;
  label: string;
  icon: typeof FolderKanban;
  path: string;
  /** The workflow stages that must be reached for this milestone to unlock */
  unlockedAt: WorkflowStage[];
}

const MILESTONES: Milestone[] = [
  {
    key: "overview",
    label: "Overview",
    icon: FolderKanban,
    path: "",
    unlockedAt: ["project", "upload", "process", "review", "export"],
  },
  {
    key: "material-matrix",
    label: "Material Matrix",
    icon: Grid3X3,
    path: "/review",
    unlockedAt: ["review", "export"],
  },
  {
    key: "submittal-binder",
    label: "Submittal Binder",
    icon: BookOpen,
    path: "/submittal-binder",
    unlockedAt: ["export"],
  },
  {
    key: "download-report",
    label: "Download Report",
    icon: Download,
    path: "/export",
    unlockedAt: ["export"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Determine which milestone is active based on the current pathname */
function getActiveMilestone(pathname: string): string {
  if (pathname.includes("/export")) return "download-report";
  if (pathname.includes("/submittal-binder")) return "submittal-binder";
  if (pathname.includes("/review") || pathname.includes("/processing")) return "material-matrix";
  return "overview";
}

/** Determine the completion index — milestones up to this index are "completed" */
function getCompletedIndex(currentStage: WorkflowStage): number {
  // Overview is always accessible (complete as soon as you enter the project)
  // Material Matrix is accessible at "review" or "export" stage
  // Submittal Binder + Download Report are accessible at "export" stage
  if (currentStage === "export") return 3; // first three completed, download report is the final step
  if (currentStage === "review") return 1; // overview completed, material matrix active
  return 0; // only overview
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function MilestoneProgressBar({
  currentStage,
  projectId,
  versionId,
}: {
  currentStage: WorkflowStage;
  projectId: string;
  versionId: string;
}) {
  const pathname = usePathname();
  const base = `/projects/${projectId}/versions/${versionId}`;
  const activeMilestone = getActiveMilestone(pathname);
  const completedUpTo = getCompletedIndex(currentStage);

  return (
    <nav
      className="flex items-center justify-center px-4 py-1 border-b bg-muted/30 shrink-0"
      aria-label="Project milestones"
    >
      <div className="flex items-center w-full max-w-2xl">
        {MILESTONES.map((milestone, index) => {
          const isActive = milestone.key === activeMilestone;
          const isUnlocked = milestone.unlockedAt.includes(currentStage);
          const isCompleted = index < completedUpTo;
          const Icon = milestone.icon;
          const href = `${base}${milestone.path}`;
          const isLast = index === MILESTONES.length - 1;

          return (
            <div
              key={milestone.key}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              {/* Step node */}
              {isUnlocked ? (
                <Link
                  href={href}
                  className="group flex items-center gap-1.5 shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 rounded-full"
                  aria-label={`${milestone.label}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {/* Circle indicator */}
                  <div
                    className={cn(
                      "relative h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-[1.5px]",
                      isActive
                        ? "gradient-accent border-transparent shadow-sm"
                        : isCompleted
                          ? "bg-status-pre-approved border-status-pre-approved"
                          : "bg-background border-border hover:border-muted-foreground"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    ) : (
                      <Icon
                        className={cn(
                          "h-3 w-3",
                          isActive
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "text-foreground font-semibold"
                        : isCompleted
                          ? "text-status-pre-approved font-semibold"
                          : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {milestone.label}
                  </span>
                </Link>
              ) : (
                <div
                  className="flex items-center gap-1.5 shrink-0 cursor-not-allowed"
                  aria-label={`${milestone.label} (locked)`}
                  aria-disabled="true"
                >
                  {/* Locked circle */}
                  <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 border-[1.5px] border-dashed border-muted-foreground/30 bg-muted/30">
                    <Icon className="h-3 w-3 text-muted-foreground/40" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/40 whitespace-nowrap">
                    {milestone.label}
                  </span>
                </div>
              )}

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2">
                  <div
                    className={cn(
                      "h-px w-full rounded-full transition-all duration-500",
                      index < completedUpTo
                        ? "bg-status-pre-approved"
                        : "bg-border"
                    )}
                    style={
                      index < completedUpTo
                        ? undefined
                        : { backgroundImage: "repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 4px, transparent 4px, transparent 8px)" }
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
