"use client";

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
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/providers/workspace-provider";
import { formatPercentage } from "@/lib/format";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { getValidationsByVersion } from "@/data/mock-validations";
import { cn } from "@/lib/utils";

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

export default function VersionOverviewPage() {
  const { project, version } = useWorkspace();
  const { confidenceSummary } = version;
  const documents = getDocumentsByVersion(version.id);
  const validations = getValidationsByVersion(version.id);

  const confidence = confidenceSummary.overallConfidence;
  const confidenceColor =
    confidence >= 80
      ? "text-status-pre-approved"
      : confidence >= 60
        ? "text-status-review-required"
        : confidence > 0
          ? "text-status-action-mandatory"
          : "text-muted-foreground";

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero Banner — simplified to 3 stats */}
      <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{version.name}</h2>
              <p className="text-white/70 text-sm mt-0.5">
                {project.name} — {version.specificationRef}
              </p>
            </div>
            <Button
              asChild
              className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
            >
              <Link href={`/projects/${project.id}/versions/${version.id}/review`}>
                <ArrowUpRight className="mr-1.5 h-4 w-4" />
                Open Conformance
              </Link>
            </Button>
          </div>

          {/* Compact stats — 3 items */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="h-3.5 w-3.5 text-nav-gold" />
                <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                  Conformance Records
                </span>
              </div>
              <p className="text-xl font-bold">{confidenceSummary.total}</p>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-nav-gold" />
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
                <Shield className="h-3.5 w-3.5 text-nav-gold" />
                <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">
                  Status
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                  <span className="font-bold">{confidenceSummary.preApproved}</span>
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-bold">{confidenceSummary.reviewRequired}</span>
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <XCircle className="h-3.5 w-3.5 text-red-400" />
                  <span className="font-bold">{confidenceSummary.actionMandatory}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conformance — card-based list */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Conformance</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {documents.length} files
            </Badge>
          </div>

          {documents.length > 0 ? (
            <div className="divide-y">
              {documents.map((doc) => {
                const validation = validations.find((v) => v.documentId === doc.id);
                const config = validation ? statusConfig[validation.status] : null;
                const StatusIcon = config?.icon;
                const FileIcon = fileIconMap[doc.fileType] ?? FileText;
                return (
                  <Link
                    key={doc.id}
                    href={`/projects/${project.id}/versions/${version.id}/review?item=${doc.id}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer group/doc"
                  >
                    <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
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
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">Pending</Badge>
                      )}
                      {validation ? (
                        <span className={cn("text-sm font-bold min-w-[3ch] text-right",
                          validation.confidenceScore >= 80 ? "text-status-pre-approved" :
                          validation.confidenceScore >= 60 ? "text-status-review-required" :
                          "text-status-action-mandatory"
                        )}>
                          {validation.confidenceScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground min-w-[3ch] text-right">—</span>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover/doc:text-muted-foreground transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Upload documents to start the AI validation process</p>
            </div>
          )}
        </div>

        {/* Right column — Version Details + Activity */}
        <div className="space-y-6">
          {/* Version Info Card */}
          <div className="rounded-xl border bg-card shadow-card p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-primary" />
              Version Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </span>
                <span className="font-medium">
                  {new Date(version.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Last Updated
                </span>
                <span className="font-medium">
                  {new Date(version.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Team Members
                </span>
                <span className="font-medium">{project.memberIds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Spec Reference
                </span>
                <span className="font-medium text-xs truncate max-w-[140px]">{version.specificationRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
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
              <Clock className="h-4 w-4 text-primary" />
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
                  )} />
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
            <BarChart3 className="h-4 w-4 text-primary" />
            Processing Status
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
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
                    {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
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
    </div>
  );
}
