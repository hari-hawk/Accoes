"use client";

import { useState, useMemo, useCallback } from "react";
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
  const [indexCategoryFilter, setIndexCategoryFilter] = useState<string>("all");
  const [systemCategoryFilter, setSystemCategoryFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<ValidationCategory>("overall");

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
        // Check decision status (approved, revisit)
        const decision = decisions[m.document.id];
        if (decision && statusFilter.has(decision)) return true;
        return false;
      });
    }

    if (indexCategoryFilter !== "all") {
      result = result.filter(
        (m) => m.document.indexCategory === indexCategoryFilter
      );
    }

    if (systemCategoryFilter !== "all") {
      result = result.filter(
        (m) => m.document.systemCategory === systemCategoryFilter
      );
    }

    return result;
  }, [materials, search, statusFilter, decisions, indexCategoryFilter, systemCategoryFilter]);

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
    setIndexCategoryFilter,
    systemCategoryFilter,
    setSystemCategoryFilter,
    indexCategories,
    systemCategories,
  };
}
