"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  UserPlus,
  Briefcase,
  MapPin,
  Calendar,
  Hash,
  Users,
  Building2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { FileUploadCard } from "@/components/projects/file-upload-card";
import { useDrafts, type DraftData } from "@/providers/draft-provider";
import { generateJobId } from "@/lib/job-id-generator";
import { mockUsers } from "@/data/mock-users";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "xlsx" | "docx" | "csv" | "other";
  category: "material_metrics" | "project_specification" | "project_documents";
}

interface MemberEntry {
  userId: string;
  role: UserRole;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function categorizeFile(
  fileName: string
): "material_metrics" | "project_specification" | "project_documents" {
  const lower = fileName.toLowerCase();
  const ext = lower.split(".").pop() ?? "";

  if (["csv", "xls", "xlsx"].includes(ext)) return "material_metrics";
  if (ext === "pdf") return "project_specification";
  if (lower.includes("matrix") || lower.includes("metric"))
    return "material_metrics";
  if (lower.includes("spec") || lower.includes("specification"))
    return "project_specification";
  return "project_documents";
}

function getFileType(fileName: string): UploadedFile["type"] {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "csv") return "csv";
  if (ext === "xlsx" || ext === "xls") return "xlsx";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "pdf") return "pdf";
  return "other";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  material_metrics: {
    label: "Material Metrics",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  project_specification: {
    label: "Project Specification",
    color:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  project_documents: {
    label: "Project Documents",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

const roleConfig: Record<string, { label: string; color: string }> = {
  collaborator: {
    label: "Collaborator",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  viewer: {
    label: "Reviewer",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

/* -------------------------------------------------------------------------- */
/*  Section Card — reusable wrapper for visual consistency                     */
/* -------------------------------------------------------------------------- */

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: typeof Briefcase;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card shadow-card overflow-hidden",
        className
      )}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
        <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-tight">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Section body */}
      <div className="p-6">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mock upload data                                                           */
/* -------------------------------------------------------------------------- */

const mockMaterialMatrixFiles = [
  { name: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv", bytes: 524288 },
  { name: "UCD_Project9592330_Heating_Matrix_Index_Grid_2026-02.csv", bytes: 491520 },
  { name: "10.14.25 specs.xls", bytes: 204800 },
];

const mockProjectSpecFiles = [
  { name: "03.14.25 project file.pdf", bytes: 204800 },
  { name: "08.14.25 mechanicaldrawings.pdf", bytes: 204800 },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

interface CreateJobFormProps {
  initialDraft?: DraftData;
}

export function CreateJobForm({ initialDraft }: CreateJobFormProps) {
  const router = useRouter();
  const { addDraft } = useDrafts();

  // File state
  const [files, setFiles] = useState<UploadedFile[]>(
    initialDraft?.files ?? []
  );

  // Job details state
  const [jobId, setJobId] = useState(initialDraft?.jobId ?? "");
  const [projectName, setProjectName] = useState(
    initialDraft?.customerName ?? ""
  );
  const [companyClient, setCompanyClient] = useState(
    initialDraft?.assignedEstimator ?? ""
  );
  const [createdDate, setCreatedDate] = useState(
    initialDraft?.bidDate ?? new Date().toISOString().split("T")[0]
  );
  const [location, setLocation] = useState(initialDraft?.notes ?? "");
  const [priority, setPriority] = useState<"high" | "medium" | "low">(
    initialDraft?.priority ?? "high"
  );

  // Access control
  const [members, setMembers] = useState<MemberEntry[]>(
    initialDraft?.members ?? []
  );
  const [memberSearch, setMemberSearch] = useState("");
  const [memberRole, setMemberRole] = useState<string>("collaborator");

  // Cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Upload counter for unique IDs
  const [uploadCounter, setUploadCounter] = useState(0);

  /* ---------------------------------------------------------------------- */
  /*  Derived                                                                */
  /* ---------------------------------------------------------------------- */

  const hasData =
    files.length > 0 ||
    jobId.trim() !== "" ||
    projectName.trim() !== "" ||
    companyClient.trim() !== "" ||
    location.trim() !== "";

  const canCreate =
    files.length > 0 &&
    jobId.trim() !== "" &&
    projectName.trim() !== "" &&
    companyClient.trim() !== "";

  // Group files by category
  const filesByCategory = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) acc[file.category] = [];
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, UploadedFile[]>
  );

  /* ---------------------------------------------------------------------- */
  /*  Handlers                                                               */
  /* ---------------------------------------------------------------------- */

  const autoPopulateOnFirstUpload = () => {
    if (files.length === 0) {
      setProjectName("Riverside Commercial Tower");
      setJobId(generateJobId("Riverside Commercial Tower"));
      setCompanyClient("Henry Thomas Construction LLC");
      setCreatedDate(new Date().toISOString().split("T")[0]);
      setLocation("Sacramento, CA");
    }
  };

  const handleUploadMaterialMatrix = () => {
    autoPopulateOnFirstUpload();
    const batch: UploadedFile[] = mockMaterialMatrixFiles.map((f, i) => ({
      id: `file-${uploadCounter + i}-${Date.now()}`,
      name: f.name,
      size: formatFileSize(f.bytes),
      type: getFileType(f.name),
      category: "material_metrics" as const,
    }));
    setUploadCounter((c) => c + batch.length);
    setFiles((prev) => [...prev, ...batch]);
  };

  const handleUploadProjectSpec = () => {
    autoPopulateOnFirstUpload();
    const batch: UploadedFile[] = mockProjectSpecFiles.map((f, i) => ({
      id: `file-${uploadCounter + i + 100}-${Date.now()}`,
      name: f.name,
      size: formatFileSize(f.bytes),
      type: getFileType(f.name),
      category: "project_specification" as const,
    }));
    setUploadCounter((c) => c + batch.length);
    setFiles((prev) => [...prev, ...batch]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleAddMember = () => {
    const term = memberSearch.trim().toLowerCase();
    if (!term) return;

    const match = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === term ||
        u.name.toLowerCase().includes(term)
    );
    if (!match) return;
    if (members.some((m) => m.userId === match.id)) return;

    setMembers((prev) => [
      ...prev,
      { userId: match.id, role: memberRole as UserRole },
    ]);
    setMemberSearch("");
  };

  const handleRemoveMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  const handleCreate = () => {
    router.push("/projects");
  };

  const handleCancel = () => {
    if (hasData) {
      setCancelDialogOpen(true);
    } else {
      router.push("/projects");
    }
  };

  const handleSaveAsDraft = () => {
    addDraft({
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        category: f.category,
      })),
      links: [],
      jobId,
      customerName: projectName,
      priority,
      bidDate: createdDate,
      points: 0,
      assignedEstimator: companyClient,
      notes: location,
      members: members.map((m) => ({
        userId: m.userId,
        role: m.role as "collaborator" | "viewer",
      })),
    });
    setCancelDialogOpen(false);
    router.push("/projects");
  };

  const handleDiscard = () => {
    setCancelDialogOpen(false);
    router.push("/projects");
  };

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* ================================================================ */}
      {/*  Section 1: Upload Documents                                      */}
      {/* ================================================================ */}
      <SectionCard
        icon={Upload}
        title="Upload Documents"
        description="Upload your material matrix and project specification files separately"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* ── Material Matrix Upload ─────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5",
                  categoryConfig.material_metrics.color
                )}
              >
                Material Matrix
              </Badge>
              <span className="text-[11px] text-muted-foreground">CSV, XLS</span>
            </div>
            <div
              className="rounded-xl border-2 border-dashed border-emerald-400/30 p-8 text-center hover:border-emerald-400/60 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none"
              role="button"
              tabIndex={0}
              aria-label="Click to upload material matrix files (CSV, XLS)"
              onClick={handleUploadMaterialMatrix}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleUploadMaterialMatrix();
                }
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">
                Drag &amp; drop or{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 200MB each
              </p>
            </div>

            {/* Material Matrix file list */}
            {(filesByCategory["material_metrics"]?.length ?? 0) > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {filesByCategory["material_metrics"].length} file
                  {filesByCategory["material_metrics"].length !== 1 ? "s" : ""} uploaded
                </span>
                <div className="flex flex-wrap gap-2.5" role="list" aria-label="Material matrix files">
                  {filesByCategory["material_metrics"].map((file) => (
                    <div key={file.id} role="listitem">
                      <FileUploadCard
                        name={file.name}
                        size={file.size}
                        type={file.type}
                        onRemove={() => handleRemoveFile(file.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Project Specification Upload ───────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5",
                  categoryConfig.project_specification.color
                )}
              >
                Project Specification
              </Badge>
              <span className="text-[11px] text-muted-foreground">PDF</span>
            </div>
            <div
              className="rounded-xl border-2 border-dashed border-blue-400/30 p-8 text-center hover:border-blue-400/60 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none"
              role="button"
              tabIndex={0}
              aria-label="Click to upload project specification files (PDF)"
              onClick={handleUploadProjectSpec}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleUploadProjectSpec();
                }
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium">
                Drag &amp; drop or{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max 200MB each
              </p>
            </div>

            {/* Project Specification file list */}
            {(filesByCategory["project_specification"]?.length ?? 0) > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {filesByCategory["project_specification"].length} file
                  {filesByCategory["project_specification"].length !== 1 ? "s" : ""} uploaded
                </span>
                <div className="flex flex-wrap gap-2.5" role="list" aria-label="Project specification files">
                  {filesByCategory["project_specification"].map((file) => (
                    <div key={file.id} role="listitem">
                      <FileUploadCard
                        name={file.name}
                        size={file.size}
                        type={file.type}
                        onRemove={() => handleRemoveFile(file.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ================================================================ */}
      {/*  Section 2: Job Details — 3-column grid                           */}
      {/* ================================================================ */}
      <SectionCard
        icon={Briefcase}
        title="Project Information"
        description="Core project information — auto-populated from uploaded files"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-5">
          {/* Row 1 */}
          <div className="space-y-2">
            <label
              htmlFor="job-id"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Hash className="h-3 w-3" aria-hidden="true" />
              Job ID <span className="text-destructive">*</span>
            </label>
            <Input
              id="job-id"
              placeholder="e.g. ACX-2026-001"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              aria-required="true"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-name"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Briefcase className="h-3 w-3" aria-hidden="true" />
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              aria-required="true"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company-client"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Building2 className="h-3 w-3" aria-hidden="true" />
              Company / Client <span className="text-destructive">*</span>
            </label>
            <Input
              id="company-client"
              placeholder="Enter company or client name"
              value={companyClient}
              onChange={(e) => setCompanyClient(e.target.value)}
              aria-required="true"
              className="h-10"
            />
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <label
              htmlFor="created-date"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Calendar className="h-3 w-3" aria-hidden="true" />
              Created Date <span className="text-destructive">*</span>
            </label>
            <Input
              id="created-date"
              type="date"
              value={createdDate}
              onChange={(e) => setCreatedDate(e.target.value)}
              aria-required="true"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Location
            </label>
            <Input
              id="location"
              placeholder="City, State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Briefcase className="h-3 w-3" aria-hidden="true" />
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(v) =>
                setPriority(v as "high" | "medium" | "low")
              }
            >
              <SelectTrigger id="priority" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* ================================================================ */}
      {/*  Section 3: Access Control                                        */}
      {/* ================================================================ */}
      <SectionCard
        icon={Users}
        title="Access Control"
        description="Invite team members and assign roles"
      >
        {/* Add member */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Add by name or email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMember();
              }}
              className="pl-10 h-10"
              aria-label="Search for a team member by name or email"
            />
          </div>
          <Select value={memberRole} onValueChange={setMemberRole}>
            <SelectTrigger className="w-[140px] shrink-0 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collaborator">Collaborator</SelectItem>
              <SelectItem value="viewer">Reviewer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="shrink-0 h-10 px-5 gradient-accent text-white border-0"
            onClick={handleAddMember}
            disabled={!memberSearch.trim()}
          >
            Add
          </Button>
        </div>

        {/* Member list */}
        {members.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {members.map((entry) => {
              const user = mockUsers.find((u) => u.id === entry.userId);
              if (!user) return null;
              const rc = roleConfig[entry.role] ?? {
                label: entry.role,
                color: "bg-muted text-muted-foreground",
              };

              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/30 transition-colors group"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    onClick={() => handleRemoveMember(entry.userId)}
                    aria-label={`Remove ${user.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {members.length === 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            No members added yet. You can add team members or skip this step.
          </p>
        )}
      </SectionCard>

      {/* ================================================================ */}
      {/*  Footer CTAs                                                      */}
      {/* ================================================================ */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-6">
        <Button variant="outline" size="lg" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          size="lg"
          className="gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity font-semibold px-8"
          disabled={!canCreate}
          onClick={handleCreate}
        >
          Create Project
        </Button>
      </div>

      {/* ================================================================ */}
      {/*  Cancel Confirmation Dialog                                       */}
      {/* ================================================================ */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save this as a draft
              or discard your changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel onClick={() => setCancelDialogOpen(false)}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDiscard}
            >
              Discard
            </AlertDialogAction>
            <AlertDialogAction
              className="gradient-action text-white border-0"
              onClick={handleSaveAsDraft}
            >
              Save as Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
