"use client";

import React, { useCallback } from "react";
import {
  Search,
  X,
  ChevronDown,
  FolderKanban,
  Package,
  Download,
  LayoutList,
  LayoutGrid,
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
import { useProjectsV2, type ViewMode, type Metrics } from "@/hooks/use-projects-v2";
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
import { exportMaterialsCsv } from "@/lib/export-csv";
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
  Copper: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
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
  viewMode,
  onViewModeChange,
}: {
  projectCount: number;
  materialCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
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
        <div className="h-4 w-px bg-border" aria-hidden="true" />
        {/* View toggle */}
        <div className="flex items-center border rounded-lg overflow-hidden" role="group" aria-label="View mode">
          <button
            className={cn(
              "p-2 transition-colors",
              viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            )}
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            className={cn(
              "p-2 transition-colors",
              viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            )}
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Metrics Dashboard                                                          */
/* -------------------------------------------------------------------------- */

function MetricsDashboard({ metrics }: { metrics: Metrics }) {
  const cards: Array<{ label: string; value: string; accent: string }> = [
    { label: "Projects", value: String(metrics.totalProjects), accent: "border-l-blue-600" },
    { label: "Materials", value: String(metrics.totalMaterials), accent: "border-l-indigo-500" },
    { label: "Approval Rate", value: `${metrics.approvalRate}%`, accent: "border-l-emerald-500" },
    { label: "Pre-Approved", value: String(metrics.preApprovedCount), accent: "border-l-emerald-500" },
    { label: "Review Required", value: String(metrics.reviewRequiredCount), accent: "border-l-amber-500" },
    { label: "Action Mandatory", value: String(metrics.actionMandatoryCount), accent: "border-l-red-500" },
    { label: "Avg Confidence", value: `${metrics.avgConfidence}%`, accent: "border-l-violet-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" role="group" aria-label="Executive metrics">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "bg-card border border-border rounded-lg px-4 py-3 border-l-[3px]",
            card.accent
          )}
        >
          <p className="text-xl font-semibold text-foreground leading-tight tabular-nums">
            {card.value}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mt-1">
            {card.label}
          </p>
        </div>
      ))}
    </div>
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

      <Select value={tradeFilter} onValueChange={(v) => onTradeChange(v as HydroTrade | "all")}>
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

      <Select value={categoryFilter} onValueChange={(v) => onCategoryChange(v as HydroIndexCategory | "all")}>
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

      <Select value={systemFilter} onValueChange={(v) => onSystemChange(v as HydroSystemCategory | "all")}>
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

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ProjectStatus | "all")}>
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

      <Select value={materialFilter} onValueChange={(v) => onMaterialChange(v as HydroMaterialCategory | "all")}>
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

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" onClick={onClearFilters} aria-label="Clear all filters">
          <X className="h-3 w-3" aria-hidden="true" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Selection Action Bar                                                       */
/* -------------------------------------------------------------------------- */

function SelectionBar({
  count,
  onExport,
  onClear,
}: {
  count: number;
  onExport: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-nav-accent/10 border border-nav-accent/20 rounded-lg px-4 py-2.5">
      <span className="text-sm font-medium">
        {count} material{count !== 1 ? "s" : ""} selected
      </span>
      <Button size="sm" className="gap-1.5" onClick={onExport}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Export CSV
      </Button>
      <Button variant="ghost" size="sm" className="text-xs" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material Rows (L2) — with checkboxes, sizes, confidence                    */
/* -------------------------------------------------------------------------- */

function MaterialRows({
  materials,
  selectedMaterialIds,
  onToggleMaterialSelect,
  onToggleMaterialSelectAll,
}: {
  materials: MaterialV2Row[];
  selectedMaterialIds: Set<string>;
  onToggleMaterialSelect: (id: string) => void;
  onToggleMaterialSelectAll: (ids: string[]) => void;
}) {
  const allIds = materials.map((m) => m.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedMaterialIds.has(id));

  return (
    <tr>
      <td colSpan={8} className="p-0 border-b border-border/50">
        <div className="animate-accordion-down overflow-hidden">
          <div className="px-6 py-3 bg-muted/20">
            <table className="w-full" aria-label="Material conformance items">
              <thead>
                <tr className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th scope="col" className="pb-2 w-8" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => onToggleMaterialSelectAll(allIds)}
                      aria-label="Select all materials in this project"
                    />
                  </th>
                  <th scope="col" className="pb-2 text-left pr-3">Spec Section</th>
                  <th scope="col" className="pb-2 text-left pr-3">Catalog Title</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden md:table-cell">Description</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden lg:table-cell">Sizes</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden lg:table-cell">Subcategory</th>
                  <th scope="col" className="pb-2 text-left pr-3">Trade</th>
                  <th scope="col" className="pb-2 text-left pr-3">AI Status</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden md:table-cell">Decision</th>
                  <th scope="col" className="pb-2 text-left pr-3 hidden lg:table-cell">System</th>
                  <th scope="col" className="pb-2 text-left">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} className="border-t border-border/30 text-xs">
                    <td className="py-2 pr-2 w-8" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedMaterialIds.has(m.id)}
                        onCheckedChange={() => onToggleMaterialSelect(m.id)}
                        aria-label={`Select ${m.catalogTitle}`}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <span className="font-mono text-[11px] text-muted-foreground">{m.specSection}</span>
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
                      <span className="text-muted-foreground text-[11px] font-mono">
                        {m.sizes.includes("|")
                          ? m.sizes.split("|").slice(0, 3).join(", ") +
                            (m.sizes.split("|").length > 3 ? "…" : "")
                          : m.sizes}
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
                    <td className="py-2 pr-3 hidden lg:table-cell">
                      <span className="text-muted-foreground">{m.system}</span>
                    </td>
                    <td className="py-2">
                      <span className={cn("text-xs font-semibold tabular-nums", confidenceColor(m.confidenceScore))}>
                        {m.confidenceScore}%
                      </span>
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
  selectedMaterialIds,
  onToggleMaterialSelect,
  onToggleMaterialSelectAll,
}: {
  row: ProjectV2Row;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
  selectedMaterialIds: Set<string>;
  onToggleMaterialSelect: (id: string) => void;
  onToggleMaterialSelectAll: (ids: string[]) => void;
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
        <td className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(row.id)}
            aria-label={`Select ${row.name}`}
          />
        </td>
        <td className="p-3 w-10">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </td>
        <td className="p-3">
          <p className="text-sm font-medium group-hover:text-nav-accent transition-colors">
            {row.name}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {row.materials.length} material{row.materials.length !== 1 ? "s" : ""}
          </p>
        </td>
        <td className="p-3 w-[120px]">
          <span className="font-mono text-[11px] text-muted-foreground">{row.jobId}</span>
        </td>
        <td className="p-3 w-[120px] hidden md:table-cell">
          <span className="text-xs text-muted-foreground">{row.type}</span>
        </td>
        <td className="p-3 w-[100px]">
          <Badge variant="secondary" className={cn("text-[10px]", STATUS_COLORS[row.status])}>
            {formatStatus(row.status)}
          </Badge>
        </td>
        <td className="p-3 w-[100px] hidden lg:table-cell">
          <span className={cn("text-sm font-semibold tabular-nums", confidenceColor(row.overallConfidence))}>
            {row.overallConfidence}%
          </span>
        </td>
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

      {isExpanded && (
        <MaterialRows
          materials={row.materials}
          selectedMaterialIds={selectedMaterialIds}
          onToggleMaterialSelect={onToggleMaterialSelect}
          onToggleMaterialSelectAll={onToggleMaterialSelectAll}
        />
      )}
    </React.Fragment>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects v2 Table (List View)                                              */
/* -------------------------------------------------------------------------- */

function ProjectsV2Table({
  rows,
  expandedId,
  onToggleExpand,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  selectedMaterialIds,
  onToggleMaterialSelect,
  onToggleMaterialSelectAll,
}: {
  rows: ProjectV2Row[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  selectedMaterialIds: Set<string>;
  onToggleMaterialSelect: (id: string) => void;
  onToggleMaterialSelectAll: (ids: string[]) => void;
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
                selectedMaterialIds={selectedMaterialIds}
                onToggleMaterialSelect={onToggleMaterialSelect}
                onToggleMaterialSelectAll={onToggleMaterialSelectAll}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid View                                                                  */
/* -------------------------------------------------------------------------- */

function ProjectGridCard({
  row,
  onClick,
}: {
  row: ProjectV2Row;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-5 hover:border-nav-accent/50 hover:shadow-sm",
        "transition-all duration-150 cursor-pointer group"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${row.name} — click to expand in list view`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold truncate group-hover:text-nav-accent transition-colors">
          {row.name}
        </h3>
        <Badge variant="secondary" className={cn("text-[10px] shrink-0", STATUS_COLORS[row.status])}>
          {formatStatus(row.status)}
        </Badge>
      </div>
      <p className="text-[11px] font-mono text-muted-foreground mt-1">{row.jobId}</p>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
        <div>
          <p className={cn("text-lg font-semibold tabular-nums", confidenceColor(row.overallConfidence))}>
            {row.overallConfidence}%
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
        </div>
        <div>
          <p className="text-lg font-semibold tabular-nums">{row.materials.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Materials</p>
        </div>
        <div className="ml-auto">
          {row.materialCategory !== "n/a" && (
            <Badge variant="secondary" className={cn("text-[10px]", MATERIAL_CAT_COLORS[row.materialCategory])}>
              {row.materialCategory}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectGridView({
  rows,
  onCardClick,
}: {
  rows: ProjectV2Row[];
  onCardClick: (projectId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map((row) => (
        <ProjectGridCard key={row.id} row={row} onClick={() => onCardClick(row.id)} />
      ))}
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
    metrics,
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
    setExpandedId,
    toggleExpand,
    viewMode,
    setViewMode,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    selectedMaterialIds,
    toggleMaterialSelect,
    toggleMaterialSelectAll,
    clearMaterialSelection,
    selectedMaterials,
  } = useProjectsV2();

  const handleGridCardClick = useCallback(
    (projectId: string) => {
      setViewMode("list");
      setExpandedId(projectId);
    },
    [setViewMode, setExpandedId]
  );

  const handleExport = useCallback(() => {
    exportMaterialsCsv(selectedMaterials);
  }, [selectedMaterials]);

  return (
    <main className="px-6 py-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Hero */}
      <HeroSection
        projectCount={filteredProjectCount}
        materialCount={totalMaterials}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Metrics */}
      <MetricsDashboard metrics={metrics} />

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

      {/* Selection action bar */}
      {selectedMaterials.length > 0 && (
        <SelectionBar
          count={selectedMaterials.length}
          onExport={handleExport}
          onClear={clearMaterialSelection}
        />
      )}

      {/* Content — table or grid or empty */}
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
      ) : viewMode === "list" ? (
        <ProjectsV2Table
          rows={filteredRows}
          expandedId={expandedId}
          onToggleExpand={toggleExpand}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          selectedMaterialIds={selectedMaterialIds}
          onToggleMaterialSelect={toggleMaterialSelect}
          onToggleMaterialSelectAll={toggleMaterialSelectAll}
        />
      ) : (
        <ProjectGridView rows={filteredRows} onCardClick={handleGridCardClick} />
      )}
    </main>
  );
}
