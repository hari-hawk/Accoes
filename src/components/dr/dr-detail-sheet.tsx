"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Calendar,
  User,
  Building2,
  Save,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DR_STATUS_CONFIG } from "@/lib/constants";
import { mockUsers } from "@/data/mock-users";
import { mockProjects } from "@/data/mock-projects";
import type { DescriptiveReport } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function DRDetailSheet({
  dr,
  open,
  onOpenChange,
  mode = "view",
}: {
  dr: DescriptiveReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "view" | "create";
}) {
  // Create mode state
  const [createProjectId, setCreateProjectId] = useState("");
  const [createName, setCreateName] = useState("");
  const [createPurpose, setCreatePurpose] = useState("");
  const [matrixFile, setMatrixFile] = useState<string | null>(null);
  const [specFile, setSpecFile] = useState<string | null>(null);

  const handleCreate = () => {
    // Mock create — would call API in production
    onOpenChange(false);
    setCreateProjectId("");
    setCreateName("");
    setCreatePurpose("");
    setMatrixFile(null);
    setSpecFile(null);
  };

  if (mode === "create") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Create New DR</SheetTitle>
            <SheetDescription>
              Set up a new Descriptive Report for a project
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-5">
              {/* Project */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Project
                </label>
                <Select value={createProjectId} onValueChange={setCreateProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* DR Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  DR Name
                </label>
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Structural Steel DR"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Purpose
                </label>
                <Textarea
                  value={createPurpose}
                  onChange={(e) => setCreatePurpose(e.target.value)}
                  placeholder="Describe the purpose of this DR..."
                  rows={3}
                />
              </div>

              <Separator />

              {/* Upload Material Matrix */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Material Matrix
                </label>
                {matrixFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium flex-1 truncate">{matrixFile}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMatrixFile(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-4 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
                    onClick={() => setMatrixFile("Material_Matrix.xlsx")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setMatrixFile("Material_Matrix.xlsx"); }}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs font-medium">Upload Material Matrix</p>
                  </div>
                )}
              </div>

              {/* Upload Project Spec */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Project Specification
                </label>
                {specFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                    <FileText className="h-5 w-5 text-red-600 shrink-0" />
                    <span className="text-sm font-medium flex-1 truncate">{specFile}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSpecFile(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-4 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
                    onClick={() => setSpecFile("Project_Specification.pdf")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setSpecFile("Project_Specification.pdf"); }}
                  >
                    <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs font-medium">Upload Project Spec</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gradient-gold text-white border-0 gap-1.5"
              disabled={!createProjectId || !createName.trim()}
              onClick={handleCreate}
            >
              <Save className="h-3.5 w-3.5" />
              Create DR
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // View mode
  if (!dr) return null;

  const project = mockProjects.find((p) => p.id === dr.projectId);
  const creator = mockUsers.find((u) => u.id === dr.createdBy);
  const statusConfig = DR_STATUS_CONFIG[dr.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg truncate">{dr.name}</SheetTitle>
            <Badge variant="secondary" className={`text-xs shrink-0 ${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
          </div>
          <SheetDescription>{dr.purpose}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">
            {/* Project info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Project
              </h4>
              {project && (
                <div className="p-3 rounded-lg border bg-muted/20">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{creator?.name ?? "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(dr.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Separator />

            {/* Files */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Uploaded Files</h4>
              {dr.materialMatrixFile && (
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dr.materialMatrixFile}</p>
                    <p className="text-xs text-muted-foreground">Material Matrix</p>
                  </div>
                </div>
              )}
              {dr.projectSpecFile && (
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <FileText className="h-5 w-5 text-red-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dr.projectSpecFile}</p>
                    <p className="text-xs text-muted-foreground">Project Specification</p>
                  </div>
                </div>
              )}
              {!dr.materialMatrixFile && !dr.projectSpecFile && (
                <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
              )}
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Timeline</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  <span>
                    Created on{" "}
                    {new Date(dr.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {dr.updatedAt !== dr.createdAt && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-nav-accent" />
                    <span>
                      Last updated{" "}
                      {new Date(dr.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
