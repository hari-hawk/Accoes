"use client";

import React, { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Replace,
  AlertTriangle,
  BookOpen,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  v4ConformanceData,
  V4_TRADE_ORDER,
  V4_MATERIAL_TYPES,
  getV4StatusCounts,
  getV4ItemEvidence,
  type V4ConformanceItem,
  type V4ItemEvidence,
} from "@/data/mock-v4-conformance";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ValidationStatus } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                   */
/* -------------------------------------------------------------------------- */

const TRADE_COLORS: Record<string, string> = {
  Mechanical: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Plumbing: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const MATCH_TYPE_COLORS: Record<string, string> = {
  EXACT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PARTIAL: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ALTERNATE: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

/** Total columns in conformance table */
const V4_TOTAL_COLS = 13;

/* -------------------------------------------------------------------------- */
/*  Evidence Detail Panel                                                       */
/* -------------------------------------------------------------------------- */

function V4EvidenceDetail({ item }: { item: V4ConformanceItem }) {
  const [activeTab, setActiveTab] = useState<"spec" | "index">("spec");
  const evidence = useMemo(() => getV4ItemEvidence(item), [item]);

  const spec = evidence.spec;
  const isMatch = spec.matchStatus === "matches";
  const isPartial = spec.matchStatus === "partial";

  const barColor = spec.confidence >= 80
    ? "bg-emerald-500"
    : spec.confidence >= 40
      ? "bg-amber-500"
      : "bg-rose-500";

  const scoreColor = spec.confidence >= 80
    ? "text-emerald-600"
    : spec.confidence >= 40
      ? "text-amber-600"
      : "text-rose-600";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b space-y-3 shrink-0">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono">{item.accoMaterialId}</p>
          <h4 className="text-sm font-semibold leading-tight">{item.description}</h4>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-primary/80">{spec.specSection}</span>
            {" — "}
            {spec.specTitle}
          </p>
        </div>

        {/* Confidence bar */}
        <div className="flex items-center gap-2.5">
          <span className={cn("text-xs font-semibold", scoreColor)}>
            {isMatch ? "Matches Specification" : isPartial ? "Partial Match" : "No Match"}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-500", barColor)} style={{ width: `${spec.confidence}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums">{spec.confidence}%</span>
          </div>
        </div>

        {/* PS / PI tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "spec" | "index")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spec" className="text-xs">Project Specifications</TabsTrigger>
            <TabsTrigger value="index" className="text-xs">Project Index</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden relative bg-muted/20">
        <ScrollArea className="absolute inset-0">
          <div className="p-5 space-y-4">
            {activeTab === "spec" ? (
              <>
                {/* Match indicator */}
                <div className="flex items-center gap-2">
                  {isMatch ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Matches Specification</span>
                    </div>
                  ) : isPartial ? (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Partial Match</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Does Not Match</span>
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="rounded-md border bg-card p-3.5 space-y-2.5">
                  <h4 className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">AI Analysis</h4>
                  <p className="text-[13px] leading-relaxed">{spec.summary}</p>
                </div>

                {/* Requirements */}
                <div className="rounded-md border bg-muted/30 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Section {spec.specSection} — {spec.specTitle}</span>
                  </div>
                  <ul className="space-y-1">
                    {spec.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-muted-foreground/40" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* References */}
                <div className="space-y-2">
                  <h4 className="text-[13px] font-medium">Relevant References ({spec.references.length})</h4>
                  {spec.references.map((ref, i) => (
                    <div key={i} className="rounded-md border bg-card p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{ref.source}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">&ldquo;{ref.excerpt}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Index Matches */}
                <p className="text-[13px] font-medium">
                  Found {evidence.indexMatches.length} match{evidence.indexMatches.length !== 1 ? "es" : ""}
                </p>
                {evidence.indexMatches.map((match, i) => (
                  <div key={i} className="rounded-md border bg-card overflow-hidden">
                    <div className="px-3.5 py-2.5 flex items-center justify-between border-b bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">Match {i + 1} of {evidence.indexMatches.length}</span>
                        <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", MATCH_TYPE_COLORS[match.matchType] ?? "bg-muted text-muted-foreground")}>
                          {match.matchType}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">Score — {Math.round(match.matchScore * 100)}</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x">
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Category</p>
                        <p className="text-[13px]">{match.category}</p>
                      </div>
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Subcategory</p>
                        <p className="text-[13px]">{match.subcategory}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x border-t">
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Description</p>
                        <p className="text-[13px]">{match.itemDescription}</p>
                      </div>
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Size</p>
                        <p className="text-[13px]">{match.size}</p>
                      </div>
                    </div>
                    <div className="border-t bg-muted/30 px-3.5 py-2.5">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Reason</p>
                      <p className="text-[13px] leading-relaxed">{match.reason}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  V4 Trade Group                                                              */
/* -------------------------------------------------------------------------- */

function V4TradeGroup({
  trade,
  items,
  selectedId,
  onSelectRow,
  checkedIds,
  toggleCheck,
  alternativeIds,
  toggleAlternative,
}: {
  trade: string;
  items: V4ConformanceItem[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
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
        <td colSpan={V4_TOTAL_COLS} className="px-4 py-2.5">
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

      {/* Data rows */}
      {!collapsed &&
        items.map((item) => {
          const statusConfig = VALIDATION_STATUS_CONFIG[item.aiStatus];
          const isChecked = checkedIds.has(item.id);
          const isAlt = alternativeIds.has(item.id);
          const isSelected = selectedId === item.id;

          return (
            <tr
              key={item.id}
              className={cn(
                "border-b hover:bg-muted/30 transition-colors cursor-pointer group",
                isSelected && "bg-primary/5 border-l-2 border-l-primary",
                isAlt && !isSelected && "bg-yellow-50/30 dark:bg-yellow-900/10"
              )}
              onClick={() => onSelectRow(item.id)}
              tabIndex={0}
              role="row"
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectRow(item.id);
                }
              }}
            >
              {/* Checkbox */}
              <td className="p-3">
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleCheck(item.id)}
                    aria-label={`Select ${item.description}`}
                  />
                </div>
              </td>

              {/* Row indicator */}
              <td className="p-3">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isSelected && "text-primary"
                  )}
                  aria-hidden="true"
                />
              </td>

              {/* ACCO Material ID */}
              <td className="p-3">
                <span className="font-mono text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                  {item.accoMaterialId}
                </span>
              </td>

              {/* Pick Section */}
              <td className="p-3">
                <span className="font-mono text-[11px] text-muted-foreground">{item.pickSection}</span>
              </td>

              {/* Index Category */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground truncate block" title={item.indexCategory}>
                  {item.indexCategory}
                </span>
              </td>

              {/* Description */}
              <td className="p-3">
                <p className="text-sm font-medium truncate" title={item.description}>
                  {item.description}
                </p>
              </td>

              {/* Size */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground">{item.sizes}</span>
              </td>

              {/* Subcategory */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground truncate block" title={item.indexSubcategory}>
                  {item.indexSubcategory}
                </span>
              </td>

              {/* Material Type */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground">{item.materialType}</span>
              </td>

              {/* All System */}
              <td className="p-3">
                {item.allSystem ? (
                  <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">All</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground truncate block" title={item.systemCategory}>{item.systemCategory}</span>
                )}
              </td>

              {/* AI Status */}
              <td className="p-3 overflow-hidden">
                <Badge
                  variant="secondary"
                  className={cn("text-[10px] truncate max-w-full", statusConfig.bgColor, statusConfig.color)}
                >
                  {statusConfig.label}
                </Badge>
              </td>

              {/* Alternate toggle */}
              <td className="p-3 overflow-hidden">
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleAlternative(item.id)}
                    aria-label={`Mark ${item.description} as alternative`}
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border transition-colors whitespace-nowrap",
                      isAlt
                        ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full border-2 flex items-center justify-center shrink-0",
                        isAlt
                          ? "border-yellow-500 dark:border-yellow-400 bg-yellow-500 dark:bg-yellow-400"
                          : "border-muted-foreground/40 bg-transparent"
                      )}
                    >
                      {isAlt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    Alt
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  V4 Conformance Section — filters + trade-grouped table + evidence panel    */
/* -------------------------------------------------------------------------- */

export function V4ConformanceSection() {
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>("all");
  const [allSystemFilter, setAllSystemFilter] = useState<string>("all");
  const [matrixFileFilter, setMatrixFileFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("category");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [alternativeIds, setAlternativeIds] = useState<Set<string>>(new Set());

  /* Unique filter options */
  const uniqueTrades = useMemo(
    () => [...new Set(v4ConformanceData.map((m) => m.trade))],
    []
  );
  const uniqueCategories = useMemo(
    () => [...new Set(v4ConformanceData.map((m) => m.indexCategory))],
    []
  );
  const uniqueSystems = useMemo(
    () => [...new Set(v4ConformanceData.map((m) => m.systemCategory))],
    []
  );
  const uniqueMaterialTypes = useMemo(
    () => [...new Set(v4ConformanceData.map((m) => m.materialType))],
    []
  );

  /* Filtering */
  const filteredData = useMemo(() => {
    let result = v4ConformanceData;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.description.toLowerCase().includes(lower) ||
          m.accoMaterialId.toLowerCase().includes(lower) ||
          m.indexCategory.toLowerCase().includes(lower) ||
          m.indexSubcategory.toLowerCase().includes(lower) ||
          m.pickSection.toLowerCase().includes(lower)
      );
    }
    if (tradeFilter !== "all") {
      result = result.filter((m) => m.trade === tradeFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((m) => m.indexCategory === categoryFilter);
    }
    if (systemFilter !== "all") {
      result = result.filter((m) => m.systemCategory === systemFilter);
    }
    if (materialTypeFilter !== "all") {
      result = result.filter((m) => m.materialType === materialTypeFilter);
    }
    if (allSystemFilter !== "all") {
      const isAll = allSystemFilter === "yes";
      result = result.filter((m) => m.allSystem === isAll);
    }

    // Sort
    result = [...result];
    switch (sortBy) {
      case "description-asc":
        result.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case "description-desc":
        result.sort((a, b) => b.description.localeCompare(a.description));
        break;
      case "material-id":
        result.sort((a, b) => a.accoMaterialId.localeCompare(b.accoMaterialId));
        break;
      case "status":
        result.sort((a, b) => a.aiStatus.localeCompare(b.aiStatus));
        break;
      case "material-type":
        result.sort((a, b) => a.materialType.localeCompare(b.materialType));
        break;
      case "category":
      default:
        break;
    }

    return result;
  }, [search, tradeFilter, categoryFilter, systemFilter, materialTypeFilter, allSystemFilter, sortBy]);

  /* Trade-grouped data */
  const groupedByTrade = useMemo(() => {
    const map = new Map<string, V4ConformanceItem[]>();
    for (const trade of V4_TRADE_ORDER) {
      const items = filteredData.filter((m) => m.trade === trade);
      if (items.length > 0) {
        map.set(trade, items);
      }
    }
    return map;
  }, [filteredData]);

  /* Status counts */
  const statusCounts = useMemo(() => getV4StatusCounts(filteredData), [filteredData]);

  /* Selected item */
  const selectedItem = useMemo(
    () => (selectedId ? v4ConformanceData.find((m) => m.id === selectedId) ?? null : null),
    [selectedId]
  );

  /* Select all */
  const filteredIds = useMemo(() => filteredData.map((m) => m.id), [filteredData]);
  const allChecked = filteredIds.length > 0 && filteredIds.every((id) => checkedIds.has(id));

  const handleSelectAll = useCallback(() => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  }, [allChecked, filteredIds]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAlternative = useCallback((id: string) => {
    setAlternativeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const hasActiveFilters =
    search !== "" || tradeFilter !== "all" || categoryFilter !== "all" || systemFilter !== "all" || materialTypeFilter !== "all" || allSystemFilter !== "all" || matrixFileFilter !== "all" || sortBy !== "category";

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setTradeFilter("all");
    setCategoryFilter("all");
    setSystemFilter("all");
    setMaterialTypeFilter("all");
    setAllSystemFilter("all");
    setMatrixFileFilter("all");
    setSortBy("category");
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Filter bar — 48px horizontal padding at 1440px */}
      <div className="shrink-0 border-b bg-card px-12 py-4 space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search descriptions, material IDs, categories, sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8"
            aria-label="Search conformance items"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2" role="search" aria-label="Filter controls">
          {/* Matrix File */}
          <div className="min-w-0">
            <Select value={matrixFileFilter} onValueChange={setMatrixFileFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by matrix file">
                <SelectValue placeholder="All Files" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matrix Files</SelectItem>
                <SelectItem value="mechanical">Mechanical Template</SelectItem>
                <SelectItem value="plumbing">Plumbing Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trade */}
          <div className="min-w-0">
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by trade">
                <SelectValue placeholder="All Trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {uniqueTrades.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Index Category */}
          <div className="min-w-0">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* All System */}
          <div className="min-w-0">
            <Select value={allSystemFilter} onValueChange={setAllSystemFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by all system">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="yes">All-System Only</SelectItem>
                <SelectItem value="no">System-Specific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Material Type */}
          <div className="min-w-0">
            <Select value={materialTypeFilter} onValueChange={setMaterialTypeFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by material type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Material Types</SelectItem>
                {uniqueMaterialTypes.map((mt) => (
                  <SelectItem key={mt} value={mt}>{mt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* System Category */}
          <div className="min-w-0">
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by system category">
                <SelectValue placeholder="All System Cat." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All System Categories</SelectItem>
                {uniqueSystems.map((sys) => (
                  <SelectItem key={sys} value={sys}>{sys}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="min-w-0">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full" aria-label="Sort order">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Index Category</SelectItem>
                <SelectItem value="description-asc">Description A-Z</SelectItem>
                <SelectItem value="description-desc">Description Z-A</SelectItem>
                <SelectItem value="material-id">Material ID</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="material-type">Material Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" onClick={handleClearFilters}>
              <X className="h-3 w-3" aria-hidden="true" />
              Clear Filters
            </Button>
          </div>
        )}

        {/* Status counts */}
        <div className="flex items-center gap-4 pt-3 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{filteredData.length}</span>
            <span className="text-muted-foreground">Total Items</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-pre-approved shrink-0" />
            <span className="font-semibold text-emerald-600">{statusCounts.preApproved}</span>
            <span className="text-muted-foreground">Pre-Approved</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-review-required shrink-0" />
            <span className="font-semibold text-amber-600">{statusCounts.reviewRequired}</span>
            <span className="text-muted-foreground">Review Required</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-action-mandatory shrink-0" />
            <span className="font-semibold text-rose-600">{statusCounts.actionMandatory}</span>
            <span className="text-muted-foreground">Action Required</span>
          </div>
        </div>
      </div>

      {/* Batch actions bar */}
      {checkedIds.size > 0 && (
        <div className="shrink-0 flex items-center justify-between gap-3 border-b bg-primary/5 border-b-primary/10 px-12 py-2">
          <span className="text-sm font-medium">{checkedIds.size} item(s) selected</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                toast.success(`${checkedIds.size} item(s) approved`);
                setCheckedIds(new Set());
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              onClick={() => {
                for (const id of checkedIds) {
                  setAlternativeIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }
                setCheckedIds(new Set());
              }}
            >
              <Replace className="h-4 w-4 mr-1" /> Alternate
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCheckedIds(new Set())}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table — scrollable area with 48px horizontal padding */}
      <div className="flex-1 min-h-0 overflow-auto">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No entries match your filters</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleClearFilters}>
              <X className="mr-1.5 h-4 w-4" /> Clear Filters
            </Button>
          </div>
        ) : (
          <div className="px-12">
            <table className="w-full table-fixed" aria-label="Trade-grouped conformance specifications">
              <colgroup><col className="w-[40px]" /><col className="w-[32px]" /><col className="w-[160px]" /><col className="w-[80px]" /><col className="w-[120px]" /><col /><col className="w-[90px]" /><col className="w-[120px]" /><col className="w-[90px]" /><col className="w-[130px]" /><col className="w-[120px]" /><col className="w-[80px]" /><col className="w-[13px]" /></colgroup>
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b bg-muted/30">
                  <th scope="col" className="p-3" aria-label="Select all">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all filtered items"
                    />
                  </th>
                  <th scope="col" className="p-3" aria-label="Details" />
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material ID</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subcategory</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alt</th>
                  <th scope="col" className="p-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from(groupedByTrade.entries()).map(([trade, items]) => (
                  <V4TradeGroup
                    key={trade}
                    trade={trade}
                    items={items}
                    selectedId={selectedId}
                    onSelectRow={handleSelectRow}
                    checkedIds={checkedIds}
                    toggleCheck={toggleCheck}
                    alternativeIds={alternativeIds}
                    toggleAlternative={toggleAlternative}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right-side overlay panel — Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent side="right" className="w-[520px] sm:w-[560px] p-0 flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Material Evidence</SheetTitle>
          </SheetHeader>
          {selectedItem && <V4EvidenceDetail item={selectedItem} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
