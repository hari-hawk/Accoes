"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { FileList, type UploadFile } from "@/components/upload/file-list";

export default function UploadPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string; versionId: string }>();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [specVersion, setSpecVersion] = useState("rev-b");

  const onFilesAdded = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      progress: 0,
      status: "uploading" as const,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  // Simulate upload progress
  useEffect(() => {
    const uploading = files.filter((f) => f.status === "uploading");
    if (uploading.length === 0) return;

    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status !== "uploading") return f;
          const newProgress = Math.min(f.progress + 15 + Math.random() * 20, 100);
          return {
            ...f,
            progress: newProgress,
            status: newProgress >= 100 ? "complete" : "uploading",
          };
        })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [files]);

  const onRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const allComplete = files.length > 0 && files.every((f) => f.status === "complete");

  return (
    <div className="absolute inset-0 overflow-auto">
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Upload Documents</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload submittal documents for AI validation
        </p>
      </div>

      <UploadDropzone onFilesAdded={onFilesAdded} />

      <FileList files={files} onRemove={onRemove} />

      {files.length > 0 && (
        <div className="space-y-4 rounded-lg border p-5">
          <div>
            <label className="text-sm font-medium">Specification Version</label>
            <Select value={specVersion} onValueChange={setSpecVersion}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rev-a">Project Specifications Rev A</SelectItem>
                <SelectItem value="rev-b">Project Specifications Rev B (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            disabled={!allComplete}
            onClick={() => {
              router.push(
                `/projects/${params.projectId}/versions/${params.versionId}/processing`
              );
            }}
          >
            <Rocket className="mr-2 h-4 w-4" />
            Start AI Processing
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}
