# Download Report Sheet Enhancement — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `DownloadReportSheet` in `project-list.tsx` to mirror the workspace material list — search, document/status filters, score chips, status badges, multi-select, and CSV/Excel format picker.

**Architecture:** Single-component rewrite (Approach A). Replace the flat document list with a rich material list using `useMaterials` hook for data (same as the workspace review page). All changes confined to `project-list.tsx` — the existing `DownloadReportSheet` function is replaced in-place.

**Tech Stack:** Next.js 16, React 19, shadcn/ui (Sheet, Select, Popover, Checkbox, ScrollArea, Badge), Tailwind v4, `useMaterials` hook.

---

### Task 1: Update imports

**Files:**
- Modify: `src/components/projects/project-list.tsx:1-64`

**Step 1: Add new imports and remove unused ones**

Add these imports to the existing import block at the top of the file:

```typescript
// Add to lucide-react imports:
import { Search, ChevronDown, X } from "lucide-react";

// Add new UI component imports:
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
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";

// Add data hook import:
import { useMaterials, type MaterialItem } from "@/hooks/use-materials";
```

Remove these imports that are no longer used by the rewritten DownloadReportSheet:
- `getDocumentsByVersion` from `@/data/mock-documents`
- `getValidationsByVersion` from `@/data/mock-validations`
- `type Document as DocType` and `type ValidationResult` from `@/data/types`

IMPORTANT: Before removing imports, check if they are used ANYWHERE ELSE in the file (other components like the list view). Only remove if `DownloadReportSheet` was the sole consumer.

**Step 2: Remove the old `statusConfig`, `fileIconMap`, and `formatFileSize` helpers**

Lines ~48-64 define `statusConfig`, `fileIconMap`, and `formatFileSize`. These are only used by the old `DownloadReportSheet`. Remove them. We'll use `VALIDATION_STATUS_CONFIG` from constants instead.

Again, before removing, verify these are not used elsewhere in the file.

**Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: Should still pass (unused imports may show warnings but not errors)

**Step 4: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "refactor: update imports for DownloadReportSheet rewrite"
```

---

### Task 2: Rewrite DownloadReportSheet — state and data

**Files:**
- Modify: `src/components/projects/project-list.tsx` — the `DownloadReportSheet` function (lines ~470-709)

**Step 1: Replace the function body — state and data section**

Replace the entire `DownloadReportSheet` function with this new version. In this step, write only the state/data section (the rest comes in Task 3):

```typescript
function DownloadReportSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<ValidationStatus>>(new Set());
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Fetch materials for this project's latest version via the same hook
  // that powers the workspace material list
  const versionId = project?.latestVersionId ?? "";
  const { materials: allMaterials } = useMaterials(versionId);

  // -- Filtering --
  const filteredMaterials = allMaterials.filter((m) => {
    // Search filter
    if (search) {
      const lower = search.toLowerCase();
      const matchesSearch =
        m.document.fileName.toLowerCase().includes(lower) ||
        m.document.specSection.includes(lower) ||
        m.document.specSectionTitle.toLowerCase().includes(lower);
      if (!matchesSearch) return false;
    }
    // Status filter
    if (statusFilter.size > 0) {
      if (!m.validation?.status || !statusFilter.has(m.validation.status)) return false;
    }
    return true;
  });

  // -- Status counts (from FULL list, not filtered) --
  const preApprovedCount = allMaterials.filter(
    (m) => m.validation?.status === "pre_approved"
  ).length;
  const reviewCount = allMaterials.filter(
    (m) => m.validation?.status === "review_required"
  ).length;
  const actionCount = allMaterials.filter(
    (m) => m.validation?.status === "action_mandatory"
  ).length;

  // -- Selection helpers --
  const allSelected =
    filteredMaterials.length > 0 &&
    filteredMaterials.every((m) => selectedIds.has(m.document.id));

  const toggleDoc = (docId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMaterials.map((m) => m.document.id)));
    }
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
    }, 1500);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedIds(new Set());
      setSearch("");
      setStatusFilter(new Set());
      setExporting(false);
      setExportComplete(false);
      setExportFormat("csv");
    }
    onOpenChange(isOpen);
  };

  const STATUS_OPTIONS: {
    key: ValidationStatus;
    label: string;
    icon: typeof CheckCircle2;
    color: string;
    dotColor: string;
  }[] = [
    { key: "pre_approved", label: "Pre-Approved", icon: CheckCircle2, color: "text-status-pre-approved", dotColor: "bg-status-pre-approved" },
    { key: "review_required", label: "Review Required", icon: AlertTriangle, color: "text-status-review-required", dotColor: "bg-status-review-required" },
    { key: "action_mandatory", label: "Action Mandatory", icon: XCircle, color: "text-status-action-mandatory", dotColor: "bg-status-action-mandatory" },
  ];

  const activeFilterCount = statusFilter.size;

  if (!project) return null;

  // ... JSX follows in Task 3 ...
}
```

NOTE: `useMaterials` returns `{ materials: filteredMaterials, allMaterials: materials, ... }`. We need ALL materials (unfiltered) and we do our own filtering here because:
1. The hook's `filteredMaterials` is controlled by the hook's internal search/status state
2. We want our own independent filter state for this sheet

So we use `allMaterials` from the hook and filter locally. Update the destructuring:
```typescript
const { allMaterials } = useMaterials(versionId);
```

Wait — looking at the `useMaterials` hook return, `materials` is the filtered list and `allMaterials` is the full list. We want the full list:
```typescript
const { allMaterials } = useMaterials(versionId);
```
Then rename the local variable `allMaterials` usage above to reference this directly.

**Step 2: Run type check**

Run: `npx tsc --noEmit`
Expected: Errors about missing JSX return — expected since we haven't written the JSX yet. But the state/data logic should type-check.

---

### Task 3: Rewrite DownloadReportSheet — JSX (ScoreChip + filter header + list + footer)

**Files:**
- Modify: `src/components/projects/project-list.tsx` — continue the `DownloadReportSheet` function

**Step 1: Add local ScoreChip helper**

Add this as a local function INSIDE `DownloadReportSheet` (or just above it as a private helper):

```typescript
/** Score chip — displays "PS: 98%" or "PI: 74%" with color coding */
function ReportScoreChip({ label, score }: { label: string; score: number | undefined }) {
  if (score === undefined) return null;
  const color =
    score >= 80
      ? "bg-status-pre-approved-bg text-status-pre-approved"
      : score >= 60
        ? "bg-status-review-required-bg text-status-review-required"
        : "bg-status-action-mandatory-bg text-status-action-mandatory";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums", color)}>
      {label}: {score}%
    </span>
  );
}
```

**Step 2: Write the full JSX return**

The return statement replaces everything from `return (` to the closing `)` of the old DownloadReportSheet. Structure:

```tsx
return (
  <Sheet open={open} onOpenChange={handleClose}>
    <SheetContent
      side="right"
      className="sm:max-w-md w-full flex flex-col p-0"
      aria-label={`Download report for ${project.name}`}
    >
      {/* ── Header ── */}
      <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg gradient-gold flex items-center justify-center shrink-0">
            <Download className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <SheetTitle className="text-base">Download Report</SheetTitle>
            <SheetDescription className="text-xs mt-0.5 truncate">
              {project.name} — {project.jobId}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      {exportComplete ? (
        /* ── Success State ── */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4 max-w-xs">
            <div className="mx-auto w-16 h-16 rounded-full bg-status-pre-approved/10 flex items-center justify-center">
              <Check className="h-7 w-7 text-status-pre-approved" aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-semibold">Report Generated</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedIds.size} document{selectedIds.size !== 1 ? "s" : ""} exported
                successfully as {exportFormat === "csv" ? "CSV" : "Excel"}
              </p>
            </div>
            <Button variant="outline" onClick={() => handleClose(false)} className="mt-2">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Filter Header ── */}
          <div className="px-4 pt-4 pb-3 space-y-2 border-b shrink-0">
            {/* Search */}
            <SearchInput
              placeholder="Search materials..."
              value={search}
              onChange={setSearch}
              className="[&_input]:h-8"
            />

            {/* Document dropdown + Status filter */}
            <div className="grid grid-cols-2 gap-2 [&>*]:min-w-0">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs w-full">
                  <SelectValue placeholder="All Documents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
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
                      activeFilterCount > 0 && "border-primary/40 bg-primary/5"
                    )}
                    aria-label={`Filter by status${activeFilterCount > 0 ? ` — ${activeFilterCount} selected` : ""}`}
                  >
                    <span className="truncate">
                      {activeFilterCount === 0
                        ? "All Status"
                        : activeFilterCount === 1
                          ? STATUS_OPTIONS.find((s) => statusFilter.has(s.key))?.label ?? "1 Status"
                          : `${activeFilterCount} Status`}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-xs font-semibold text-muted-foreground">Filter by Status</span>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          className="text-[11px] text-primary hover:underline font-medium"
                          onClick={() => setStatusFilter(new Set())}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="h-px bg-border" />
                    {STATUS_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = statusFilter.has(opt.key);
                      const countMap: Record<ValidationStatus, number> = {
                        pre_approved: preApprovedCount,
                        review_required: reviewCount,
                        action_mandatory: actionCount,
                      };
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
                            onCheckedChange={() => {
                              setStatusFilter((prev) => {
                                const next = new Set(prev);
                                if (next.has(opt.key)) next.delete(opt.key);
                                else next.add(opt.key);
                                return next;
                              });
                            }}
                            className="h-3.5 w-3.5"
                          />
                          <Icon className={cn("h-3.5 w-3.5 shrink-0", opt.color)} aria-hidden="true" />
                          <span className="text-xs font-medium flex-1">{opt.label}</span>
                          <span className="text-[11px] text-muted-foreground tabular-nums font-medium">
                            {countMap[opt.key]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {STATUS_OPTIONS.filter((s) => statusFilter.has(s.key)).map((opt) => (
                  <span
                    key={opt.key}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      VALIDATION_STATUS_CONFIG[opt.key].bgColor,
                      VALIDATION_STATUS_CONFIG[opt.key].color
                    )}
                  >
                    {opt.label}
                    <button
                      type="button"
                      className="hover:opacity-70 transition-opacity"
                      onClick={() => {
                        setStatusFilter((prev) => {
                          const next = new Set(prev);
                          next.delete(opt.key);
                          return next;
                        });
                      }}
                      aria-label={`Remove ${opt.label} filter`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
                  onClick={() => setStatusFilter(new Set())}
                >
                  Clear
                </button>
              </div>
            )}

            {/* Select all + status counts */}
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
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
                <span className="flex items-center gap-1 text-status-action-mandatory" aria-label={`${actionCount} action mandatory`}>
                  <XCircle className="h-3 w-3" aria-hidden="true" />
                  {actionCount}
                </span>
              </div>
            </div>
          </div>

          {/* ── Material List (scrollable) ── */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="divide-y" role="group" aria-label="Materials for export">
              {filteredMaterials.map((item) => {
                const isChecked = selectedIds.has(item.document.id);
                const status = item.validation?.status;
                const effectiveDecision = item.validation?.decision;
                const psScore = item.paValidation?.confidenceScore;
                const piScore = item.piValidation?.confidenceScore;
                const overallScore = item.validation?.confidenceScore;
                const hasSubScores = psScore !== undefined || piScore !== undefined;

                return (
                  <label
                    key={item.document.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                      isChecked
                        ? "bg-nav-accent/5 border-l-2 border-l-nav-accent"
                        : "hover:bg-muted/30 border-l-2 border-l-transparent"
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleDoc(item.document.id)}
                      aria-label={`Select ${item.document.fileName}`}
                      className="mt-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {/* Material name + status dot */}
                      <div className="flex items-center gap-1.5">
                        {status && (
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              status === "pre_approved" && "bg-status-pre-approved",
                              status === "review_required" && "bg-status-review-required",
                              status === "action_mandatory" && "bg-status-action-mandatory"
                            )}
                          />
                        )}
                        <p className="text-sm font-medium leading-tight truncate">
                          {item.document.fileName}
                        </p>
                      </div>

                      {/* Spec section */}
                      <p className="text-xs text-muted-foreground mt-1 leading-tight truncate">
                        <span className="font-mono font-semibold text-primary/80">
                          {item.document.specSection}
                        </span>
                        {" — "}
                        {item.document.specSectionTitle}
                      </p>

                      {/* Score chips + decision/status badge */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {hasSubScores ? (
                          <>
                            <ReportScoreChip label="PS" score={psScore} />
                            <ReportScoreChip label="PI" score={piScore} />
                          </>
                        ) : (
                          <ReportScoreChip label="Score" score={overallScore} />
                        )}

                        <div className="ml-auto shrink-0">
                          {effectiveDecision && effectiveDecision !== "pending" ? (
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
                    </div>
                  </label>
                );
              })}

              {filteredMaterials.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {search || statusFilter.size > 0 ? "No materials match your filters" : "No documents available"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                    {search || statusFilter.size > 0
                      ? "Try adjusting your search or filters"
                      : "Upload documents to this project\u0027s latest version first"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* ── Footer ── */}
          <SheetFooter className="px-6 py-4 border-t shrink-0">
            <div className="flex items-center gap-3 w-full">
              <Button variant="outline" onClick={() => handleClose(false)} className="flex-1">
                Cancel
              </Button>
              <Select
                value={exportFormat}
                onValueChange={(v) => setExportFormat(v as "csv" | "xlsx")}
              >
                <SelectTrigger className="w-24 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExport}
                disabled={selectedIds.size === 0 || exporting}
                className="flex-1 gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity"
                aria-label={
                  selectedIds.size === 0
                    ? "Select documents to export"
                    : `Export ${selectedIds.size} document${selectedIds.size !== 1 ? "s" : ""} as ${exportFormat}`
                }
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Exporting…
                  </>
                ) : (
                  <>
                    <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
                  </>
                )}
              </Button>
            </div>
          </SheetFooter>
        </>
      )}
    </SheetContent>
  </Sheet>
);
```

**Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: PASS — all types should resolve

**Step 4: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "feat: rewrite DownloadReportSheet with material list, filters, score chips, format picker"
```

---

### Task 4: Verify lint, build, and visual check

**Step 1: Run lint**

Run: `npm run lint`
Expected: 0 errors (existing warnings are acceptable)

If there are lint errors (e.g., React 19 purity warnings, unused variables), fix them before proceeding.

**Step 2: Run build**

Run: `npm run build`
Expected: Clean build with all routes generated

**Step 3: Visual check**

Run: `npm run dev`
Open the projects page, click "Download Report" on a project card. Verify:
- Search bar appears and filters material list
- Document dropdown and Status filter work
- Status count badges show correct numbers
- Each material item shows: status dot, name, spec section, PS/PI score chips, status badge
- Checkboxes work (single + select all)
- Format picker shows CSV/Excel options
- Export button shows count, disabled when nothing selected
- Export success state shows format name

**Step 4: Commit any fixes**

```bash
git add src/components/projects/project-list.tsx
git commit -m "fix: address lint/build issues in DownloadReportSheet"
```

---

### Task 5: Push to production

**Step 1: Push**

```bash
git push origin main
```

**Step 2: Verify deployment**

Check Vercel deployment completes successfully.
