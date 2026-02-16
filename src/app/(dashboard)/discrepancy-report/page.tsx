"use client";

import { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileDown,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiscrepancyTable } from "@/components/discrepancy-report/discrepancy-table";
import { ItemDetailPanel } from "@/components/discrepancy-report/item-detail-panel";
import { mockDRs } from "@/data/mock-drs";
import { mockMaterialItems } from "@/data/mock-material-items";
import { mockProjects } from "@/data/mock-projects";
import type { MaterialItem, DiscrepancyStatus } from "@/data/types";

export default function DiscrepancyReportPage() {
  const [selectedDRId, setSelectedDRId] = useState<string>("dr-1");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiscrepancyStatus | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailItem, setDetailItem] = useState<MaterialItem | null>(null);

  // Only DRs that are ready_for_review or processing (have items to compare)
  const eligibleDRs = mockDRs.filter((dr) => dr.status !== "not_started");

  const selectedDR = mockDRs.find((dr) => dr.id === selectedDRId);
  const selectedProject = selectedDR
    ? mockProjects.find((p) => p.id === selectedDR.projectId)
    : null;

  const allItems = useMemo(
    () => mockMaterialItems.filter((item) => item.drId === selectedDRId),
    [selectedDRId]
  );

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchSearch =
        !search ||
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.specSection.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allItems, search, statusFilter]);

  const preApprovedCount = allItems.filter((i) => i.status === "pre_approved").length;
  const reviewCount = allItems.filter((i) => i.status === "review_required").length;
  const actionCount = allItems.filter((i) => i.status === "action_mandatory").length;

  const summaryCards = [
    {
      label: "Total Items",
      count: allItems.length,
      icon: BarChart3,
      color: "text-foreground",
      bg: "bg-muted/50",
    },
    {
      label: "Pre-Approved",
      count: preApprovedCount,
      icon: CheckCircle2,
      color: "text-status-pre-approved",
      bg: "bg-status-pre-approved-bg",
    },
    {
      label: "Review Required",
      count: reviewCount,
      icon: AlertTriangle,
      color: "text-status-review-required",
      bg: "bg-status-review-required-bg",
    },
    {
      label: "Action Mandatory",
      count: actionCount,
      icon: XCircle,
      color: "text-status-action-mandatory",
      bg: "bg-status-action-mandatory-bg",
    },
  ];

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBulkStatusChange = (_status: DiscrepancyStatus) => {
    // Mock — in production this would update items
    setSelectedIds(new Set());
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStatusChange = (_id: string, _status: DiscrepancyStatus) => {
    // Mock — in production this would update the item status
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discrepancy Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare material matrix, project spec, and project index values
          </p>
        </div>
        <Button variant="outline">
          <FileDown className="mr-1.5 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* DR Selector */}
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Descriptive Report
          </label>
          <Select value={selectedDRId} onValueChange={(v) => { setSelectedDRId(v); setSelectedIds(new Set()); setSearch(""); setStatusFilter("all"); }}>
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a DR..." />
            </SelectTrigger>
            <SelectContent>
              {eligibleDRs.map((dr) => {
                const proj = mockProjects.find((p) => p.id === dr.projectId);
                return (
                  <SelectItem key={dr.id} value={dr.id}>
                    {dr.name} — {proj?.name ?? "Unknown"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {selectedDR && selectedProject && (
          <div className="text-xs text-muted-foreground pt-4">
            Project: <span className="font-medium text-foreground">{selectedProject.name}</span>
            {" · "}
            {selectedProject.jobId}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border bg-card shadow-card p-4 flex items-center gap-4 hover-lift animate-fade-up"
            >
              <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <IconComp className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{card.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as DiscrepancyStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pre_approved">Pre-Approved</SelectItem>
            <SelectItem value="review_required">Review Required</SelectItem>
            <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <DiscrepancyTable
          items={filtered}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleAll={handleToggleAll}
          onItemClick={(item) => setDetailItem(item)}
          onBulkStatusChange={handleBulkStatusChange}
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-card p-12 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-base font-medium">No items found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {allItems.length === 0
              ? "Select a descriptive report with material items"
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      )}

      {/* Item Detail Panel */}
      {detailItem && (
        <ItemDetailPanel
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
