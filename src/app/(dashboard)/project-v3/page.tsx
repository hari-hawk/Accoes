"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  X,
  ChevronDown,
  Filter,
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
import { EmptyState } from "@/components/shared/empty-state";
import { EvidencePanel } from "@/components/workspace/evidence-panel";
import { useMaterials } from "@/hooks/use-materials";
import type { MaterialItem } from "@/hooks/use-materials";
import { getMatrixFilesByVersion } from "@/data/mock-documents";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import type { ValidationCategory } from "@/data/types";
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
/*  Status dot colors (for the counts bar and AI Status column)                */
/* -------------------------------------------------------------------------- */

const STATUS_DOT_COLORS: Record<string, string> = {
  pre_approved: "bg-status-pre-approved",
  review_required: "bg-status-review-required",
  action_mandatory: "bg-status-action-mandatory",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function removeFileExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "");
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function ProjectV3Page() {
  /* ── Hook calls (must be before any early returns per React 19 rules) ──── */
  const {
    allMaterials,
    decisions,
    updateDecision,
    activeCategory,
    setActiveCategory,
  } = useMaterials("ver-5");

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

  /* ── Derive matrix files for the Project Files multi-select ────────────── */
  const matrixFiles = useMemo(() => getMatrixFilesByVersion("ver-5"), []);

  /* ── Derive unique filter options from allMaterials ────────────────────── */
  const uniqueTrades = useMemo(
    () =>
      [...new Set(allMaterials.map((m) => m.document.trade).filter(Boolean))] as string[],
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

    // Document filter (Project Files multi-select)
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
  const statusCounts = useMemo(() => {
    const counts = { pre_approved: 0, review_required: 0, action_mandatory: 0 };
    for (const m of filteredMaterials) {
      const status = m.validation?.status;
      if (status && status in counts) {
        counts[status as keyof typeof counts]++;
      }
    }
    return counts;
  }, [filteredMaterials]);

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
        // Check if ALL docIds of this file are currently selected
        const allSelected = fileDocIds.every((id) => next.has(id));
        if (allSelected) {
          // Remove them all
          for (const id of fileDocIds) {
            next.delete(id);
          }
        } else {
          // Add them all
          for (const id of fileDocIds) {
            next.add(id);
          }
        }
        return next;
      });
    },
    []
  );

  /* ── Derive the currently expanded material ────────────────────────────── */
  const expandedMaterial = useMemo(
    () =>
      expandedId
        ? filteredMaterials.find((m) => m.document.id === expandedId) ?? null
        : null,
    [expandedId, filteredMaterials]
  );

  /* ── Count selected files for Popover label ────────────────────────────── */
  const selectedFileCount = useMemo(() => {
    if (documentFilter.size === 0) return 0;
    return matrixFiles.filter((mf) =>
      mf.documentIds.some((id) => documentFilter.has(id))
    ).length;
  }, [documentFilter, matrixFiles]);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <main className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
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
      <section className="space-y-3" aria-label="Filters">
        {/* Search bar — full width */}
        <div className="relative w-full max-w-xl">
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

        {/* Filter row */}
        <div
          className="flex flex-wrap items-center gap-3"
          role="search"
          aria-label="Filter controls"
        >
          {/* 1. Project Files — multi-select Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-1.5 text-sm font-normal"
                aria-label="Filter by project files"
              >
                <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                {selectedFileCount > 0
                  ? `${selectedFileCount} file${selectedFileCount !== 1 ? "s" : ""}`
                  : "Project Files"}
                <ChevronDown className="h-3 w-3 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Matrix Index Grid Files
              </p>
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

          {/* 2. Trade */}
          <Select
            value={tradeFilter}
            onValueChange={(v) => setTradeFilter(v)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Filter by trade">
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

          {/* 3. Category */}
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger
              className="w-[180px]"
              aria-label="Filter by index category"
            >
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

          {/* 4. System */}
          <Select
            value={systemFilter}
            onValueChange={(v) => setSystemFilter(v)}
          >
            <SelectTrigger
              className="w-[160px]"
              aria-label="Filter by system category"
            >
              <SelectValue placeholder="All Systems" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="Chilled Water">Chilled Water</SelectItem>
              <SelectItem value="Condenser Water">Condenser Water</SelectItem>
              <SelectItem value="Generic">Generic</SelectItem>
            </SelectContent>
          </Select>

          {/* 5. Material */}
          <Select
            value={materialFilter}
            onValueChange={(v) => setMaterialFilter(v)}
          >
            <SelectTrigger
              className="w-[160px]"
              aria-label="Filter by material category"
            >
              <SelectValue placeholder="All Materials" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Materials</SelectItem>
              <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
              <SelectItem value="Copper">Copper</SelectItem>
              <SelectItem value="n/a">N/A</SelectItem>
            </SelectContent>
          </Select>

          {/* 6. Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
            <SelectTrigger className="w-[160px]" aria-label="Sort order">
              <SelectValue placeholder="Name A-Z" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="index-category">Index Category</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
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
          )}
        </div>
      </section>

      {/* ── Status Counts Bar ─────────────────────────────────────────────── */}
      <section
        className="flex items-center gap-5 text-sm"
        aria-label="Status summary"
      >
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              STATUS_DOT_COLORS.pre_approved
            )}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">
            {statusCounts.pre_approved}{" "}
            <span className="hidden sm:inline">Pre-Approved</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              STATUS_DOT_COLORS.review_required
            )}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">
            {statusCounts.review_required}{" "}
            <span className="hidden sm:inline">Review Required</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              STATUS_DOT_COLORS.action_mandatory
            )}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">
            {statusCounts.action_mandatory}{" "}
            <span className="hidden sm:inline">Action Required</span>
          </span>
        </div>
        <span className="text-muted-foreground/60 text-xs ml-auto">
          {filteredMaterials.length} of {allMaterials.length} items
        </span>
      </section>

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
          <div className="overflow-x-auto">
            <table
              className="w-full"
              aria-label="Trade-grouped material specifications"
            >
              <thead>
                <tr className="border-b bg-muted/30">
                  <th scope="col" className="p-3 w-10" aria-label="Expand" />
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]"
                  >
                    Spec Section #
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[180px]"
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
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[130px]"
                  >
                    Trade
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[140px]"
                  >
                    Subcategory
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]"
                  >
                    Material Type
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[140px]"
                  >
                    AI Status
                  </th>
                  <th
                    scope="col"
                    className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[90px]"
                  >
                    SP#
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
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
}: {
  trade: string;
  items: MaterialItem[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  decisions: Record<string, import("@/data/types").DecisionStatus>;
  updateDecision: (
    documentId: string,
    decision: import("@/data/types").DecisionStatus
  ) => void;
  activeCategory: ValidationCategory;
  setActiveCategory: (category: ValidationCategory) => void;
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
        <td colSpan={10} className="px-4 py-2.5">
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

          return (
            <React.Fragment key={item.document.id}>
              <tr
                className={cn(
                  "border-b hover:bg-muted/30 transition-colors cursor-pointer group",
                  isExpanded &&
                    "bg-nav-accent/5 border-b-0 border-l-2 border-l-nav-accent"
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
                {/* 1. Chevron */}
                <td className="p-3 w-10">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </td>

                {/* 2. Spec Section # */}
                <td className="p-3 w-[120px]">
                  <span className="font-mono text-[11px] text-muted-foreground group-hover:text-nav-accent transition-colors">
                    {item.document.specSection}
                  </span>
                </td>

                {/* 3. Catalogue Title */}
                <td className="p-3 w-[180px]">
                  <span
                    className="text-xs text-muted-foreground truncate block max-w-[170px]"
                    title={item.document.specSectionTitle}
                  >
                    {item.document.specSectionTitle}
                  </span>
                </td>

                {/* 4. Description (fileName without extension) */}
                <td className="p-3">
                  <p
                    className="text-sm font-medium truncate max-w-[300px]"
                    title={removeFileExtension(item.document.fileName)}
                  >
                    {removeFileExtension(item.document.fileName)}
                  </p>
                </td>

                {/* 5. Size */}
                <td className="p-3 w-[100px]">
                  <span className="text-xs text-muted-foreground">
                    {item.document.sizes ?? "—"}
                  </span>
                </td>

                {/* 6. Trade */}
                <td className="p-3 w-[130px]">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      TRADE_COLORS[item.document.trade ?? ""] ?? ""
                    )}
                  >
                    {item.document.trade ?? "—"}
                  </Badge>
                </td>

                {/* 7. Subcategory */}
                <td className="p-3 w-[140px]">
                  <span
                    className="text-xs text-muted-foreground truncate block max-w-[130px]"
                    title={item.document.indexSubcategory ?? ""}
                  >
                    {item.document.indexSubcategory ?? "—"}
                  </span>
                </td>

                {/* 8. Material Type */}
                <td className="p-3 w-[120px]">
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
                      —
                    </span>
                  )}
                </td>

                {/* 9. AI Status */}
                <td className="p-3 w-[140px]">
                  {statusConfig ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-block h-2 w-2 rounded-full shrink-0",
                          STATUS_DOT_COLORS[validationStatus!] ?? ""
                        )}
                        aria-hidden="true"
                      />
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          statusConfig.bgColor,
                          statusConfig.color
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </td>

                {/* 10. SP# */}
                <td className="p-3 w-[90px]">
                  {validationStatus === "pre_approved" ? (
                    <span className="text-xs font-mono text-status-pre-approved">
                      SP#Rev1
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </td>
              </tr>

              {/* Inline expansion row with EvidencePanel */}
              {isExpanded && (
                <tr className="border-b">
                  <td colSpan={10} className="p-0">
                    <div className="bg-muted/40 border-t border-l-2 border-l-nav-accent/40 max-h-[600px] overflow-y-auto">
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
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
    </>
  );
}
