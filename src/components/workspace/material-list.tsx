"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/shared/search-input";
import { cn } from "@/lib/utils";
import type { MaterialItem } from "@/hooks/use-materials";
import type { ValidationStatus, DecisionStatus } from "@/data/types";

const statusColors: Record<string, string> = {
  pre_approved: "bg-status-pre-approved",
  review_required: "bg-status-review-required",
  action_mandatory: "bg-status-action-mandatory",
};

/** Score chip — displays "PS: 98%" or "PI: 74%" with color coding */
function ScoreChip({
  label,
  score,
}: {
  label: string;
  score: number | undefined;
}) {
  if (score === undefined) return null;
  const color =
    score >= 80
      ? "bg-status-pre-approved-bg text-status-pre-approved"
      : score >= 60
        ? "bg-status-review-required-bg text-status-review-required"
        : "bg-status-action-mandatory-bg text-status-action-mandatory";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
        color
      )}
    >
      {label}: {score}%
    </span>
  );
}

function MaterialListItem({
  item,
  isSelected,
  isChecked,
  decision,
  onSelect,
  onToggleCheck,
}: {
  item: MaterialItem;
  isSelected: boolean;
  isChecked: boolean;
  decision?: DecisionStatus;
  onSelect: () => void;
  onToggleCheck: () => void;
}) {
  const effectiveDecision = decision ?? item.validation?.decision;
  const status = item.validation?.status;
  const psScore = item.paValidation?.confidenceScore;
  const piScore = item.piValidation?.confidenceScore;

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b",
        isSelected
          ? "bg-primary/8 dark:bg-primary/12"
          : "hover:bg-muted/50"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select ${item.document.fileName}`}
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
        {/* Material name */}
        <div className="flex items-center gap-1.5">
          {status && (
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0",
                statusColors[status]
              )}
            />
          )}
          <p className="text-sm font-medium leading-tight truncate">
            {item.document.fileName.replace(/\.[^/.]+$/, "")}
          </p>
        </div>

        {/* Sub-text: spec section */}
        <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">
          <span className="font-mono font-semibold text-primary/80">
            {item.document.specSection}
          </span>
          {" — "}
          {item.document.specSectionTitle}
        </p>

        {/* PS + PI score chips */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <ScoreChip label="PS" score={psScore} />
          <ScoreChip label="PI" score={piScore} />

          {effectiveDecision && effectiveDecision !== "pending" && (
            <span className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize shrink-0">
              {effectiveDecision.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MaterialList({
  materials,
  selectedId,
  checkedIds,
  decisions,
  search,
  statusFilter,
  onSelect,
  onToggleCheck,
  onSearchChange,
  onStatusFilterChange,
}: {
  materials: MaterialItem[];
  selectedId: string | null;
  checkedIds: Set<string>;
  decisions: Record<string, DecisionStatus>;
  search: string;
  statusFilter: ValidationStatus | "all";
  onSelect: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ValidationStatus | "all") => void;
}) {
  const preApprovedCount = materials.filter(
    (m) => m.validation?.status === "pre_approved"
  ).length;
  const reviewCount = materials.filter(
    (m) => m.validation?.status === "review_required"
  ).length;
  const actionCount = materials.filter(
    (m) => m.validation?.status === "action_mandatory"
  ).length;

  const allChecked =
    materials.length > 0 &&
    materials.every((m) => checkedIds.has(m.document.id));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Filter header */}
      <div className="border-b p-3 space-y-2 shrink-0">
        <SearchInput
          placeholder="Search from Material Matrix"
          value={search}
          onChange={onSearchChange}
        />
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              onStatusFilterChange(v as ValidationStatus | "all")
            }
          >
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue placeholder="Project Specifications (PS)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pre_approved">Pre-Approved</SelectItem>
              <SelectItem value="review_required">Review Required</SelectItem>
              <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="flex-1 h-8 text-xs">
              <SelectValue placeholder="Project Index (PI)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All PI</SelectItem>
              <SelectItem value="pre_approved">Pre-Approved</SelectItem>
              <SelectItem value="review_required">Review Required</SelectItem>
              <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <div className="flex items-center gap-2 ml-auto">
            <span className="flex items-center gap-1 text-status-pre-approved">
              <CheckCircle2 className="h-3 w-3" />
              {preApprovedCount}
            </span>
            <span className="flex items-center gap-1 text-status-review-required">
              <AlertTriangle className="h-3 w-3" />
              {reviewCount}
            </span>
            <span className="flex items-center gap-1 text-status-action-mandatory">
              <XCircle className="h-3 w-3" />
              {actionCount}
            </span>
          </div>
        </div>
      </div>

      {/* Material items — scrollable */}
      <ScrollArea className="flex-1">
        <div className="w-full overflow-hidden">
          {materials.map((item) => (
            <MaterialListItem
              key={item.document.id}
              item={item}
              isSelected={selectedId === item.document.id}
              isChecked={checkedIds.has(item.document.id)}
              decision={decisions[item.document.id]}
              onSelect={() => onSelect(item.document.id)}
              onToggleCheck={() => onToggleCheck(item.document.id)}
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
  );
}
