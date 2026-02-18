"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Plus,
  X,
  Link2,
  UserPlus,
  Briefcase,
  MapPin,
  Calendar,
  Hash,
  Users,
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

interface LinkEntry {
  id: string;
  url: string;
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

  // Extension-based
  if (["csv", "xls", "xlsx"].includes(ext)) return "material_metrics";
  if (ext === "pdf") return "project_specification";

  // Name-based
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

const categoryConfig: Record<
  string,
  { label: string; color: string }
> = {
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
    label: "Viewer",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

/* -------------------------------------------------------------------------- */
/*  Mock upload data                                                           */
/* -------------------------------------------------------------------------- */

const mockBatchFiles = [
  { name: "03.14.25 project file.pdf", bytes: 204800 },
  { name: "10.14.25 specs.xls", bytes: 204800 },
  { name: "08.14.25 mechanicaldrawings.pdf", bytes: 204800 },
  { name: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv", bytes: 524288 },
  { name: "UCD_Project9592330_Heating_Matrix_Index_Grid_2026-02.csv", bytes: 491520 },
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

  // Link state
  const [links, setLinks] = useState<LinkEntry[]>(
    initialDraft?.links ?? []
  );
  const [linkInput, setLinkInput] = useState("");

  // Job details state
  const [jobId, setJobId] = useState(initialDraft?.jobId ?? "");
  const [customerName, setCustomerName] = useState(
    initialDraft?.customerName ?? ""
  );
  const [priority, setPriority] = useState<"high" | "medium" | "low">(
    initialDraft?.priority ?? "high"
  );
  const [bidDate, setBidDate] = useState(initialDraft?.bidDate ?? "");
  const [points, setPoints] = useState(initialDraft?.points ?? 0);
  const [assignedEstimator, setAssignedEstimator] = useState(
    initialDraft?.assignedEstimator ?? ""
  );

  // Notes
  const [notes, setNotes] = useState(initialDraft?.notes ?? "");

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
    links.length > 0 ||
    jobId.trim() ||
    customerName.trim() ||
    notes.trim();

  const canCreate =
    files.length > 0 &&
    jobId.trim() !== "" &&
    customerName.trim() !== "" &&
    assignedEstimator.trim() !== "";

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

  const handleUploadFiles = () => {
    const isFirstUpload = files.length === 0;
    const batch: UploadedFile[] = mockBatchFiles.map((f, i) => ({
      id: `file-${uploadCounter + i}-${Date.now()}`,
      name: f.name,
      size: formatFileSize(f.bytes),
      type: getFileType(f.name),
      category: categorizeFile(f.name),
    }));

    setUploadCounter((c) => c + batch.length);
    setFiles((prev) => [...prev, ...batch]);

    // Auto-populate on first upload
    if (isFirstUpload) {
      setCustomerName("Henry Thomas");
      setJobId(generateJobId("Henry Thomas"));
      setAssignedEstimator("Jacob Swan");
      setBidDate("2024-05-05");
      setPoints(8);
    }
  };

  const handleAddMoreFiles = () => {
    const newFile: UploadedFile = {
      id: `file-${uploadCounter}-${Date.now()}`,
      name: `Additional_Document_${uploadCounter + 1}.pdf`,
      size: "1.2 MB",
      type: "pdf",
      category: categorizeFile(`Additional_Document_${uploadCounter + 1}.pdf`),
    };
    setUploadCounter((c) => c + 1);
    setFiles((prev) => [...prev, newFile]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleAddLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    setLinks((prev) => [
      ...prev,
      { id: `link-${Date.now()}`, url },
    ]);
    setLinkInput("");
  };

  const handleRemoveLink = (linkId: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
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
    // Mock creation — in production this would call an API
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
      links,
      jobId,
      customerName,
      priority,
      bidDate,
      points,
      assignedEstimator,
      notes,
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
    <div className="space-y-8">
      {/* ================================================================ */}
      {/*  Section 1: Upload Documents                                      */}
      {/* ================================================================ */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" aria-hidden="true" />
          Upload Documents
        </h2>

        {/* Drop zone */}
        <div
          className="rounded-xl border-2 border-dashed border-nav-accent/30 p-8 text-center hover:border-nav-accent/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 outline-none bg-nav-accent/[0.02]"
          role="button"
          tabIndex={0}
          aria-label="Click to select files for upload"
          onClick={handleUploadFiles}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleUploadFiles();
            }
          }}
        >
          <div className="mx-auto w-12 h-12 rounded-xl bg-nav-accent/10 flex items-center justify-center mb-3">
            <Upload className="h-6 w-6 text-nav-accent" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">
            Drag &amp; drop files or{" "}
            <span className="text-nav-accent font-semibold">
              click to browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your files (PDF, DWG, RVT, MAJ — Max 10MB each)
          </p>
        </div>

        {/* Uploaded file cards — grouped by category */}
        {files.length > 0 && (
          <div className="mt-4 space-y-4">
            {(
              [
                "material_metrics",
                "project_specification",
                "project_documents",
              ] as const
            ).map((cat) => {
              const catFiles = filesByCategory[cat];
              if (!catFiles || catFiles.length === 0) return null;
              const config = categoryConfig[cat];

              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px] font-bold", config.color)}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      ({catFiles.length})
                    </span>
                  </div>
                  <div
                    className="flex flex-wrap gap-3"
                    role="list"
                    aria-label={`${config.label} files`}
                  >
                    {catFiles.map((file) => (
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
              );
            })}

            {/* Add more files button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleAddMoreFiles}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add More Files
            </Button>
          </div>
        )}
      </section>

      {/* ================================================================ */}
      {/*  Section 2: Add Link(s)                                           */}
      {/* ================================================================ */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
          Add link(s)
        </h2>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter URL"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddLink();
            }}
            className="flex-1"
            aria-label="Enter a URL to add"
          />
          <Button
            size="sm"
            className="shrink-0 gradient-accent text-white border-0"
            onClick={handleAddLink}
            disabled={!linkInput.trim()}
          >
            Add
          </Button>
        </div>

        {links.length > 0 && (
          <div className="mt-3 space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-muted/30 group"
              >
                <Link2
                  className="h-3.5 w-3.5 text-nav-accent shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm text-nav-accent truncate flex-1">
                  {link.url}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveLink(link.id)}
                  aria-label={`Remove link ${link.url}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* ================================================================ */}
      {/*  Section 3: Job Details                                           */}
      {/* ================================================================ */}
      <section>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" aria-hidden="true" />
          Job Details
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {/* Row 1 */}
          <div className="space-y-1.5">
            <label
              htmlFor="job-id"
              className="text-xs font-medium text-muted-foreground"
            >
              Job ID <span className="text-destructive">*</span>
            </label>
            <Input
              id="job-id"
              placeholder="Enter job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="customer-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Customer Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="priority"
              className="text-xs font-medium text-muted-foreground"
            >
              Priority <span className="text-destructive">*</span>
            </label>
            <Select
              value={priority}
              onValueChange={(v) =>
                setPriority(v as "high" | "medium" | "low")
              }
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 2 */}
          <div className="space-y-1.5">
            <label
              htmlFor="bid-date"
              className="text-xs font-medium text-muted-foreground flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" aria-hidden="true" />
              Bid Date
            </label>
            <Input
              id="bid-date"
              type="date"
              value={bidDate}
              onChange={(e) => setBidDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="points"
              className="text-xs font-medium text-muted-foreground flex items-center gap-1"
            >
              <Hash className="h-3 w-3" aria-hidden="true" />
              Points
            </label>
            <Input
              id="points"
              type="number"
              min={0}
              placeholder="Placeholder"
              value={points || ""}
              onChange={(e) => setPoints(Number(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="assigned-estimator"
              className="text-xs font-medium text-muted-foreground flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Assigned Estimator <span className="text-destructive">*</span>
            </label>
            <Input
              id="assigned-estimator"
              placeholder="Enter estimator name"
              value={assignedEstimator}
              onChange={(e) => setAssignedEstimator(e.target.value)}
              aria-required="true"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ================================================================ */}
      {/*  Section 4: Notes / Comments                                      */}
      {/* ================================================================ */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
          Notes / Comments
        </h2>

        <Textarea
          placeholder="Add any additional notes or comments about this project..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] resize-y"
          aria-label="Project notes and comments"
        />
        <p className="text-[11px] text-muted-foreground mt-2">
          This information will be saved with the project record
        </p>
      </section>

      <Separator />

      {/* ================================================================ */}
      {/*  Section 5: Access Control                                        */}
      {/* ================================================================ */}
      <section>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          Access Control
        </h2>

        {/* Add member */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Add by name or email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMember();
              }}
              className="pl-9"
              aria-label="Search for a team member by name or email"
            />
          </div>
          <Select value={memberRole} onValueChange={setMemberRole}>
            <SelectTrigger className="w-[130px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collaborator">Collaborator</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="shrink-0"
            onClick={handleAddMember}
            disabled={!memberSearch.trim()}
          >
            Add
          </Button>
        </div>

        {/* Member list */}
        {members.length > 0 && (
          <div className="mt-3 space-y-2">
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
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[11px] font-bold gradient-accent text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
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
      </section>

      <Separator />

      {/* ================================================================ */}
      {/*  Footer CTAs                                                      */}
      {/* ================================================================ */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold"
          disabled={!canCreate}
          onClick={handleCreate}
        >
          Create Job
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
              className="gradient-gold text-white border-0"
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
