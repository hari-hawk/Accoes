"use client";

import { useState } from "react";
import {
  Send,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenPdfViewer, type Citation } from "@/components/documents/full-screen-pdf-viewer";
import { mockUsers } from "@/data/mock-users";
import { getActivityLogsByProject } from "@/data/mock-activity-logs";
import { getProjectComments } from "@/data/mock-project-comments";
import { cn } from "@/lib/utils";
import type { MaterialItem } from "@/hooks/use-materials";
import type {
  DecisionStatus,
  ValidationCategory,
  ValidationResult,
} from "@/data/types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
}

/* -------------------------------------------------------------------------- */
/*  Project Specifications (PS) Tab Content                                    */
/* -------------------------------------------------------------------------- */

function PSTabContent({
  validation,
  onOpenPdf,
}: {
  validation: ValidationResult;
  onOpenPdf: (highlightText: string, page: number) => void;
}) {
  const isMatch = validation.status === "pre_approved";
  const isPartial = validation.status === "review_required";

  return (
    <div className="space-y-5">
      {/* Match indicator */}
      <div className="flex items-center gap-2">
        {isMatch ? (
          <div className="flex items-center gap-2 text-status-pre-approved">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold">Matches Specification</span>
          </div>
        ) : isPartial ? (
          <div className="flex items-center gap-2 text-status-review-required">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">Partial Match</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-status-action-mandatory">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">Does Not Match</span>
          </div>
        )}
      </div>

      {/* AI Analysis card */}
      <div className="rounded-lg border p-4 space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          AI Analysis
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {validation.aiReasoning.summary}
        </p>
        {validation.aiReasoning.keyFindings.length > 0 && (
          <ul className="space-y-1.5 mt-2">
            {validation.aiReasoning.keyFindings.map((finding, i) => (
              <li
                key={i}
                className="text-xs text-foreground/70 flex items-start gap-2"
              >
                <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-primary" />
                {finding}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Relevant References */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            Relevant References ({validation.evidenceItems.length})
          </h4>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-7 text-xs">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value={validation.specReference.sectionNumber}>
                {validation.specReference.sectionNumber}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {validation.evidenceItems.map((ev) => (
          <div key={ev.id} className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {ev.sourceFileName}
              </span>
            </div>
            <p className="text-xs text-foreground/70 italic leading-relaxed">
              &ldquo;{ev.excerpt}&rdquo;
            </p>
            {ev.pageNumber && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5"
                onClick={() => onOpenPdf(ev.excerpt, ev.pageNumber!)}
              >
                <FileText className="h-3 w-3" />
                Page {ev.pageNumber}
              </Button>
            )}
          </div>
        ))}

        {/* Spec reference summary */}
        <div className="rounded-lg border p-3 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold">
              Section {validation.specReference.sectionNumber} —{" "}
              {validation.specReference.sectionTitle}
            </span>
          </div>
          <ul className="space-y-1">
            {validation.specReference.requirements.map((req, i) => (
              <li
                key={i}
                className="text-xs text-foreground/60 flex items-start gap-2"
              >
                <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-muted-foreground" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Project Index (PI) Tab Content — Stacked Match Cards                      */
/* -------------------------------------------------------------------------- */

function PITabContent({
  validation,
}: {
  validation: ValidationResult;
}) {
  const isMatch = validation.status === "pre_approved";
  const isPartial = validation.status === "review_required";
  const matchScore = (validation.confidenceScore / 100).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Match card(s) — stacked, not tabs */}
      <div className="rounded-lg border overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            {isMatch ? (
              <CheckCircle2 className="h-4 w-4 text-status-pre-approved" />
            ) : (
              <AlertTriangle
                className={cn(
                  "h-4 w-4",
                  isPartial
                    ? "text-status-review-required"
                    : "text-status-action-mandatory"
                )}
              />
            )}
            <span className="text-sm font-semibold">
              {isMatch
                ? "Matches Index"
                : isPartial
                  ? "Partial Match with Index"
                  : "Does Not Match Index"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Match Score: {matchScore}
          </span>
        </div>

        {/* 2-column data grid */}
        <div className="grid grid-cols-2 gap-px bg-border">
          <div className="bg-card px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Category
            </p>
            <p className="text-sm font-medium mt-1">
              {validation.specReference.sectionTitle.split(" — ")[0]}
            </p>
          </div>
          <div className="bg-card px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Sub Category
            </p>
            <p className="text-sm font-medium mt-1">
              {validation.specReference.sectionNumber}
            </p>
          </div>
          <div className="bg-card px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Size
            </p>
            <p className="text-sm font-medium mt-1">Standard</p>
          </div>
          <div className="bg-card px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Item Description
            </p>
            <p className="text-sm font-medium mt-1 line-clamp-2">
              {validation.aiReasoning.summary.slice(0, 60)}...
            </p>
          </div>
        </div>

        {/* Reason box */}
        <div
          className={cn(
            "px-4 py-3 border-t",
            isMatch
              ? "bg-status-pre-approved-bg/30"
              : isPartial
                ? "bg-status-review-required-bg/30"
                : "bg-status-action-mandatory-bg/30"
          )}
        >
          <p className="text-xs font-medium mb-1">Reason</p>
          <p className="text-xs text-foreground/70 leading-relaxed">
            {validation.aiReasoning.complianceAssessment}
          </p>
        </div>
      </div>

      {/* Additional match card if evidence contradicts */}
      {validation.evidenceItems.some((ev) => ev.relevance === "contradicts") && (
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-status-action-mandatory" />
              <span className="text-sm font-semibold">Discrepancy Found</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {validation.evidenceItems
              .filter((ev) => ev.relevance === "contradicts")
              .map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-lg bg-status-action-mandatory-bg/20 p-3"
                >
                  <p className="text-xs italic text-foreground/70">
                    &ldquo;{ev.excerpt}&rdquo;
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {ev.sourceFileName}
                    {ev.pageNumber && ` — p. ${ev.pageNumber}`}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Comments & Activity Side Panel                                             */
/* -------------------------------------------------------------------------- */

function CommentsActivityPanel({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const activityLogs = getActivityLogsByProject(projectId);
  const projectComments = getProjectComments(projectId);

  return (
    <div className="w-[320px] border-l flex flex-col h-full shrink-0" role="complementary" aria-label="Comments and activity panel">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <h3 className="text-sm font-semibold" id="comments-panel-title">Comments & Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onClose}
          aria-label="Close comments panel"
        >
          Close
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Activity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Activity
            </h4>
            {activityLogs.map((log) => {
              const user = mockUsers.find((u) => u.id === log.userId);
              return (
                <div key={log.id} className="flex gap-2.5">
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                    {user?.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
                    <AvatarFallback className="text-[8px] font-bold">
                      {user ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-medium">
                        {user?.name ?? "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {log.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Comments
            </h4>
            {projectComments.map((comment) => {
              const user = mockUsers.find((u) => u.id === comment.authorId);
              return (
                <div key={comment.id} className="flex gap-2.5">
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                    {user?.avatarUrl && (
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user?.name ?? ""}
                      />
                    )}
                    <AvatarFallback className="text-[8px] font-bold">
                      {user ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-medium">
                        {user?.name ?? "Unknown"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Comment input */}
      <div className="border-t p-3 shrink-0" role="form" aria-label="Add a comment">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && commentText.trim()) {
                setCommentText("");
              }
            }}
            className="flex-1 text-xs h-8"
            aria-label="Comment text"
          />
          <Button size="icon" className="h-8 w-8 shrink-0" aria-label="Send comment">
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Evidence Panel                                                        */
/* -------------------------------------------------------------------------- */

export function EvidencePanel({
  material,
  decision,
  onDecide,
  activeCategory = "overall",
  onCategoryChange,
  projectId,
}: {
  material: MaterialItem;
  decision?: DecisionStatus;
  onDecide: (decision: DecisionStatus) => void;
  activeCategory?: ValidationCategory;
  onCategoryChange?: (category: ValidationCategory) => void;
  projectId?: string;
}) {
  const { document } = material;
  const [showComments, setShowComments] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfHighlight, setPdfHighlight] = useState("");
  const [pdfHighlightPage, setPdfHighlightPage] = useState<number | undefined>();

  // Map categories to PS/PI naming
  const getActiveValidation = (): ValidationResult | undefined => {
    switch (activeCategory) {
      case "project_assets":
        return material.paValidation;
      case "performance_index":
        return material.piValidation;
      default:
        return material.validation;
    }
  };

  const activeValidation = getActiveValidation();
  const effectiveDecision = decision ?? activeValidation?.decision ?? "pending";

  // Build citations for PDF viewer from evidence items
  const citations: Citation[] = (activeValidation?.evidenceItems ?? [])
    .filter((ev) => ev.pageNumber)
    .map((ev, i) => ({
      id: ev.id,
      label: `Match ${i + 1}`,
      page: ev.pageNumber!,
      excerpt: ev.excerpt,
    }));

  const handleOpenPdf = (highlightText: string, page: number) => {
    setPdfHighlight(highlightText);
    setPdfHighlightPage(page);
    setPdfOpen(true);
  };

  // Confidence bar
  const score = activeValidation?.confidenceScore ?? 0;
  const barColor =
    score >= 80
      ? "bg-status-pre-approved"
      : score >= 60
        ? "bg-status-review-required"
        : "bg-status-action-mandatory";
  const scoreColor =
    score >= 80
      ? "text-status-pre-approved"
      : score >= 60
        ? "text-status-review-required"
        : "text-status-action-mandatory";

  return (
    <div className="flex h-full" role="region" aria-label="Evidence review panel">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-4 border-b shrink-0 space-y-3">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold leading-tight truncate" id="evidence-panel-title">
                {document.fileName.replace(/\.[^/.]+$/, "")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-mono font-semibold text-primary/80">
                  {document.specSection}
                </span>
                {" — "}
                {document.specSectionTitle}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Status dropdown */}
              <Select
                value={
                  effectiveDecision !== "pending"
                    ? effectiveDecision
                    : (activeValidation?.status ?? "review_required")
                }
                onValueChange={(value) => {
                  if (value === "approved" || value === "revisit") {
                    onDecide(value as DecisionStatus);
                  } else if (value === "pending") {
                    onDecide("pending" as DecisionStatus);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[160px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending (Reset)</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="revisit">Revisit</SelectItem>
                  <SelectItem value="pre_approved">Pre-Approved</SelectItem>
                  <SelectItem value="review_required">
                    Review Required
                  </SelectItem>
                  <SelectItem value="action_mandatory">
                    Action Mandatory
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Comment icon */}
              <Button
                variant={showComments ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowComments(!showComments)}
                aria-label={showComments ? "Hide comments and activity" : "Show comments and activity"}
                aria-expanded={showComments}
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* PS / PI tabs + Confidence bar */}
          <div className="flex items-center gap-4">
            {onCategoryChange && (
              <Tabs
                value={activeCategory}
                onValueChange={(v) =>
                  onCategoryChange(v as ValidationCategory)
                }
                className="flex-1"
              >
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="project_assets" className="text-xs">
                    Project Specifications
                  </TabsTrigger>
                  <TabsTrigger value="performance_index" className="text-xs">
                    Project Index
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Confidence bar */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn("text-sm font-bold tabular-nums", scoreColor)}>
                {score}%
              </span>
              <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    barColor
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 relative">
        <ScrollArea className="absolute inset-0">
          <div className="p-5">
            {activeValidation ? (
              activeCategory === "performance_index" ? (
                <PITabContent validation={activeValidation} />
              ) : (
                <PSTabContent
                  validation={activeValidation}
                  onOpenPdf={handleOpenPdf}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BookOpen className="h-8 w-8 mb-3 opacity-40" />
                <p className="text-sm font-medium">
                  No{" "}
                  {activeCategory === "performance_index"
                    ? "Project Index"
                    : "Project Specifications"}{" "}
                  validation data yet
                </p>
                <p className="text-xs mt-1">
                  Validation data for this category has not been generated.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
        </div>
      </div>

      {/* Comments & Activity side panel */}
      {showComments && projectId && (
        <CommentsActivityPanel
          projectId={projectId}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* Full-screen PDF viewer */}
      <FullScreenPdfViewer
        open={pdfOpen}
        onOpenChange={setPdfOpen}
        title={document.fileName}
        subtitle={document.specSectionTitle}
        highlightText={pdfHighlight}
        highlightPage={pdfHighlightPage}
        citations={citations}
        totalPages={1200}
      />
    </div>
  );
}
