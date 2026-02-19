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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
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
  IndexMatch,
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
    <div className="space-y-4">
      {/* Match indicator */}
      <div className="flex items-center gap-2">
        {isMatch ? (
          <div className="flex items-center gap-2 text-status-pre-approved">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-[13px] font-medium">Matches Specification</span>
          </div>
        ) : isPartial ? (
          <div className="flex items-center gap-2 text-status-review-required">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-[13px] font-medium">Partial Match</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-status-action-mandatory">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-[13px] font-medium">Does Not Match</span>
          </div>
        )}
      </div>

      {/* AI Analysis card */}
      <div className="rounded-md border border-border/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3.5 space-y-2.5">
        <h4 className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider">
          AI Analysis
        </h4>
        <p className="text-[13px] text-ds-neutral-900 leading-relaxed">
          {validation.aiReasoning.summary}
        </p>
        {validation.aiReasoning.keyFindings.length > 0 && (
          <ul className="space-y-1.5 mt-1.5">
            {validation.aiReasoning.keyFindings.map((finding, i) => (
              <li
                key={i}
                className="text-xs text-ds-neutral-700 flex items-start gap-2"
              >
                <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-primary" />
                {finding}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Relevant References */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-medium text-ds-neutral-900">
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
          <div key={ev.id} className="rounded-md border border-border/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ds-neutral-600">
                {ev.sourceFileName}
              </span>
            </div>
            <p className="text-xs text-ds-neutral-700 italic leading-relaxed">
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
        <div className="rounded-md border border-border/70 bg-ds-bg-gray-light shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-3">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-ds-neutral-500" />
            <span className="text-xs font-medium text-ds-neutral-900">
              Section {validation.specReference.sectionNumber} —{" "}
              {validation.specReference.sectionTitle}
            </span>
          </div>
          <ul className="space-y-1">
            {validation.specReference.requirements.map((req, i) => (
              <li
                key={i}
                className="text-xs text-ds-neutral-700 flex items-start gap-2"
              >
                <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-ds-neutral-400" />
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
/*  Project Index (PI) Tab Content                                             */
/*  — Accordion-based cards with white bg, readable fonts, text-only scores    */
/* -------------------------------------------------------------------------- */

/** Match type badge colors */
const MATCH_TYPE_COLORS: Record<string, string> = {
  EXACT: "bg-status-pre-approved/15 text-status-pre-approved border-status-pre-approved/30",
  PARTIAL: "bg-status-review-required/15 text-status-review-required border-status-review-required/30",
  ALTERNATE: "bg-status-action-mandatory/15 text-status-action-mandatory border-status-action-mandatory/30",
};

/** Score text colour helper */
function scoreTextColor(score: number): string {
  return score >= 80
    ? "text-status-pre-approved"
    : score >= 60
      ? "text-status-review-required"
      : "text-status-action-mandatory";
}

function buildFallbackMatch(validation: ValidationResult): IndexMatch {
  return {
    id: "fallback",
    category: validation.specReference.sectionTitle.split(" — ")[0],
    subCategory: validation.specReference.sectionNumber,
    itemDescription: validation.aiReasoning.summary.slice(0, 80),
    size: "Standard",
    matchType: validation.status === "pre_approved" ? "EXACT" : "PARTIAL",
    matchScore: validation.confidenceScore / 100,
    reason: validation.aiReasoning.complianceAssessment,
  };
}

function getDisplayMatches(validation: ValidationResult): IndexMatch[] {
  const matches = validation.indexMatches;
  return matches && matches.length > 0 ? matches : [buildFallbackMatch(validation)];
}

function PITabContent({
  validation,
}: {
  validation: ValidationResult;
  projectId?: string;
}) {
  const displayMatches = getDisplayMatches(validation);
  const matchCount = displayMatches.length;

  return (
    <div className="space-y-3">
      {/* Match count header */}
      <p className="text-[13px] font-medium text-ds-neutral-800">
        Found {matchCount} match{matchCount !== 1 ? "es" : ""}
      </p>

      {/* Use accordion when 3+ matches to avoid scroll overflow */}
      {matchCount >= 3 ? (
        <Accordion type="multiple" defaultValue={["match-0"]} className="space-y-2">
          {displayMatches.map((match, index) => (
            <AccordionItem
              key={match.id}
              value={`match-${index}`}
              className="rounded-md border border-border/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <AccordionTrigger className="px-3.5 py-2.5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <MatchCardHeader match={match} index={index + 1} total={matchCount} />
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <MatchCardBody match={match} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="space-y-2">
          {displayMatches.map((match, index) => (
            <div key={match.id} className="rounded-md border border-border/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-3.5 py-2.5">
                <MatchCardHeader match={match} index={index + 1} total={matchCount} />
              </div>
              <MatchCardBody match={match} />
            </div>
          ))}
        </div>
      )}

      {/* Discrepancy cards — still shown if evidence contradicts */}
      {validation.evidenceItems.some((ev) => ev.relevance === "contradicts") && (
        <div className="rounded-md border border-border/70 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b bg-status-action-mandatory/5">
            <AlertTriangle className="h-3.5 w-3.5 text-status-action-mandatory" />
            <span className="text-[13px] font-medium text-ds-neutral-900">Discrepancy Found</span>
          </div>
          <div className="p-3.5 space-y-2">
            {validation.evidenceItems
              .filter((ev) => ev.relevance === "contradicts")
              .map((ev) => (
                <div
                  key={ev.id}
                  className="rounded border border-status-action-mandatory/20 bg-status-action-mandatory/5 p-2.5"
                >
                  <p className="text-[13px] italic text-ds-neutral-800">
                    &ldquo;{ev.excerpt}&rdquo;
                  </p>
                  <p className="text-xs text-ds-neutral-600 mt-1">
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

/** Header row shown in both accordion trigger and static card */
function MatchCardHeader({
  match,
  index,
  total,
}: {
  match: IndexMatch;
  index: number;
  total: number;
}) {
  const scorePercent = Math.round(match.matchScore * 100);

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-ds-neutral-900">
          Match {index} of {total}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
            MATCH_TYPE_COLORS[match.matchType] ?? "bg-muted text-muted-foreground"
          )}
        >
          {match.matchType}
        </span>
      </div>
      <span className={cn("text-xs font-normal tabular-nums", scoreTextColor(scorePercent))}>
        Match Score — {scorePercent}
      </span>
    </div>
  );
}

/** Card body: 2-column grid + reason — subtle white bg, readable text */
function MatchCardBody({ match }: { match: IndexMatch }) {
  return (
    <div className="border-t">
      {/* 2×2 key-value grid */}
      <div className="grid grid-cols-2 divide-x divide-border/60">
        <div className="px-3.5 py-2.5">
          <p className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider mb-0.5">
            Category
          </p>
          <p className="text-[13px] text-ds-neutral-900">{match.category}</p>
        </div>
        <div className="px-3.5 py-2.5">
          <p className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider mb-0.5">
            Sub Category
          </p>
          <p className="text-[13px] text-ds-neutral-900">{match.subCategory}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border/60 border-t border-border/60">
        <div className="px-3.5 py-2.5">
          <p className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider mb-0.5">
            Item Description
          </p>
          <p className="text-[13px] text-ds-neutral-900">{match.itemDescription}</p>
        </div>
        <div className="px-3.5 py-2.5">
          <p className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider mb-0.5">
            Size
          </p>
          <p className="text-[13px] text-ds-neutral-900">{match.size}</p>
        </div>
      </div>

      {/* Reason — softly tinted section */}
      <div className="border-t border-border/60 bg-ds-bg-gray-light px-3.5 py-2.5">
        <p className="text-[10px] text-ds-neutral-500 font-medium uppercase tracking-wider mb-0.5">
          Reason
        </p>
        <p className="text-[13px] text-ds-neutral-800 leading-relaxed">{match.reason}</p>
      </div>
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

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="absolute inset-0">
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
                      <AvatarFallback className="text-[10px] font-medium">
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
                      <AvatarFallback className="text-[10px] font-medium">
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
      </div>

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

        {/* Content area — flex-1 + min-h-0 ensures scrollable within flex column */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <ScrollArea className="absolute inset-0">
            <div className="p-5">
            {activeValidation ? (
              activeCategory === "performance_index" ? (
                <PITabContent validation={activeValidation} projectId={projectId} />
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
