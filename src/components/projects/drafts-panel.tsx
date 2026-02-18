"use client";

import { Trash2, Clock, Paperclip } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDrafts, type DraftData } from "@/providers/draft-provider";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const priorityConfig: Record<
  string,
  { label: string; color: string }
> = {
  high: {
    label: "HIGH",
    color:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    label: "MEDIUM",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  low: {
    label: "LOW",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

interface DraftsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDraft: (draft: DraftData) => void;
}

export function DraftsPanel({
  open,
  onOpenChange,
  onLoadDraft,
}: DraftsPanelProps) {
  const { drafts, removeDraft } = useDrafts();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12 shrink-0">
          <SheetTitle className="text-base font-bold">
            Saved Drafts
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your saved draft jobs. Click a card to resume editing.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="absolute inset-0">
            <div className="p-6 space-y-3">
              {drafts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    No drafts saved
                  </p>
                </div>
              ) : (
                drafts.map((draft) => {
                  const pConfig =
                    priorityConfig[draft.priority] ?? priorityConfig.medium;

                  return (
                    <div
                      key={draft.id}
                      className="relative group rounded-xl border bg-card shadow-card p-4 cursor-pointer hover:shadow-card-hover hover:border-nav-accent/30 transition-all"
                      role="button"
                      tabIndex={0}
                      aria-label={`Resume draft: ${draft.customerName || "Untitled"}, ${draft.jobId}`}
                      onClick={() => {
                        onLoadDraft(draft);
                        onOpenChange(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onLoadDraft(draft);
                          onOpenChange(false);
                        }
                      }}
                    >
                      {/* Delete — hover only, top-right */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-muted-foreground hover:text-destructive transition-opacity focus-visible:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDraft(draft.id);
                        }}
                        aria-label={`Delete draft ${draft.jobId}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>

                      {/* Line 1: Customer name */}
                      <p className="font-semibold text-sm pr-6 truncate">
                        {draft.customerName || "Untitled Job"}
                      </p>

                      {/* Line 2: Job ID + Priority badge */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-muted-foreground font-mono">
                          {draft.jobId || "No Job ID"}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0",
                            pConfig.color
                          )}
                        >
                          {pConfig.label}
                        </Badge>
                      </div>

                      {/* Line 3: Timeline + file/link counts */}
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {formatRelativeTime(draft.savedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Paperclip
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                          {draft.files.length} file
                          {draft.files.length !== 1 ? "s" : ""},{" "}
                          {draft.links.length} link
                          {draft.links.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
