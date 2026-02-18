"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Clock,
  FileType,
  TrendingUp,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/providers/workspace-provider";
import { formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";

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

// Mock Material Index Grid source files — 3 CSV files
const mockMaterialIndexGridFiles = [
  { id: "mig-1", fileName: "UCD_Project9592330_Plumbing_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 524288, uploadedAt: "2026-02-05T10:00:00Z" },
  { id: "mig-2", fileName: "UCD_Project9592330_Heating_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 491520, uploadedAt: "2026-02-05T10:05:00Z" },
  { id: "mig-3", fileName: "UCD_Project9592330_Mechanical_Matrix_Index_Grid_2026-02.csv", fileType: "csv" as const, fileSize: 458752, uploadedAt: "2026-02-05T10:10:00Z" },
];

interface MockUploadFile {
  id: string;
  name: string;
  size: string;
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

function HeroBanner({
  versionName,
  projectName,
  specRef,
  confidenceSummary,
  confidence,
}: {
  versionName: string;
  projectName: string;
  specRef: string;
  confidenceSummary: { total: number; preApproved: number; reviewRequired: number; actionMandatory: number };
  confidence: number;
  confidenceColor: string;
}) {
  return (
    <section
      className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden"
      aria-label="Version overview"
    >
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
      <div className="relative">
        <div>
          <h2 className="text-xl font-bold">{versionName}</h2>
          <p className="text-white/80 text-sm mt-0.5">
            {projectName} — {specRef}
          </p>
        </div>

        {/* Compact stats — 3 items */}
        <div className="grid grid-cols-3 gap-4 mt-5" role="group" aria-label="Version statistics">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-nav-gold" aria-hidden="true" />
              <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                Material Index Grid
              </span>
            </div>
            <p className="text-xl font-bold">{confidenceSummary.total}</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-nav-gold" aria-hidden="true" />
              <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                Confidence
              </span>
            </div>
            <p className="text-xl font-bold">
              {confidence > 0 ? `${confidence}%` : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-nav-gold" aria-hidden="true" />
              <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                Status
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-sm" aria-label={`${confidenceSummary.preApproved} pre-approved`}>
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
                <span className="font-bold">{confidenceSummary.preApproved}</span>
              </span>
              <span className="flex items-center gap-1 text-sm" aria-label={`${confidenceSummary.reviewRequired} review required`}>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span className="font-bold">{confidenceSummary.reviewRequired}</span>
              </span>
              <span className="flex items-center gap-1 text-sm" aria-label={`${confidenceSummary.actionMandatory} action mandatory`}>
                <XCircle className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                <span className="font-bold">{confidenceSummary.actionMandatory}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Specifications Section — with preview, download, multi-select,     */
/*  export, and re-upload                                                      */
/* -------------------------------------------------------------------------- */

function ProjectSpecificationsCard({
  onReUpload,
}: {
  onReUpload: () => void;
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
                className="h-7 text-xs gap-1 gradient-gold text-white border-0 hover:opacity-90 transition-opacity"
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
            <Button
              size="sm"
              className="h-7 text-xs gap-1 gradient-accent text-white border-0 hover:opacity-90"
              onClick={onReUpload}
              aria-label="Upload specification documents"
            >
              <Upload className="h-3 w-3" aria-hidden="true" />
              Upload
            </Button>
          </div>
        </div>

        {/* Select all bar */}
        {mockProjectSpecs.length > 0 && (
          <div className="px-5 py-2 border-b bg-muted/20 flex items-center justify-between">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              className="h-3.5 w-3.5"
              aria-label={allSelected ? "Deselect all specifications" : "Select all specifications"}
            />
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
                <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <FileIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
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

              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material Index Grid Section                                                */
/* -------------------------------------------------------------------------- */

function MaterialIndexGridCard({
  onUpload,
}: {
  onUpload: () => void;
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const files = mockMaterialIndexGridFiles;
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
          <h3 className="font-semibold text-sm">Material Index Grid</h3>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              className="h-7 text-xs gap-1 gradient-gold text-white border-0 hover:opacity-90 transition-opacity"
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
            {files.length} files
          </Badge>
          <Button
            size="sm"
            className="h-7 text-xs gap-1 gradient-accent text-white border-0 hover:opacity-90"
            onClick={onUpload}
            aria-label="Upload new files"
          >
            <Upload className="h-3 w-3" aria-hidden="true" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Select all bar */}
      {files.length > 0 && (
        <div className="px-5 py-2 border-b bg-muted/20 flex items-center justify-between">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            className="h-3.5 w-3.5"
            aria-label={allSelected ? "Deselect all files" : "Select all files"}
          />
          {selectedIds.size > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {selectedIds.size} of {files.length} selected
            </span>
          )}
        </div>
      )}

      {/* File list */}
      <div className="divide-y" role="list" aria-label="Material index grid source files">
        {files.map((file) => {
          const FileIcon = fileIconMap[file.fileType] ?? FileText;
          const isChecked = selectedIds.has(file.id);

          return (
            <div
              key={file.id}
              className={cn(
                "flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors",
                isChecked && "bg-nav-accent/5"
              )}
              role="listitem"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleFile(file.id)}
                aria-label={`Select ${file.fileName}`}
                className="shrink-0"
              />
              <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <FileIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function VersionOverviewPage() {
  const { project, version } = useWorkspace();
  const { confidenceSummary } = version;

  // Upload dialog state (for Material Index Grid)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<MockUploadFile[]>([]);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Re-upload dialog for Project Specifications
  const [specUploadOpen, setSpecUploadOpen] = useState(false);
  const [specUploadFiles, setSpecUploadFiles] = useState<MockUploadFile[]>([]);
  const [specUploadCounter, setSpecUploadCounter] = useState(0);
  const [specUploading, setSpecUploading] = useState(false);

  const confidence = confidenceSummary.overallConfidence;
  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-muted-foreground";

  // Material Index Grid upload handlers
  const handleSimulateUpload = () => {
    const batch: MockUploadFile[] = [
      { id: `up-${uploadCounter}`, name: "New_Submittal_Document.pdf", size: "3.2 MB" },
      { id: `up-${uploadCounter + 1}`, name: "Updated_Equipment_Schedule.xlsx", size: "1.5 MB" },
    ];
    setUploadCounter((c) => c + 2);
    setUploadFiles((prev) => [...prev, ...batch]);
  };

  const handleAddOneMore = () => {
    setUploadFiles((prev) => [
      ...prev,
      { id: `up-${uploadCounter}`, name: `Additional_File_${uploadCounter + 1}.pdf`, size: "1.0 MB" },
    ]);
    setUploadCounter((c) => c + 1);
  };

  const handleRemoveUploadFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirmUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadDialogOpen(false);
      setUploadFiles([]);
    }, 1200);
  };

  // Spec re-upload handlers
  const handleSimulateSpecUpload = () => {
    const batch: MockUploadFile[] = [
      { id: `spec-${specUploadCounter}`, name: "Project Specifications - Volume 4.pdf", size: "8.5 MB" },
    ];
    setSpecUploadCounter((c) => c + 1);
    setSpecUploadFiles((prev) => [...prev, ...batch]);
  };

  const handleAddOneMoreSpec = () => {
    setSpecUploadFiles((prev) => [
      ...prev,
      { id: `spec-${specUploadCounter}`, name: `Additional_Spec_Volume_${specUploadCounter + 1}.pdf`, size: "5.0 MB" },
    ]);
    setSpecUploadCounter((c) => c + 1);
  };

  const handleRemoveSpecFile = (id: string) => {
    setSpecUploadFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConfirmSpecUpload = () => {
    setSpecUploading(true);
    setTimeout(() => {
      setSpecUploading(false);
      setSpecUploadOpen(false);
      setSpecUploadFiles([]);
    }, 1200);
  };

  return (
    <div className="h-full overflow-auto">
    <main className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero Banner */}
      <HeroBanner
        versionName={version.name}
        projectName={project.name}
        specRef={version.specificationRef}
        confidenceSummary={confidenceSummary}
        confidence={confidence}
        confidenceColor={confidenceColor}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Material Index Grid (top) + Project Specifications (bottom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Material Index Grid — at the top */}
          <MaterialIndexGridCard
            onUpload={() => setUploadDialogOpen(true)}
          />

          {/* Project Specifications — at the bottom */}
          <ProjectSpecificationsCard
            onReUpload={() => setSpecUploadOpen(true)}
          />
        </div>

        {/* Right column — Version Details + Activity (sticky sidebar) */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Version Info Card */}
          <div className="rounded-xl border bg-card shadow-card p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              Version Details
            </h3>
            <div className="space-y-3 text-sm">
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
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  Team Members
                </span>
                <span className="font-medium">{project.memberIds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Spec Reference
                </span>
                <span className="font-medium text-xs truncate max-w-[140px]">{version.specificationRef}</span>
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
            </div>
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
                        <span className="text-[10px] font-medium text-primary/70">{activity.user}</span>
                        <span className="text-[10px] text-muted-foreground/60">{activity.time}</span>
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
      {/*  Upload Files Dialog (Material Index Grid)                            */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Add new documents to {version.name}. Files will be queued for AI processing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {uploadFiles.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center hover:border-nav-accent/40 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 outline-none"
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
                  PDF, Excel, Word — up to 50MB each
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can select multiple files
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <ScrollArea className={uploadFiles.length > 4 ? "h-[180px]" : ""}>
                  <div className="space-y-2 pr-2">
                    {uploadFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10"
                      >
                        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveUploadFile(file.id)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    ))}
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

      {/* ------------------------------------------------------------------ */}
      {/*  Re-upload Specifications Dialog                                    */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={specUploadOpen} onOpenChange={setSpecUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Specifications</DialogTitle>
            <DialogDescription>
              Upload updated or additional project specification documents.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {specUploadFiles.length === 0 ? (
              <div
                className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center hover:border-nav-accent/40 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 outline-none"
                onClick={handleSimulateSpecUpload}
                role="button"
                tabIndex={0}
                aria-label="Click to select specification files"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSimulateSpecUpload();
                  }
                }}
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-sm font-medium">Click to select specification files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF files — up to 50MB each
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  These will be added alongside existing specifications
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <ScrollArea className={specUploadFiles.length > 4 ? "h-[180px]" : ""}>
                  <div className="space-y-2 pr-2">
                    {specUploadFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/10"
                      >
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveSpecFile(file.id)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {specUploadFiles.length} file{specUploadFiles.length !== 1 ? "s" : ""} selected
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleAddOneMoreSpec}
                  >
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    Add More
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setSpecUploadOpen(false); setSpecUploadFiles([]); }}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSpecUpload}
              disabled={specUploadFiles.length === 0 || specUploading}
              className="gradient-accent text-white border-0"
            >
              {specUploading ? "Uploading..." : `Upload ${specUploadFiles.length} File${specUploadFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
    </div>
  );
}
