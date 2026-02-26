"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, FolderKanban, ShieldCheck, FileText, BookOpen } from "lucide-react";
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
    key: "conformance",
    label: "Conformance",
    icon: ShieldCheck,
    path: "/review",
    unlockedAt: ["review", "export"],
  },
  {
    key: "preview-cover-page",
    label: "Preview Cover Page",
    icon: FileText,
    path: "/preview-cover",
    unlockedAt: ["export"],
  },
  {
    key: "submittal-binder",
    label: "Submittal Binder",
    icon: BookOpen,
    path: "/submittal-binder",
    unlockedAt: ["export"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Determine which milestone is active based on the current pathname */
function getActiveMilestone(pathname: string): string {
  if (pathname.includes("/submittal-binder")) return "submittal-binder";
  if (pathname.includes("/preview-cover")) return "preview-cover-page";
  if (pathname.includes("/review") || pathname.includes("/processing")) return "conformance";
  return "overview";
}

/** Determine the completion index — milestones up to this index are "completed" */
function getCompletedIndex(currentStage: WorkflowStage, pathname: string, projectId: string): number {
  // Stage-based completion (from backend workflow state)
  let stageIndex = 0;
  if (currentStage === "export") stageIndex = 3;
  else if (currentStage === "review") stageIndex = 1;

  // Path-based completion — navigating forward marks previous as complete
  let pathIndex = 0;
  if (pathname.includes("/submittal-binder")) pathIndex = 3;
  else if (pathname.includes("/preview-cover")) pathIndex = 2;
  else if (pathname.includes("/review") || pathname.includes("/processing")) pathIndex = 1;

  // Persist highest-ever index per project — never regresses on back-navigation
  const storageKey = `milestone-highest-${projectId}`;
  const stored = typeof window !== "undefined"
    ? parseInt(localStorage.getItem(storageKey) ?? "0", 10)
    : 0;
  const highest = Math.max(stageIndex, pathIndex, stored);
  if (typeof window !== "undefined" && highest > stored) {
    localStorage.setItem(storageKey, String(highest));
  }

  return highest;
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
  const completedUpTo = getCompletedIndex(currentStage, pathname, projectId);

  return (
    <nav
      className="flex items-center justify-center px-4 py-2 border-b bg-muted/30 shrink-0"
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
                      "relative h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-[1.5px]",
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
                      "text-xs font-medium whitespace-nowrap transition-colors",
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
                  <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-[1.5px] border-dashed border-muted-foreground/50 bg-muted/30">
                    <Icon className="h-3 w-3 text-muted-foreground/60" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/60 whitespace-nowrap">
                    {milestone.label}
                  </span>
                </div>
              )}

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2.5">
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
