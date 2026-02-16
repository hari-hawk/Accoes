"use client";

import { useState, useMemo, useCallback } from "react";
import { mockProjects } from "@/data/mock-projects";
import type { ProjectStatus } from "@/data/types";

export type ViewMode = "grid" | "list";
export type SortBy = "updated" | "name" | "status";

// Derive unique job IDs and locations from mock data
export const allJobIds = Array.from(new Set(mockProjects.map((p) => p.jobId)));
export const allLocations = Array.from(new Set(mockProjects.map((p) => p.location)));

export function useProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("updated");

  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.client.toLowerCase().includes(lower) ||
          p.jobId.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (jobFilter !== "all") {
      result = result.filter((p) => p.jobId === jobFilter);
    }

    if (locationFilter !== "all") {
      result = result.filter((p) => p.location === locationFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "status":
          return a.status.localeCompare(b.status);
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  }, [search, statusFilter, jobFilter, locationFilter, sortBy]);

  return {
    projects: filteredProjects,
    search,
    setSearch: useCallback((v: string) => setSearch(v), []),
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
  };
}
