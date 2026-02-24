"use client";

import { X, FileText, FileSpreadsheet, FileType, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fileTypeConfig: Record<
  string,
  { icon: typeof FileText; bgColor: string; iconColor: string; label: string }
> = {
  pdf: {
    icon: FileText,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    label: "PDF",
  },
  xlsx: {
    icon: FileSpreadsheet,
    bgColor: "bg-status-pre-approved-bg",
    iconColor: "text-status-pre-approved",
    label: "XLS",
  },
  xls: {
    icon: FileSpreadsheet,
    bgColor: "bg-status-pre-approved-bg",
    iconColor: "text-status-pre-approved",
    label: "XLS",
  },
  csv: {
    icon: FileSpreadsheet,
    bgColor: "bg-status-pre-approved-bg",
    iconColor: "text-status-pre-approved",
    label: "CSV",
  },
  docx: {
    icon: FileType,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "DOC",
  },
  other: {
    icon: File,
    bgColor: "bg-status-review-required-bg",
    iconColor: "text-status-review-required",
    label: "FILE",
  },
};

interface FileUploadCardProps {
  name: string;
  size: string;
  type: string;
  onRemove: () => void;
}

export function FileUploadCard({
  name,
  size,
  type,
  onRemove,
}: FileUploadCardProps) {
  const config = fileTypeConfig[type] ?? fileTypeConfig.other;
  const FileIcon = config.icon;

  return (
    <div className="relative group rounded-xl border bg-card shadow-card p-3 pr-8 flex items-center gap-3 w-full">
      {/* Remove button — vertically centered */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 -translate-y-1/2 right-1.5 h-5 w-5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-muted-foreground hover:text-destructive transition-opacity focus-visible:opacity-100"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* File icon */}
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
          config.bgColor
        )}
      >
        <FileIcon
          className={cn("h-4 w-4", config.iconColor)}
          aria-hidden="true"
        />
      </div>

      {/* File info */}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground">{size}</p>
      </div>
    </div>
  );
}
