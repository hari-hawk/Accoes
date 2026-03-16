"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Replace,
  AlertTriangle,
  BookOpen,
  FileText,
  RotateCcw,
  MessageSquare,
  Download,
  Send,
  Eye,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  v4ConformanceData,
  V4_TRADE_ORDER,
  V4_MATERIAL_TYPES,
  getV4StatusCounts,
  getV4ItemEvidence,
  getCachedProjectConformanceData,
  type V4ConformanceItem,
  type V4ItemEvidence,
} from "@/data/mock-v4-conformance";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ValidationStatus } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                   */
/* -------------------------------------------------------------------------- */

const TRADE_COLORS: Record<string, string> = {
  Mechanical: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Plumbing: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const MATCH_TYPE_COLORS: Record<string, string> = {
  EXACT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PARTIAL: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  ALTERNATE: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

/** Total columns in conformance table */
const V4_TOTAL_COLS = 14;

/* -------------------------------------------------------------------------- */
/*  Evidence Detail Panel                                                       */
/* -------------------------------------------------------------------------- */

function V4EvidenceDetail({
  item,
  onViewPdf,
  onStatusChange,
}: {
  item: V4ConformanceItem;
  onViewPdf?: (ref: string) => void;
  onStatusChange?: (itemId: string, status: ValidationStatus) => void;
}) {
  const evidence = useMemo(() => getV4ItemEvidence(item), [item]);

  const spec = evidence.spec;
  const isMatch = spec.matchStatus === "matches";
  const isPartial = spec.matchStatus === "partial";

  const barColor = spec.confidence >= 80
    ? "bg-emerald-500"
    : spec.confidence >= 40
      ? "bg-amber-500"
      : "bg-rose-500";

  const scoreColor = spec.confidence >= 80
    ? "text-emerald-600 dark:text-emerald-400"
    : spec.confidence >= 40
      ? "text-amber-600 dark:text-amber-400"
      : "text-rose-600 dark:text-rose-400";

  return (
    <div className="flex flex-col h-full">
      {/* Header — item info + status dropdown */}
      <div className="px-5 py-4 pr-12 border-b space-y-3 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-mono">{item.accoMaterialId}</p>
            <h4 className="text-sm font-semibold leading-tight">{item.description}</h4>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-primary/80">{spec.specSection}</span>
              {" — "}
              {spec.specTitle}
            </p>
          </div>
        </div>

        {/* Confidence bar + status dropdown row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className={cn("text-xs font-semibold whitespace-nowrap", scoreColor)}>
              {isMatch ? "Matches Specification" : isPartial ? "Partial Match" : "No Match"}
            </span>
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", barColor)} style={{ width: `${spec.confidence}%` }} />
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums">{spec.confidence}%</span>
            </div>
          </div>

          {/* Status filter/change dropdown — clear of close button */}
          {onStatusChange && (
            <Select
              value={item.aiStatus}
              onValueChange={(v) => onStatusChange(item.id, v as ValidationStatus)}
            >
              <SelectTrigger
                className="w-[160px] h-8 text-xs shrink-0"
                aria-label="Change item status"
              >
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_approved" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-status-pre-approved shrink-0" aria-hidden="true" />
                    Pre-Approved
                  </span>
                </SelectItem>
                <SelectItem value="review_required" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-status-review-required shrink-0" aria-hidden="true" />
                    Review Required
                  </span>
                </SelectItem>
                <SelectItem value="action_mandatory" className="text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-status-action-mandatory shrink-0" aria-hidden="true" />
                    Action Mandatory
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Resizable split content — vertical stack (top/bottom) with draggable divider */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup orientation="vertical" className="h-full">
          {/* Top: Project Specifications */}
          <ResizablePanel defaultSize={55} minSize={20}>
            <div className="px-4 pt-3 pb-1">
              <h5 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Project Specifications
              </h5>
            </div>
            <ScrollArea className="h-[calc(100%-28px)]">
              <div className="p-3 sm:p-4 pt-2 space-y-3 sm:space-y-4">
                {/* Match indicator */}
                <div className="flex items-center gap-2">
                  {isMatch ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Matches Specification</span>
                    </div>
                  ) : isPartial ? (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Partial Match</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-[13px] font-medium">Does Not Match</span>
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="rounded-md border bg-card p-3.5 space-y-2.5">
                  <h4 className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">AI Analysis</h4>
                  <p className="text-[13px] leading-relaxed">{spec.summary}</p>
                </div>

                {/* Requirements */}
                <div className="rounded-md border bg-muted/30 p-3.5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Section {spec.specSection} — {spec.specTitle}</span>
                  </div>
                  <ul className="space-y-1">
                    {spec.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="mt-1.5 shrink-0 h-1 w-1 rounded-full bg-muted-foreground/40" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* References */}
                <div className="space-y-2">
                  <h4 className="text-[13px] font-medium">Relevant References ({spec.references.length})</h4>
                  {spec.references.map((ref, i) => (
                    <div key={i} className="rounded-md border bg-card p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium text-muted-foreground truncate">{ref.source}</span>
                        </div>
                        {onViewPdf && (
                          <button
                            type="button"
                            className="shrink-0 inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors"
                            onClick={() => onViewPdf(ref.source)}
                          >
                            <Eye className="h-3 w-3" />
                            View PDF
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">&ldquo;{ref.excerpt}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>

          {/* Draggable divider — thicker hit area for vertical orientation */}
          <ResizableHandle
            withHandle
            className="h-2 bg-muted/50 hover:bg-primary/10 active:bg-primary/20 transition-colors after:h-3"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />

          {/* Bottom: Project Index */}
          <ResizablePanel defaultSize={45} minSize={20}>
            <div className="px-4 pt-3 pb-1">
              <h5 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Project Index
              </h5>
            </div>
            <ScrollArea className="h-[calc(100%-28px)]">
              <div className="p-3 sm:p-4 pt-2 space-y-3 sm:space-y-4">
                <p className="text-[13px] font-medium">
                  Found {evidence.indexMatches.length} match{evidence.indexMatches.length !== 1 ? "es" : ""}
                </p>
                {evidence.indexMatches.map((match, i) => (
                  <div key={i} className="rounded-md border bg-card overflow-hidden">
                    <div className="px-3.5 py-2.5 flex items-center justify-between border-b bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium">Match {i + 1} of {evidence.indexMatches.length}</span>
                        <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide", MATCH_TYPE_COLORS[match.matchType] ?? "bg-muted text-muted-foreground")}>
                          {match.matchType}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">Score — {Math.round(match.matchScore * 100)}</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Category</p>
                        <p className="text-[13px]">{match.category}</p>
                      </div>
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Subcategory</p>
                        <p className="text-[13px]">{match.subcategory}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border border-t">
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Description</p>
                        <p className="text-[13px]">{match.itemDescription}</p>
                      </div>
                      <div className="px-3.5 py-2.5">
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Size</p>
                        <p className="text-[13px]">{match.size}</p>
                      </div>
                    </div>
                    <div className="border-t bg-muted/30 px-3.5 py-2.5">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Reason</p>
                      <p className="text-[13px] leading-relaxed">{match.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  V4 Per-Item Comments Panel (threaded, multi-user)                          */
/* -------------------------------------------------------------------------- */

const MOCK_USERS = [
  { name: "Sarah Chen", initials: "SC", color: "bg-blue-500" },
  { name: "Mark Johnson", initials: "MJ", color: "bg-emerald-500" },
  { name: "You", initials: "YO", color: "bg-primary" },
];

const MOCK_COMMENTS = [
  { user: 0, text: "This material specification needs further review — the rated pressure seems inconsistent with Section 15010.", time: "2h ago" },
  { user: 1, text: "Agreed. I checked with the mechanical engineer and the spec calls for 150 PSI minimum. We should flag this as review required.", time: "1h ago" },
];

function V4ItemComments({
  item,
}: {
  item: V4ConformanceItem | null;
}) {
  const [newComment, setNewComment] = useState("");

  if (!item) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b shrink-0 space-y-1">
        <h4 className="text-sm font-semibold">Comments</h4>
        <p className="text-xs text-muted-foreground font-mono">{item.accoMaterialId}</p>
        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
      </div>

      {/* Comments list */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="absolute inset-0">
          <div className="p-5 space-y-4">
            {MOCK_COMMENTS.map((comment, i) => {
              const user = MOCK_USERS[comment.user];
              return (
                <div key={i} className="flex gap-3">
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0", user.color)}>
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{user.name}</span>
                      <span className="text-[11px] text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed mt-0.5">{comment.text}</p>
                  </div>
                </div>
              );
            })}
            {MOCK_COMMENTS.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No comments yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Comment input — inline send icon */}
      <div className="shrink-0 border-t p-4">
        <div className="relative">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="resize-none text-sm pr-10"
          />
          <button
            type="button"
            disabled={!newComment.trim()}
            onClick={() => {
              toast.success("Comment added");
              setNewComment("");
            }}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center transition-colors",
              newComment.trim()
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send comment"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  V4 Trade Group                                                              */
/* -------------------------------------------------------------------------- */

function V4TradeGroup({
  trade,
  items,
  selectedId,
  onSelectRow,
  checkedIds,
  toggleCheck,
  alternativeIds,
  toggleAlternative,
  onOpenComments,
}: {
  trade: string;
  items: V4ConformanceItem[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  checkedIds: Set<string>;
  toggleCheck: (id: string) => void;
  alternativeIds: Set<string>;
  toggleAlternative: (id: string) => void;
  onOpenComments: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Trade section header */}
      <tr
        className="bg-muted/40 border-y border-muted cursor-pointer select-none"
        onClick={() => setCollapsed((prev) => !prev)}
        role="row"
        aria-label={`${trade} trade group — ${items.length} entries`}
      >
        <td colSpan={V4_TOTAL_COLS} className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                collapsed && "-rotate-90"
              )}
              aria-hidden="true"
            />
            <Badge
              variant="secondary"
              className={cn("text-[10px]", TRADE_COLORS[trade] ?? "")}
            >
              {trade}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </td>
      </tr>

      {/* Data rows */}
      {!collapsed &&
        items.map((item) => {
          const statusConfig = VALIDATION_STATUS_CONFIG[item.aiStatus];
          const isChecked = checkedIds.has(item.id);
          const isAlt = alternativeIds.has(item.id);
          const isSelected = selectedId === item.id;

          return (
            <tr
              key={item.id}
              className={cn(
                "border-b hover:bg-muted/30 transition-colors cursor-pointer group",
                isSelected && "bg-primary/5 border-l-2 border-l-primary",
                isAlt && !isSelected && "bg-yellow-50/30 dark:bg-yellow-900/10"
              )}
              onClick={() => onSelectRow(item.id)}
              tabIndex={0}
              role="row"
              aria-selected={isSelected}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectRow(item.id);
                }
              }}
            >
              {/* Checkbox */}
              <td className="p-3">
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleCheck(item.id)}
                    aria-label={`Select ${item.description}`}
                  />
                </div>
              </td>

              {/* Row indicator */}
              <td className="p-3">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isSelected && "text-primary"
                  )}
                  aria-hidden="true"
                />
              </td>

              {/* ACCO Material ID */}
              <td className="p-3">
                <span className="font-mono text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                  {item.accoMaterialId}
                </span>
              </td>

              {/* Pick Section */}
              <td className="p-3">
                <span className="font-mono text-[11px] text-muted-foreground">{item.pickSection}</span>
              </td>

              {/* Index Category */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground truncate block" title={item.indexCategory}>
                  {item.indexCategory}
                </span>
              </td>

              {/* Description */}
              <td className="p-3">
                <p className="text-sm font-medium truncate" title={item.description}>
                  {item.description}
                </p>
              </td>

              {/* Size */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground">{item.sizes}</span>
              </td>

              {/* Subcategory */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground truncate block" title={item.indexSubcategory}>
                  {item.indexSubcategory}
                </span>
              </td>

              {/* Material Type */}
              <td className="p-3">
                <span className="text-xs text-muted-foreground">{item.materialType}</span>
              </td>

              {/* All System */}
              <td className="p-3">
                {item.allSystem ? (
                  <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">All</Badge>
                ) : (
                  <span className="text-xs text-muted-foreground truncate block" title={item.systemCategory}>{item.systemCategory}</span>
                )}
              </td>

              {/* AI Status */}
              <td className="p-3 overflow-hidden">
                <Badge
                  variant="secondary"
                  className={cn("text-[10px] truncate max-w-full", statusConfig.bgColor, statusConfig.color)}
                >
                  {statusConfig.label}
                </Badge>
              </td>

              {/* Alternate toggle */}
              <td className="p-3 overflow-hidden">
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleAlternative(item.id)}
                    aria-label={`Mark ${item.description} as alternative`}
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border transition-colors whitespace-nowrap",
                      isAlt
                        ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                    )}
                  >
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full border-2 flex items-center justify-center shrink-0",
                        isAlt
                          ? "border-yellow-500 dark:border-yellow-400 bg-yellow-500 dark:bg-yellow-400"
                          : "border-muted-foreground/40 bg-transparent"
                      )}
                    >
                      {isAlt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    Alternate
                  </button>
                </div>
              </td>

              {/* Chat icon */}
              <td className="p-3">
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onOpenComments(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted"
                    aria-label={`Open comments for ${item.description}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  V4 Conformance Section — filters + trade-grouped table + evidence panel    */
/* -------------------------------------------------------------------------- */

export function V4ConformanceSection() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const initialMatrix = searchParams.get("matrix") ?? "all";
  const projectId = params.projectId as string;

  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>("all");
  const [allSystemFilter, setAllSystemFilter] = useState<string>("all");
  const [matrixFileFilter, setMatrixFileFilter] = useState<string>(initialMatrix);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("category");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [alternativeIds, setAlternativeIds] = useState<Set<string>>(new Set());
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentItemId, setCommentItemId] = useState<string | null>(null);
  const [pdfPreviewRef, setPdfPreviewRef] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ValidationStatus>>({});

  /* Per-project conformance data — unique items for each project */
  const projectConformanceData = useMemo(
    () => getCachedProjectConformanceData(projectId),
    [projectId]
  );

  /* Unique filter options (derived from project-specific data) */
  const uniqueTrades = useMemo(
    () => [...new Set(projectConformanceData.map((m) => m.trade))],
    [projectConformanceData]
  );
  const uniqueCategories = useMemo(
    () => [...new Set(projectConformanceData.map((m) => m.indexCategory))],
    [projectConformanceData]
  );
  const uniqueSystems = useMemo(
    () => [...new Set(projectConformanceData.map((m) => m.systemCategory))],
    [projectConformanceData]
  );
  const uniqueMaterialTypes = useMemo(
    () => [...new Set(projectConformanceData.map((m) => m.materialType))],
    [projectConformanceData]
  );

  /* Filtering */
  const filteredData = useMemo(() => {
    let result = projectConformanceData;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.description.toLowerCase().includes(lower) ||
          m.accoMaterialId.toLowerCase().includes(lower) ||
          m.indexCategory.toLowerCase().includes(lower) ||
          m.indexSubcategory.toLowerCase().includes(lower) ||
          m.pickSection.toLowerCase().includes(lower)
      );
    }
    if (tradeFilter !== "all") {
      result = result.filter((m) => m.trade === tradeFilter);
    }
    if (categoryFilter !== "all") {
      result = result.filter((m) => m.indexCategory === categoryFilter);
    }
    if (systemFilter !== "all") {
      result = result.filter((m) => m.systemCategory === systemFilter);
    }
    if (materialTypeFilter !== "all") {
      result = result.filter((m) => m.materialType === materialTypeFilter);
    }
    if (allSystemFilter !== "all") {
      const isAll = allSystemFilter === "yes";
      result = result.filter((m) => m.allSystem === isAll);
    }
    if (statusFilter !== "all") {
      result = result.filter((m) => m.aiStatus === statusFilter);
    }

    // Sort
    result = [...result];
    switch (sortBy) {
      case "description-asc":
        result.sort((a, b) => a.description.localeCompare(b.description));
        break;
      case "description-desc":
        result.sort((a, b) => b.description.localeCompare(a.description));
        break;
      case "material-id":
        result.sort((a, b) => a.accoMaterialId.localeCompare(b.accoMaterialId));
        break;
      case "status":
        result.sort((a, b) => a.aiStatus.localeCompare(b.aiStatus));
        break;
      case "material-type":
        result.sort((a, b) => a.materialType.localeCompare(b.materialType));
        break;
      case "category":
      default:
        break;
    }

    return result;
  }, [projectConformanceData, search, tradeFilter, categoryFilter, systemFilter, materialTypeFilter, allSystemFilter, statusFilter, sortBy]);

  /* Apply status overrides so approve/revisit actions reflect in the table */
  const effectiveData = useMemo(() => {
    const hasOverrides = Object.keys(statusOverrides).length > 0;
    if (!hasOverrides) return filteredData;
    return filteredData.map((item) =>
      statusOverrides[item.id] ? { ...item, aiStatus: statusOverrides[item.id] } : item
    );
  }, [filteredData, statusOverrides]);

  /* Trade-grouped data */
  const groupedByTrade = useMemo(() => {
    const map = new Map<string, V4ConformanceItem[]>();
    for (const trade of V4_TRADE_ORDER) {
      const items = effectiveData.filter((m) => m.trade === trade);
      if (items.length > 0) {
        map.set(trade, items);
      }
    }
    return map;
  }, [effectiveData]);

  /* Status counts */
  const statusCounts = useMemo(() => getV4StatusCounts(effectiveData), [effectiveData]);

  /* Selected item (with status override applied) */
  const selectedItem = useMemo(
    () => {
      if (!selectedId) return null;
      const base = projectConformanceData.find((m) => m.id === selectedId) ?? null;
      if (!base) return null;
      const overriddenStatus = statusOverrides[base.id];
      return overriddenStatus ? { ...base, aiStatus: overriddenStatus } : base;
    },
    [selectedId, statusOverrides, projectConformanceData]
  );

  /* Select all */
  const filteredIds = useMemo(() => filteredData.map((m) => m.id), [filteredData]);
  const allChecked = filteredIds.length > 0 && filteredIds.every((id) => checkedIds.has(id));

  const handleSelectAll = useCallback(() => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  }, [allChecked, filteredIds]);

  const toggleCheck = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAlternative = useCallback((id: string) => {
    setAlternativeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectRow = useCallback((id: string) => {
    setCommentItemId(null);
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const hasActiveFilters =
    search !== "" || tradeFilter !== "all" || categoryFilter !== "all" || systemFilter !== "all" || materialTypeFilter !== "all" || allSystemFilter !== "all" || matrixFileFilter !== "all" || statusFilter !== "all" || sortBy !== "category";

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setTradeFilter("all");
    setCategoryFilter("all");
    setSystemFilter("all");
    setMaterialTypeFilter("all");
    setAllSystemFilter("all");
    setMatrixFileFilter("all");
    setStatusFilter("all");
    setSortBy("category");
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Filter bar — responsive horizontal padding */}
      <div className="shrink-0 border-b bg-card px-4 sm:px-6 lg:px-12 py-3 sm:py-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search descriptions, material IDs, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8"
              aria-label="Search conformance items"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label="Sort items">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              {[
                { value: "category", label: "Default (Category)", icon: null },
                { value: "description-asc", label: "Description A → Z", icon: ArrowDownAZ },
                { value: "description-desc", label: "Description Z → A", icon: ArrowUpAZ },
                { value: "material-id", label: "Material ID", icon: null },
                { value: "status", label: "Status", icon: null },
                { value: "material-type", label: "Material Type", icon: null },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors text-left",
                    sortBy === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  {opt.icon ? <opt.icon className="h-3.5 w-3.5 shrink-0" /> : <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />}
                  {opt.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2" role="search" aria-label="Filter controls">
          {/* Matrix File */}
          <div className="min-w-0">
            <Select value={matrixFileFilter} onValueChange={setMatrixFileFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by matrix file">
                <SelectValue placeholder="All Files" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matrix Files</SelectItem>
                <SelectItem value="mechanical">Mechanical Template</SelectItem>
                <SelectItem value="plumbing">Plumbing Template</SelectItem>
                <SelectItem value="heating">Heating Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trade */}
          <div className="min-w-0">
            <Select value={tradeFilter} onValueChange={setTradeFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by trade">
                <SelectValue placeholder="All Trades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trades</SelectItem>
                {uniqueTrades.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Index Category */}
          <div className="min-w-0">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* All System */}
          <div className="min-w-0">
            <Select value={allSystemFilter} onValueChange={setAllSystemFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by all system">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="yes">All-System Only</SelectItem>
                <SelectItem value="no">System-Specific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Material Type */}
          <div className="min-w-0">
            <Select value={materialTypeFilter} onValueChange={setMaterialTypeFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by material type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Material Types</SelectItem>
                {uniqueMaterialTypes.map((mt) => (
                  <SelectItem key={mt} value={mt}>{mt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* System Category */}
          <div className="min-w-0">
            <Select value={systemFilter} onValueChange={setSystemFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by system category">
                <SelectValue placeholder="All System Cat." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All System Categories</SelectItem>
                {uniqueSystems.map((sys) => (
                  <SelectItem key={sys} value={sys}>{sys}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* AI Status */}
          <div className="min-w-0">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full" aria-label="Filter by AI status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pre_approved">Pre-Approved</SelectItem>
                <SelectItem value="review_required">Review Required</SelectItem>
                <SelectItem value="action_mandatory">Action Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {matrixFileFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {matrixFileFilter === "mechanical" ? "Mechanical" : matrixFileFilter === "plumbing" ? "Plumbing" : matrixFileFilter === "heating" ? "Heating" : matrixFileFilter}
                <button type="button" onClick={() => setMatrixFileFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove matrix file filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {tradeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {tradeFilter}
                <button type="button" onClick={() => setTradeFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove trade filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {categoryFilter}
                <button type="button" onClick={() => setCategoryFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove category filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {allSystemFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {allSystemFilter === "yes" ? "All-System" : "System-Specific"}
                <button type="button" onClick={() => setAllSystemFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove system filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {materialTypeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {materialTypeFilter}
                <button type="button" onClick={() => setMaterialTypeFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove material type filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {systemFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {systemFilter}
                <button type="button" onClick={() => setSystemFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove system category filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                {statusFilter === "pre_approved" ? "Pre-Approved" : statusFilter === "review_required" ? "Review Required" : "Action Required"}
                <button type="button" onClick={() => setStatusFilter("all")} className="h-4 w-4 rounded-full hover:bg-primary/20 flex items-center justify-center" aria-label="Remove status filter"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            {sortBy !== "category" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground pl-2.5 pr-1 py-0.5 text-[11px] font-medium">
                Sort: {sortBy === "description-asc" ? "A→Z" : sortBy === "description-desc" ? "Z→A" : sortBy === "material-id" ? "Material ID" : sortBy === "status" ? "Status" : "Type"}
                <button type="button" onClick={() => setSortBy("category")} className="h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center" aria-label="Reset sort"><X className="h-2.5 w-2.5" /></button>
              </span>
            )}
            <Button variant="ghost" size="sm" className="text-xs h-6 gap-1 px-2 text-muted-foreground" onClick={handleClearFilters}>
              <X className="h-3 w-3" aria-hidden="true" />
              Clear All
            </Button>
          </div>
        )}

        {/* Status counts */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{filteredData.length}</span>
            <span className="text-muted-foreground">Total Items</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-pre-approved shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{statusCounts.preApproved}</span>
            <span className="text-muted-foreground">Pre-Approved</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-review-required shrink-0" />
            <span className="font-semibold text-amber-600 dark:text-amber-400">{statusCounts.reviewRequired}</span>
            <span className="text-muted-foreground">Review Required</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-status-action-mandatory shrink-0" />
            <span className="font-semibold text-rose-600 dark:text-rose-400">{statusCounts.actionMandatory}</span>
            <span className="text-muted-foreground">Action Required</span>
          </div>
        </div>
      </div>

      {/* Batch actions bar */}
      {checkedIds.size > 0 && (
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b bg-primary/5 dark:bg-primary/10 border-b-primary/10 px-4 sm:px-6 lg:px-12 py-2">
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{checkedIds.size} item(s) selected</span>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => {
                const ids = Array.from(checkedIds);
                setStatusOverrides((prev) => {
                  const next = { ...prev };
                  for (const id of ids) next[id] = "pre_approved";
                  return next;
                });
                setReviewedIds((prev) => {
                  const next = new Set(prev);
                  for (const id of ids) next.add(id);
                  return next;
                });
                toast.success(`${ids.length} item(s) approved`);
                setCheckedIds(new Set());
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const ids = Array.from(checkedIds);
                setStatusOverrides((prev) => {
                  const next = { ...prev };
                  for (const id of ids) next[id] = "review_required";
                  return next;
                });
                setReviewedIds((prev) => {
                  const next = new Set(prev);
                  for (const id of ids) next.add(id);
                  return next;
                });
                toast.success(`${ids.length} item(s) marked for revisit`);
                setCheckedIds(new Set());
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Revisit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              onClick={() => {
                for (const id of checkedIds) {
                  setAlternativeIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(id)) next.delete(id);
                    else next.add(id);
                    return next;
                  });
                }
                setCheckedIds(new Set());
              }}
            >
              <Replace className="h-4 w-4 mr-1" /> Alternate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCommentDialogOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> Comment
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCheckedIds(new Set())}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table — scrollable area inside V3-style card container */}
      <div className="flex-1 min-h-0 overflow-auto px-4 sm:px-6 lg:px-12 py-4">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No entries match your filters</p>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={handleClearFilters}>
              <X className="h-4 w-4" /> Clear Filters
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-card overflow-x-auto">
            <table className="w-full table-fixed min-w-[1100px]" aria-label="Trade-grouped conformance specifications">
              <colgroup><col className="w-[40px]" /><col className="w-[32px]" /><col className="w-[160px]" /><col className="w-[80px]" /><col className="w-[120px]" /><col /><col className="w-[90px]" /><col className="w-[120px]" /><col className="w-[90px]" /><col className="w-[130px]" /><col className="w-[120px]" /><col className="w-[100px]" /><col className="w-[40px]" /><col className="w-[8px]" /></colgroup>
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="border-b bg-muted/30">
                  <th scope="col" className="p-3" aria-label="Select all">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all filtered items"
                    />
                  </th>
                  <th scope="col" className="p-3" aria-label="Details" />
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material ID</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Section</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Size</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subcategory</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">System</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alternate</th>
                  <th scope="col" className="p-3" aria-label="Comments" />
                  <th scope="col" className="p-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from(groupedByTrade.entries()).map(([trade, items]) => (
                  <V4TradeGroup
                    key={trade}
                    trade={trade}
                    items={items}
                    selectedId={selectedId}
                    onSelectRow={handleSelectRow}
                    checkedIds={checkedIds}
                    toggleCheck={toggleCheck}
                    alternativeIds={alternativeIds}
                    toggleAlternative={toggleAlternative}
                    onOpenComments={(id) => {
                      setSelectedId(null);
                      setCommentItemId(id);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom static panel — review progress + Proceed CTA */}
      <div className="shrink-0 border-t bg-card dark:bg-card px-4 sm:px-6 lg:px-12 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-sm font-medium whitespace-nowrap">
            <span className="font-semibold tabular-nums">{reviewedIds.size}</span>
            <span className="text-muted-foreground">/{filteredData.length} reviewed</span>
          </span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-xs">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00529B] to-[#003075] transition-all duration-500"
              style={{ width: `${filteredData.length > 0 ? (reviewedIds.size / filteredData.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {filteredData.length > 0 ? Math.round((reviewedIds.size / filteredData.length) * 100) : 0}%
          </span>
        </div>
        <Button
          className={cn(
            "shrink-0",
            reviewedIds.size > 0
              ? "gradient-accent text-white shadow-glow"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          disabled={reviewedIds.size === 0}
          onClick={() => router.push(`/project-v4/${projectId}/preview-cover`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Proceed to Preview Cover
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Right-side overlay panel — Evidence Sheet (wider for split view) */}
      <Sheet open={!!selectedItem && !commentItemId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent
          side="right"
          className="w-full sm:w-[85vw] md:w-[60vw] lg:w-[50vw] sm:min-w-[480px] max-w-[720px] p-0 flex flex-col"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Material Evidence</SheetTitle>
          </SheetHeader>
          {selectedItem && (
            <V4EvidenceDetail
              item={selectedItem}
              onViewPdf={(ref) => setPdfPreviewRef(ref)}
              onStatusChange={(itemId, status) => {
                setStatusOverrides((prev) => ({ ...prev, [itemId]: status }));
                setReviewedIds((prev) => new Set(prev).add(itemId));
                toast.success(`Status updated to ${status.replace(/_/g, " ")}`);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Right-side overlay panel — Comments Sheet */}
      <Sheet open={!!commentItemId} onOpenChange={(open) => { if (!open) setCommentItemId(null); }}>
        <SheetContent side="right" className="w-full sm:w-[80vw] lg:w-[50vw] sm:min-w-[540px] max-w-[840px] p-0 flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Item Comments</SheetTitle>
          </SheetHeader>
          {commentItemId && (
            <V4ItemComments
              item={projectConformanceData.find((m) => m.id === commentItemId) ?? null}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Batch comment dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Comment to {checkedIds.size} Item(s)</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="relative">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your comment here..."
                rows={4}
                className="resize-none pr-10"
              />
              <button
                type="button"
                disabled={!commentText.trim()}
                onClick={() => {
                  toast.success(`Comment added to ${checkedIds.size} item(s)`);
                  setCommentDialogOpen(false);
                  setCommentText("");
                  setCheckedIds(new Set());
                }}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center transition-colors",
                  commentText.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                aria-label="Send comment"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              This comment will be added to all {checkedIds.size} selected item(s).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCommentDialogOpen(false); setCommentText(""); }}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF preview overlay — z-[60] to sit above Sheet (z-50), 90% screen */}
      {pdfPreviewRef && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 dark:bg-black/70 flex items-center justify-center p-3 sm:p-5"
          onClick={() => setPdfPreviewRef(null)}
          role="dialog"
          aria-modal="true"
          aria-label="PDF Preview"
        >
          <div
            className="relative bg-card rounded-xl shadow-2xl w-[95vw] sm:w-[92vw] md:w-[90vw] h-[90vh] flex flex-col overflow-hidden border dark:border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium truncate">{pdfPreviewRef}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPdfPreviewRef(null)}
                className="shrink-0 gap-1.5"
                aria-label="Close PDF preview"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Close
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-muted/30 p-8">
              <div className="text-center space-y-3">
                <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto" aria-hidden="true" />
                <p className="text-base font-medium text-muted-foreground">PDF Preview</p>
                <p className="text-sm text-muted-foreground">{pdfPreviewRef}</p>
                <p className="text-xs text-muted-foreground/60">Full PDF viewer will connect to actual specification documents</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
