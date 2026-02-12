"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreVertical,
  FileText,
  BookOpen,
  User,
  Plus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ConformanceDetailSheet,
  type ConformanceItem,
} from "@/components/conformance/conformance-detail-sheet";

const mockConformanceData: ConformanceItem[] = [
  { id: "c1", documentName: "HVAC Equipment Schedule", specSection: "23 34 00", status: "conforming", score: 96, project: "Riverside Commercial Tower", lastChecked: "Jan 28, 2026", reviewer: "Sarah Mitchell" },
  { id: "c2", documentName: "Structural Steel Shop Drawings", specSection: "05 12 00", status: "conforming", score: 92, project: "Harbor District Mixed Use", lastChecked: "Jan 25, 2026", reviewer: "James Chen" },
  { id: "c3", documentName: "Fire Protection System", specSection: "21 13 00", status: "partial", score: 74, project: "Metro Line Extension Phase 3", lastChecked: "Jan 22, 2026", reviewer: "Maria Garcia" },
  { id: "c4", documentName: "Electrical Switchgear Data", specSection: "26 24 00", status: "non_conforming", score: 45, project: "Harbor District Mixed Use", lastChecked: "Jan 20, 2026", reviewer: "David Park" },
  { id: "c5", documentName: "Plumbing Fixtures Schedule", specSection: "22 40 00", status: "conforming", score: 98, project: "Riverside Commercial Tower", lastChecked: "Jan 18, 2026", reviewer: "Sarah Mitchell" },
  { id: "c6", documentName: "Curtain Wall System", specSection: "08 44 00", status: "partial", score: 68, project: "Downtown Office Renovation", lastChecked: "Jan 15, 2026", reviewer: "James Chen" },
  { id: "c7", documentName: "Concrete Mix Design", specSection: "03 31 00", status: "conforming", score: 89, project: "Metro Line Extension Phase 3", lastChecked: "Jan 12, 2026", reviewer: "Maria Garcia" },
  { id: "c8", documentName: "Elevator Equipment Submittal", specSection: "14 21 00", status: "non_conforming", score: 38, project: "Downtown Office Renovation", lastChecked: "Jan 10, 2026", reviewer: "David Park" },
];

const statusConfig = {
  conforming: { label: "Conforming", icon: CheckCircle2, color: "text-status-pre-approved", bg: "bg-status-pre-approved-bg", border: "border-status-pre-approved/20" },
  partial: { label: "Partial", icon: AlertTriangle, color: "text-status-review-required", bg: "bg-status-review-required-bg", border: "border-status-review-required/20" },
  non_conforming: { label: "Non-conforming", icon: XCircle, color: "text-status-action-mandatory", bg: "bg-status-action-mandatory-bg", border: "border-status-action-mandatory/20" },
};

export default function ConformancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create">("view");
  const [selectedItem, setSelectedItem] = useState<ConformanceItem | null>(null);

  const filtered = mockConformanceData.filter((item) => {
    const matchSearch =
      item.documentName.toLowerCase().includes(search.toLowerCase()) ||
      item.specSection.toLowerCase().includes(search.toLowerCase()) ||
      item.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const conforming = mockConformanceData.filter((d) => d.status === "conforming").length;
  const partial = mockConformanceData.filter((d) => d.status === "partial").length;
  const nonConforming = mockConformanceData.filter((d) => d.status === "non_conforming").length;

  const openCreate = () => {
    setSelectedItem(null);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const openView = (item: ConformanceItem) => {
    setSelectedItem(item);
    setSheetMode("view");
    setSheetOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conformance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track document conformance status across all projects
          </p>
        </div>
        <Button
          className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
          onClick={openCreate}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New Conformance
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-status-pre-approved-bg p-2.5">
              <CheckCircle2 className="h-5 w-5 text-status-pre-approved" />
            </div>
            <div>
              <p className="text-2xl font-bold">{conforming}</p>
              <p className="text-xs text-muted-foreground">Conforming</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-status-review-required-bg p-2.5">
              <AlertTriangle className="h-5 w-5 text-status-review-required" />
            </div>
            <div>
              <p className="text-2xl font-bold">{partial}</p>
              <p className="text-xs text-muted-foreground">Partial</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-status-action-mandatory-bg p-2.5">
              <XCircle className="h-5 w-5 text-status-action-mandatory" />
            </div>
            <div>
              <p className="text-2xl font-bold">{nonConforming}</p>
              <p className="text-xs text-muted-foreground">Non-conforming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, sections, projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="conforming">Conforming</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="non_conforming">Non-conforming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conformance Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;
          const scoreColor =
            item.score >= 80
              ? "text-status-pre-approved"
              : item.score >= 60
                ? "text-status-review-required"
                : "text-status-action-mandatory";
          const barColor =
            item.score >= 80
              ? "bg-status-pre-approved"
              : item.score >= 60
                ? "bg-status-review-required"
                : "bg-status-action-mandatory";

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border bg-card shadow-card overflow-hidden transition-shadow hover:shadow-card-hover cursor-pointer",
                config.border
              )}
              onClick={() => openView(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openView(item);
                }
              }}
            >
              <div className="p-5 space-y-4">
                {/* Top row: Document name + actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={cn("rounded-lg p-2 shrink-0 mt-0.5", config.bg)}>
                      <FileText className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {item.documentName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.project}
                      </p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mt-1 -mr-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openView(item)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Re-check</DropdownMenuItem>
                        <DropdownMenuItem>Export Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Status badge + spec section */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className={cn("gap-1", config.bg, config.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    <span className="font-mono font-semibold">{item.specSection}</span>
                  </span>
                </div>

                {/* Score bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">
                      Conformance Score
                    </span>
                    <span className={cn("font-bold", scoreColor)}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", barColor)}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>

                {/* Footer: reviewer + date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    {item.reviewer}
                  </span>
                  <span>{item.lastChecked}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border bg-card shadow-card p-12 text-center">
          <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="text-base font-medium">No documents match your criteria</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {/* Conformance Detail Sheet */}
      <ConformanceDetailSheet
        item={selectedItem}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
      />
    </div>
  );
}
