"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  FileType,
  ChevronRight,
  ChevronLeft,
  Check,
  UserPlus,
  X,
  MapPin,
  Briefcase,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUsers } from "@/data/mock-users";
import type { ProjectStatus, UserRole } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Steps — 3-step flow: Upload → Details → Access                            */
/* -------------------------------------------------------------------------- */

const steps = [
  { label: "Upload", description: "Upload Documents" },
  { label: "Details", description: "Project Info" },
  { label: "Access", description: "Share Access" },
];

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "xlsx" | "docx" | "csv";
  category: "material_index" | "specification";
}

interface MemberEntry {
  userId: string;
  role: UserRole;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const fileTypeConfig: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
  xlsx: { icon: FileSpreadsheet, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  csv: { icon: FileSpreadsheet, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  docx: { icon: FileType, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
};

/** Determine category from file extension: CSV → Material Index Grid, everything else → Project Specification */
function categorizeFile(fileName: string): "material_index" | "specification" {
  return fileName.toLowerCase().endsWith(".csv") ? "material_index" : "specification";
}

/** Get file extension type */
function getFileType(fileName: string): UploadedFile["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "csv") return "csv";
  if (ext === "xlsx" || ext === "xls") return "xlsx";
  if (ext === "docx" || ext === "doc") return "docx";
  return "pdf";
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);

  // Step 1: Upload — multiple files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Step 2: Auto-extracted fields (mock)
  const [projectName, setProjectName] = useState("");
  const [jobId, setJobId] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("in_progress");

  // Step 3: Share access
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("collaborator");

  // Mock file counter for unique IDs
  const [fileCounter, setFileCounter] = useState(0);

  const handleUploadFiles = () => {
    // Simulate uploading a batch of files — mix of CSV (Material Index Grid) and non-CSV (Project Specification)
    const mockNames = [
      "Material_Index_Grid_2026.csv",
      "Hangers_Supports_Hardware.csv",
      "Structural_Steel_Shop_Drawings.pdf",
      "HVAC_Equipment_Schedule.pdf",
      "Specification_Volume_1.pdf",
    ];
    const mockSizes = ["1.2 MB", "0.8 MB", "4.8 MB", "1.2 MB", "3.5 MB"];
    const mockBatch: UploadedFile[] = mockNames.map((name, i) => ({
      id: `f-${fileCounter + i}`,
      name,
      size: mockSizes[i],
      type: getFileType(name),
      category: categorizeFile(name),
    }));
    setFileCounter((c) => c + mockNames.length);
    setUploadedFiles((prev) => [...prev, ...mockBatch]);

    // Mock auto-extraction from first upload
    if (uploadedFiles.length === 0) {
      setProjectName("New Commercial Tower");
      setJobId("NCT-2026-001");
      setLocation("Chicago, IL");
      setClient("Apex Development Corp");
    }
  };

  const handleAddMoreFiles = () => {
    const name = `Additional_Document_${fileCounter}.pdf`;
    const extra: UploadedFile[] = [
      { id: `f-${fileCounter}`, name, size: "1.1 MB", type: getFileType(name), category: categorizeFile(name) },
    ];
    setFileCounter((c) => c + 1);
    setUploadedFiles((prev) => [...prev, ...extra]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleAddMember = () => {
    if (!addEmail.trim()) return;
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === addEmail.toLowerCase() || u.name.toLowerCase().includes(addEmail.toLowerCase())
    );
    if (found) {
      setMembers((prev) => {
        if (prev.some((m) => m.userId === found.id)) return prev;
        return [...prev, { userId: found.id, role: addRole }];
      });
    }
    setAddEmail("");
  };

  const handleRemoveMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  const handleCreate = () => {
    // Mock create — in production this would call an API
    onOpenChange(false);
    // Reset
    setStep(0);
    setUploadedFiles([]);
    setFileCounter(0);
    setProjectName("");
    setJobId("");
    setLocation("");
    setClient("");
    setStatus("in_progress");
    setMembers([]);
  };

  const canNext =
    (step === 0 && uploadedFiles.length > 0) ||
    (step === 1 && projectName.trim() && jobId.trim()) ||
    step === 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Upload documents to get started
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i < step
                      ? "bg-status-pre-approved text-white"
                      : i === step
                        ? "gradient-accent text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-medium truncate">{s.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5 min-h-[300px]">
          {/* Step 1: Upload Material Files — Multiple */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload documents for this project. CSV files are categorized as
                Material Index Grid; other files as Project Specification.
                Project details will be auto-extracted.
              </p>

              {uploadedFiles.length === 0 ? (
                <div
                  className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
                  onClick={handleUploadFiles}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleUploadFiles();
                  }}
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">
                    Click to upload files
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Excel (.xlsx), Word (.docx), CSV — up to 50MB each
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You can select multiple files
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* File list — grouped by category */}
                  <ScrollArea className={uploadedFiles.length > 4 ? "h-[200px]" : ""}>
                    <div className="space-y-2 pr-2">
                      {/* Material Index Grid files (CSV) */}
                      {uploadedFiles.filter((f) => f.category === "material_index").length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              Material Index Grid
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {uploadedFiles.filter((f) => f.category === "material_index").length} file{uploadedFiles.filter((f) => f.category === "material_index").length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {uploadedFiles.filter((f) => f.category === "material_index").map((file) => {
                            const ft = fileTypeConfig[file.type] ?? fileTypeConfig.pdf;
                            const FileIcon = ft.icon;
                            return (
                              <div key={file.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/10">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${ft.color}`}>
                                  <FileIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{file.size}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveFile(file.id)}>
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Project Specification files (non-CSV) */}
                      {uploadedFiles.filter((f) => f.category === "specification").length > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Project Specification
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {uploadedFiles.filter((f) => f.category === "specification").length} file{uploadedFiles.filter((f) => f.category === "specification").length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {uploadedFiles.filter((f) => f.category === "specification").map((file) => {
                            const ft = fileTypeConfig[file.type] ?? fileTypeConfig.pdf;
                            const FileIcon = ft.icon;
                            return (
                              <div key={file.id} className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/10">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${ft.color}`}>
                                  <FileIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{file.size}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveFile(file.id)}>
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Summary + Add more */}
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-muted-foreground">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} uploaded
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={handleAddMoreFiles}
                    >
                      <Plus className="h-3 w-3" />
                      Add More Files
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Project Details (auto-extracted, editable) */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and edit the auto-extracted project details.
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Project Name
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Client
                  </label>
                  <Input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client name..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Job ID
                    </label>
                    <Input
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      placeholder="JOB-2026-001"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as ProjectStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Share Access */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add team members and assign roles. You can skip this step and add
                members later.
              </p>

              {/* Add member input */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="pl-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddMember();
                    }}
                  />
                </div>
                <Select
                  value={addRole}
                  onValueChange={(v) => setAddRole(v as UserRole)}
                >
                  <SelectTrigger className="w-[130px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaborator">Collaborator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddMember}>
                  Add
                </Button>
              </div>

              {/* Members list */}
              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((m) => {
                    const user = mockUsers.find((u) => u.id === m.userId);
                    if (!user) return null;
                    return (
                      <div
                        key={m.userId}
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
                        <Badge variant="secondary" className="text-[10px] shrink-0 capitalize">
                          {m.role === "global_viewer" ? "Viewer" : m.role === "submitter" ? "Collaborator" : m.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMember(m.userId)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No members added yet. You can skip this step.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep(step - 1))}
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            {step < 2 ? (
              <Button
                size="sm"
                disabled={!canNext}
                onClick={() => setStep(step + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleCreate}
                className="gradient-gold text-white border-0 gap-1"
              >
                <Check className="h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
