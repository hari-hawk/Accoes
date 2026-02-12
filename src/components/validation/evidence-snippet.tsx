import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { EvidenceItem } from "@/data/types";

const relevanceStyles = {
  supports: "border-l-status-pre-approved bg-status-pre-approved-bg/30",
  contradicts: "border-l-status-action-mandatory bg-status-action-mandatory-bg/30",
  neutral: "border-l-muted-foreground bg-muted/50",
};

const relevanceLabels = {
  supports: "Supports compliance",
  contradicts: "Contradicts requirement",
  neutral: "Neutral reference",
};

export function EvidenceSnippet({
  evidence,
  className,
}: {
  evidence: EvidenceItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-3",
        relevanceStyles[evidence.relevance],
        className
      )}
    >
      <p className="text-sm leading-relaxed italic">
        &ldquo;{evidence.excerpt}&rdquo;
      </p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3 w-3" />
          <span className="truncate max-w-[200px]">
            {evidence.sourceFileName}
          </span>
          {evidence.pageNumber && <span>p. {evidence.pageNumber}</span>}
        </div>
        <span className="font-medium">{relevanceLabels[evidence.relevance]}</span>
      </div>
    </div>
  );
}
