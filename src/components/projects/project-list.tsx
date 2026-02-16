"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban, Activity, Eye, ShieldCheck, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { PROJECT_STAGE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { ProjectDetailSheet } from "./project-detail-sheet";
import { CreateProjectDialog } from "./create-project-dialog";
import { useProjects } from "@/hooks/use-projects";
import { mockProjects } from "@/data/mock-projects";
import type { Project } from "@/data/types";

function HeroSection({ onNewProject }: { onNewProject: () => void }) {
  const activeCount = mockProjects.filter((p) => p.status === "active").length;

  return (
    <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Welcome back, Sarah</h1>
          <p className="text-white/70 mt-0.5 text-sm">
            Here&apos;s an overview of your submittal validation projects
          </p>
        </div>
        <Button
          className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
          onClick={onNewProject}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Inline compact stats */}
      <div className="relative flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        {[
          { label: "Total Projects", value: mockProjects.length, icon: FolderKanban },
          { label: "Active", value: activeCount, icon: Activity },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-nav-gold" />
              <div>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  List View Row                                                              */
/* -------------------------------------------------------------------------- */

function ProjectListRow({
  project,
  onClick,
}: {
  project: Project;
  onClick: (project: Project) => void;
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

  const stageConfig = PROJECT_STAGE_CONFIG[project.stage];
  const hasVersions = !!project.latestVersionId;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project);
        }
      }}
    >
      {/* Name + Job ID */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{project.name}</p>
        <p className="text-xs font-mono text-muted-foreground truncate">{project.jobId}</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusIndicator status={project.status} />
      </div>

      {/* Stage */}
      <div className="shrink-0 hidden md:block text-xs">
        <span className="text-muted-foreground">Stage: </span>
        <span className={cn("font-medium", stageConfig.color)}>
          {stageConfig.label}
        </span>
      </div>

      {/* Confidence */}
      <div className="shrink-0 w-16 text-right">
        <span className={`text-sm font-bold ${confidenceColor}`}>
          {confidence > 0 ? `${confidence}%` : "—"}
        </span>
      </div>

      {/* Created date */}
      <div className="shrink-0 w-24 text-right text-xs text-muted-foreground hidden lg:block">
        {new Date(project.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* 3 action icons */}
      <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        {hasVersions ? (
          <>
            <Link
              href={`/projects/${project.id}/versions/${project.latestVersionId}`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Overview"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`/projects/${project.id}/versions/${project.latestVersionId}/review`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Conformance"
            >
              <ShieldCheck className="h-4 w-4" />
            </Link>
            <Link
              href={`/projects/${project.id}/versions/${project.latestVersionId}/export`}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-nav-accent hover:bg-muted/50 transition-colors"
              title="Report"
            >
              <FileBarChart className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Overview">
              <Eye className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Conformance">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground/30 cursor-not-allowed" title="Report">
              <FileBarChart className="h-4 w-4" />
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export function ProjectList() {
  const {
    projects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    jobFilter,
    setJobFilter,
    locationFilter,
    setLocationFilter,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
  } = useProjects();

  // Sheet state for project detail panel
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Create project dialog
  const [createOpen, setCreateOpen] = useState(false);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero section */}
      <HeroSection onNewProject={() => setCreateOpen(true)} />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        jobFilter={jobFilter}
        onJobChange={setJobFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Try adjusting your search or filters, or create a new project to get started."
        >
          <Button className="gradient-gold text-white border-0" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Button>
        </EmptyState>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          {/* List header */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b bg-muted/30 text-xs font-medium text-muted-foreground">
            <div className="flex-1">Project</div>
            <div className="shrink-0">Status</div>
            <div className="shrink-0 hidden md:block">Stage</div>
            <div className="shrink-0 w-16 text-right">Conf.</div>
            <div className="shrink-0 w-24 text-right hidden lg:block">Created</div>
            <div className="shrink-0 w-[104px]" />
          </div>
          {projects.map((project) => (
            <ProjectListRow
              key={project.id}
              project={project}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Project Detail Sheet */}
      <ProjectDetailSheet
        project={selectedProject}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}
