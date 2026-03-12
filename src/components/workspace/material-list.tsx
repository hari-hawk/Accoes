"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  X,
  RotateCcw,
  ArrowUpDown,
  Replace,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { SearchInput } from "@/components/shared/search-input";
import { cn } from "@/lib/utils";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import type { MaterialItem } from "@/hooks/use-materials";
import type { ValidationStatus, DecisionStatus } from "@/data/types";

const statusColors: Record<string, string> = {
  pre_approved: "bg-status-pre-approved",
  review_required: "bg-status-review-required",
  action_mandatory: "bg-status-action-mandatory",
};

/** Score chip — displays "PS: Pre-Approved" or "PI: Review Required" with color coding */
function ScoreChip({
  label,
  score,
}: {
  label: string;
  score: number | undefined;
}) {
  if (score === undefined) return null;
  const statusText =
    score >= 80
      ? "Pre-Approved"
      : score >= 40
        ? "Review Required"
        : "Action Required";
  const color =
    score >= 80
      ? "bg-status-pre-approved-bg text-status-pre-approved"
      : score >= 40
        ? "bg-status-review-required-bg text-status-review-required"
        : "bg-status-action-mandatory-bg text-status-action-mandatory";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
        color
      )}
    >
      {label}: {statusText}
    </span>
  );
}

function MaterialListItem({
  item,
  isSelected,
  isChecked,
  decision,
  isAlternative,
  onSelect,
  onToggleCheck,
  onToggleAlternative,
}: {
  item: MaterialItem;
  isSelected: boolean;
  isChecked: boolean;
  decision?: DecisionStatus;
  isAlternative?: boolean;
  onSelect: () => void;
  onToggleCheck: () => void;
  onToggleAlternative?: () => void;
}) {
  const effectiveDecision = decision ?? item.validation?.decision;
  const status = item.validation?.status;
  const psScore = item.paValidation?.confidenceScore;
  const piScore = item.piValidation?.confidenceScore;
  const overallScore = item.validation?.confidenceScore;
  const hasSubScores = psScore !== undefined || piScore !== undefined;

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-inset outline-none",
        isSelected
          ? "bg-background shadow-[inset_3px_0_0_var(--color-primary)] border-b-primary/10"
          : "hover:bg-background/80"
      )}
      onClick={onSelect}
      role="listitem"
      tabIndex={0}
      aria-label={`${item.document.fileName.replace(/\.[^/.]+$/, "")} — ${item.document.specSectionTitle}`}
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={onToggleCheck}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Check ${item.document.fileName}`}
        className="mt-1 shrink-0"
      />

      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Material name + Alternate radio toggle */}
        <div className="flex items-center gap-1.5">
          {status && (
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                statusColors[status]
              )}
            />
          )}
          <p className="text-sm font-medium leading-tight truncate flex-1 min-w-0">
            {item.document.fileName.replace(/\.[^/.]+$/, "")}
          </p>
          {onToggleAlternative && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleAlternative(); }}
              className={cn(
                "flex items-center gap-1 shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5 transition-all cursor-pointer border",
                isAlternative
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                  : "bg-transparent border-transparent text-muted-foreground hover:text-yellow-700 hover:bg-yellow-50/50"
              )}
              aria-label={`Mark ${item.document.fileName} as alternate`}
              aria-pressed={!!isAlternative}
            >
              <span className={cn(
                "h-3 w-3 rounded-full border-2 flex items-center justify-center shrink-0",
                isAlternative ? "border-yellow-500" : "border-muted-foreground/40"
              )}>
                {isAlternative && <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />}
              </span>
              Alt
            </button>
          )}
        </div>

        {/* Sub-text: spec section */}
        <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">
          <span className="font-mono font-semibold text-primary/80">
            {item.document.specSection}
          </span>
          {" — "}
          {item.document.specSectionTitle}
        </p>

        {/* Score chips + status/decision badges */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {/* Score chips — left side */}
          {hasSubScores ? (
            <>
              <ScoreChip label="PS" score={psScore} />
              <ScoreChip label="PI" score={piScore} />
            </>
          ) : (
            <ScoreChip label="Score" score={overallScore} />
          )}

          {/* Single status badge — pushed to far right */}
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            {effectiveDecision && effectiveDecision !== "pending" ? (
              /* Show decision badge when user has made a decision */
              <span
                className={cn(
                  "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold leading-none capitalize",
                  effectiveDecision === "approved"
                    ? "bg-status-pre-approved-bg text-status-pre-approved"
                    : effectiveDecision === "revisit"
                      ? "bg-status-review-required-bg text-status-review-required"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {effectiveDecision.replace(/_/g, " ")}
              </span>
            ) : (
              /* Show AI validation status when no decision has been made */
              status && (
                <span
                  className={cn(
                    "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold leading-none",
                    VALIDATION_STATUS_CONFIG[status].bgColor,
                    VALIDATION_STATUS_CONFIG[status].color
                  )}
                >
                  {VALIDATION_STATUS_CONFIG[status].label}
                </span>
              )
            )}
          </div>
        </div>

        {/* Category pills */}
        {(item.document.indexCategory || item.document.systemCategory) && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {item.document.indexCategory && (
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                {item.document.indexCategory}
              </span>
            )}
            {item.document.systemCategory && (
              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200">
                {item.document.systemCategory}
              </span>
            )}
          </div>
        )}

        {/* Alternate toggle moved to title row as compact radio */}
      </div>
    </div>
  );
}

/** Status filter options — validation statuses + decision statuses */
const STATUS_OPTIONS: {
  key: string;
  label: string;
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  dotColor: string;
  kind: "validation" | "decision";
}[] = [
  { key: "pre_approved", label: "Pre-Approved (80-100%)", icon: CheckCircle2, color: "text-status-pre-approved", bgColor: "bg-status-pre-approved-bg", dotColor: "bg-status-pre-approved", kind: "validation" },
  { key: "review_required", label: "Review Required (70-79%)", icon: AlertTriangle, color: "text-status-review-required", bgColor: "bg-status-review-required-bg", dotColor: "bg-status-review-required", kind: "validation" },
  { key: "action_mandatory", label: "Action Required (0-69%)", icon: XCircle, color: "text-status-action-mandatory", bgColor: "bg-status-action-mandatory-bg", dotColor: "bg-status-action-mandatory", kind: "validation" },
  { key: "approved", label: "Approved (100%)", icon: CheckCircle2, color: "text-status-pre-approved", bgColor: "bg-status-pre-approved-bg", dotColor: "bg-status-pre-approved", kind: "decision" },
  { key: "revisit", label: "Revisit", icon: RotateCcw, color: "text-status-review-required", bgColor: "bg-status-review-required-bg", dotColor: "bg-status-review-required", kind: "decision" },
  { key: "no_acco_id", label: "No ACCO ID", icon: XCircle, color: "text-orange-700", bgColor: "bg-orange-100", dotColor: "bg-orange-500", kind: "decision" },
  { key: "sent_to_acco_review", label: "Sent to ACCO Review Team", icon: CheckCircle2, color: "text-cyan-700", bgColor: "bg-cyan-100", dotColor: "bg-cyan-500", kind: "decision" },
  { key: "defer_to_future", label: "Defer to future Submittal", icon: RotateCcw, color: "text-slate-600", bgColor: "bg-slate-100", dotColor: "bg-slate-500", kind: "decision" },
  { key: "alternative", label: "Alternate", icon: Replace, color: "text-yellow-700", bgColor: "bg-yellow-100", dotColor: "bg-yellow-500", kind: "decision" },
];

export function MaterialList({
  materials,
  selectedId,
  checkedIds,
  decisions,
  search,
  statusFilter,
  indexCategoryFilter,
  systemCategoryFilter,
  indexCategories,
  systemCategories,
  sortBy,
  alternativeIds,
  onSelect,
  onToggleCheck,
  onSearchChange,
  onToggleStatusFilter,
  onClearStatusFilter,
  onIndexCategoryToggle,
  onIndexCategoryClear,
  onSystemCategoryToggle,
  onSystemCategoryClear,
  onSortChange,
  onToggleAlternative,
}: {
  materials: MaterialItem[];
  selectedId: string | null;
  checkedIds: Set<string>;
  decisions: Record<string, DecisionStatus>;
  search: string;
  statusFilter: Set<string>;
  indexCategoryFilter: Set<string>;
  systemCategoryFilter: Set<string>;
  indexCategories: string[];
  systemCategories: string[];
  sortBy: "name-asc" | "name-desc" | "index-category";
  alternativeIds?: Set<string>;
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onSearchChange: (value: string) => void;
  onToggleStatusFilter: (status: string) => void;
  onClearStatusFilter: () => void;
  onIndexCategoryToggle: (cat: string) => void;
  onIndexCategoryClear: () => void;
  onSystemCategoryToggle: (sys: string) => void;
  onSystemCategoryClear: () => void;
  onSortChange: (sort: "name-asc" | "name-desc" | "index-category") => void;
  onToggleAlternative?: (id: string) => void;
}) {
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [indexCatPopoverOpen, setIndexCatPopoverOpen] = useState(false);
  const [systemCatPopoverOpen, setSystemCatPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);

  // Count by validation status
  const preApprovedCount = materials.filter(
    (m) => m.validation?.status === "pre_approved"
  ).length;
  const reviewCount = materials.filter(
    (m) => m.validation?.status === "review_required"
  ).length;
  const actionCount = materials.filter(
    (m) => m.validation?.status === "action_mandatory"
  ).length;
  // Count by decision status
  const approvedCount = materials.filter(
    (m) => decisions[m.document.id] === "approved"
  ).length;
  const revisitCount = materials.filter(
    (m) => decisions[m.document.id] === "revisit"
  ).length;

  const alternativeCount = alternativeIds
    ? materials.filter((m) => alternativeIds.has(m.document.id)).length
    : 0;

  // Count new decision statuses
  const noAccoIdCount = materials.filter(
    (m) => decisions[m.document.id] === "no_acco_id"
  ).length;
  const sentToAccoReviewCount = materials.filter(
    (m) => decisions[m.document.id] === "sent_to_acco_review"
  ).length;
  const deferToFutureCount = materials.filter(
    (m) => decisions[m.document.id] === "defer_to_future"
  ).length;

  const statusCountMap: Record<string, number> = {
    pre_approved: preApprovedCount,
    review_required: reviewCount,
    action_mandatory: actionCount,
    approved: approvedCount,
    revisit: revisitCount,
    no_acco_id: noAccoIdCount,
    sent_to_acco_review: sentToAccoReviewCount,
    defer_to_future: deferToFutureCount,
    alternative: alternativeCount,
  };

  const allChecked =
    materials.length > 0 &&
    materials.every((m) => checkedIds.has(m.document.id));

  const activeStatusCount = statusFilter.size;
  const activeIndexCatCount = indexCategoryFilter.size;
  const activeSystemCatCount = systemCategoryFilter.size;
  const totalActiveFilters = activeStatusCount + activeIndexCatCount + activeSystemCatCount;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background" role="region" aria-label="Material list panel">
      {/* Filter header */}
      <div className="border-b p-3 space-y-2 shrink-0 bg-background" role="search" aria-label="Filter materials">
        {/* Row 1: Search + Sort */}
        <div className="flex items-center gap-2">
          <SearchInput
            placeholder="Search materials..."
            value={search}
            onChange={onSearchChange}
            className="[&_input]:h-8 flex-1"
          />
          <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0",
                  sortBy !== "name-asc" && "border-primary/40 bg-primary/5"
                )}
                aria-label="Sort materials"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground px-2 py-1">Sort by</span>
                <div className="h-px bg-border" />
                {([
                  { key: "name-asc" as const, label: "Name A → Z" },
                  { key: "name-desc" as const, label: "Name Z → A" },
                  { key: "index-category" as const, label: "Index Category" },
                ]).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={cn(
                      "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left",
                      sortBy === opt.key ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                    )}
                    onClick={() => { onSortChange(opt.key); setSortPopoverOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Row 2: Document dropdown + Status filter — two columns */}
        <div className="grid grid-cols-2 gap-2 [&>*]:min-w-0">
          <Select defaultValue="all">
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue placeholder="All Documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="mig-7">UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v3.csv</SelectItem>
              <SelectItem value="mig-8">UCD_HobbsVet_Heating_Matrix_Index_Grid_v3.csv</SelectItem>
              <SelectItem value="mig-9">UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v3.csv</SelectItem>
            </SelectContent>
          </Select>

          {/* Status multi-select popover */}
          <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 w-full text-xs justify-between font-normal px-3",
                  activeStatusCount > 0 && "border-primary/40 bg-primary/5"
                )}
                aria-label={`Filter by status${activeStatusCount > 0 ? ` — ${activeStatusCount} selected` : ""}`}
              >
                <span className="truncate">
                  {activeStatusCount === 0
                    ? "All Status"
                    : activeStatusCount === 1
                      ? STATUS_OPTIONS.find((s) => statusFilter.has(s.key))?.label ?? "1 Status"
                      : `${activeStatusCount} Status`}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground">Filter by Status</span>
                  {activeStatusCount > 0 && (
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline font-medium"
                      onClick={() => onClearStatusFilter()}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="h-px bg-border" />
                {STATUS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = statusFilter.has(opt.key);
                  const count = statusCountMap[opt.key];
                  return (
                    <label
                      key={opt.key}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                        isActive ? "bg-primary/5" : "hover:bg-muted/50"
                      )}
                    >
                      <Checkbox
                        checked={isActive}
                        onCheckedChange={() => onToggleStatusFilter(opt.key)}
                        className="h-3.5 w-3.5"
                      />
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", opt.color)} aria-hidden="true" />
                      <span className="text-xs font-medium flex-1">{opt.label}</span>
                      <span className="text-[11px] text-muted-foreground tabular-nums font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Row 3: Category multi-select popovers */}
        <div className="grid grid-cols-2 gap-2 [&>*]:min-w-0">
          {/* Index Category multi-select */}
          <Popover open={indexCatPopoverOpen} onOpenChange={setIndexCatPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 w-full text-xs justify-between font-normal px-3",
                  activeIndexCatCount > 0 && "border-primary/40 bg-primary/5"
                )}
              >
                <span className="truncate">
                  {activeIndexCatCount === 0
                    ? "All Categories"
                    : activeIndexCatCount === 1
                      ? [...indexCategoryFilter][0]
                      : `${activeIndexCatCount} Categories`}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground">Index Category</span>
                  {activeIndexCatCount > 0 && (
                    <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={onIndexCategoryClear}>
                      Clear all
                    </button>
                  )}
                </div>
                <div className="h-px bg-border" />
                {indexCategories.map((cat) => {
                  const isActive = indexCategoryFilter.has(cat);
                  return (
                    <label key={cat} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors", isActive ? "bg-primary/5" : "hover:bg-muted/50")}>
                      <Checkbox checked={isActive} onCheckedChange={() => onIndexCategoryToggle(cat)} className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium flex-1 truncate">{cat}</span>
                    </label>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* System Category multi-select */}
          <Popover open={systemCatPopoverOpen} onOpenChange={setSystemCatPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 w-full text-xs justify-between font-normal px-3",
                  activeSystemCatCount > 0 && "border-primary/40 bg-primary/5"
                )}
              >
                <span className="truncate">
                  {activeSystemCatCount === 0
                    ? "All Systems"
                    : activeSystemCatCount === 1
                      ? [...systemCategoryFilter][0]
                      : `${activeSystemCatCount} Systems`}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-xs font-semibold text-muted-foreground">System</span>
                  {activeSystemCatCount > 0 && (
                    <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={onSystemCategoryClear}>
                      Clear all
                    </button>
                  )}
                </div>
                <div className="h-px bg-border" />
                {systemCategories.map((sys) => {
                  const isActive = systemCategoryFilter.has(sys);
                  return (
                    <label key={sys} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors", isActive ? "bg-primary/5" : "hover:bg-muted/50")}>
                      <Checkbox checked={isActive} onCheckedChange={() => onSystemCategoryToggle(sys)} className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium flex-1 truncate">{sys}</span>
                    </label>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filter chips — show when any filter is active */}
        {totalActiveFilters > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status chips */}
            {STATUS_OPTIONS.filter((s) => statusFilter.has(s.key)).map((opt) => (
              <span
                key={opt.key}
                className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", opt.bgColor, opt.color)}
              >
                {opt.label}
                <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onToggleStatusFilter(opt.key)} aria-label={`Remove ${opt.label} filter`}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {/* Index category chips */}
            {[...indexCategoryFilter].map((cat) => (
              <span key={`idx-${cat}`} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700">
                {cat}
                <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onIndexCategoryToggle(cat)} aria-label={`Remove ${cat} filter`}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {/* System category chips */}
            {[...systemCategoryFilter].map((sys) => (
              <span key={`sys-${sys}`} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600">
                {sys}
                <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onSystemCategoryToggle(sys)} aria-label={`Remove ${sys} filter`}>
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
              onClick={() => { onClearStatusFilter(); onIndexCategoryClear(); onSystemCategoryClear(); }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Select all + status counts */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <Checkbox
              checked={allChecked}
              onCheckedChange={() => {
                materials.forEach((m) => {
                  const isChecked = checkedIds.has(m.document.id);
                  if (allChecked && isChecked) onToggleCheck(m.document.id);
                  if (!allChecked && !isChecked) onToggleCheck(m.document.id);
                });
              }}
              className="h-3.5 w-3.5"
            />
            <span className="text-muted-foreground">Select all</span>
          </label>
          <div className="flex items-center gap-2 ml-auto" role="group" aria-label="Status counts">
            <span className="flex items-center gap-1 text-status-pre-approved" aria-label={`${preApprovedCount} pre-approved`}>
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              {preApprovedCount}
            </span>
            <span className="flex items-center gap-1 text-status-review-required" aria-label={`${reviewCount} review required`}>
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              {reviewCount}
            </span>
            <span className="flex items-center gap-1 text-status-action-mandatory" aria-label={`${actionCount} action required`}>
              <XCircle className="h-3 w-3" aria-hidden="true" />
              {actionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Material items — scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="absolute inset-0">
          <div className="w-full" role="list" aria-label="Material items">
            {materials.map((item) => (
              <MaterialListItem
                key={item.document.id}
                item={item}
                isSelected={selectedId === item.document.id}
                isChecked={checkedIds.has(item.document.id)}
                decision={decisions[item.document.id]}
                isAlternative={alternativeIds?.has(item.document.id)}
                onSelect={() => onSelect(item.document.id)}
                onToggleCheck={() => onToggleCheck(item.document.id)}
                onToggleAlternative={onToggleAlternative ? () => onToggleAlternative(item.document.id) : undefined}
              />
            ))}
            {materials.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No materials match your filters.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
