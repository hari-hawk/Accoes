"use client";

import { X, FileText, FileSpreadsheet, File, CheckCircle2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
}

const FILE_ICONS: Record<string, LucideIcon> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  docx: File,
};

function getFileIconComponent(name: string): LucideIcon {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICONS[ext] ?? File;
}

function FileItem({
  item,
  onRemove,
  icon: Icon,
}: {
  item: UploadFile;
  onRemove: (id: string) => void;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(item.file.size)}
        </p>
        {item.status === "uploading" && (
          <Progress value={item.progress} className="mt-1.5 h-1" />
        )}
      </div>
      <div className="flex items-center gap-2">
        {item.status === "complete" && (
          <CheckCircle2 className="h-4 w-4 text-status-pre-approved" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.file.name}`}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function FileList({
  files,
  onRemove,
  className,
}: {
  files: UploadFile[];
  onRemove: (id: string) => void;
  className?: string;
}) {
  if (files.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">
        {files.length} file{files.length !== 1 ? "s" : ""} selected
      </p>
      {files.map((item) => (
        <FileItem
          key={item.id}
          item={item}
          onRemove={onRemove}
          icon={getFileIconComponent(item.file.name)}
        />
      ))}
    </div>
  );
}
