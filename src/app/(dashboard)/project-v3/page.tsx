"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  Filter,
  CheckCircle2,
  RotateCcw,
  Replace,
  MessageSquare,
  Eye,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { EvidencePanel } from "@/components/workspace/evidence-panel";
import { useMaterials } from "@/hooks/use-materials";
import type { MaterialItem } from "@/hooks/use-materials";
import { getMatrixFilesByVersion } from "@/data/mock-documents";
import { mockProjects } from "@/data/mock-projects";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import type { ValidationCategory, DecisionStatus } from "@/data/types";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Badge color configs                                                        */
/* -------------------------------------------------------------------------- */

const TRADE_COLORS: Record<string, string> = {
  Mechanical:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Electrical:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Plumbing:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "Fire Protection":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const MATERIAL_COLORS: Record<string, string> = {
  "Carbon Steel":
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400",
  Copper:
    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "n/a": "",
};

const TRADE_ORDER = ["Mechanical", "Electrical", "Plumbing", "Fire Protection"];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function removeFileExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

/** Total number of columns in the table (used for colSpan on trade header & expanded rows) */
const TOTAL_COLS = 11;

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function ProjectV3Page() {
  /* ── All hooks MUST be called first, before any early returns ─────────── */
  const router = useRouter();

  /* ── Sprint 3A: Project filter ─────────────────────────────────────────── */
  const [projectFilter, setProjectFilter] = useState<string>("proj-2");

  const activeVersionId = useMemo(() => {
    const proj = mockProjects.find((p) => p.id === projectFilter);
    return proj?.latestVersionId || "ver-5";
  }, [projectFilter]);

  /* ── Hook calls (must be before any early returns per React 19 rules) ──── */
  const {
    allMaterials,
    decisions,
    updateDecision,
    activeCategory,
    setActiveCategory,
    checkedIds,
    toggleCheck,
    clearChecks,
    batchApprove,
    batchRevisit,
    alternativeIds,
    toggleAlternative,
    batchToggleAlternative,
  } = useMaterials(activeVersionId);

  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [documentFilter, setDocumentFilter] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  /* ── Derive selected project ─────────────────────────────────────────── */
  const selectedProject = useMemo(
    () => mockProjects.find((p) => p.id === projectFilter) ?? null,
    [projectFilter]
  );

  /* ── Derive matrix files (Sprint 3B: dynamic based on activeVersionId) ── */
  const matrixFiles = useMemo(
    () => getMatrixFilesByVersion(activeVersionId),
    [activeVersionId]
  );

  /* ── Derive unique filter options from allMaterials ────────────────────── */
  const uniqueTrades = useMemo(
    () =>
      [
        ...new Set(allMaterials.map((m) => m.document.trade).filter(Boolean)),
      ] as string[],
    [allMaterials]
  );

  const uniqueCategories = useMemo(
    () =>
      [
        ...new Set(
          allMaterials.map((m) => m.document.indexCategory).filter(Boolean)
        ),
      ] as string[],
    [allMaterials]
  );

  /* ── Sprint 3C: Dynamic system & material filter options ───────────────── */
  const uniqueSystems = useMemo(
    () =>
      [
        ...new Set(
          allMaterials.map((m) => m.document.systemCategory).filter(Boolean)
        ),
      ] as string[],
    [allMaterials]
  );

  const uniqueMaterials = useMemo(
    () =>
      [
        ...new Set(
          allMaterials.map((m) => m.document.materialCategory).filter(Boolean)
        ),
      ] as string[],
    [allMaterials]
  );

  /* ── Filtering logic ───────────────────────────────────────────────────── */
  const filteredMaterials = useMemo(() => {
    let result = allMaterials;

    // Search filter
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.document.fileName.toLowerCase().includes(lower) ||
          m.document.specSection.toLowerCase().includes(lower) ||
          m.document.specSectionTitle.toLowerCase().includes(lower) ||
          (m.document.indexSubcategory ?? "").toLowerCase().includes(lower)
      );
    }

    // Trade filter
    if (tradeFilter !== "all") {
      result = result.filter((m) => m.document.trade === tradeFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (m) => m.document.indexCategory === categoryFilter
      );
    }

    // System filter
    if (systemFilter !== "all") {
      result = result.filter(
        (m) => m.document.systemCategory === systemFilter
      );
    }

    // Material filter
    if (materialFilter !== "all") {
      result = result.filter(
        (m) => m.document.materialCategory === materialFilter
      );
    }

    // Document filter (Matrix Files multi-select)
    if (documentFilter.size > 0) {
      result = result.filter((m) => documentFilter.has(m.document.id));
    }

    // Sort
    result = [...result];
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) =>
          a.document.fileName.localeCompare(b.document.fileName)
        );
        break;
      case "name-desc":
        result.sort((a, b) =>
          b.document.fileName.localeCompare(a.document.fileName)
        );
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
  }, [
    allMaterials,
    search,
    tradeFilter,
    categoryFilter,
    systemFilter,
    materialFilter,
    documentFilter,
    sortBy,
  ]);

  /* ── Status counts ─────────────────────────────────────────────────────── */
  /* ── Trade-grouped data ────────────────────────────────────────────────── */
  const groupedByTrade = useMemo(() => {
    const map = new Map<string, MaterialItem[]>();
    for (const trade of TRADE_ORDER) {
      const items = filteredMaterials.filter(
        (m) => m.document.trade === trade
      );
      if (items.length > 0) {
        map.set(trade, items);
      }
    }
    // Include any remaining trades not in TRADE_ORDER
    for (const m of filteredMaterials) {
      const trade = m.document.trade ?? "Other";
      if (!TRADE_ORDER.includes(trade)) {
        if (!map.has(trade)) map.set(trade, []);
        map.get(trade)!.push(m);
      }
    }
    return map;
  }, [filteredMaterials]);

  /* ── Select all: filtered material IDs ─────────────────────────────────── */
  const filteredIds = useMemo(
    () => filteredMaterials.map((m) => m.document.id),
    [filteredMaterials]
  );

  const allFilteredChecked = useMemo(
    () => filteredIds.length > 0 && filteredIds.every((id) => checkedIds.has(id)),
    [filteredIds, checkedIds]
  );

  const handleSelectAll = useCallback(() => {
    if (allFilteredChecked) {
      // Uncheck all filtered
      for (const id of filteredIds) {
        if (checkedIds.has(id)) {
          toggleCheck(id);
        }
      }
    } else {
      // Check all filtered
      for (const id of filteredIds) {
        if (!checkedIds.has(id)) {
          toggleCheck(id);
        }
      }
    }
  }, [allFilteredChecked, filteredIds, checkedIds, toggleCheck]);

  /* ── Has any active filter ─────────────────────────────────────────────── */
  const hasActiveFilters =
    search !== "" ||
    tradeFilter !== "all" ||
    categoryFilter !== "all" ||
    systemFilter !== "all" ||
    materialFilter !== "all" ||
    documentFilter.size > 0 ||
    sortBy !== "name-asc";

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setTradeFilter("all");
    setCategoryFilter("all");
    setSystemFilter("all");
    setMaterialFilter("all");
    setDocumentFilter(new Set());
    setSortBy("name-asc");
  }, []);

  const handleToggleMatrixFile = useCallback(
    (fileDocIds: string[]) => {
      setDocumentFilter((prev) => {
        const next = new Set(prev);
        const allSelected = fileDocIds.every((id) => next.has(id));
        if (allSelected) {
          for (const id of fileDocIds) {
            next.delete(id);
          }
        } else {
          for (const id of fileDocIds) {
            next.add(id);
          }
        }
        return next;
      });
    },
    []
  );

  /* Sprint 3B: Toggle "All Documents" in the Matrix Files popover */
  const handleToggleAllDocuments = useCallback(() => {
    setDocumentFilter((prev) => {
      if (prev.size === 0) {
        // Nothing selected — do nothing (already showing all)
        return prev;
      }
      // Clear all file selections
      return new Set<string>();
    });
  }, []);

  const handleCommentSubmit = useCallback(() => {
    // In real app, this would save comments. For now, just close.
    setCommentText("");
    setCommentDialogOpen(false);
  }, []);


  /* ── Count selected files for Popover label ────────────────────────────── */
  const selectedFileCount = useMemo(() => {
    if (documentFilter.size === 0) return 0;
    return matrixFiles.filter((mf) =>
      mf.documentIds.some((id) => documentFilter.has(id))
    ).length;
  }, [documentFilter, matrixFiles]);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <main className="px-4 sm:px-6 py-6 space-y-6 max-w-[1400px] mx-auto overflow-x-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-1 animate-fade-up"
        aria-label="Project V3 header"
      >
        <h1 className="text-xl font-bold tracking-tight">Project V3</h1>
        <p className="text-muted-foreground text-sm">
          Unified material review — trade-grouped table with inline conformance
          review
        </p>
      </section>

      {/* ── Filter Section ────────────────────────────────────────────────── */}
      <section className="rounded-xl border bg-card shadow-card p-4 space-y-3" aria-label="Filters">
        {/* Search bar — full width (Sprint 1B: removed max-w-xl) */}
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search descriptions, spec sections, subcategories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
            aria-label="Search material specifications"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X
                className="h-3 w-3 text-muted-foreground"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* Filter row — 7 equal-width columns wrapped in explicit divs */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2"
          role="search"
          aria-label="Filter controls"
        >
          {/* 1. Project Name */}
          <div className="min-w-0">
            <Select
              value={projectFilter}
              onValueChange={(v) => setProjectFilter(v)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by project">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Matrix Files */}
          <div className="min-w-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 gap-1.5 text-sm font-normal w-full justify-between"
                  aria-label="Filter by matrix files"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Filter className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {selectedFileCount > 0
                      ? `${selectedFileCount} file${selectedFileCount !== 1 ? "s" : ""}`
                      : "Matrix Files"}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50 shrink-0" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Matrix Index Grid Files
                </p>

                {/* All Documents toggle */}
                <label className="flex items-start gap-2.5 cursor-pointer group mb-2 pb-2 border-b">
                  <Checkbox
                    checked={documentFilter.size === 0}
                    onCheckedChange={handleToggleAllDocuments}
                    aria-label="Show all documents"
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-snug font-medium group-hover:text-foreground text-muted-foreground transition-colors">
                    All Documents
                  </span>
                </label>

                <div className="space-y-2">
                  {matrixFiles.map((mf) => {
                    const isChecked = mf.documentIds.every((id) =>
                      documentFilter.has(id)
                    );
                    return (
                      <label
                        key={mf.id}
                        className="flex items-start gap-2.5 cursor-pointer group"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleToggleMatrixFile(mf.documentIds)
                          }
                          aria-label={`Select ${mf.fileName}`}
                          className="mt-0.5"
                        />
                        <span className="text-sm leading-snug group-hover:text-foreground text-muted-foreground transition-colors">
                          {mf.fileName}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {documentFilter.size > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 mt-2 w-full"
                    onClick={() => setDocumentFilter(new Set())}
                  >
                    Clear file selection
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* 3. Trade */}
          <div className="min-w-0">
            <Select
              value={tradeFilter}
              onValueChange={(v) => setTradeFilter(v)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by trade">
                <SelectValue placeholder="All Trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {uniqueTrades.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. Category */}
          <div className="min-w-0">
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by index category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. System */}
          <div className="min-w-0">
            <Select
              value={systemFilter}
              onValueChange={(v) => setSystemFilter(v)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by system category">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                {uniqueSystems.map((sys) => (
                  <SelectItem key={sys} value={sys}>
                    {sys}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 6. Material */}
          <div className="min-w-0">
            <Select
              value={materialFilter}
              onValueChange={(v) => setMaterialFilter(v)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by material category">
                <SelectValue placeholder="All Materials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {uniqueMaterials.map((mat) => (
                  <SelectItem key={mat} value={mat}>
                    {mat === "n/a" ? "N/A" : mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 7. Sort */}
          <div className="min-w-0">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
              <SelectTrigger className="w-full" aria-label="Sort order">
                <SelectValue placeholder="Name A-Z" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="index-category">Index Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 gap-1"
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              <X className="h-3 w-3" aria-hidden="true" />
              Clear Filters
            </Button>
          </div>
        )}

        {/* ── Project Metrics ──────────────────────── */}
        <div className="flex items-center gap-4 pt-3 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{selectedProject?.totalDocuments ?? 0}</span>
            <span className="text-muted-foreground">Total Items</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600">{selectedProject?.confidenceSummary?.preApproved ?? 0}</span>
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-amber-600">{(selectedProject?.confidenceSummary?.reviewRequired ?? 0) + (selectedProject?.confidenceSummary?.actionMandatory ?? 0)}</span>
            <span className="text-muted-foreground">Open</span>
          </div>
        </div>
      </section>

      {/* ── Project Info ─────────────────────────── */}
      <section className="flex items-center gap-3 flex-wrap text-sm" aria-label="Project information">
        <h2 className="text-base font-semibold">{selectedProject?.name ?? "Project"}</h2>
        <div className="h-4 w-px bg-border" />
        <span className="text-muted-foreground">{selectedProject?.client ?? ""}{selectedProject?.location ? ` • ${selectedProject.location}` : ""}</span>
        <div className="h-4 w-px bg-border" />
        <span className="text-emerald-600 font-medium">{selectedProject?.confidenceSummary?.preApproved ?? 0} Pre-Approved</span>
        <div className="h-4 w-px bg-border" />
        <span className="text-amber-600 font-medium">{selectedProject?.confidenceSummary?.reviewRequired ?? 0} Review Required</span>
        <div className="h-4 w-px bg-border" />
        <span className="text-rose-600 font-medium">{selectedProject?.confidenceSummary?.actionMandatory ?? 0} Action Mandatory</span>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push("/project-v3/overview")}
          >
            <Eye className="h-4 w-4" />
            View Overview
          </Button>
        </div>
      </section>

      {/* ── Sprint 2E: Batch actions bar ──────────────────────────────────── */}
      {checkedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-primary/5 border border-primary/10 px-4 py-2">
          <span className="text-sm font-medium">
            {checkedIds.size} item(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={batchApprove}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={batchRevisit}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={batchToggleAlternative}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <Replace className="h-4 w-4 mr-1" /> Alternate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCommentDialogOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> Comment
            </Button>
            <Button size="sm" variant="ghost" onClick={clearChecks}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      )}

      {/* ── Table or Empty State ──────────────────────────────────────────── */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No entries match your filters"
          description="Try adjusting your search or filter criteria to find the material specifications you need."
        >
          <Button
            variant="outline"
            onClick={handleClearFilters}
            aria-label="Clear all filters to show all entries"
          >
            <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Clear Filters
          </Button>
        </EmptyState>
      ) : (
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          {/* Sprint 1C: overflow-x-auto on wrapper */}
          <div className="overflow-x-auto">
            <table
              className="w-full table-fixed"
              aria-label="Trade-grouped material specifications"
            >
              {/* Sprint 1C: colgroup for fixed widths */}
              <colgroup>
                <col className="w-[40px]" />   {/* Checkbox */}
                <col className="w-[36px]" />   {/* Chevron */}
                <col className="w-[90px]" />   {/* Spec Section */}
                <col className="w-[140px]" />  {/* Catalogue Title */}
                <col />                         {/* Description (flex) */}
                <col className="w-[70px]" />   {/* Size */}
                <col className="w-[80px]" />   {/* Trade */}
                <col className="w-[100px]" />  {/* Subcategory */}
                <col className="w-[90px]" />   {/* Material Type */}
                <col className="w-[170px]" />  {/* AI Status */}
                <col className="w-[110px]" />  {/* Alternate */}
              </colgroup>
              <thead>
                <tr className="border-b bg-muted/30">
                  {/* Sprint 2B: Select All checkbox */}
                  <th scope="col" className="p-3" aria-label="Select all">
                    <Checkbox
                      checked={allFilteredChecked}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all filtered items"
                    />
                  </th>
                  <th scope="col" className="p-3" aria-label="Expand" />
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Spec Section
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Catalogue Title
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Trade
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Subcategory
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Material Type
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    AI Status
                  </th>
                  {/* Sprint 2C: Alternate column header */}
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Alternate
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from(groupedByTrade.entries()).map(
                  ([trade, items]) => (
                    <TradeGroup
                      key={trade}
                      trade={trade}
                      items={items}
                      expandedId={expandedId}
                      onToggleExpand={handleToggleExpand}
                      decisions={decisions}
                      updateDecision={updateDecision}
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      checkedIds={checkedIds}
                      toggleCheck={toggleCheck}
                      alternativeIds={alternativeIds}
                      toggleAlternative={toggleAlternative}
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Generate Binding button ───────────────────────────────────────── */}
      <div className="flex justify-end">
        <Button
          onClick={() => router.push("/project-v3/preview-cover")}
          className="gap-2"
          disabled={checkedIds.size === 0}
        >
          <FileText className="h-4 w-4" />
          Generate Binding
        </Button>
      </div>

      {/* ── Comment Dialog (Sprint 2E) ────────────────────────────────────── */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Comment to {checkedIds.size} item(s)
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCommentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trade Group (section header + data rows)                                    */
/* -------------------------------------------------------------------------- */

function TradeGroup({
  trade,
  items,
  expandedId,
  onToggleExpand,
  decisions,
  updateDecision,
  activeCategory,
  setActiveCategory,
  checkedIds,
  toggleCheck,
  alternativeIds,
  toggleAlternative,
}: {
  trade: string;
  items: MaterialItem[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  decisions: Record<string, DecisionStatus>;
  updateDecision: (
    documentId: string,
    decision: DecisionStatus
  ) => void;
  activeCategory: ValidationCategory;
  setActiveCategory: (category: ValidationCategory) => void;
  checkedIds: Set<string>;
  toggleCheck: (id: string) => void;
  alternativeIds: Set<string>;
  toggleAlternative: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Trade section header */}
      <tr
        className="bg-muted/40 border-y border-muted cursor-pointer select-none"
        onClick={() => setCollapsed((prev) => !prev)}
        role="row"
        aria-label={`${trade} trade group — ${items.length} entries`}
      >
        <td colSpan={TOTAL_COLS} className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                collapsed && "-rotate-90"
              )}
              aria-hidden="true"
            />
            <Badge
              variant="secondary"
              className={cn("text-[10px]", TRADE_COLORS[trade] ?? "")}
            >
              {trade}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </td>
      </tr>

      {/* Data rows (hidden when collapsed) */}
      {!collapsed &&
        items.map((item) => {
          const isExpanded = expandedId === item.document.id;
          const validationStatus = item.validation?.status;
          const statusConfig = validationStatus
            ? VALIDATION_STATUS_CONFIG[validationStatus]
            : null;
          const materialCat = item.document.materialCategory ?? "n/a";
          const isChecked = checkedIds.has(item.document.id);
          const isAlt = alternativeIds.has(item.document.id);

          return (
            <React.Fragment key={item.document.id}>
              <tr
                className={cn(
                  "border-b hover:bg-muted/30 transition-colors cursor-pointer group",
                  isExpanded &&
                    "bg-nav-accent/5 border-b-0 border-l-2 border-l-nav-accent",
                  isAlt && "bg-yellow-50/30 dark:bg-yellow-900/10"
                )}
                onClick={() => onToggleExpand(item.document.id)}
                tabIndex={0}
                role="row"
                aria-label={`${removeFileExtension(item.document.fileName)} — ${item.document.specSection}`}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggleExpand(item.document.id);
                  }
                }}
              >
                {/* 0. Checkbox (Sprint 2B) */}
                <td className="p-3">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleCheck(item.document.id)}
                      aria-label={`Select ${item.document.fileName}`}
                    />
                  </div>
                </td>

                {/* 1. Chevron */}
                <td className="p-3">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </td>

                {/* 2. Spec Section # */}
                <td className="p-3">
                  <span className="font-mono text-[11px] text-muted-foreground group-hover:text-nav-accent transition-colors">
                    {item.document.specSection}
                  </span>
                </td>

                {/* 3. Catalogue Title */}
                <td className="p-3">
                  <span
                    className="text-xs text-muted-foreground truncate block"
                    title={item.document.specSectionTitle}
                  >
                    {item.document.specSectionTitle}
                  </span>
                </td>

                {/* 4. Description (fileName without extension) */}
                <td className="p-3">
                  <p
                    className="text-sm font-medium truncate"
                    title={removeFileExtension(item.document.fileName)}
                  >
                    {removeFileExtension(item.document.fileName)}
                  </p>
                </td>

                {/* 5. Size */}
                <td className="p-3">
                  <span className="text-xs text-muted-foreground">
                    {item.document.sizes ?? "\u2014"}
                  </span>
                </td>

                {/* 6. Trade */}
                <td className="p-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      TRADE_COLORS[item.document.trade ?? ""] ?? ""
                    )}
                  >
                    {item.document.trade ?? "\u2014"}
                  </Badge>
                </td>

                {/* 7. Subcategory */}
                <td className="p-3">
                  <span
                    className="text-xs text-muted-foreground truncate block"
                    title={item.document.indexSubcategory ?? ""}
                  >
                    {item.document.indexSubcategory ?? "\u2014"}
                  </span>
                </td>

                {/* 8. Material Type */}
                <td className="p-3">
                  {materialCat !== "n/a" ? (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        MATERIAL_COLORS[materialCat] ?? ""
                      )}
                    >
                      {materialCat}
                    </Badge>
                  ) : (
                    <span
                      className="text-xs text-muted-foreground/50"
                      aria-label="Not applicable"
                    >
                      {"\u2014"}
                    </span>
                  )}
                </td>

                {/* 9. AI Status */}
                <td className="p-3 overflow-hidden">
                  {statusConfig ? (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] truncate max-w-full",
                        statusConfig.bgColor,
                        statusConfig.color
                      )}
                    >
                      {statusConfig.label}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">
                      {"\u2014"}
                    </span>
                  )}
                </td>

                {/* 10. Alternate toggle — explicit text with radio indicator */}
                <td className="p-3 overflow-hidden">
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => toggleAlternative(item.document.id)}
                      aria-label={`Mark ${item.document.fileName} as alternative`}
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border transition-colors whitespace-nowrap",
                        isAlt
                          ? "border-yellow-400 bg-yellow-50 text-yellow-700 font-medium"
                          : "border-muted-foreground/30 text-muted-foreground hover:border-yellow-400 hover:text-yellow-600"
                      )}
                    >
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full border-2 flex items-center justify-center shrink-0",
                          isAlt
                            ? "border-yellow-500 bg-yellow-500"
                            : "border-muted-foreground/40 bg-transparent"
                        )}
                      >
                        {isAlt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      Alternate
                    </button>
                  </div>
                </td>
              </tr>

              {/* Inline expansion row with EvidencePanel (Sprint 1D) */}
              {isExpanded && (
                <tr className="border-b">
                  <td colSpan={TOTAL_COLS} className="p-0">
                    <div className="overflow-hidden max-w-full">
                      <div className="bg-muted/40 border-t border-l-2 border-l-nav-accent/40 overflow-y-auto max-h-[500px]">
                        <EvidencePanel
                          material={item}
                          decision={decisions[item.document.id]}
                          onDecide={(decision) =>
                            updateDecision(item.document.id, decision)
                          }
                          activeCategory={activeCategory}
                          onCategoryChange={setActiveCategory}
                          projectId="proj-2"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
    </>
  );
}
