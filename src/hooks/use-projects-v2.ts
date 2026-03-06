"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getProjectV2Rows,
  PROJECT_V2_STATUS_OPTIONS,
  type ProjectV2Row,
} from "@/data/mock-projects-v2";
import type { ProjectStatus } from "@/data/types";
import type {
  HydroTrade,
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
} from "@/data/mock-project-index";
import { HYDRO_TRADE_ORDER, HYDRO_CATEGORY_ORDER } from "@/data/mock-project-index";

export function useProjectsV2() {
  const [allRows] = useState<ProjectV2Row[]>(() => getProjectV2Rows());

  // Filters
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<HydroTrade | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<HydroIndexCategory | "all">("all");
  const [systemFilter, setSystemFilter] = useState<HydroSystemCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [materialFilter, setMaterialFilter] = useState<HydroMaterialCategory | "all">("all");

  // Expansion (one project at a time)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Checkbox selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) return new Set();
      return new Set(ids);
    });
  }, []);

  // Filtered rows
  const filteredRows = useMemo(() => {
    let result = allRows;

    // L1-level filters
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (materialFilter !== "all") {
      result = result.filter((r) => r.materialCategory === materialFilter);
    }

    // L2-level filters — filter materials, keep project if any material matches
    if (
      search ||
      tradeFilter !== "all" ||
      categoryFilter !== "all" ||
      systemFilter !== "all"
    ) {
      result = result
        .map((row) => {
          let materials = row.materials;

          if (search) {
            const lower = search.toLowerCase();
            materials = materials.filter(
              (m) =>
                m.catalogTitle.toLowerCase().includes(lower) ||
                m.description.toLowerCase().includes(lower) ||
                m.specSection.toLowerCase().includes(lower) ||
                m.subcategory.toLowerCase().includes(lower) ||
                row.name.toLowerCase().includes(lower) ||
                row.jobId.toLowerCase().includes(lower)
            );
          }
          if (tradeFilter !== "all") {
            materials = materials.filter((m) => m.trade === tradeFilter);
          }
          if (categoryFilter !== "all") {
            materials = materials.filter((m) => m.subcategory === categoryFilter);
          }
          if (systemFilter !== "all") {
            materials = materials.filter((m) => m.system === systemFilter);
          }

          return { ...row, materials };
        })
        .filter((row) => row.materials.length > 0);
    }

    return result;
  }, [allRows, search, tradeFilter, categoryFilter, systemFilter, statusFilter, materialFilter]);

  const hasActiveFilters =
    search !== "" ||
    tradeFilter !== "all" ||
    categoryFilter !== "all" ||
    systemFilter !== "all" ||
    statusFilter !== "all" ||
    materialFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearch("");
    setTradeFilter("all");
    setCategoryFilter("all");
    setSystemFilter("all");
    setStatusFilter("all");
    setMaterialFilter("all");
  }, []);

  const totalMaterials = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.materials.length, 0),
    [filteredRows]
  );

  return {
    filteredRows,
    totalProjects: allRows.length,
    filteredProjectCount: filteredRows.length,
    totalMaterials,
    // Filters
    search,
    setSearch,
    tradeFilter,
    setTradeFilter,
    trades: HYDRO_TRADE_ORDER,
    categoryFilter,
    setCategoryFilter,
    categories: HYDRO_CATEGORY_ORDER,
    systemFilter,
    setSystemFilter,
    statusFilter,
    setStatusFilter,
    statusOptions: PROJECT_V2_STATUS_OPTIONS,
    materialFilter,
    setMaterialFilter,
    hasActiveFilters,
    clearFilters,
    // Expansion
    expandedId,
    toggleExpand,
    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
  };
}
