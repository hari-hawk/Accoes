"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  FileDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISCREPANCY_STATUS_CONFIG } from "@/lib/constants";
import type { MaterialItem, DiscrepancyStatus } from "@/data/types";

interface DiscrepancyTableProps {
  items: MaterialItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onItemClick: (item: MaterialItem) => void;
  onBulkStatusChange: (status: DiscrepancyStatus) => void;
}

const statusIcons: Record<DiscrepancyStatus, typeof CheckCircle2> = {
  pre_approved: CheckCircle2,
  review_required: AlertTriangle,
  action_mandatory: XCircle,
};

export function DiscrepancyTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onItemClick,
  onBulkStatusChange,
}: DiscrepancyTableProps) {
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <div className="space-y-3">
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-border" />
          <Select onValueChange={(v) => onBulkStatusChange(v as DiscrepancyStatus)}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Change Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pre_approved">Pre-Approved</SelectItem>
              <SelectItem value="review_required">Review Required</SelectItem>
              <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <FileDown className="h-3.5 w-3.5 mr-1.5" />
            Export Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-3 w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onToggleAll}
                    aria-label="Select all items"
                  />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Item
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Material Matrix
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Project Spec
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                  Project Index
                </th>
                <th className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28">
                  Score
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-40">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => {
                const config = DISCREPANCY_STATUS_CONFIG[item.status];
                const StatusIcon = statusIcons[item.status];
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => onItemClick(item)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(item.id)}
                        aria-label={`Select ${item.itemName}`}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm font-medium group-hover:text-nav-accent transition-colors">
                          {item.itemName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {item.specSection}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {item.materialMatrixValue}
                      </p>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {item.projectSpecValue}
                      </p>
                    </td>
                    <td className="p-3 hidden xl:table-cell">
                      <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {item.projectIndexValue}
                      </p>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-sm font-bold ${
                          item.confidenceScore >= 90
                            ? "text-status-pre-approved"
                            : item.confidenceScore >= 60
                              ? "text-status-review-required"
                              : "text-status-action-mandatory"
                        }`}
                      >
                        {item.confidenceScore}%
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] shrink-0 ${config.color} ${config.bgColor}`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                        {item.comments.length > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            {item.comments.length}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
