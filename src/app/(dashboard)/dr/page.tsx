"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
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
import { Badge } from "@/components/ui/badge";
import { DRDetailSheet } from "@/components/dr/dr-detail-sheet";
import { mockDRs } from "@/data/mock-drs";
import { mockProjects } from "@/data/mock-projects";
import { DR_STATUS_CONFIG } from "@/lib/constants";
import type { DescriptiveReport, DRStatus } from "@/data/types";

const statusIcons: Record<DRStatus, typeof FileText> = {
  not_started: Clock,
  processing: Loader2,
  ready_for_review: CheckCircle2,
};

export default function DRPage() {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<DRStatus | "all">("all");

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDR, setSelectedDR] = useState<DescriptiveReport | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "create">("view");

  const filtered = mockDRs.filter((dr) => {
    const matchSearch =
      dr.name.toLowerCase().includes(search.toLowerCase()) ||
      dr.purpose.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === "all" || dr.projectId === projectFilter;
    const matchStatus = statusFilter === "all" || dr.status === statusFilter;
    return matchSearch && matchProject && matchStatus;
  });

  const notStartedCount = mockDRs.filter((d) => d.status === "not_started").length;
  const processingCount = mockDRs.filter((d) => d.status === "processing").length;
  const readyCount = mockDRs.filter((d) => d.status === "ready_for_review").length;

  const summaryCards = [
    { label: "Total DRs", count: mockDRs.length, icon: FileText, color: "text-foreground", bg: "bg-muted/50" },
    { label: "Not Started", count: notStartedCount, icon: Clock, color: "text-muted-foreground", bg: "bg-muted/50" },
    { label: "Processing", count: processingCount, icon: Loader2, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Ready for Review", count: readyCount, icon: CheckCircle2, color: "text-status-pre-approved", bg: "bg-status-pre-approved-bg" },
  ];

  const handleCardClick = (dr: DescriptiveReport) => {
    setSelectedDR(dr);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedDR(null);
    setSheetMode("create");
    setSheetOpen(true);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Descriptive Reports (DR)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage descriptive reports across your projects
          </p>
        </div>
        <Button
          className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
          onClick={handleCreateNew}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create New DR
        </Button>
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
            placeholder="Search DRs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {mockProjects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as DRStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="ready_for_review">Ready for Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((dr) => {
          const project = mockProjects.find((p) => p.id === dr.projectId);
          const config = DR_STATUS_CONFIG[dr.status];
          const StatusIcon = statusIcons[dr.status];
          return (
            <div
              key={dr.id}
              className="group relative rounded-xl border bg-card shadow-card p-5 hover:shadow-card-hover transition-all hover-lift animate-fade-up cursor-pointer"
              onClick={() => handleCardClick(dr)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(dr);
                }
              }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold truncate group-hover:text-nav-accent transition-colors">
                    {dr.name}
                  </h3>
                  {project && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {project.name}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${config.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>

              {/* Purpose */}
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {dr.purpose}
              </p>

              {/* Files */}
              <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                {dr.materialMatrixFile && (
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="h-3 w-3" />
                    Matrix
                  </span>
                )}
                {dr.projectSpecFile && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Spec
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="mt-3 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(dr.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border bg-card shadow-card p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-base font-medium">No descriptive reports found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* DR Detail Sheet */}
      <DRDetailSheet
        dr={selectedDR}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
      />
    </div>
  );
}
