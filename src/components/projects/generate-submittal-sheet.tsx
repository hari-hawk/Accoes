"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  FileText,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchInput } from "@/components/shared/search-input";
import { useMaterials } from "@/hooks/use-materials";
import { getMatrixFilesByVersion } from "@/data/mock-documents";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Project, ValidationStatus } from "@/data/types";

/* ── Confidence helpers ─────────────────────────────────────── */

function confidenceColor(score: number) {
  if (score >= 80) return { text: "text-status-pre-approved", bar: "bg-status-pre-approved", bg: "bg-status-pre-approved-bg" };
  if (score >= 40) return { text: "text-status-review-required", bar: "bg-status-review-required", bg: "bg-status-review-required-bg" };
  return { text: "text-status-action-mandatory", bar: "bg-status-action-mandatory", bg: "bg-status-action-mandatory-bg" };
}

function ConfidenceIndicator({ score }: { score: number }) {
  const colors = confidenceColor(score);
  return (
    <div className="flex items-center gap-1.5 shrink-0" title={`AI Confidence: ${score}%`}>
      <span className={cn("text-xs font-bold tabular-nums", colors.text)}>
        {score}%
      </span>
      <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

const SUBMITTAL_STATUS_OPTIONS: {
  key: ValidationStatus;
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
  icon: typeof CheckCircle2;
}[] = [
  {
    key: "pre_approved",
    label: "Pre-Approved",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
    dotColor: "bg-status-pre-approved",
    icon: CheckCircle2,
  },
  {
    key: "review_required",
    label: "Review Required",
    color: "text-status-review-required",
    bgColor: "bg-status-review-required-bg",
    dotColor: "bg-status-review-required",
    icon: AlertTriangle,
  },
  {
    key: "action_mandatory",
    label: "Action Mandatory",
    color: "text-status-action-mandatory",
    bgColor: "bg-status-action-mandatory-bg",
    dotColor: "bg-status-action-mandatory",
    icon: XCircle,
  },
];

export function GenerateSubmittalSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [documentFilter, setDocumentFilter] = useState<Set<string>>(new Set());
  const [tradeFilter, setTradeFilter] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);

  const versionId = project?.latestVersionId ?? "";
  const { allMaterials } = useMaterials(versionId);

  /* Derive unique filter options from data */
  const matrixFiles = useMemo(
    () => getMatrixFilesByVersion(versionId),
    [versionId]
  );
  const tradeOptions = useMemo(
    () => [...new Set(allMaterials.map((m) => m.document.systemCategory).filter(Boolean))] as string[],
    [allMaterials]
  );
  const categoryOptions = useMemo(
    () => [...new Set(allMaterials.map((m) => m.document.indexCategory).filter(Boolean))] as string[],
    [allMaterials]
  );

  /* Build a set of document IDs that pass the document filter.
   * When matrix files exist, filter keys are matrix file IDs → resolve to doc IDs.
   * When no matrix files exist (fallback), filter keys ARE doc IDs directly. */
  const matrixFilterDocIds = useMemo(() => {
    if (documentFilter.size === 0) return null; // no filter = show all
    if (matrixFiles.length > 0) {
      const ids = new Set<string>();
      matrixFiles
        .filter((mf) => documentFilter.has(mf.id))
        .forEach((mf) => mf.documentIds.forEach((id) => ids.add(id)));
      return ids;
    }
    // Fallback: documentFilter contains direct document IDs
    return documentFilter;
  }, [documentFilter, matrixFiles]);

  const filteredMaterials = useMemo(() => {
    return allMaterials.filter((m) => {
      if (search) {
        const lower = search.toLowerCase();
        const matchesSearch =
          m.document.fileName.toLowerCase().includes(lower) ||
          m.document.specSection.toLowerCase().includes(lower) ||
          m.document.specSectionTitle.toLowerCase().includes(lower) ||
          (m.document.indexCategory?.toLowerCase().includes(lower) ?? false) ||
          (m.document.systemCategory?.toLowerCase().includes(lower) ?? false);
        if (!matchesSearch) return false;
      }
      if (statusFilter.size > 0) {
        if (!m.validation?.status || !statusFilter.has(m.validation.status))
          return false;
      }
      if (matrixFilterDocIds) {
        if (!matrixFilterDocIds.has(m.document.id)) return false;
      }
      if (tradeFilter.size > 0) {
        if (!m.document.systemCategory || !tradeFilter.has(m.document.systemCategory)) return false;
      }
      if (categoryFilter.size > 0) {
        if (!m.document.indexCategory || !categoryFilter.has(m.document.indexCategory)) return false;
      }
      return true;
    });
  }, [allMaterials, search, statusFilter, matrixFilterDocIds, tradeFilter, categoryFilter]);

  const preApprovedMaterials = filteredMaterials.filter(
    (m) => m.validation?.status === "pre_approved"
  );

  const statusCounts = useMemo(() => ({
    pre_approved: allMaterials.filter((m) => m.validation?.status === "pre_approved").length,
    review_required: allMaterials.filter((m) => m.validation?.status === "review_required").length,
    action_mandatory: allMaterials.filter((m) => m.validation?.status === "action_mandatory").length,
  }), [allMaterials]);

  const allPreApprovedSelected =
    preApprovedMaterials.length > 0 &&
    preApprovedMaterials.every((m) => selectedIds.has(m.document.id));

  const selectedCount = preApprovedMaterials.filter((m) =>
    selectedIds.has(m.document.id)
  ).length;

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPreApproved = () => {
    if (allPreApprovedSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        preApprovedMaterials.forEach((m) => next.delete(m.document.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        preApprovedMaterials.forEach((m) => next.add(m.document.id));
        return next;
      });
    }
  };

  const toggleSetItem = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleGenerate = () => {
    if (selectedCount === 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success("Submittal generated", {
        description: `${selectedCount} pre-approved material${selectedCount !== 1 ? "s" : ""} included.`,
      });
      handleClose(false);
      if (project?.latestVersionId) {
        // Store matrix file IDs that had selected materials
        const approvedMatrixFileIds = matrixFiles
          .filter(mf => mf.documentIds.some(id => selectedIds.has(id)))
          .map(mf => mf.id);
        localStorage.setItem(
          `submittal-approved-files-${project.latestVersionId}`,
          JSON.stringify(approvedMatrixFileIds)
        );
        router.push(`/projects/${project.id}/versions/${project.latestVersionId}/preview-cover`);
      }
    }, 1500);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearch("");
      setStatusFilter(new Set());
      setDocumentFilter(new Set());
      setTradeFilter(new Set());
      setCategoryFilter(new Set());
      setGenerating(false);
    }
    onOpenChange(isOpen);
  };

  const activeFilterCount = statusFilter.size + documentFilter.size + tradeFilter.size + categoryFilter.size;

  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="sm:max-w-[50vw] lg:max-w-2xl w-full flex flex-col p-0"
        aria-label={`Generate submittal for ${project.name}`}
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">Generate Submittal</SheetTitle>
              <SheetDescription className="text-xs mt-0.5 truncate">
                {project.name} — {project.jobId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Search + Filters — no divider, spacing only */}
        <div className="px-4 pt-2 pb-2 space-y-2.5 border-b shrink-0 bg-muted/20">
          <SearchInput
            placeholder="Search by title, description, trade..."
            value={search}
            onChange={setSearch}
            className="[&_input]:h-8 [&_input]:text-xs"
          />

          {/* 4-column equal-width responsive filter grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Documents multi-select (matrix files) */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-full text-[11px] justify-between font-normal gap-1 px-2.5",
                    documentFilter.size > 0 && "border-primary/40 bg-primary/5"
                  )}
                >
                  <Filter className="h-3 w-3 shrink-0 opacity-60" />
                  <span className="truncate flex-1 text-left">
                    {documentFilter.size === 0 ? "All Documents" : `${documentFilter.size} Doc${documentFilter.size !== 1 ? "s" : ""}`}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start" side="bottom" avoidCollisions sideOffset={4}>
                <div className="px-3 pt-2.5 pb-1.5">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-muted-foreground">Select Documents</span>
                    {documentFilter.size > 0 && (
                      <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={() => setDocumentFilter(new Set())}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[180px] px-3 pb-2">
                  {matrixFiles.length > 0 ? (
                    matrixFiles.map((mf) => (
                      <label key={mf.id} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs", documentFilter.has(mf.id) ? "bg-primary/5" : "hover:bg-muted/50")}>
                        <Checkbox checked={documentFilter.has(mf.id)} onCheckedChange={() => toggleSetItem(setDocumentFilter, mf.id)} className="h-3.5 w-3.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{mf.fileName.replace(/\.[^/.]+$/, "")}</span>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">{mf.documentIds.length} materials</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    /* Fallback: show individual document fileNames if no matrix files exist */
                    allMaterials.map((m) => (
                      <label key={m.document.id} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs", documentFilter.has(m.document.id) ? "bg-primary/5" : "hover:bg-muted/50")}>
                        <Checkbox checked={documentFilter.has(m.document.id)} onCheckedChange={() => toggleSetItem(setDocumentFilter, m.document.id)} className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate font-medium">{m.document.fileName}</span>
                      </label>
                    ))
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Status filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-full text-[11px] justify-between font-normal gap-1 px-2.5",
                    statusFilter.size > 0 && "border-primary/40 bg-primary/5"
                  )}
                >
                  <span className="truncate flex-1 text-left">
                    {statusFilter.size === 0 ? "Status" : `${statusFilter.size} Status`}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start" side="bottom" avoidCollisions sideOffset={4}>
                <div className="px-3 pt-2.5 pb-1.5">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-muted-foreground">Filter by Status</span>
                    {statusFilter.size > 0 && (
                      <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={() => setStatusFilter(new Set())}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[180px] px-3 pb-2">
                  {SUBMITTAL_STATUS_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = statusFilter.has(opt.key);
                    const count = statusCounts[opt.key];
                    return (
                      <label key={opt.key} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors", isActive ? "bg-primary/5" : "hover:bg-muted/50")}>
                        <Checkbox checked={isActive} onCheckedChange={() => toggleSetItem(setStatusFilter, opt.key)} className="h-3.5 w-3.5" />
                        <Icon className={cn("h-3.5 w-3.5 shrink-0", opt.color)} aria-hidden="true" />
                        <span className="text-xs font-medium flex-1">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground tabular-nums font-medium">{count}</span>
                      </label>
                    );
                  })}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Trade filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-full text-[11px] justify-between font-normal gap-1 px-2.5",
                    tradeFilter.size > 0 && "border-primary/40 bg-primary/5"
                  )}
                  disabled={tradeOptions.length === 0}
                >
                  <span className="truncate flex-1 text-left">
                    {tradeFilter.size === 0 ? "Trade" : `${tradeFilter.size} Trade`}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start" side="bottom" avoidCollisions sideOffset={4}>
                <div className="px-3 pt-2.5 pb-1.5">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-muted-foreground">Filter by Trade</span>
                    {tradeFilter.size > 0 && (
                      <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={() => setTradeFilter(new Set())}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[180px] px-3 pb-2">
                  {tradeOptions.map((trade) => (
                    <label key={trade} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs", tradeFilter.has(trade) ? "bg-primary/5" : "hover:bg-muted/50")}>
                      <Checkbox checked={tradeFilter.has(trade)} onCheckedChange={() => toggleSetItem(setTradeFilter, trade)} className="h-3.5 w-3.5" />
                      <span className="min-w-0 flex-1 truncate font-medium">{trade}</span>
                    </label>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Category filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 w-full text-[11px] justify-between font-normal gap-1 px-2.5",
                    categoryFilter.size > 0 && "border-primary/40 bg-primary/5"
                  )}
                  disabled={categoryOptions.length === 0}
                >
                  <span className="truncate flex-1 text-left">
                    {categoryFilter.size === 0 ? "Category" : `${categoryFilter.size} Cat.`}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start" side="bottom" avoidCollisions sideOffset={4}>
                <div className="px-3 pt-2.5 pb-1.5">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-muted-foreground">Filter by Category</span>
                    {categoryFilter.size > 0 && (
                      <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={() => setCategoryFilter(new Set())}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[180px] px-3 pb-2">
                  {categoryOptions.map((cat) => (
                    <label key={cat} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs", categoryFilter.has(cat) ? "bg-primary/5" : "hover:bg-muted/50")}>
                      <Checkbox checked={categoryFilter.has(cat)} onCheckedChange={() => toggleSetItem(setCategoryFilter, cat)} className="h-3.5 w-3.5" />
                      <span className="min-w-0 flex-1 truncate font-medium">{cat}</span>
                    </label>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Select All + counts + clear filters */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={allPreApprovedSelected}
                onCheckedChange={toggleAllPreApproved}
                className="h-3.5 w-3.5"
              />
              <span className="text-muted-foreground">Select All Pre-Approved</span>
            </label>
            {activeFilterCount > 0 && (
              <button
                type="button"
                className="text-[11px] text-primary hover:underline font-medium"
                onClick={() => {
                  setStatusFilter(new Set());
                  setDocumentFilter(new Set());
                  setTradeFilter(new Set());
                  setCategoryFilter(new Set());
                }}
              >
                Clear filters
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto" role="group" aria-label="Status counts">
              <span className="flex items-center gap-1 text-status-pre-approved" aria-label={`${statusCounts.pre_approved} pre-approved`}>
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                {statusCounts.pre_approved}
              </span>
              <span className="flex items-center gap-1 text-status-review-required" aria-label={`${statusCounts.review_required} review required`}>
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                {statusCounts.review_required}
              </span>
              <span className="flex items-center gap-1 text-status-action-mandatory" aria-label={`${statusCounts.action_mandatory} action mandatory`}>
                <XCircle className="h-3 w-3" aria-hidden="true" />
                {statusCounts.action_mandatory}
              </span>
            </div>
          </div>
        </div>

        {/* Material list */}
        <ScrollArea className="flex-1 min-h-0">
          <div role="list" aria-label="Materials for submittal">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((item) => {
                const status = item.validation?.status;
                const isPreApproved = status === "pre_approved";
                const isChecked = selectedIds.has(item.document.id);
                const statusConfig = status ? VALIDATION_STATUS_CONFIG[status] : null;
                const confidenceScore = item.validation?.confidenceScore;

                return (
                  <label
                    key={item.document.id}
                    role="listitem"
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b",
                      !isPreApproved && "opacity-50 cursor-not-allowed",
                      isChecked
                        ? "bg-nav-accent/5 border-l-2 border-l-nav-accent"
                        : "hover:bg-muted/30 border-l-2 border-l-transparent"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => isPreApproved && toggleItem(item.document.id)}
                      disabled={!isPreApproved}
                      aria-label={
                        isPreApproved
                          ? `Select ${item.document.fileName}`
                          : `${item.document.fileName} — not selectable (${status?.replace(/_/g, " ")})`
                      }
                      className="mt-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {/* Row 1: Title + Status badge & Confidence (right side) */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {status && (
                            <span className={cn("h-2 w-2 rounded-full shrink-0", SUBMITTAL_STATUS_OPTIONS.find((o) => o.key === status)?.dotColor)} />
                          )}
                          <p className="text-sm font-medium leading-tight truncate">
                            {item.document.fileName.replace(/\.[^/.]+$/, "")}
                          </p>
                        </div>

                        {/* Right corner: Status badge + Confidence */}
                        <div className="flex items-center gap-2 shrink-0">
                          {statusConfig && (
                            <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none whitespace-nowrap", statusConfig.bgColor, statusConfig.color)}>
                              {statusConfig.label}
                            </span>
                          )}
                          {confidenceScore !== undefined && (
                            <ConfidenceIndicator score={confidenceScore} />
                          )}
                        </div>
                      </div>

                      {/* Row 2: Section number (mono) + description — matching conformance page */}
                      <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">
                        <span className="font-mono font-semibold text-primary/80">
                          {item.document.specSection}
                        </span>
                        {" — "}
                        {item.document.specSectionTitle}
                      </p>

                      {/* Row 3: Category pills (conformance style — colored rings) */}
                      {(item.document.indexCategory || item.document.systemCategory) && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {item.document.systemCategory && (
                            <span
                              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:ring-slate-700"
                              title={`Trade: ${item.document.systemCategory}`}
                            >
                              {item.document.systemCategory}
                            </span>
                          )}
                          {item.document.indexCategory && (
                            <span
                              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-700"
                              title={`Category: ${item.document.indexCategory}`}
                            >
                              {item.document.indexCategory}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                );
              })
            ) : allMaterials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No documents available</p>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">Upload documents to generate a submittal</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No materials match filters</p>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sticky footer */}
        <SheetFooter className="px-6 py-4 border-t shrink-0">
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-muted-foreground flex-1">
              <span className="font-semibold text-nav-accent">{selectedCount}</span>
              {" "}of {statusCounts.pre_approved} pre-approved selected
            </span>
            <Button variant="outline" onClick={() => handleClose(false)} disabled={generating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={selectedCount === 0 || generating}
              className="gradient-accent text-white border-0 shadow-glow hover:opacity-90 transition-opacity"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Approve &amp; Generate Summary
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
