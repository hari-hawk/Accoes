"use client";

import {
  FileText,
  FileSpreadsheet,
  File,
  type LucideIcon,
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

const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: File,
};

function getFileIcon(fileType: string): LucideIcon {
  return FILE_TYPE_ICONS[fileType] ?? File;
}

const statusColors: Record<string, string> = {
  pre_approved: "bg-status-pre-approved",
  review_required: "bg-status-review-required",
  action_mandatory: "bg-status-action-mandatory",
};

const statusLabels: Record<string, string> = {
  pre_approved: "Pre-Approved",
  review_required: "Review",
  action_mandatory: "Action",
};

function MaterialListItem({
  item,
  isSelected,
  isChecked,
  decision,
  onSelect,
  onToggleCheck,
  icon: Icon,
}: {
  item: MaterialItem;
  isSelected: boolean;
  isChecked: boolean;
  decision?: DecisionStatus;
  onSelect: () => void;
  onToggleCheck: () => void;
  icon: LucideIcon;
}) {
  const effectiveDecision = decision ?? item.validation?.decision;
  const score = item.validation?.confidenceScore;
  const status = item.validation?.status;

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
        {/* Filename + spec section */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm font-medium leading-tight truncate">
              {item.document.fileName.replace(/\.[^/.]+$/, "")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">
            <span className="font-mono font-semibold text-primary/80">
              {item.document.specSection}
            </span>
            {" — "}
            {item.document.specSectionTitle}
          </p>
        </div>

        {/* Score + Status row */}
        {item.validation && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Confidence score */}
            {score !== undefined && (
              <span className={cn(
                "text-xs font-bold tabular-nums",
                score >= 90 ? "text-status-pre-approved" :
                score >= 70 ? "text-status-review-required" :
                "text-status-action-mandatory"
              )}>
                {score}%
              </span>
            )}

            {/* Mini confidence bar */}
            {score !== undefined && (
              <div className="h-1 rounded-full bg-muted overflow-hidden w-16 shrink-0">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    score >= 90 ? "bg-status-pre-approved" :
                    score >= 70 ? "bg-status-review-required" :
                    "bg-status-action-mandatory"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            )}

            {/* Status dot + label */}
            {status && (
              <span className={cn(
                "inline-flex items-center gap-1 text-[11px] font-medium",
                status === "pre_approved" ? "text-status-pre-approved" :
                status === "review_required" ? "text-status-review-required" :
                "text-status-action-mandatory"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  statusColors[status]
                )} />
                {statusLabels[status]}
              </span>
            )}

            {/* PA/PI indicator dots */}
            {(item.paValidation || item.piValidation) && (
              <span className="inline-flex items-center gap-1.5 ml-1">
                {item.paValidation && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      item.paValidation.status === "pre_approved" ? "bg-status-pre-approved" :
                      item.paValidation.status === "review_required" ? "bg-status-review-required" :
                      "bg-status-action-mandatory"
                    )} />
                    PA
                  </span>
                )}
                {item.piValidation && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      item.piValidation.status === "pre_approved" ? "bg-status-pre-approved" :
                      item.piValidation.status === "review_required" ? "bg-status-review-required" :
                      "bg-status-action-mandatory"
                    )} />
                    PI
                  </span>
                )}
              </span>
            )}

            {/* Decision badge */}
            {effectiveDecision && effectiveDecision !== "pending" && (
              <span className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize shrink-0">
                {effectiveDecision.replace(/_/g, " ")}
              </span>
            )}
          </div>
        )}
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
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Filter header */}
      <div className="border-b p-3 space-y-2 shrink-0">
        <SearchInput
          placeholder="Search documents..."
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
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pre_approved">Pre-Approved</SelectItem>
              <SelectItem value="review_required">Review Required</SelectItem>
              <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            {materials.length} items
          </span>
        </div>
      </div>

      {/* Material items — scrollable, no horizontal overflow */}
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
              icon={getFileIcon(item.document.fileType)}
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
