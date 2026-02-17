"use client";

import { useState, useMemo } from "react";
import {
  getAllHydroEntries,
  HYDRO_CATEGORY_ORDER,
} from "@/data/mock-project-index";
import type {
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
  HydroMatrixEntry,
} from "@/data/mock-project-index";

export function useHydroMatrix() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<HydroIndexCategory | "all">("all");
  const [systemFilter, setSystemFilter] = useState<HydroSystemCategory | "all">("all");
  const [materialFilter, setMaterialFilter] = useState<HydroMaterialCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allEntries = useMemo(() => getAllHydroEntries(), []);

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
    selectedId,
    setSelectedId,
    selectedEntry,
    totalCount: allEntries.length,
    filteredCount: filteredEntries.length,
    filteredCategoryCount,
    filteredSystemCount,
  };
}
