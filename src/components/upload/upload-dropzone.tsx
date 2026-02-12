"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, FileSpreadsheet, File } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export function UploadDropzone({
  onFilesAdded,
}: {
  onFilesAdded: (files: File[]) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 100 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input {...getInputProps()} />
      <div className="rounded-xl bg-muted p-4 mb-4">
        <Upload className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-base font-medium">
        {isDragActive ? "Drop files here" : "Drop files or click to upload"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Supports PDF, XLSX, and DOCX (max 100 MB per file)
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          PDF
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileSpreadsheet className="h-3.5 w-3.5" />
          XLSX
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <File className="h-3.5 w-3.5" />
          DOCX
        </div>
      </div>
    </div>
  );
}
