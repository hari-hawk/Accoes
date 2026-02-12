"use client";

import { useState } from "react";
import { Plus, FolderKanban, TrendingUp, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "./project-card";
import { ProjectFilters } from "./project-filters";
import { ProjectDetailSheet } from "./project-detail-sheet";
import { useProjects } from "@/hooks/use-projects";
import { mockProjects } from "@/data/mock-projects";
import type { Project } from "@/data/types";

function HeroSection() {
  const totalDocs = mockProjects.reduce((sum, p) => sum + p.totalDocuments, 0);
  const avgConf = Math.round(
    mockProjects.reduce((sum, p) => sum + p.confidenceSummary.overallConfidence, 0) /
      mockProjects.length
  );

  return (
    <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Welcome back, Sarah</h1>
          <p className="text-white/70 mt-0.5 text-sm">
            Here&apos;s an overview of your submittal validation projects
          </p>
        </div>
        <Button className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Inline compact stats */}
      <div className="relative flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        {[
          { label: "Projects", value: mockProjects.length, icon: FolderKanban },
          { label: "Documents", value: totalDocs, icon: FileCheck },
          { label: "Avg Confidence", value: `${avgConf}%`, icon: TrendingUp },
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

export function ProjectList() {
  const {
    projects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
  } = useProjects();

  // Sheet state for project detail panel
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero section */}
      <HeroSection />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
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
          <Button className="gradient-gold text-white border-0">
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onCardClick={handleCardClick}
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
    </div>
  );
}
