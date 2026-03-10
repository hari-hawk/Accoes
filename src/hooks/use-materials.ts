"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getDocumentsByVersion } from "@/data/mock-documents";
import {
  getValidationByDocument,
  getPAValidationByDocument,
  getPIValidationByDocument,
} from "@/data/mock-validations";
import type { ValidationStatus, ValidationCategory, DecisionStatus, Document, ValidationResult } from "@/data/types";

export interface MaterialItem {
  document: Document;
  validation: ValidationResult | undefined;
  paValidation: ValidationResult | undefined;
  piValidation: ValidationResult | undefined;
}

export function useMaterials(versionId: string) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [decisions, setDecisions] = useState<Record<string, DecisionStatus>>({});
  const [indexCategoryFilter, setIndexCategoryFilter] = useState<Set<string>>(new Set());
  const [systemCategoryFilter, setSystemCategoryFilter] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "index-category">("name-asc");
  const [activeCategory, setActiveCategory] = useState<ValidationCategory>("overall");

  // Alternative items — persisted to localStorage for cross-page access
  const [alternativeIds, setAlternativeIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const stored = localStorage.getItem(`alternative-items-${versionId}`);
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(`alternative-items-${versionId}`, JSON.stringify([...alternativeIds]));
  }, [alternativeIds, versionId]);

  const materials: MaterialItem[] = useMemo(() => {
    const docs = getDocumentsByVersion(versionId);
    return docs.map((doc) => ({
      document: doc,
      validation: getValidationByDocument(doc.id),
      paValidation: getPAValidationByDocument(doc.id),
      piValidation: getPIValidationByDocument(doc.id),
    }));
  }, [versionId]);

  const filteredMaterials = useMemo(() => {
    let result = materials;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.document.fileName.toLowerCase().includes(lower) ||
          m.document.specSection.includes(lower) ||
          m.document.specSectionTitle.toLowerCase().includes(lower)
      );
    }

    if (statusFilter.size > 0) {
      result = result.filter((m) => {
        // Check validation status (pre_approved, review_required, action_mandatory)
        if (m.validation?.status && statusFilter.has(m.validation.status)) return true;
        // Check decision status (approved, revisit, no_acco_id, sent_to_acco_review, defer_to_future)
        const decision = decisions[m.document.id];
        if (decision && statusFilter.has(decision)) return true;
        // Check alternative filter
        if (statusFilter.has("alternative") && alternativeIds.has(m.document.id)) return true;
        return false;
      });
    }

    if (indexCategoryFilter.size > 0) {
      result = result.filter(
        (m) => m.document.indexCategory != null && indexCategoryFilter.has(m.document.indexCategory)
      );
    }

    if (systemCategoryFilter.size > 0) {
      result = result.filter(
        (m) => m.document.systemCategory != null && systemCategoryFilter.has(m.document.systemCategory)
      );
    }

    // Sort
    result = [...result];
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.document.fileName.localeCompare(b.document.fileName));
        break;
      case "name-desc":
        result.sort((a, b) => b.document.fileName.localeCompare(a.document.fileName));
        break;
      case "index-category":
        result.sort((a, b) => {
          const catA = a.document.indexCategory ?? "";
          const catB = b.document.indexCategory ?? "";
          const catCmp = catA.localeCompare(catB);
          if (catCmp !== 0) return catCmp;
          return a.document.fileName.localeCompare(b.document.fileName);
        });
        break;
    }

    return result;
  }, [materials, search, statusFilter, decisions, alternativeIds, indexCategoryFilter, systemCategoryFilter, sortBy]);

  const indexCategories = useMemo(
    () => [...new Set(materials.map((m) => m.document.indexCategory).filter(Boolean))] as string[],
    [materials]
  );

  const systemCategories = useMemo(
    () => [...new Set(materials.map((m) => m.document.systemCategory).filter(Boolean))] as string[],
    [materials]
  );

  const selectedMaterial = useMemo(
    () => materials.find((m) => m.document.id === selectedId) ?? null,
    [materials, selectedId]
  );

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearChecks = useCallback(() => setCheckedIds(new Set()), []);

  const updateDecision = useCallback((documentId: string, decision: DecisionStatus) => {
    setDecisions((prev) => ({ ...prev, [documentId]: decision }));
  }, []);

  const batchApprove = useCallback(() => {
    setDecisions((prev) => {
      const next = { ...prev };
      checkedIds.forEach((id) => {
        next[id] = "approved";
      });
      return next;
    });
    setCheckedIds(new Set());
  }, [checkedIds]);

  const batchRevisit = useCallback(() => {
    setDecisions((prev) => {
      const next = { ...prev };
      checkedIds.forEach((id) => {
        next[id] = "revisit";
      });
      return next;
    });
    setCheckedIds(new Set());
  }, [checkedIds]);

  const getValidationForCategory = useCallback(
    (item: MaterialItem, category: ValidationCategory): ValidationResult | undefined => {
      switch (category) {
        case "project_assets":
          return item.paValidation;
        case "performance_index":
          return item.piValidation;
        default:
          return item.validation;
      }
    },
    []
  );

  const toggleStatusFilter = useCallback((status: string) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }, []);

  const clearStatusFilter = useCallback(() => setStatusFilter(new Set()), []);

  const toggleIndexCategoryFilter = useCallback((cat: string) => {
    setIndexCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const clearIndexCategoryFilter = useCallback(() => setIndexCategoryFilter(new Set()), []);

  const toggleSystemCategoryFilter = useCallback((sys: string) => {
    setSystemCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(sys)) next.delete(sys);
      else next.add(sys);
      return next;
    });
  }, []);

  const clearSystemCategoryFilter = useCallback(() => setSystemCategoryFilter(new Set()), []);

  const toggleAlternative = useCallback((id: string) => {
    setAlternativeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const batchToggleAlternative = useCallback(() => {
    setAlternativeIds((prev) => {
      const allCheckedAreAlt = [...checkedIds].every((id) => prev.has(id));
      const next = new Set(prev);
      if (allCheckedAreAlt) {
        // Un-mark all checked items
        checkedIds.forEach((id) => next.delete(id));
      } else {
        // Mark all checked items as alternative
        checkedIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [checkedIds]);

  return {
    materials: filteredMaterials,
    allMaterials: materials,
    search,
    setSearch: useCallback((v: string) => setSearch(v), []),
    statusFilter,
    setStatusFilter,
    toggleStatusFilter,
    clearStatusFilter,
    selectedId,
    setSelectedId,
    selectedMaterial,
    checkedIds,
    toggleCheck,
    clearChecks,
    decisions,
    updateDecision,
    batchApprove,
    batchRevisit,
    activeCategory,
    setActiveCategory,
    getValidationForCategory,
    indexCategoryFilter,
    toggleIndexCategoryFilter,
    clearIndexCategoryFilter,
    systemCategoryFilter,
    toggleSystemCategoryFilter,
    clearSystemCategoryFilter,
    sortBy,
    setSortBy,
    indexCategories,
    systemCategories,
    alternativeIds,
    toggleAlternative,
    batchToggleAlternative,
  };
}
