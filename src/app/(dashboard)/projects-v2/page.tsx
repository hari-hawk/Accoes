"use client";

import React from "react";
import {
  Search,
  X,
  ChevronDown,
  FolderKanban,
  Package,
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
import { EmptyState } from "@/components/shared/empty-state";
import { useProjectsV2 } from "@/hooks/use-projects-v2";
import { formatStatus } from "@/data/mock-projects-v2";
import type { ProjectV2Row, MaterialV2Row } from "@/data/mock-projects-v2";
import type { ProjectStatus } from "@/data/types";
import type {
  HydroTrade,
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
} from "@/data/mock-project-index";
import { HYDRO_CATEGORY_ORDER } from "@/data/mock-project-index";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Badge color configs                                                        */
/* -------------------------------------------------------------------------- */

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-ds-neutral-100 text-ds-neutral-700 dark:bg-ds-neutral-800 dark:text-ds-neutral-300",
  on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  extracting: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const AI_STATUS_COLORS: Record<string, string> = {
  pre_approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  review_required: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  action_mandatory: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const DECISION_COLORS: Record<string, string> = {
  pending: "bg-ds-neutral-100 text-ds-neutral-600 dark:bg-ds-neutral-800 dark:text-ds-neutral-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  approved_with_notes: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  revision_requested: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  revisit: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const MATERIAL_CAT_COLORS: Record<string, string> = {
  "Carbon Steel": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400",
  "Copper": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "n/a": "",
};

function confidenceColor(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

function HeroSection({
  projectCount,
  materialCount,
}: {
  projectCount: number;
  materialCount: number;
}) {
  return (
    <section
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up"
      aria-label="Projects v2 header"
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight">Projects v2</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Cross-project material conformance overview
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <FolderKanban className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold text-foreground">{projectCount}</span>
          <span>Projects</span>
        </div>
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Package className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold text-foreground">{materialCount}</span>
          <span>Materials</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters Bar                                                                */
/* -------------------------------------------------------------------------- */

function FiltersBar({
  search,
  onSearchChange,
  tradeFilter,
  onTradeChange,
  trades,
  categoryFilter,
  onCategoryChange,
  systemFilter,
  onSystemChange,
  statusFilter,
  onStatusChange,
  statusOptions,
  materialFilter,
  onMaterialChange,
  hasActiveFilters,
  onClearFilters,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  tradeFilter: HydroTrade | "all";
  onTradeChange: (v: HydroTrade | "all") => void;
  trades: HydroTrade[];
  categoryFilter: HydroIndexCategory | "all";
  onCategoryChange: (v: HydroIndexCategory | "all") => void;
  systemFilter: HydroSystemCategory | "all";
  onSystemChange: (v: HydroSystemCategory | "all") => void;
  statusFilter: ProjectStatus | "all";
  onStatusChange: (v: ProjectStatus | "all") => void;
  statusOptions: ProjectStatus[];
  materialFilter: HydroMaterialCategory | "all";
  onMaterialChange: (v: HydroMaterialCategory | "all") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3" role="search" aria-label="Filter projects and materials">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search projects, materials, specs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search projects and materials"
        />
        {search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-1 outline-none"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Trade */}
      <Select
        value={tradeFilter}
        onValueChange={(v) => onTradeChange(v as HydroTrade | "all")}
      >
        <SelectTrigger className="w-[160px]" aria-label="Filter by trade">
          <SelectValue placeholder="All Trades" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Trades</SelectItem>
          {trades.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={categoryFilter}
        onValueChange={(v) => onCategoryChange(v as HydroIndexCategory | "all")}
      >
        <SelectTrigger className="w-[170px]" aria-label="Filter by category">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {HYDRO_CATEGORY_ORDER.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* System */}
      <Select
        value={systemFilter}
        onValueChange={(v) => onSystemChange(v as HydroSystemCategory | "all")}
      >
        <SelectTrigger className="w-[170px]" aria-label="Filter by system">
          <SelectValue placeholder="All Systems" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Systems</SelectItem>
          <SelectItem value="Chilled Water">Chilled Water</SelectItem>
          <SelectItem value="Condenser Water">Condenser Water</SelectItem>
          <SelectItem value="Generic">Generic</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusChange(v as ProjectStatus | "all")}
      >
        <SelectTrigger className="w-[160px]" aria-label="Filter by status">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statusOptions.map((s) => (
            <SelectItem key={s} value={s}>{formatStatus(s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Material */}
      <Select
        value={materialFilter}
        onValueChange={(v) => onMaterialChange(v as HydroMaterialCategory | "all")}
      >
        <SelectTrigger className="w-[160px]" aria-label="Filter by material">
          <SelectValue placeholder="All Materials" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Materials</SelectItem>
          <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
          <SelectItem value="Copper">Copper</SelectItem>
          <SelectItem value="n/a">N/A</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-8 gap-1"
          onClick={onClearFilters}
          aria-label="Clear all filters"
        >
          <X className="h-3 w-3" aria-hidden="true" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material Rows (L2)                                                         */
/* -------------------------------------------------------------------------- */

function MaterialRows({ materials }: { materials: MaterialV2Row[] }) {
  return (
    <tr>
      <td colSpan={8} className="p-0 border-b border-border/50">
        <div className="animate-accordion-down overflow-hidden">
          <div className="px-6 py-3 bg-muted/20">
            <table className="w-full" aria-label="Material conformance items">
              <thead>
                <tr className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th scope="col" className="pb-2 text-left pr-3">Spec Section</th>
                  <th scope="col" className="pb-2 text-left pr-3">Catalog Title</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden md:table-cell">Description</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden lg:table-cell">Subcategory</th>
                  <th scope="col" className="pb-2 text-left pr-3">Trade</th>
                  <th scope="col" className="pb-2 text-left pr-3">AI Status</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden md:table-cell">Decision</th>
                  <th scope="col" className="pb-2 text-left hidden lg:table-cell">System</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t border-border/30 text-xs"
                  >
                    <td className="py-2 pr-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {m.specSection}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className="font-medium text-sm">{m.catalogTitle}</span>
                    </td>
                    <td className="py-2 pr-3 hidden md:table-cell">
                      <span className="text-muted-foreground truncate block max-w-[200px]" title={m.description}>
                        {m.description}
                      </span>
                    </td>
                    <td className="py-2 pr-3 hidden lg:table-cell">
                      <span className="text-muted-foreground">{m.subcategory}</span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className="text-muted-foreground">{m.trade}</span>
                    </td>
                    <td className="py-2 pr-3">
                      <Badge variant="secondary" className={cn("text-[10px]", AI_STATUS_COLORS[m.aiStatus])}>
                        {formatStatus(m.aiStatus)}
                      </Badge>
                    </td>
                    <td className="py-2 pr-3 hidden md:table-cell">
                      <Badge variant="secondary" className={cn("text-[10px]", DECISION_COLORS[m.decision])}>
                        {formatStatus(m.decision)}
                      </Badge>
                    </td>
                    <td className="py-2 hidden lg:table-cell">
                      <span className="text-muted-foreground">{m.system}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Row (L1) + optional L2 expansion                                   */
/* -------------------------------------------------------------------------- */

function ProjectRow({
  row,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
}: {
  row: ProjectV2Row;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
}) {
  return (
    <React.Fragment>
      <tr
        className={cn(
          "border-b hover:bg-muted/30 transition-colors cursor-pointer group",
          isExpanded && "bg-nav-accent/5 border-b-0"
        )}
        onClick={() => onToggleExpand(row.id)}
        tabIndex={0}
        role="row"
        aria-label={`${row.name} — ${row.jobId}`}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand(row.id);
          }
        }}
      >
        {/* Checkbox */}
        <td className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(row.id)}
            aria-label={`Select ${row.name}`}
          />
        </td>
        {/* Chevron */}
        <td className="p-3 w-10">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </td>
        {/* Project Name */}
        <td className="p-3">
          <p className="text-sm font-medium group-hover:text-nav-accent transition-colors">
            {row.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {row.materials.length} material{row.materials.length !== 1 ? "s" : ""}
          </p>
        </td>
        {/* Job ID */}
        <td className="p-3 w-[120px]">
          <span className="font-mono text-[11px] text-muted-foreground">
            {row.jobId}
          </span>
        </td>
        {/* Type */}
        <td className="p-3 w-[120px] hidden md:table-cell">
          <span className="text-xs text-muted-foreground">{row.type}</span>
        </td>
        {/* Status */}
        <td className="p-3 w-[100px]">
          <Badge variant="secondary" className={cn("text-[10px]", STATUS_COLORS[row.status])}>
            {formatStatus(row.status)}
          </Badge>
        </td>
        {/* Confidence */}
        <td className="p-3 w-[100px] hidden lg:table-cell">
          <span className={cn("text-sm font-semibold tabular-nums", confidenceColor(row.overallConfidence))}>
            {row.overallConfidence}%
          </span>
        </td>
        {/* Material Category */}
        <td className="p-3 w-[130px] hidden xl:table-cell">
          {row.materialCategory !== "n/a" ? (
            <Badge variant="secondary" className={cn("text-[10px]", MATERIAL_CAT_COLORS[row.materialCategory])}>
              {row.materialCategory}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground/50">—</span>
          )}
        </td>
      </tr>

      {/* L2 Material rows (expanded) */}
      {isExpanded && <MaterialRows materials={row.materials} />}
    </React.Fragment>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects v2 Table                                                          */
/* -------------------------------------------------------------------------- */

function ProjectsV2Table({
  rows,
  expandedId,
  onToggleExpand,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: {
  rows: ProjectV2Row[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
}) {
  const allIds = rows.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Projects v2 — cross-project material conformance">
          <thead>
            <tr className="border-b bg-muted/30">
              <th scope="col" className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onToggleSelectAll(allIds)}
                  aria-label="Select all projects"
                />
              </th>
              <th scope="col" className="p-3 w-10" aria-label="Expand" />
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Project Name
              </th>
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]">
                Job ID
              </th>
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px] hidden md:table-cell">
                Type
              </th>
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">
                Status
              </th>
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px] hidden lg:table-cell">
                Confidence
              </th>
              <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[130px] hidden xl:table-cell">
                Material
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <ProjectRow
                key={row.id}
                row={row}
                isExpanded={expandedId === row.id}
                isSelected={selectedIds.has(row.id)}
                onToggleExpand={onToggleExpand}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProjectsV2Page() {
  const {
    filteredRows,
    filteredProjectCount,
    totalMaterials,
    search,
    setSearch,
    tradeFilter,
    setTradeFilter,
    trades,
    categoryFilter,
    setCategoryFilter,
    systemFilter,
    setSystemFilter,
    statusFilter,
    setStatusFilter,
    statusOptions,
    materialFilter,
    setMaterialFilter,
    hasActiveFilters,
    clearFilters,
    expandedId,
    toggleExpand,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
  } = useProjectsV2();

  return (
    <main className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <HeroSection
        projectCount={filteredProjectCount}
        materialCount={totalMaterials}
      />

      {/* Filters */}
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        tradeFilter={tradeFilter}
        onTradeChange={setTradeFilter}
        trades={trades}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        systemFilter={systemFilter}
        onSystemChange={setSystemFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
        materialFilter={materialFilter}
        onMaterialChange={setMaterialFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Table or Empty */}
      {filteredRows.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects match your filters"
          description="Try adjusting your search or filter criteria."
        >
          <Button variant="outline" onClick={clearFilters} aria-label="Clear all filters">
            <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Clear Filters
          </Button>
        </EmptyState>
      ) : (
        <ProjectsV2Table
          rows={filteredRows}
          expandedId={expandedId}
          onToggleExpand={toggleExpand}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />
      )}
    </main>
  );
}
