"use client";

import { useState } from "react";
import {
  Pencil,
  X,
  Save,
  Upload,
  FileText,
  FileSpreadsheet,
  FileType,
  Users,
  UserPlus,
  Trash2,
  Calendar,
  Building2,
  Share2,
  MapPin,
  Briefcase,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { mockUsers } from "@/data/mock-users";
import { getVersionsByProject } from "@/data/mock-versions";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { cn } from "@/lib/utils";
import type { Project, Document as DocType, ProjectStatus } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  File type helpers                                                          */
/* -------------------------------------------------------------------------- */

const fileTypeConfig: Record<
  string,
  { label: string; color: string; icon: typeof FileText }
> = {
  pdf: {
    label: "PDF",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: FileText,
  },
  xlsx: {
    label: "XLSX",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: FileSpreadsheet,
  },
  docx: {
    label: "DOCX",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: FileType,
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: {
    label: "Admin",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  global_viewer: {
    label: "Global Viewer",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  submitter: {
    label: "Submitter",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  reviewer: {
    label: "Reviewer",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editJobId, setEditJobId] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("planning");

  if (!project) return null;

  // Gather all documents across all versions for this project
  const versions = getVersionsByProject(project.id);
  const allDocs: DocType[] = versions.flatMap((v) =>
    getDocumentsByVersion(v.id)
  );

  // Resolve team members
  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean) as typeof mockUsers;

  const startEdit = () => {
    setEditName(project.name);
    setEditClient(project.client);
    setEditJobId(project.jobId);
    setEditLocation(project.location);
    setEditStatus(project.status);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = () => {
    // Mock save — in production this would call an API
    setEditing(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg truncate">
                  {project.name}
                </SheetTitle>
                <StatusIndicator status={project.status} />
              </div>
              <SheetDescription className="mt-1">
                {project.client}
              </SheetDescription>
            </div>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={startEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* ============================================================ */}
            {/*  Section: Project Information                                 */}
            {/* ============================================================ */}
            {editing ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Edit Project</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Project Name
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Client
                    </label>
                    <Input
                      value={editClient}
                      onChange={(e) => setEditClient(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Job ID
                      </label>
                      <Input
                        value={editJobId}
                        onChange={(e) => setEditJobId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Location
                      </label>
                      <Input
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={editStatus}
                      onValueChange={(v) => setEditStatus(v as ProjectStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" onClick={saveEdit} className="gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="gap-1.5"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Project Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{project.jobId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Created{" "}
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{members.length} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className={cn(
                        "font-bold",
                        project.confidenceSummary.overallConfidence >= 80
                          ? "text-status-pre-approved"
                          : project.confidenceSummary.overallConfidence >= 60
                            ? "text-status-review-required"
                            : project.confidenceSummary.overallConfidence > 0
                              ? "text-status-action-mandatory"
                              : "text-muted-foreground"
                      )}
                    >
                      {project.confidenceSummary.overallConfidence > 0
                        ? `${project.confidenceSummary.overallConfidence}% confidence`
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* ============================================================ */}
            {/*  Section: Material Files                                      */}
            {/* ============================================================ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Material Files
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {allDocs.length} files
                </Badge>
              </div>

              {allDocs.length > 0 ? (
                <div className="space-y-2">
                  {allDocs.map((doc) => {
                    const ftConfig = fileTypeConfig[doc.fileType] ?? {
                      label: doc.fileType.toUpperCase(),
                      color: "bg-muted text-muted-foreground",
                      icon: FileText,
                    };
                    const FileIcon = ftConfig.icon;
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.fileName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                ftConfig.color
                              )}
                            >
                              {ftConfig.label}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              {formatFileSize(doc.fileSize)}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {doc.specSection}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No files uploaded yet
                </div>
              )}

              {/* Upload drop zone */}
              <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 text-center hover:border-nav-accent/40 transition-colors cursor-pointer">
                <div className="mx-auto w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  Drop material matrix files here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, XLSX, DOCX up to 50MB each
                </p>
              </div>
            </div>

            <Separator />

            {/* ============================================================ */}
            {/*  Section: Share Access                                        */}
            {/* ============================================================ */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4 text-primary" />
                Share Access
              </h4>

              {/* Current members */}
              <div className="space-y-2">
                {members.map((user) => {
                  const rc = roleConfig[user.role] ?? {
                    label: user.role,
                    color: "bg-muted text-muted-foreground",
                  };
                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-[11px] font-bold gradient-accent text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px] shrink-0", rc.color)}
                      >
                        {rc.label}
                      </Badge>
                      {user.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add member */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Add by name or email..."
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="submitter">
                  <SelectTrigger className="w-[130px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitter">Submitter</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="global_viewer">Global Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="shrink-0">
                  Add
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Submitters can upload files and edit project details.
                Reviewers can view and approve submittals.
              </p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
