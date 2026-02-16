"use client";

import { useState } from "react";
import { Send, MessageSquare, BookOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidenceScore } from "@/components/validation/confidence-score";
import { StatusClassification } from "@/components/validation/status-classification";
import { EvidenceSnippet } from "@/components/validation/evidence-snippet";
import { RoleBadge } from "@/components/shared/role-badge";
import { getCommentsByValidation } from "@/data/mock-comments";
import { mockUsers, currentUser } from "@/data/mock-users";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MaterialItem } from "@/hooks/use-materials";
import type { DecisionStatus, ValidationCategory, Comment as CommentType, ValidationResult } from "@/data/types";

function DecisionActions({
  currentDecision,
  onDecide,
}: {
  currentDecision: DecisionStatus;
  onDecide: (decision: DecisionStatus) => void;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Decision</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={currentDecision === "approved" ? "default" : "outline"}
          onClick={() => onDecide("approved")}
          className={cn(
            "text-xs h-8",
            currentDecision === "approved" && "bg-status-pre-approved hover:bg-status-pre-approved/90"
          )}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant={currentDecision === "approved_with_notes" ? "default" : "outline"}
          onClick={() => {
            setShowNotes(true);
            onDecide("approved_with_notes");
          }}
          className="text-xs h-8"
        >
          Approve with Notes
        </Button>
        <Button
          size="sm"
          variant={currentDecision === "revision_requested" ? "default" : "outline"}
          onClick={() => {
            setShowNotes(true);
            onDecide("revision_requested");
          }}
          className={cn(
            "text-xs h-8",
            currentDecision === "revision_requested" && "bg-status-review-required hover:bg-status-review-required/90"
          )}
        >
          Request Revision
        </Button>
        <Button
          size="sm"
          variant={currentDecision === "rejected" ? "default" : "outline"}
          onClick={() => onDecide("rejected")}
          className={cn(
            "text-xs h-8",
            currentDecision === "rejected" && "bg-destructive hover:bg-destructive/90"
          )}
        >
          Reject
        </Button>
      </div>
      {showNotes && (
        <Textarea
          placeholder="Add notes for your decision..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="text-sm"
          rows={2}
        />
      )}
    </div>
  );
}

function CommentThread({
  validationId,
}: {
  validationId: string;
}) {
  const comments = getCommentsByValidation(validationId);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState<CommentType[]>([]);

  const allComments = [...comments, ...localComments];

  const addComment = () => {
    if (!newComment.trim()) return;
    setLocalComments((prev) => [
      ...prev,
      {
        id: `cmt-local-${Date.now()}`,
        validationResultId: validationId,
        authorId: currentUser.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold">
          Comments ({allComments.length})
        </h4>
      </div>

      {allComments.length > 0 && (
        <div className="space-y-3">
          {allComments.map((comment) => {
            const author = mockUsers.find((u) => u.id === comment.authorId);
            const initials = author
              ? author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?";

            return (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[10px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {author?.name ?? "Unknown"}
                    </span>
                    {author && <RoleBadge role={author.role} className="text-[10px] px-1.5 py-0" />}
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-sm"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              addComment();
            }
          }}
        />
        <Button
          size="icon"
          className="shrink-0 h-9 w-9"
          onClick={addComment}
          disabled={!newComment.trim()}
          aria-label="Send comment"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<ValidationCategory, string> = {
  overall: "Overall",
  project_assets: "PA",
  performance_index: "PI",
};

function ValidationContent({
  validation,
  decision,
  onDecide,
}: {
  validation: ValidationResult;
  decision?: DecisionStatus;
  onDecide: (decision: DecisionStatus) => void;
}) {
  const [criticalOpen, setCriticalOpen] = useState(false);
  const effectiveDecision = decision ?? validation.decision;
  const isCritical = validation.status === "action_mandatory";

  return (
    <>
      {/* Confidence + Status */}
      <div className="flex items-center gap-6">
        <ConfidenceScore score={validation.confidenceScore} size="lg" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusClassification status={validation.status} size="md" />
            {isCritical && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 text-status-action-mandatory border-status-action-mandatory/30 hover:bg-status-action-mandatory-bg"
                onClick={() => setCriticalOpen(true)}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                View Critical Actions
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {validation.aiReasoning.summary}
          </p>
        </div>
      </div>

      <Separator />

      {/* Evidence */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Evidence ({validation.evidenceItems.length})</h4>
        {validation.evidenceItems.map((ev) => (
          <EvidenceSnippet key={ev.id} evidence={ev} />
        ))}
      </div>

      <Separator />

      {/* AI Reasoning */}
      <div className="rounded-lg bg-muted/50 border-l-4 border-primary/30 p-4 space-y-4">
        <h4 className="text-sm font-semibold">AI Reasoning</h4>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Key Findings
          </p>
          <ul className="space-y-1.5">
            {validation.aiReasoning.keyFindings.map((finding, i) => (
              <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                <span className="mt-2 shrink-0 h-1 w-1 rounded-full bg-primary" />
                {finding}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Compliance Assessment
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {validation.aiReasoning.complianceAssessment}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Recommendation
          </p>
          <p className="text-sm font-medium">
            {validation.aiReasoning.recommendation}
          </p>
        </div>
      </div>

      <Separator />

      {/* Spec Reference */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Specification Reference</h4>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">
            Section {validation.specReference.sectionNumber} —{" "}
            {validation.specReference.sectionTitle}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {validation.specReference.sourceDocument}
          </p>
          <ul className="mt-3 space-y-1.5">
            {validation.specReference.requirements.map((req, i) => (
              <li key={i} className="text-xs text-foreground/70 flex items-start gap-2">
                <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-muted-foreground" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator />

      {/* Decision */}
      <DecisionActions
        currentDecision={effectiveDecision}
        onDecide={onDecide}
      />

      <Separator />

      {/* Comments */}
      <CommentThread validationId={validation.id} />

      {/* Critical Action Dialog */}
      <Dialog open={criticalOpen} onOpenChange={setCriticalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-status-action-mandatory">
              <AlertTriangle className="h-5 w-5" />
              Critical Action Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-status-action-mandatory-bg p-4">
              <p className="text-sm font-medium text-status-action-mandatory">
                {validation.aiReasoning.recommendation}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Non-Compliant Requirements
              </p>
              <ul className="space-y-2">
                {validation.evidenceItems
                  .filter((ev) => ev.relevance === "contradicts")
                  .map((ev) => (
                    <li key={ev.id} className="rounded-lg border border-status-action-mandatory/20 p-3">
                      <p className="text-sm italic text-foreground/80">
                        &ldquo;{ev.excerpt}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ev.sourceFileName} {ev.pageNumber && `— p. ${ev.pageNumber}`}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Specification Requirements
              </p>
              <ul className="space-y-1">
                {validation.specReference.requirements.map((req, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="mt-2 shrink-0 h-1 w-1 rounded-full bg-status-action-mandatory" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EvidencePanel({
  material,
  decision,
  onDecide,
  activeCategory = "overall",
  onCategoryChange,
}: {
  material: MaterialItem;
  decision?: DecisionStatus;
  onDecide: (decision: DecisionStatus) => void;
  activeCategory?: ValidationCategory;
  onCategoryChange?: (category: ValidationCategory) => void;
}) {
  const { document } = material;

  // Get validation for the active category
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

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold leading-tight">{document.fileName}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono font-semibold text-primary/80">{document.specSection}</span>
            {" — "}
            {document.specSectionTitle}
          </p>
        </div>

        {/* Category Tabs */}
        {onCategoryChange && (
          <Tabs
            value={activeCategory}
            onValueChange={(v) => onCategoryChange(v as ValidationCategory)}
          >
            <TabsList className="grid w-full grid-cols-3">
              {(Object.entries(CATEGORY_LABELS) as [ValidationCategory, string][]).map(
                ([key, label]) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {label}
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </Tabs>
        )}

        {/* Validation Content */}
        {activeValidation ? (
          <ValidationContent
            validation={activeValidation}
            decision={decision}
            onDecide={onDecide}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BookOpen className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">
              No {CATEGORY_LABELS[activeCategory]} validation data yet
            </p>
            <p className="text-xs mt-1">
              Validation data for this category has not been generated.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
