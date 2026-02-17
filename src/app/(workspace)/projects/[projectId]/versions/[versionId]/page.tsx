"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  ArrowUpRight,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/providers/workspace-provider";
import { formatPercentage } from "@/lib/format";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { getValidationsByVersion } from "@/data/mock-validations";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                   */
/* -------------------------------------------------------------------------- */

const statusConfig = {
  pre_approved: { label: "Pre-Approved", color: "bg-status-pre-approved-bg text-status-pre-approved", icon: CheckCircle2 },
  review_required: { label: "Review Required", color: "bg-status-review-required-bg text-status-review-required", icon: AlertTriangle },
  action_mandatory: { label: "Action Mandatory", color: "bg-status-action-mandatory-bg text-status-action-mandatory", icon: XCircle },
};

const fileIconMap: Record<string, typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileType,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Mock recent activity for the version
const recentActivity = [
  { id: 1, action: "Document validated", detail: "Fire-Rated Gypsum Board — Pre-Approved (96%)", time: "2 hours ago", type: "success" as const },
  { id: 2, action: "Review flagged", detail: "Structural Steel Shop Drawings — Missing fireproofing details", time: "3 hours ago", type: "warning" as const },
  { id: 3, action: "Action required", detail: "HVAC Equipment Schedule — Chiller undersized by 50 tons", time: "4 hours ago", type: "error" as const },
  { id: 4, action: "Document validated", detail: "Concrete Mix Design Report — Pre-Approved (93%)", time: "5 hours ago", type: "success" as const },
  { id: 5, action: "Document uploaded", detail: "Elevator Specifications.pdf uploaded by James Chen", time: "6 hours ago", type: "info" as const },
  { id: 6, action: "AI processing complete", detail: "12 documents analyzed in 4m 23s", time: "6 hours ago", type: "info" as const },
];

// Mock project specification documents (source input from the client)
const mockProjectSpecs = [
  { id: "ps-1", fileName: "Project Specifications Rev A.pdf", fileType: "pdf" as const, fileSize: 15728640, uploadedAt: "2025-08-10T09:00:00Z" },
  { id: "ps-2", fileName: "Division 05 - Metals.pdf", fileType: "pdf" as const, fileSize: 4194304, uploadedAt: "2025-08-10T09:05:00Z" },
  { id: "ps-3", fileName: "Division 09 - Finishes.pdf", fileType: "pdf" as const, fileSize: 3145728, uploadedAt: "2025-08-10T09:10:00Z" },
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
  confidenceColor,
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
                Material Matrix
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
/*  Project Specifications Section                                             */
/* -------------------------------------------------------------------------- */

function ProjectSpecificationsCard() {
  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="font-semibold text-sm">Project Specifications</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {mockProjectSpecs.length} {mockProjectSpecs.length === 1 ? "file" : "files"}
        </Badge>
      </div>
      <div className="divide-y">
        {mockProjectSpecs.map((spec) => {
          const FileIcon = fileIconMap[spec.fileType] ?? FileText;
          return (
            <div
              key={spec.id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <FileIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
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
              <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                Source
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Material Matrix Section (formerly Conformance)                             */
/* -------------------------------------------------------------------------- */

function MaterialMatrixCard({
  documents,
  validations,
  projectId,
  versionId,
  onUpload,
}: {
  documents: ReturnType<typeof getDocumentsByVersion>;
  validations: ReturnType<typeof getValidationsByVersion>;
  projectId: string;
  versionId: string;
  onUpload: () => void;
}) {
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const allSelected = documents.length > 0 && selectedDocIds.size === documents.length;

  const toggleDoc = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedDocIds(new Set());
    } else {
      setSelectedDocIds(new Set(documents.map((d) => d.id)));
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
          {/* Export button — visible when documents are selected */}
          {selectedDocIds.size > 0 && (
            <Button
              size="sm"
              className="h-7 text-xs gap-1 gradient-gold text-white border-0 hover:opacity-90 transition-opacity"
              onClick={handleExport}
              disabled={exporting}
              aria-label={`Export ${selectedDocIds.size} selected document${selectedDocIds.size !== 1 ? "s" : ""}`}
            >
              {exporting ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              ) : exportComplete ? (
                <Check className="h-3 w-3" aria-hidden="true" />
              ) : (
                <Download className="h-3 w-3" aria-hidden="true" />
              )}
              {exportComplete ? "Exported!" : `Export (${selectedDocIds.size})`}
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            {documents.length} files
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

      {/* Select all bar — shown when documents exist */}
      {documents.length > 0 && (
        <div className="px-5 py-2 border-b bg-muted/20 flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-medium text-nav-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
            onClick={toggleAll}
            aria-label={allSelected ? "Deselect all documents" : "Select all documents"}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          {selectedDocIds.size > 0 && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {selectedDocIds.size} of {documents.length} selected
            </span>
          )}
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 ? (
        <div className="divide-y" role="list" aria-label="Material matrix documents">
          {documents.map((doc) => {
            const validation = validations.find((v) => v.documentId === doc.id);
            const config = validation ? statusConfig[validation.status] : null;
            const StatusIcon = config?.icon;
            const FileIcon = fileIconMap[doc.fileType] ?? FileText;
            const isChecked = selectedDocIds.has(doc.id);

            return (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors group/doc",
                  isChecked && "bg-nav-accent/5"
                )}
                role="listitem"
              >
                {/* Checkbox */}
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => {
                    setSelectedDocIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(doc.id)) next.delete(doc.id);
                      else next.add(doc.id);
                      return next;
                    });
                  }}
                  aria-label={`Select ${doc.fileName}`}
                  className="shrink-0"
                />

                {/* Clickable document link area */}
                <Link
                  href={`/projects/${projectId}/versions/${versionId}/review?item=${doc.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                    <FileIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono font-semibold text-nav-accent">
                        {doc.specSection}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatFileSize(doc.fileSize)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {config && StatusIcon ? (
                      <Badge variant="secondary" className={cn("text-[11px]", config.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                        {config.label}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px]">Pending</Badge>
                    )}
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover/doc:text-muted-foreground transition-colors" aria-hidden="true" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" aria-hidden="true" />
          <p className="text-sm font-medium text-muted-foreground">No documents uploaded yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Upload documents to start the AI validation process</p>
          <Button
            size="sm"
            className="mt-4 gap-1"
            onClick={onUpload}
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            Upload Files
          </Button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function VersionOverviewPage() {
  const { project, version } = useWorkspace();
  const { confidenceSummary } = version;
  const documents = getDocumentsByVersion(version.id);
  const validations = getValidationsByVersion(version.id);

  // Upload dialog state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<MockUploadFile[]>([]);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [uploading, setUploading] = useState(false);

  // New Version dialog state
  const [newVersionOpen, setNewVersionOpen] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [pullPrevious, setPullPrevious] = useState(true);
  const [creatingVersion, setCreatingVersion] = useState(false);

  const confidence = confidenceSummary.overallConfidence;
  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-muted-foreground";

  // Upload handlers
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

  // New version handler
  const handleCreateVersion = () => {
    setCreatingVersion(true);
    setTimeout(() => {
      setCreatingVersion(false);
      setNewVersionOpen(false);
      setVersionName("");
      setPullPrevious(true);
    }, 1200);
  };

  return (
    <main className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero Banner — no Open Conformance CTA */}
      <HeroBanner
        versionName={version.name}
        projectName={project.name}
        specRef={version.specificationRef}
        confidenceSummary={confidenceSummary}
        confidence={confidence}
        confidenceColor={confidenceColor}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Project Specs + Material Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Specifications */}
          <ProjectSpecificationsCard />

          {/* Material Matrix (formerly Conformance) — with multi-select + export */}
          <MaterialMatrixCard
            documents={documents}
            validations={validations}
            projectId={project.id}
            versionId={version.id}
            onUpload={() => setUploadDialogOpen(true)}
          />
        </div>

        {/* Right column — Version Details + Activity */}
        <div className="space-y-6">
          {/* Version Info Card */}
          <div className="rounded-xl border bg-card shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                Version Details
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setNewVersionOpen(true)}
              >
                <Layers className="h-3 w-3" aria-hidden="true" />
                New Version
              </Button>
            </div>
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
          <div className="rounded-xl border bg-card shadow-card p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              Recent Activity
            </h3>
            <div className="space-y-3">
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
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
      {/*  Upload Files Dialog                                                */}
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
      {/*  New Version Dialog                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={newVersionOpen} onOpenChange={setNewVersionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version for {project.name}. You can pull existing files from the current version.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Version Name</Label>
              <Input
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g., Resubmittal B"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Checkbox
                id="pull-prev"
                checked={pullPrevious}
                onCheckedChange={(checked) => setPullPrevious(checked === true)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="pull-prev" className="text-sm font-medium cursor-pointer">
                  Pull files from current version
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Copy {documents.length} file{documents.length !== 1 ? "s" : ""} from &ldquo;{version.name}&rdquo; as a starting point
                </p>
              </div>
            </div>

            {/* Upload new files for version */}
            <div
              className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Upload additional files for the new version"
            >
              <Upload className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium">Upload additional files</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, XLSX, DOCX up to 50MB each
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewVersionOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateVersion}
              disabled={!versionName.trim() || creatingVersion}
              className="gradient-gold text-white border-0"
            >
              {creatingVersion ? "Creating..." : "Create Version"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
