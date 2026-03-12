"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Clock,
  FileType,
  Users,
  Calendar,
  Shield,
  FileSpreadsheet,
  Upload,
  Plus,
  X,
  Layers,
  Download,
  Check,
  Loader2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  History,
  Lock,
  Pencil,
  Save,
  Building2,
  MapPin,
  Briefcase,
  User,
  Hash,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkspace } from "@/providers/workspace-provider";
import { FullScreenPdfViewer } from "@/components/documents/full-screen-pdf-viewer";
import { FileUploadCard } from "@/components/projects/file-upload-card";
import { mockUsers } from "@/data/mock-users";
import { formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectType } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                   */
/* -------------------------------------------------------------------------- */

const fileIconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileType,
  csv: FileSpreadsheet,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Mock recent activity for the version
const recentActivity = [
  { id: 1, action: "Document validated", detail: "Fire-Rated Gypsum Board — Pre-Approved (96%)", time: "2 hours ago", type: "success" as const, user: "AI System" },
  { id: 2, action: "Review flagged", detail: "Structural Steel Shop Drawings — Missing fireproofing details", time: "3 hours ago", type: "warning" as const, user: "Sarah Wilson" },
  { id: 3, action: "Action required", detail: "HVAC Equipment Schedule — Chiller undersized by 50 tons", time: "4 hours ago", type: "error" as const, user: "James Chen" },
  { id: 4, action: "Document validated", detail: "Concrete Mix Design Report — Pre-Approved (93%)", time: "5 hours ago", type: "success" as const, user: "AI System" },
  { id: 5, action: "Document uploaded", detail: "Elevator Specifications.pdf uploaded", time: "6 hours ago", type: "info" as const, user: "James Chen" },
  { id: 6, action: "AI processing complete", detail: "12 documents analyzed in 4m 23s", time: "6 hours ago", type: "info" as const, user: "AI System" },
  { id: 7, action: "Comment added", detail: "Plumbing Fixture Schedule — Verify GPM rating", time: "7 hours ago", type: "warning" as const, user: "Emily Rodriguez" },
  { id: 8, action: "Document approved", detail: "Electrical Panel Schedule — Approved with notes", time: "8 hours ago", type: "success" as const, user: "Sarah Wilson" },
];

// Mock project specification documents — UCD naming convention
const mockProjectSpecs = [
  { id: "ps-1", fileName: "UCD_Project9592330_Project_Specification_Volume_1_2026-02.pdf", fileType: "pdf" as const, fileSize: 16482304, uploadedAt: "2026-02-05T09:00:00Z", totalPages: 342 },
  { id: "ps-2", fileName: "UCD_Project9592330_Project_Specification_Volume_2_2026-02.pdf", fileType: "pdf" as const, fileSize: 13107200, uploadedAt: "2026-02-05T09:05:00Z", totalPages: 278 },
];

// Mock Material matrix files — split into current (active) and historical
const currentMaterialFiles = [
  { id: "mig-7", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v3.csv", fileType: "csv" as const, fileSize: 548864, uploadedAt: "2026-02-18T10:30:00Z", trade: "Plumbing", version: "v3" },
  { id: "mig-8", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v3.csv", fileType: "csv" as const, fileSize: 516096, uploadedAt: "2026-02-18T10:35:00Z", trade: "Heating", version: "v3" },
  { id: "mig-9", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v3.csv", fileType: "csv" as const, fileSize: 483328, uploadedAt: "2026-02-18T10:40:00Z", trade: "Mechanical", version: "v3" },
];

const historicalMaterialFiles = [
  { id: "mig-1", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv", fileType: "csv" as const, fileSize: 524288, uploadedAt: "2026-02-05T10:00:00Z", version: "v1", processedAt: "2026-02-06T14:00:00Z", confidence: 72 },
  { id: "mig-2", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v1.csv", fileType: "csv" as const, fileSize: 491520, uploadedAt: "2026-02-05T10:05:00Z", version: "v1", processedAt: "2026-02-06T14:05:00Z", confidence: 68 },
  { id: "mig-3", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv" as const, fileSize: 458752, uploadedAt: "2026-02-05T10:10:00Z", version: "v1", processedAt: "2026-02-06T14:10:00Z", confidence: 75 },
  { id: "mig-4", fileName: "UCD_Project9592330_Plumbing_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 537600, uploadedAt: "2026-02-10T10:15:00Z", version: "v2", processedAt: "2026-02-11T09:00:00Z", confidence: 81 },
  { id: "mig-5", fileName: "UCD_Project9592330_Heating_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 503808, uploadedAt: "2026-02-10T10:20:00Z", version: "v2", processedAt: "2026-02-11T09:05:00Z", confidence: 78 },
  { id: "mig-6", fileName: "UCD_Project9592330_Mechanical_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 471040, uploadedAt: "2026-02-10T10:25:00Z", version: "v2", processedAt: "2026-02-11T09:10:00Z", confidence: 83 },
];

interface MockUploadFile {
  id: string;
  name: string;
  size: string;
}

/* -------------------------------------------------------------------------- */
/*  Project Specifications Section — with preview, download, multi-select,     */
/*  export, and re-upload                                                      */
/* -------------------------------------------------------------------------- */

function ProjectSpecificationsCard({
  onPreview,
}: {
  onPreview: (spec: typeof mockProjectSpecs[number]) => void;
}) {
  const [selectedSpecIds, setSelectedSpecIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const allSelected = mockProjectSpecs.length > 0 && selectedSpecIds.size === mockProjectSpecs.length;

  const toggleSpec = (specId: string) => {
    setSelectedSpecIds((prev) => {
      const next = new Set(prev);
      if (next.has(specId)) next.delete(specId);
      else next.add(specId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedSpecIds(new Set());
    } else {
      setSelectedSpecIds(new Set(mockProjectSpecs.map((s) => s.id)));
    }
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 2500);
    }, 1500);
  };

  return (
    <>
      <div className="rounded-xl border bg-card shadow-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-sm">Project Specifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Export button — visible when specs are selected */}
            {selectedSpecIds.size > 0 && (
              <Button
                size="sm"
                className="h-7 text-xs gap-1 gradient-action text-white border-0 hover:opacity-90 transition-opacity"
                onClick={handleExport}
                disabled={exporting}
                aria-label={`Export ${selectedSpecIds.size} selected specification${selectedSpecIds.size !== 1 ? "s" : ""}`}
              >
                {exporting ? (
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                ) : exportComplete ? (
                  <Check className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <Download className="h-3 w-3" aria-hidden="true" />
                )}
                {exportComplete ? "Exported!" : `Export (${selectedSpecIds.size})`}
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">
              {mockProjectSpecs.length} {mockProjectSpecs.length === 1 ? "file" : "files"}
            </Badge>
          </div>
        </div>

        {/* Select all bar */}
        {mockProjectSpecs.length > 0 && (
          <div className="px-5 py-2 border-b bg-muted/20 flex items-center justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                className="h-3.5 w-3.5"
                aria-label={allSelected ? "Deselect all specifications" : "Select all specifications"}
              />
              <span className="text-xs text-muted-foreground">Select all</span>
            </label>
            {selectedSpecIds.size > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {selectedSpecIds.size} of {mockProjectSpecs.length} selected
              </span>
            )}
          </div>
        )}

        {/* Spec document list */}
        <div className="divide-y" role="list" aria-label="Project specification documents">
          {mockProjectSpecs.map((spec) => {
            const FileIcon = fileIconMap[spec.fileType] ?? FileText;
            const isChecked = selectedSpecIds.has(spec.id);

            return (
              <div
                key={spec.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors group/spec",
                  isChecked && "bg-nav-accent/5"
                )}
                role="listitem"
              >
                {/* Checkbox */}
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleSpec(spec.id)}
                  aria-label={`Select ${spec.fileName}`}
                  className="shrink-0"
                />

                {/* File icon */}
                <div className="h-9 w-9 rounded-lg bg-ds-primary-100 flex items-center justify-center shrink-0">
                  <FileIcon className="h-4 w-4 text-ds-primary-800" aria-hidden="true" />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{spec.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">
                      {formatFileSize(spec.fileSize)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Uploaded {new Date(spec.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Preview button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground/0 group-hover/spec:text-muted-foreground hover:!text-primary transition-colors"
                  onClick={() => onPreview(spec)}
                  aria-label={`Preview ${spec.fileName}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material Matrix Section                                                */
/* -------------------------------------------------------------------------- */

function MaterialIndexGridCard({
  onUpload,
  onFileClick,
  onHistoryFileClick,
  versionId,
}: {
  onUpload: () => void;
  onFileClick?: (fileId: string) => void;
  onHistoryFileClick?: (fileId: string) => void;
  versionId: string;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [approvedFileIds, setApprovedFileIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(`submittal-approved-files-${versionId}`);
    if (stored) {
      try {
        setApprovedFileIds(new Set(JSON.parse(stored) as string[]));
      } catch {
        // ignore malformed localStorage
      }
    }
  }, [versionId]);

  const files = currentMaterialFiles;
  const allSelected = files.length > 0 && selectedIds.size === files.length;

  const toggleFile = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(files.map((f) => f.id)));
    }
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 2500);
    }, 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="font-semibold text-sm">Material Matrix</h3>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              className="h-7 text-xs gap-1 gradient-action text-white border-0 hover:opacity-90 transition-opacity"
              onClick={handleExport}
              disabled={exporting}
              aria-label={`Export ${selectedIds.size} selected file${selectedIds.size !== 1 ? "s" : ""}`}
            >
              {exporting ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : exportComplete ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Download className="h-3 w-3" aria-hidden="true" />
              )}
              {exportComplete ? "Exported!" : `Export (${selectedIds.size})`}
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            {files.length} {files.length === 1 ? "file" : "files"}
          </Badge>
          <Button
            size="sm"
            className={cn(
              "h-7 text-xs gap-1 gradient-accent text-white border-0 hover:opacity-90 transition-opacity",
              selectedIds.size > 0 && "opacity-50 pointer-events-none"
            )}
            onClick={onUpload}
            disabled={selectedIds.size > 0}
            aria-label="Re-upload files — replaces active files"
          >
            <Upload className="h-3 w-3" aria-hidden="true" />
            Re-upload
          </Button>
        </div>
      </div>

      {/* Select all bar */}
      {files.length > 0 && (
        <div className="px-5 py-2 border-b bg-muted/20 flex items-center justify-between">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              className="h-3.5 w-3.5"
              aria-label={allSelected ? "Deselect all files" : "Select all files"}
            />
            <span className="text-xs text-muted-foreground">Select all</span>
          </label>
          {selectedIds.size > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {selectedIds.size} of {files.length} selected
            </span>
          )}
        </div>
      )}

      {/* Active file list */}
      <div className="divide-y" role="list" aria-label="Material matrix files">
        {files.map((file) => {
          const FileIcon = fileIconMap[file.fileType] ?? FileText;
          const isChecked = selectedIds.has(file.id);

          return (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer group/row",
                isChecked && "bg-nav-accent/5"
              )}
              role="listitem"
              onClick={() => onFileClick?.(file.id)}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleFile(file.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${file.fileName}`}
                className="shrink-0"
              />
              <div className="h-9 w-9 rounded-lg bg-status-pre-approved-bg flex items-center justify-center shrink-0">
                <FileIcon className="h-4 w-4 text-status-pre-approved" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.fileName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">
                    {formatFileSize(file.fileSize)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(file.uploadedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              {/* Trade pill */}
              {file.trade && (
                <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:ring-slate-700 shrink-0">
                  {file.trade}
                </span>
              )}
              {/* Revision badge */}
              {file.version && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                  {file.version}
                </Badge>
              )}
              <Badge variant="secondary" className="text-[11px] px-1.5 py-0 h-4 bg-status-pre-approved-bg text-status-pre-approved shrink-0">
                {approvedFileIds.has(file.id) ? "Approved" : "Active"}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground/0 group-hover/row:text-muted-foreground transition-colors shrink-0" aria-hidden="true" />
            </div>
          );
        })}
      </div>

      {/* History section — collapsible */}
      {historicalMaterialFiles.length > 0 && (
        <>
          <button
            type="button"
            className="w-full flex items-center justify-between gap-2 px-5 py-3 border-t bg-muted/20 hover:bg-muted/40 transition-colors text-left"
            onClick={() => setHistoryOpen((prev) => !prev)}
            aria-expanded={historyOpen}
            aria-controls="history-file-list"
          >
            <span className="flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs font-semibold text-muted-foreground">History</span>
              <Badge variant="secondary" className="text-[10px]">
                {historicalMaterialFiles.length}
              </Badge>
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                historyOpen && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>

          {historyOpen && (
            <div id="history-file-list" className="divide-y bg-muted/10" role="list" aria-label="Historical material matrix files">
              {historicalMaterialFiles.map((file) => {
                const FileIcon = fileIconMap[file.fileType] ?? FileText;

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer group/row"
                    role="listitem"
                    onClick={() => onHistoryFileClick?.(file.id)}
                  >
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 relative">
                      <FileIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Lock className="h-2.5 w-2.5 text-muted-foreground/60 absolute -bottom-0.5 -right-0.5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-muted-foreground">{file.fileName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{file.version}</Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {formatFileSize(file.fileSize)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Processed {new Date(file.processedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {file.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="secondary" className="text-[11px] bg-muted text-muted-foreground">
                        View Only
                      </Badge>
                      <Eye className="h-3.5 w-3.5 text-muted-foreground/0 group-hover/row:text-muted-foreground transition-colors" aria-hidden="true" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Insights Section — full-width stats bar                            */
/* -------------------------------------------------------------------------- */

function ProjectInsightsSection({
  project,
  confidenceSummary,
}: {
  project: { memberIds: string[]; createdAt: string; updatedAt: string };
  confidenceSummary: { total: number; preApproved: number; reviewRequired: number; actionMandatory: number };
}) {
  const totalDocs = confidenceSummary.total;

  // Compute how many days the project has been active
  const daysSinceCreation = Math.max(
    1,
    Math.floor(
      (new Date().getTime() - new Date(project.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const completedCount = confidenceSummary.preApproved;
  const outstandingCount = confidenceSummary.reviewRequired + confidenceSummary.actionMandatory;
  const completionPct = totalDocs > 0 ? Math.round((completedCount / totalDocs) * 100) : 0;

  return (
    <section
      className="rounded-xl border bg-card shadow-card overflow-hidden"
      aria-label="Project insights"
    >
      <div className="px-5 py-4 border-b flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 className="font-semibold text-sm">Project Insights</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-y lg:divide-y-0">
        {/* Stat 1: Completion Rate */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Completion Rate
          </p>
          <p className={cn("text-2xl font-bold", completionPct >= 80 ? "text-status-pre-approved" : completionPct >= 50 ? "text-status-review-required" : completionPct > 0 ? "text-status-action-mandatory" : "text-muted-foreground")}>
            {totalDocs > 0 ? `${completionPct}%` : "Pending"}
          </p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                completionPct >= 80
                  ? "bg-status-pre-approved"
                  : completionPct >= 50
                    ? "bg-status-review-required"
                    : completionPct > 0
                      ? "bg-status-action-mandatory"
                      : "bg-muted-foreground/30"
              )}
              style={{ width: totalDocs > 0 ? `${completionPct}%` : "0%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalDocs > 0
              ? `${completedCount} completed · ${outstandingCount} outstanding`
              : "Awaiting AI processing"}
          </p>
        </div>

        {/* Stat 2: Validation Status — breakdown badges */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Validation Status
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-status-pre-approved">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Pre-Approved
              </span>
              <span className="text-sm font-bold">{confidenceSummary.preApproved}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-status-review-required">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Review Required
              </span>
              <span className="text-sm font-bold">{confidenceSummary.reviewRequired}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-status-action-mandatory">
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Action Required
              </span>
              <span className="text-sm font-bold">{confidenceSummary.actionMandatory}</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Project Timeline */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Project Timeline
          </p>
          <p className="text-lg font-bold">
            {daysSinceCreation}{" "}
            <span className="text-sm font-normal text-muted-foreground">days</span>
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" aria-hidden="true" />
              {project.memberIds.length} member{project.memberIds.length !== 1 ? "s" : ""}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <span>
              Updated{" "}
              {new Date(project.updatedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Since {new Date(project.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function VersionOverviewPage() {
  const { project, version } = useWorkspace();
  const router = useRouter();
  const { confidenceSummary } = version;

  // Upload dialog state (for Conformance)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<MockUploadFile[]>([]);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [uploading, setUploading] = useState(false);

  // PDF preview state for Project Specifications
  const [previewSpec, setPreviewSpec] = useState<typeof mockProjectSpecs[number] | null>(null);

  // Edit Sheet state for Project Details
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editJobId, setEditJobId] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("in_progress");
  const [editProjectManager, setEditProjectManager] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editArchitect, setEditArchitect] = useState("");
  const [editEngineer, setEditEngineer] = useState("");
  const [editRevisedDate, setEditRevisedDate] = useState("");
  const [editRevisionNumber, setEditRevisionNumber] = useState("");
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editPriority, setEditPriority] = useState<"high" | "medium" | "low">("high");
  const [editProjectType, setEditProjectType] = useState<ProjectType>("dr");

  // View More/Less toggle for Project Details card
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const startDetailEdit = () => {
    setEditName(project.name);
    setEditClient(project.client);
    setEditJobId(project.jobId);
    setEditLocation(project.location);
    setEditStatus(project.status);
    setEditPriority(project.priority);
    setEditProjectType(project.projectType);
    setEditProjectManager(
      project.projectManager === "__custom__"
        ? project.projectManagerCustom ?? ""
        : mockUsers.find((u) => u.id === project.projectManager)?.name ?? ""
    );
    setEditOwner(project.owner ?? "");
    setEditArchitect(project.architect ?? "");
    setEditEngineer(project.engineer ?? "");
    setEditRevisedDate(project.revisedDate ?? "");
    setEditRevisionNumber(project.revisionNumber ?? "");
    setEditCustomerId(project.customerId ?? "");
    setEditSheetOpen(true);
  };

  const saveDetailEdit = () => {
    // Mock save — in production this would call an API
    setEditSheetOpen(false);
  };

  const cancelDetailEdit = () => {
    setEditSheetOpen(false);
  };

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "in_progress", label: "In Progress" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" },
  ];

  const confidence = confidenceSummary.overallConfidence;
  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-muted-foreground";

  // Conformance upload handlers
  const handleSimulateUpload = () => {
    const batch: MockUploadFile[] = [
      { id: `up-${uploadCounter}`, name: "UCD_HobbsVet_Electrical_Matrix_Index_Grid_v1.csv", size: "480 KB" },
      { id: `up-${uploadCounter + 1}`, name: "UCD_HobbsVet_Fire_Protection_Matrix_Index_Grid_v1.csv", size: "320 KB" },
    ];
    setUploadCounter((c) => c + 2);
    setUploadFiles((prev) => [...prev, ...batch]);
  };

  const handleAddOneMore = () => {
    setUploadFiles((prev) => [
      ...prev,
      { id: `up-${uploadCounter}`, name: `UCD_Additional_Matrix_Index_Grid_${uploadCounter + 1}.csv`, size: "256 KB" },
    ]);
    setUploadCounter((c) => c + 1);
  };

  const handleRemoveUploadFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirmUpload = () => {
    const fileCount = uploadFiles.length;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadDialogOpen(false);
      setUploadFiles([]);
      toast.success(`${fileCount} file${fileCount !== 1 ? "s" : ""} uploaded successfully`, {
        description: "Files have been queued for AI processing.",
      });
    }, 1200);
  };


  return (
    <div className="absolute inset-0 flex flex-col">
    <div className="flex-1 overflow-auto">
    <main className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Project Insights — full-width stats section */}
      <ProjectInsightsSection
        project={project}
        confidenceSummary={confidenceSummary}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Material Matrix (top) + Project Specifications (bottom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Material Matrix — current + history */}
          <MaterialIndexGridCard
            onUpload={() => setUploadDialogOpen(true)}
            onFileClick={() => {
              router.push(`/projects/${project.id}/versions/${version.id}/review`);
            }}
            onHistoryFileClick={() => {
              router.push(`/projects/${project.id}/versions/${version.id}/review?mode=readonly`);
            }}
            versionId={version.id}
          />

          {/* Project Specifications — at the bottom */}
          <ProjectSpecificationsCard
            onPreview={(spec) => setPreviewSpec(spec)}
          />
        </div>

        {/* Right column — Project Details + Activity (sticky sidebar) */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Project Details Card — view only, edit via Sheet */}
          <div className="rounded-xl border bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                Project Details
              </h3>
              <button
                type="button"
                onClick={startDetailEdit}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2 py-1.5 transition-all cursor-pointer group"
                aria-label="Edit project details"
              >
                <Pencil className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Edit</span>
              </button>
            </div>

            {/* General Information — always visible */}
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  Job ID
                </span>
                <span className="font-medium">{project.jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  Location
                </span>
                <span className="font-medium">{project.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  Project Type
                </span>
                <span className="font-medium">{project.projectType === "dr" ? "Discrepancy Report" : "Design Job"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Project Manager
                </span>
                <span className="font-medium">
                  {project.projectManager === "__custom__"
                    ? project.projectManagerCustom ?? "—"
                    : mockUsers.find((u) => u.id === project.projectManager)?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                  Overall Score
                </span>
                <span className={cn("font-bold", confidenceColor)}>
                  {confidence > 0 ? formatPercentage(confidence) : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  Team Members
                </span>
                <span className="font-medium">{project.memberIds.length}</span>
              </div>
            </div>

            {/* Expanded: Additional Details */}
            {detailsExpanded && (
              <div className="space-y-2.5 text-sm mt-4 pt-4 border-t border-border/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Additional Details</p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Created
                  </span>
                  <time className="font-medium" dateTime={version.createdAt}>
                    {new Date(version.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </time>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Last Updated
                  </span>
                  <time className="font-medium" dateTime={version.updatedAt}>
                    {new Date(version.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </time>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                    Priority
                  </span>
                  <span className="font-medium capitalize">{project.priority}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Owner
                  </span>
                  <span className="font-medium">{project.owner || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Architect
                  </span>
                  <span className="font-medium">{project.architect || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Engineer
                  </span>
                  <span className="font-medium">{project.engineer || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    Revised Date
                  </span>
                  <span className="font-medium">
                    {project.revisedDate
                      ? new Date(project.revisedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                    Revision #
                  </span>
                  <span className="font-medium">{project.revisionNumber || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                    Customer ID
                  </span>
                  <span className="font-medium">{project.customerId || "—"}</span>
                </div>
              </div>
            )}

            {/* View More / View Less toggle */}
            <button
              type="button"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mt-4 pt-3 border-t cursor-pointer transition-colors"
            >
              {detailsExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  View Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  View More
                </>
              )}
            </button>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border bg-card shadow-card p-5 overflow-hidden">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Recent Activity
            </h3>
            <ScrollArea className="max-h-[280px]">
              <div className="space-y-3 pr-2">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={cn(
                      "mt-0.5 h-2 w-2 rounded-full shrink-0",
                      activity.type === "success" && "bg-status-pre-approved",
                      activity.type === "warning" && "bg-status-review-required",
                      activity.type === "error" && "bg-status-action-mandatory",
                      activity.type === "info" && "bg-primary",
                    )} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{activity.action}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{activity.detail}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-primary">{activity.user}</span>
                        <span className="text-[11px] text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Processing Progress — show only when version is processing */}
      {version.processingProgress && (
        <div className="rounded-xl border bg-card shadow-card p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
            Processing Status
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={version.processingProgress.percentComplete} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full gradient-accent transition-all"
                style={{
                  width: `${version.processingProgress.percentComplete}%`,
                }}
              />
            </div>
            <span className="text-sm font-bold text-primary">
              {version.processingProgress.percentComplete}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Step {version.processingProgress.stepsCompleted} of {version.processingProgress.totalSteps}: {version.processingProgress.currentStep}
          </p>
          {version.processingProgress.log.length > 0 && (
            <div className="mt-3 rounded-lg bg-muted/50 p-3 max-h-40 overflow-y-auto">
              {version.processingProgress.log.map((entry, i) => (
                <div key={i} className="flex gap-2 text-[11px] py-0.5">
                  <span className="text-muted-foreground/60 font-mono shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })}
                  </span>
                  <span className={cn(
                    entry.level === "success" && "text-status-pre-approved",
                    entry.level === "warning" && "text-status-review-required",
                    entry.level === "error" && "text-status-action-mandatory",
                    entry.level === "info" && "text-muted-foreground",
                  )}>
                    {entry.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  Upload Files Dialog (Conformance)                            */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Add new documents to {version.name}. Files will be queued for AI processing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 min-w-0 overflow-hidden">
            {uploadFiles.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed border-muted-foreground/40 p-8 text-center hover:border-nav-accent/40 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 outline-none"
                onClick={handleSimulateUpload}
                role="button"
                tabIndex={0}
                aria-label="Click to select files for upload"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSimulateUpload();
                  }
                }}
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium">Click to select files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  CSV files — up to 50MB each
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can select multiple files
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <ScrollArea className="max-h-[240px] -mx-1">
                  <div className="flex flex-col gap-2 px-1 py-1" role="list" aria-label="Files to upload">
                    {uploadFiles.map((file) => {
                      const ext = file.name.split(".").pop()?.toLowerCase() ?? "other";
                      return (
                        <div key={file.id} role="listitem" className="min-w-0">
                          <FileUploadCard
                            name={file.name}
                            size={file.size}
                            type={ext}
                            onRemove={() => handleRemoveUploadFile(file.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {uploadFiles.length} file{uploadFiles.length !== 1 ? "s" : ""} selected
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleAddOneMore}
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    Add More
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setUploadDialogOpen(false); setUploadFiles([]); }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={uploadFiles.length === 0 || uploading}
              className="gradient-accent text-white border-0"
            >
              {uploading ? "Uploading..." : `Upload ${uploadFiles.length} File${uploadFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Viewer for Project Specifications */}
      <FullScreenPdfViewer
        open={!!previewSpec}
        onOpenChange={(open) => { if (!open) setPreviewSpec(null); }}
        title={previewSpec?.fileName ?? ""}
        subtitle="Project Specification"
        totalPages={previewSpec?.totalPages ?? 100}
      />

      {/* ------------------------------------------------------------------ */}
      {/*  Edit Project Details — Right-side Sheet                            */}
      {/* ------------------------------------------------------------------ */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[460px] flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b shrink-0">
            <SheetTitle className="text-base">Edit Project Details</SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-5">
            <div className="space-y-6">
              {/* Section: Project Information */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Project Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Company / Client</label>
                    <Input value={editClient} onChange={(e) => setEditClient(e.target.value)} className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Job ID</label>
                    <Input value={editJobId} onChange={(e) => setEditJobId(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as ProjectStatus)}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Priority</label>
                    <Select value={editPriority} onValueChange={(v) => setEditPriority(v as "high" | "medium" | "low")}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Type</label>
                    <Select value={editProjectType} onValueChange={(v) => setEditProjectType(v as ProjectType)}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dr">Discrepancy Report</SelectItem>
                        <SelectItem value="design_job">Design Job</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Manager</label>
                    <Input
                      value={editProjectManager}
                      onChange={(e) => setEditProjectManager(e.target.value)}
                      placeholder="Enter project manager name"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Section: Additional Details */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Additional Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Owner</label>
                    <Input value={editOwner} onChange={(e) => setEditOwner(e.target.value)} placeholder="Owner name" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Architect</label>
                    <Input value={editArchitect} onChange={(e) => setEditArchitect(e.target.value)} placeholder="Architect name" className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Engineer</label>
                    <Input value={editEngineer} onChange={(e) => setEditEngineer(e.target.value)} placeholder="Engineer name" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Customer ID</label>
                    <Input value={editCustomerId} onChange={(e) => setEditCustomerId(e.target.value)} placeholder="Manual entry" className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Revised Date</label>
                    <Input type="date" value={editRevisedDate} onChange={(e) => setEditRevisedDate(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Revision #</label>
                    <Input value={editRevisionNumber} onChange={(e) => setEditRevisionNumber(e.target.value)} placeholder="e.g. 3" className="h-9" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex items-center gap-2 shrink-0 bg-background">
            <Button size="sm" onClick={saveDetailEdit} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelDetailEdit}>
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

    </main>
    </div>

    {/* Sticky bottom CTA bar — consistent with confirmation/preview-cover pages */}
    <div className="shrink-0 border-t bg-background/95 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-end">
        <Button
          className="gradient-accent text-white border-0 gap-2 font-semibold px-6"
          onClick={() => router.push(`/projects/${project.id}/versions/${version.id}/review`)}
        >
          <BookOpen className="h-4 w-4" />
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    </div>
  );
}
