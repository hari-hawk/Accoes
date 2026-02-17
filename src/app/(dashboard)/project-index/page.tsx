"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Upload,
  Download,
  FileSpreadsheet,
  Layers,
  Filter,
  X,
  Loader2,
  AlertTriangle,
  Check,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/shared/empty-state";
import { useHydroMatrix } from "@/hooks/use-hydro-matrix";
import { HYDRO_CATEGORY_ORDER } from "@/data/mock-project-index";
import type {
  HydroIndexCategory,
  HydroSystemCategory,
  HydroMaterialCategory,
  HydroMatrixEntry,
} from "@/data/mock-project-index";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Badge color configs                                                        */
/* -------------------------------------------------------------------------- */

const INDEX_CATEGORY_COLORS: Record<HydroIndexCategory, string> = {
  "Pipe": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Fittings": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Valves": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "Insulation": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "Hangers/Supports": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Specialties": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  "Joining/Branch Methods": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  "Identification": "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
  "Pressure Testing": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  "Anchors": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const SYSTEM_CATEGORY_COLORS: Record<HydroSystemCategory, string> = {
  "Chilled Water": "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  "Condenser Water": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Generic": "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
};

const MATERIAL_CATEGORY_COLORS: Record<HydroMaterialCategory, string> = {
  "Carbon Steel": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400",
  "Copper": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "n/a": "",
};

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

function HeroSection({
  totalCount,
  categoryCount,
  systemCount,
  onImport,
  onExport,
  exporting,
}: {
  totalCount: number;
  categoryCount: number;
  systemCount: number;
  onImport: () => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden animate-fade-up">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="relative flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Hydro Matrix Index Grid</h1>
          <p className="text-white/70 mt-0.5 text-sm">
            Material specification library for mechanical systems reference data
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
            onClick={onImport}
          >
            <Upload className="mr-1.5 h-4 w-4" />
            Import Template
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={onExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1.5 h-4 w-4" />
            )}
            Export Template
          </Button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="relative flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
        {[
          { label: "Total Entries", value: totalCount, icon: Layers },
          { label: "Categories", value: categoryCount, icon: Filter },
          { label: "Systems", value: systemCount, icon: ExternalLink },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-nav-gold" />
              <div>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters Bar                                                                */
/* -------------------------------------------------------------------------- */

function FiltersBar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  systemFilter,
  onSystemChange,
  materialFilter,
  onMaterialChange,
  hasActiveFilters,
  onClearFilters,
  filteredCount,
  totalCount,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: HydroIndexCategory | "all";
  onCategoryChange: (v: HydroIndexCategory | "all") => void;
  systemFilter: HydroSystemCategory | "all";
  onSystemChange: (v: HydroSystemCategory | "all") => void;
  materialFilter: HydroMaterialCategory | "all";
  onMaterialChange: (v: HydroMaterialCategory | "all") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search descriptions, IDs, subcategories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Index Category */}
      <Select
        value={categoryFilter}
        onValueChange={(v) => onCategoryChange(v as HydroIndexCategory | "all")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {HYDRO_CATEGORY_ORDER.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* System Category */}
      <Select
        value={systemFilter}
        onValueChange={(v) => onSystemChange(v as HydroSystemCategory | "all")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Systems" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Systems</SelectItem>
          <SelectItem value="Chilled Water">Chilled Water</SelectItem>
          <SelectItem value="Condenser Water">Condenser Water</SelectItem>
          <SelectItem value="Generic">Generic</SelectItem>
        </SelectContent>
      </Select>

      {/* Material Category */}
      <Select
        value={materialFilter}
        onValueChange={(v) => onMaterialChange(v as HydroMaterialCategory | "all")}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Materials" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Materials</SelectItem>
          <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
          <SelectItem value="Copper">Copper</SelectItem>
          <SelectItem value="n/a">N/A</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear + Count */}
      <div className="flex items-center gap-2 ml-auto">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 gap-1"
            onClick={onClearFilters}
          >
            <X className="h-3 w-3" />
            Clear Filters
          </Button>
        )}
        <Badge variant="secondary" className="text-xs shrink-0">
          {filteredCount === totalCount
            ? `${totalCount} entries`
            : `${filteredCount} of ${totalCount}`}
        </Badge>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grouped Data Table                                                         */
/* -------------------------------------------------------------------------- */

function HydroMatrixTable({
  groupedEntries,
  onRowClick,
  selectedId,
}: {
  groupedEntries: Map<HydroIndexCategory, HydroMatrixEntry[]>;
  onRowClick: (entry: HydroMatrixEntry) => void;
  selectedId: string | null;
}) {
  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[150px]">
                Index ID
              </th>
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[140px]">
                System
              </th>
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px] hidden md:table-cell">
                Material
              </th>
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px] hidden lg:table-cell">
                Sizes
              </th>
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[180px] hidden xl:table-cell">
                Subcategory
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(groupedEntries.entries()).map(([category, entries]) => (
              <CategoryGroup
                key={category}
                category={category}
                entries={entries}
                onRowClick={onRowClick}
                selectedId={selectedId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryGroup({
  category,
  entries,
  onRowClick,
  selectedId,
}: {
  category: HydroIndexCategory;
  entries: HydroMatrixEntry[];
  onRowClick: (entry: HydroMatrixEntry) => void;
  selectedId: string | null;
}) {
  return (
    <>
      {/* Section header row */}
      <tr className="bg-muted/40 border-y border-muted">
        <td colSpan={6} className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("text-[10px]", INDEX_CATEGORY_COLORS[category])}>
              {category}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </td>
      </tr>

      {/* Data rows */}
      {entries.map((entry) => (
        <tr
          key={entry.id}
          className={cn(
            "border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer group",
            selectedId === entry.id && "bg-nav-accent/5"
          )}
          onClick={() => onRowClick(entry)}
        >
          <td className="p-3">
            <span className="font-mono text-[11px] text-muted-foreground group-hover:text-nav-accent transition-colors">
              {entry.indexIdFull}
            </span>
          </td>
          <td className="p-3">
            <Badge variant="secondary" className={cn("text-[10px]", SYSTEM_CATEGORY_COLORS[entry.systemCategory])}>
              {entry.systemCategory}
            </Badge>
          </td>
          <td className="p-3 hidden md:table-cell">
            {entry.materialCategory !== "n/a" ? (
              <Badge variant="secondary" className={cn("text-[10px]", MATERIAL_CATEGORY_COLORS[entry.materialCategory])}>
                {entry.materialCategory}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground/50">—</span>
            )}
          </td>
          <td className="p-3">
            <p className="text-sm font-medium truncate max-w-[350px]" title={entry.description}>
              {entry.description}
            </p>
            {entry.fittingMfr !== "n/a" && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Mfr: {entry.fittingMfr}
              </p>
            )}
          </td>
          <td className="p-3 hidden lg:table-cell">
            <span className="text-xs text-muted-foreground">
              {entry.sizes.includes("|")
                ? entry.sizes.split("|").slice(0, 4).join(", ") +
                  (entry.sizes.split("|").length > 4 ? "..." : "")
                : entry.sizes}
            </span>
          </td>
          <td className="p-3 hidden xl:table-cell">
            <span className="text-xs text-muted-foreground truncate block max-w-[160px]" title={entry.indexSubcategory}>
              {entry.indexSubcategory}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Entry Detail Sheet                                                         */
/* -------------------------------------------------------------------------- */

function HydroEntryDetailSheet({
  entry,
  open,
  onOpenChange,
}: {
  entry: HydroMatrixEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!entry) return null;

  const details = [
    { label: "Index ID", value: entry.indexIdFull, mono: true },
    { label: "Trade", value: entry.trade },
    { label: "Index Category", value: entry.indexCategory },
    { label: "System Category", value: entry.systemCategory },
    { label: "Material Category", value: entry.materialCategory },
    { label: "Fitting Manufacturer", value: entry.fittingMfr },
    { label: "Sizes", value: entry.sizes.includes("|") ? entry.sizes.split("|").join(", ") : entry.sizes },
    { label: "Subcategory", value: entry.indexSubcategory },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg w-full flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={cn("text-[10px]", INDEX_CATEGORY_COLORS[entry.indexCategory])}>
              {entry.indexCategory}
            </Badge>
            <Badge variant="secondary" className={cn("text-[10px]", SYSTEM_CATEGORY_COLORS[entry.systemCategory])}>
              {entry.systemCategory}
            </Badge>
          </div>
          <SheetTitle className="text-base leading-snug">
            {entry.description}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {entry.indexIdFull}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Full description */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Index Description
              </p>
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="text-sm leading-relaxed text-foreground/90">
                  {entry.indexDescription}
                </p>
              </div>
            </div>

            {/* Key-value details */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Specification Details
              </p>
              <div className="space-y-3">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-muted-foreground shrink-0">{d.label}</span>
                    <span
                      className={cn(
                        "text-sm font-medium text-right",
                        d.mono && "font-mono text-xs"
                      )}
                    >
                      {d.value === "n/a" ? (
                        <span className="text-muted-foreground/50">N/A</span>
                      ) : (
                        d.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*  Import Template Dialog                                                     */
/* -------------------------------------------------------------------------- */

function HydroImportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<"drop" | "preview" | "processing" | "done">("drop");
  const [fileName, setFileName] = useState("");

  const handleFileDrop = () => {
    // Mock: simulate file selection
    setFileName("Hydro Matrix Index Grid.xlsx");
    setStep("preview");
  };

  const handleConfirm = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("done");
    }, 1500);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset on close
      setStep("drop");
      setFileName("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Template
          </DialogTitle>
          <DialogDescription>
            Upload an XLSX template to update the Hydro Matrix Index Grid library.
          </DialogDescription>
        </DialogHeader>

        {step === "drop" && (
          <div className="space-y-4 pt-2">
            <div
              className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-10 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
              onClick={handleFileDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleFileDrop();
              }}
            >
              <div className="mx-auto w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-3">
                <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Drop your XLSX template here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Accepts: .xlsx only &middot; Max size: 10 MB
              </p>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4 pt-2">
            {/* File info */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">1.2 MB &middot; Ready to import</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => {
                  setStep("drop");
                  setFileName("");
                }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Mock preview table */}
            <div className="rounded-lg border overflow-hidden">
              <div className="px-3 py-2 bg-muted/30 border-b">
                <p className="text-xs font-medium text-muted-foreground">Preview (first 5 rows)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-1.5 text-left text-muted-foreground font-medium">Index ID</th>
                      <th className="px-3 py-1.5 text-left text-muted-foreground font-medium">Category</th>
                      <th className="px-3 py-1.5 text-left text-muted-foreground font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "01_01_01_00_005_XX", cat: "Pressure Testing", desc: "Hydrostatic @ 150 psi" },
                      { id: "01_02_01_00_071_XX", cat: "Pipe", desc: "CS Sch 40 ERW - ASTM A-53" },
                      { id: "01_03_01_00_035_00", cat: "Fittings", desc: "Black Malleable Iron 150#" },
                      { id: "01_05_01_00_050_XX", cat: "Valves", desc: "Nibco BFV LD-1000 (Lugged)" },
                      { id: "01_07_XX_00_001_XX", cat: "Insulation", desc: "1\" Insulation Thickness" },
                    ].map((row) => (
                      <tr key={row.id} className="border-b last:border-b-0">
                        <td className="px-3 py-1.5 font-mono text-[10px] text-muted-foreground">{row.id}</td>
                        <td className="px-3 py-1.5">{row.cat}</td>
                        <td className="px-3 py-1.5 truncate max-w-[180px]">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
              <span className="font-medium">311 rows detected</span>
              <span>&middot;</span>
              <span>10 categories</span>
              <span>&middot;</span>
              <span>3 system types</span>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This will replace the current library data. The existing entries will be overwritten.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setStep("drop"); setFileName(""); }}>
                Back
              </Button>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                className="gradient-gold text-white border-0"
                onClick={handleConfirm}
              >
                Confirm Import
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium">Importing template...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Parsing 311 rows across 10 categories
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="rounded-full bg-status-pre-approved/10 p-3">
              <Check className="h-6 w-6 text-status-pre-approved" />
            </div>
            <p className="text-sm font-medium">Import complete!</p>
            <p className="text-xs text-muted-foreground">
              311 entries imported across 10 categories
            </p>
            <Button variant="outline" size="sm" onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function ProjectIndexPage() {
  const {
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
    totalCount,
    filteredCount,
    filteredCategoryCount,
    filteredSystemCount,
  } = useHydroMatrix();

  // Import dialog
  const [importOpen, setImportOpen] = useState(false);

  // Export state
  const [exporting, setExporting] = useState(false);

  // Detail sheet
  const sheetOpen = selectedId !== null;

  const handleRowClick = useCallback(
    (entry: HydroMatrixEntry) => {
      setSelectedId(entry.id);
    },
    [setSelectedId]
  );

  const handleSheetClose = useCallback(
    (open: boolean) => {
      if (!open) setSelectedId(null);
    },
    [setSelectedId]
  );

  const handleExport = useCallback(() => {
    setExporting(true);
    setTimeout(() => {
      const entries = filteredEntries;
      const headers = [
        "Index ID Full",
        "Trade",
        "Index Category",
        "System Category",
        "Material Category",
        "Description",
        "Fitting Mfr",
        "Sizes",
        "Index Description",
        "Index Subcategory",
      ];
      const rows = entries.map((e) =>
        [
          e.indexIdFull,
          e.trade,
          e.indexCategory,
          e.systemCategory,
          e.materialCategory,
          e.description,
          e.fittingMfr,
          e.sizes,
          e.indexDescription,
          e.indexSubcategory,
        ]
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",")
      );
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hydro-matrix-index.csv";
      a.click();
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 800);
  }, [filteredEntries]);

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <HeroSection
        totalCount={totalCount}
        categoryCount={filteredCategoryCount}
        systemCount={filteredSystemCount}
        onImport={() => setImportOpen(true)}
        onExport={handleExport}
        exporting={exporting}
      />

      {/* Filters */}
      <FiltersBar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        systemFilter={systemFilter}
        onSystemChange={setSystemFilter}
        materialFilter={materialFilter}
        onMaterialChange={setMaterialFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        filteredCount={filteredCount}
        totalCount={totalCount}
      />

      {/* Table or Empty state */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No entries match your filters"
          description="Try adjusting your search or filter criteria to find the material specifications you need."
        >
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-1.5 h-4 w-4" />
            Clear Filters
          </Button>
        </EmptyState>
      ) : (
        <HydroMatrixTable
          groupedEntries={groupedEntries}
          onRowClick={handleRowClick}
          selectedId={selectedId}
        />
      )}

      {/* Detail Sheet */}
      <HydroEntryDetailSheet
        entry={selectedEntry}
        open={sheetOpen}
        onOpenChange={handleSheetClose}
      />

      {/* Import Dialog */}
      <HydroImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
}
