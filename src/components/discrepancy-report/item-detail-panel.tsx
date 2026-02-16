"use client";

import { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Brain,
  MessageSquare,
  Send,
  FileText,
  Table2,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISCREPANCY_STATUS_CONFIG } from "@/lib/constants";
import { mockUsers } from "@/data/mock-users";
import type { MaterialItem, DiscrepancyStatus } from "@/data/types";

interface ItemDetailPanelProps {
  item: MaterialItem;
  onClose: () => void;
  onStatusChange: (id: string, status: DiscrepancyStatus) => void;
}

const statusIcons: Record<DiscrepancyStatus, typeof CheckCircle2> = {
  pre_approved: CheckCircle2,
  review_required: AlertTriangle,
  action_mandatory: XCircle,
};

const sourceIcons = [
  { label: "Material Matrix", icon: Table2, color: "text-blue-500" },
  { label: "Project Spec", icon: BookOpen, color: "text-purple-500" },
  { label: "Project Index", icon: FileText, color: "text-amber-500" },
];

export function ItemDetailPanel({
  item,
  onClose,
  onStatusChange,
}: ItemDetailPanelProps) {
  const [newComment, setNewComment] = useState("");

  const config = DISCREPANCY_STATUS_CONFIG[item.status];
  const StatusIcon = statusIcons[item.status];

  const comparisonData = [
    { source: "Material Matrix", value: item.materialMatrixValue },
    { source: "Project Spec", value: item.projectSpecValue },
    { source: "Project Index", value: item.projectIndexValue },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-background border-l shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold">{item.itemName}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.description}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">
            {item.specSection}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status + Score */}
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={`${config.color} ${config.bgColor}`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
          <span
            className={`text-sm font-bold ${
              item.confidenceScore >= 90
                ? "text-status-pre-approved"
                : item.confidenceScore >= 60
                  ? "text-status-review-required"
                  : "text-status-action-mandatory"
            }`}
          >
            {item.confidenceScore}% confidence
          </span>
        </div>

        {/* Change Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Change Status
          </label>
          <Select
            value={item.status}
            onValueChange={(v) => onStatusChange(item.id, v as DiscrepancyStatus)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pre_approved">Pre-Approved</SelectItem>
              <SelectItem value="review_required">Review Required</SelectItem>
              <SelectItem value="action_mandatory">Action Mandatory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3-File Comparison */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            3-File Comparison
          </h3>
          <div className="space-y-2">
            {comparisonData.map((entry, i) => {
              const SourceIcon = sourceIcons[i].icon;
              return (
                <div
                  key={entry.source}
                  className="rounded-lg border p-3 space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <SourceIcon className={`h-3.5 w-3.5 ${sourceIcons[i].color}`} />
                    <span className="text-xs font-medium">{entry.source}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {entry.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Brain className="h-4 w-4 text-nav-accent" />
            AI Analysis
          </h3>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.aiReason}
            </p>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Comments ({item.comments.length})
          </h3>

          {item.comments.length === 0 && (
            <p className="text-xs text-muted-foreground">No comments yet.</p>
          )}

          <div className="space-y-2">
            {item.comments.map((comment) => {
              const author = mockUsers.find((u) => u.id === comment.authorId);
              return (
                <div key={comment.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {author?.name ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Add Comment */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-xs h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newComment.trim()) {
                  setNewComment("");
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={!newComment.trim()}
              onClick={() => setNewComment("")}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
