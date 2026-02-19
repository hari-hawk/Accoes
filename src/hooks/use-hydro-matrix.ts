"use client";

import { useState, useMemo, useCallback } from "react";
import {
  HYDRO_CATEGORY_ORDER,
  HYDRO_GRID_VERSIONS,
  getEntriesForVersion,
} from "@/data/mock-project-index";
import type {
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
  HydroMatrixEntry,
} from "@/data/mock-project-index";

/** Default to the latest (first) version */
const DEFAULT_VERSION_ID = HYDRO_GRID_VERSIONS[0].id;

export function useHydroMatrix() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<HydroIndexCategory | "all">("all");
  const [systemFilter, setSystemFilter] = useState<HydroSystemCategory | "all">("all");
  const [materialFilter, setMaterialFilter] = useState<HydroMaterialCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Version state — switching versions reloads entries
  const [selectedVersionId, setSelectedVersionId] = useState(DEFAULT_VERSION_ID);

  // Mutable state so entries can be edited in-place
  const [allEntries, setAllEntries] = useState<HydroMatrixEntry[]>(
    () => getEntriesForVersion(DEFAULT_VERSION_ID)
  );

  /** Switch to a different grid version — reloads entries, resets edits */
  const switchVersion = useCallback((versionId: string) => {
    setSelectedVersionId(versionId);
    setAllEntries(getEntriesForVersion(versionId));
    setSelectedId(null);
  }, []);

  /** Update a single entry by ID — merges partial updates */
  const updateEntry = useCallback(
    (id: string, updates: Partial<HydroMatrixEntry>) => {
      setAllEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
    },
    []
  );

  const filteredEntries = useMemo(() => {
    let result = allEntries;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(lower) ||
          e.indexSubcategory.toLowerCase().includes(lower) ||
          e.indexIdFull.toLowerCase().includes(lower) ||
          e.indexDescription.toLowerCase().includes(lower) ||
          e.fittingMfr.toLowerCase().includes(lower)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((e) => e.indexCategory === categoryFilter);
    }
    if (systemFilter !== "all") {
      result = result.filter((e) => e.systemCategory === systemFilter);
    }
    if (materialFilter !== "all") {
      result = result.filter((e) => e.materialCategory === materialFilter);
    }

    return result;
  }, [allEntries, search, categoryFilter, systemFilter, materialFilter]);

  // Group by category, preserving canonical order
  const groupedEntries = useMemo(() => {
    const map = new Map<HydroIndexCategory, HydroMatrixEntry[]>();
    for (const cat of HYDRO_CATEGORY_ORDER) {
      const rows = filteredEntries.filter((e) => e.indexCategory === cat);
      if (rows.length > 0) map.set(cat, rows);
    }
    return map;
  }, [filteredEntries]);

  // Unique category count from filtered results
  const filteredCategoryCount = groupedEntries.size;

  // Unique system categories in filtered results
  const filteredSystemCount = useMemo(() => {
    const systems = new Set(filteredEntries.map((e) => e.systemCategory));
    return systems.size;
  }, [filteredEntries]);

  const hasActiveFilters =
    search !== "" ||
    categoryFilter !== "all" ||
    systemFilter !== "all" ||
    materialFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setSystemFilter("all");
    setMaterialFilter("all");
  };

  const selectedEntry = useMemo(
    () => allEntries.find((e) => e.id === selectedId) ?? null,
    [allEntries, selectedId]
  );

  return {
    // Version
    versions: HYDRO_GRID_VERSIONS,
    selectedVersionId,
    switchVersion,
    // Filters
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    systemFilter,
    setSystemFilter,
    materialFilter,
    setMaterialFilter,
    filteredEntries,
    groupedEntries,
    hasActiveFilters,
    clearFilters,
    // Selection & editing
    selectedId,
    setSelectedId,
    selectedEntry,
    updateEntry,
    // Counts
    totalCount: allEntries.length,
    filteredCount: filteredEntries.length,
    filteredCategoryCount,
    filteredSystemCount,
  };
}
