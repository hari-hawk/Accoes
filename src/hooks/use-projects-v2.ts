"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getProjectV2Rows,
  PROJECT_V2_STATUS_OPTIONS,
  type ProjectV2Row,
  type MaterialV2Row,
} from "@/data/mock-projects-v2";
import type { ProjectStatus } from "@/data/types";
import type {
  HydroTrade,
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
} from "@/data/mock-project-index";
import { HYDRO_TRADE_ORDER, HYDRO_CATEGORY_ORDER } from "@/data/mock-project-index";

export type ViewMode = "list" | "grid";

export interface Metrics {
  totalProjects: number;
  totalMaterials: number;
  approvalRate: number;
  preApprovedCount: number;
  reviewRequiredCount: number;
  actionMandatoryCount: number;
  avgConfidence: number;
}

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

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // L1 project checkbox selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // L2 material checkbox selection
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // L1 selection
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

  // L2 material selection
  const toggleMaterialSelect = useCallback((materialId: string) => {
    setSelectedMaterialIds((prev) => {
      const next = new Set(prev);
      if (next.has(materialId)) next.delete(materialId);
      else next.add(materialId);
      return next;
    });
  }, []);

  const toggleMaterialSelectAll = useCallback((materialIds: string[]) => {
    setSelectedMaterialIds((prev) => {
      const allSelected = materialIds.every((id) => prev.has(id));
      if (allSelected) {
        const next = new Set(prev);
        materialIds.forEach((id) => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      materialIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const clearMaterialSelection = useCallback(() => {
    setSelectedMaterialIds(new Set());
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

  // Selected materials with project name (for export)
  const selectedMaterials = useMemo(() => {
    if (selectedMaterialIds.size === 0) return [];
    const result: Array<MaterialV2Row & { projectName: string }> = [];
    for (const row of filteredRows) {
      for (const m of row.materials) {
        if (selectedMaterialIds.has(m.id)) {
          result.push({ ...m, projectName: row.name });
        }
      }
    }
    return result;
  }, [filteredRows, selectedMaterialIds]);

  // Executive metrics (reactive to filters)
  const metrics: Metrics = useMemo(() => {
    const allMaterials = filteredRows.flatMap((r) => r.materials);
    const total = allMaterials.length;
    if (total === 0) {
      return {
        totalProjects: 0,
        totalMaterials: 0,
        approvalRate: 0,
        preApprovedCount: 0,
        reviewRequiredCount: 0,
        actionMandatoryCount: 0,
        avgConfidence: 0,
      };
    }

    const approvedCount = allMaterials.filter(
      (m) => m.decision === "approved" || m.decision === "approved_with_notes"
    ).length;
    const preApproved = allMaterials.filter((m) => m.aiStatus === "pre_approved").length;
    const reviewRequired = allMaterials.filter((m) => m.aiStatus === "review_required").length;
    const actionMandatory = allMaterials.filter((m) => m.aiStatus === "action_mandatory").length;
    const avgConfidence = Math.round(
      allMaterials.reduce((sum, m) => sum + m.confidenceScore, 0) / total
    );

    return {
      totalProjects: filteredRows.length,
      totalMaterials: total,
      approvalRate: Math.round((approvedCount / total) * 100),
      preApprovedCount: preApproved,
      reviewRequiredCount: reviewRequired,
      actionMandatoryCount: actionMandatory,
      avgConfidence,
    };
  }, [filteredRows]);

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

  return {
    filteredRows,
    totalProjects: allRows.length,
    filteredProjectCount: filteredRows.length,
    totalMaterials: metrics.totalMaterials,
    metrics,
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
    setExpandedId,
    toggleExpand,
    // View mode
    viewMode,
    setViewMode,
    // L1 Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    // L2 Material selection
    selectedMaterialIds,
    toggleMaterialSelect,
    toggleMaterialSelectAll,
    clearMaterialSelection,
    selectedMaterials,
  };
}
