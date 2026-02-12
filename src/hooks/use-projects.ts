"use client";

import { useState, useMemo, useCallback } from "react";
import { mockProjects } from "@/data/mock-projects";
import type { ProjectStatus } from "@/data/types";

export type ViewMode = "grid" | "list";
export type SortBy = "updated" | "name" | "status";

export function useProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("updated");

  const filteredProjects = useMemo(() => {
    let result = [...mockProjects];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.client.toLowerCase().includes(lower)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
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
  }, [search, statusFilter, sortBy]);

  return {
    projects: filteredProjects,
    search,
    setSearch: useCallback((v: string) => setSearch(v), []),
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
  };
}
