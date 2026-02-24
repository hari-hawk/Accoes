"use client";

import { useState } from "react";
import {
  Pencil,
  X,
  Save,
  FileText,
  FileSpreadsheet,
  FileType,
  Users,
  UserPlus,
  Calendar,
  Building2,
  Share2,
  MapPin,
  Briefcase,
  Activity,
  History,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Crown,
  ArrowRightLeft,
  Layers,
  BookOpen,
  Eye,
  Download,
  Lock,
  Loader2,
  Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FullScreenPdfViewer } from "@/components/documents/full-screen-pdf-viewer";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { mockUsers } from "@/data/mock-users";
import { getActivityLogsByProject } from "@/data/mock-activity-logs";
import { cn } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
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
      "bg-status-pre-approved-bg text-status-pre-approved",
    icon: FileSpreadsheet,
  },
  docx: {
    label: "DOCX",
    color: "bg-ds-primary-100 text-ds-primary-800",
    icon: FileType,
  },
  csv: {
    label: "CSV",
    color:
      "bg-status-pre-approved-bg text-status-pre-approved",
    icon: FileSpreadsheet,
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

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "in_progress", label: "In Progress" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
];

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: {
    label: "Owner",
    color: "bg-ds-primary-100 text-ds-primary-800",
  },
  collaborator: {
    label: "Collaborator",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  viewer: {
    label: "Reviewer",
    color:
      "bg-ds-primary-100 text-ds-primary-800",
  },
  // Legacy roles — map to new labels
  submitter: {
    label: "Collaborator",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  reviewer: {
    label: "Collaborator",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  global_viewer: {
    label: "Reviewer",
    color:
      "bg-ds-primary-100 text-ds-primary-800",
  },
};

/* -------------------------------------------------------------------------- */
/*  Mock data for the documents tab sections                                   */
/* -------------------------------------------------------------------------- */

const mockSpecFiles = [
  { id: "ps-1", fileName: "UCD_Project9592330_Project_Specification_Volume_1_2026-02.pdf", fileType: "pdf", fileSize: 16482304, totalPages: 342 },
  { id: "ps-2", fileName: "UCD_Project9592330_Project_Specification_Volume_2_2026-02.pdf", fileType: "pdf", fileSize: 13107200, totalPages: 278 },
];

// Material Matrix files — current + historical
const currentMatrixFiles = [
  { id: "mig-7", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 548864, version: "v3" },
  { id: "mig-8", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 516096, version: "v3" },
  { id: "mig-9", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 483328, version: "v3" },
];

const historicalMatrixFiles = [
  { id: "mig-1", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 524288, version: "v1", confidence: 72 },
  { id: "mig-2", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 491520, version: "v1", confidence: 68 },
  { id: "mig-3", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 458752, version: "v1", confidence: 75 },
];

/* -------------------------------------------------------------------------- */
/*  Collapsible Section                                                        */
/* -------------------------------------------------------------------------- */

function CollapsibleSection({
  title,
  icon: Icon,
  count,
  defaultOpen = false,
  id,
  children,
}: {
  title: string;
  icon: typeof FileText;
  count: number;
  defaultOpen?: boolean;
  id: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `${id}-content`;
  return (
    <div className="border rounded-lg overflow-hidden" role="region" aria-labelledby={id}>
      <button
        type="button"
        id={id}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-muted/30 transition-colors focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-inset outline-none"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
        )}
        <Icon className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium flex-1">{title}</span>
        <Badge variant="secondary" className="text-[10px]">
          {count}
        </Badge>
      </button>
      {open && <div id={contentId} className="border-t" role="group" aria-label={`${title} items`}>{children}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline Share Panel                                                         */
/* -------------------------------------------------------------------------- */

function InlineSharePanel({
  members,
  onBack,
}: {
  members: typeof mockUsers;
  onBack: () => void;
}) {
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<string>("collaborator");

  // Find owner (admin user or first member)
  const owner = members.find((u) => u.role === "admin") ?? members[0];

  return (
    <div className="p-6 space-y-5" role="region" aria-label="Share access settings">
      {/* Back button + title */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onBack}
          aria-label="Go back to project details"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" aria-hidden="true" />
          Share Access
        </h4>
      </div>

      {/* Add member input */}
      <div className="flex items-center gap-2" role="search" aria-label="Add team member">
        <div className="flex-1 relative">
          <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Add by name or email..."
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            className="pl-9"
            aria-label="Search for a team member by name or email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Mock add — in production this would search and add
                setAddEmail("");
              }
            }}
          />
        </div>
        <Select value={addRole} onValueChange={setAddRole}>
          <SelectTrigger className="w-[130px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collaborator">Collaborator</SelectItem>
            <SelectItem value="viewer">Reviewer</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => setAddEmail("")}
        >
          Add
        </Button>
      </div>

      {/* Project Owner */}
      {owner && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Project Owner
          </h4>
          <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30">
            <Avatar className="h-8 w-8 shrink-0">
              {owner.avatarUrl && (
                <AvatarImage src={owner.avatarUrl} alt={owner.name} />
              )}
              <AvatarFallback className="text-[11px] font-bold gradient-accent text-white">
                {getInitials(owner.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{owner.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {owner.email}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-[11px] shrink-0 bg-ds-primary-100 text-ds-primary-800"
            >
              <Crown className="h-2.5 w-2.5 mr-1" />
              Owner
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Only one person can be the project owner. Ownership can be
            transferred to another member.
          </p>
        </div>
      )}

      {/* Team Members */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Team Members
        </h4>
        <div className="space-y-2">
          {members
            .filter((u) => u.id !== owner?.id)
            .map((user) => {
              const rc = roleConfig[user.role] ?? {
                label: user.role,
                color: "bg-muted text-muted-foreground",
              };
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
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
                    className={cn("text-[11px] shrink-0", rc.color)}
                  >
                    {rc.label}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Transfer Ownership"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          {members.filter((u) => u.id !== owner?.id).length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No team members added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
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
  const [showShare, setShowShare] = useState(false);
  const [editName, setEditName] = useState("");
  const [editClient, setEditClient] = useState("");
  const [editJobId, setEditJobId] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState<ProjectStatus>("in_progress");
  const [activityFilter, setActivityFilter] = useState("3d");
  const [previewSpec, setPreviewSpec] = useState<typeof mockSpecFiles[number] | null>(null);
  const [selectedMatrixIds, setSelectedMatrixIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!project) return null;

  // Resolve team members
  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean) as typeof mockUsers;

  // Activity logs
  const activityLogs = getActivityLogsByProject(project.id);

  // Filter activity by time range
  const filterMs =
    activityFilter === "3d"
      ? 3 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;
  const filteredLogs = activityLogs.filter(
    (log) => Date.now() - new Date(log.timestamp).getTime() <= filterMs
  );

  const startEdit = () => {
    setEditName(project.name);
    setEditClient(project.client);
    setEditJobId(project.jobId);
    setEditLocation(project.location);
    setEditStatus(project.status);
    setEditing(true);
    setShowShare(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = () => {
    // Mock save — in production this would call an API
    setEditing(false);
  };

  const [matrixHistoryOpen, setMatrixHistoryOpen] = useState(false);

  const allMatrixSelected =
    currentMatrixFiles.length > 0 &&
    selectedMatrixIds.size === currentMatrixFiles.length;

  const toggleMatrixFile = (id: string) => {
    setSelectedMatrixIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllMatrix = () => {
    if (allMatrixSelected) {
      setSelectedMatrixIds(new Set());
    } else {
      setSelectedMatrixIds(new Set(currentMatrixFiles.map((f) => f.id)));
    }
  };

  const handleMatrixExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 2500);
    }, 1500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-2xl w-full flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12 shrink-0">
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
          </div>
          <div className="flex items-center gap-2 w-fit">
            {!editing && !showShare && (
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
            {!showShare && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => {
                  setShowShare(true);
                  setEditing(false);
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 relative">
        <ScrollArea className="absolute inset-0">
          {/* ============================================================ */}
          {/*  Inline Share Panel (replaces content when showShare=true)   */}
          {/* ============================================================ */}
          {showShare ? (
            <InlineSharePanel
              members={members}
              onBack={() => setShowShare(false)}
            />
          ) : (
            <div className="p-6 space-y-6">
              {/* ======================================================== */}
              {/*  Section: Project Information                             */}
              {/* ======================================================== */}
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
                        onValueChange={(v) =>
                          setEditStatus(v as ProjectStatus)
                        }
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
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
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

              {/* ======================================================== */}
              {/*  Tabs: Documents | Activity | Material Matrix             */}
              {/* ======================================================== */}
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="files" className="text-xs gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    Activity
                  </TabsTrigger>
                </TabsList>

                {/* --- Documents Tab --- */}
                <TabsContent value="files" className="mt-4 space-y-3">
                  {/* Material Matrix — unified container */}
                  <div className="border rounded-lg overflow-hidden" role="region" aria-label="Material Matrix">
                    {/* Header */}
                    <div className="px-3 py-2.5 border-b flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span className="text-xs font-medium">Material Matrix</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {currentMatrixFiles.length}
                        </Badge>
                      </div>
                      {selectedMatrixIds.size > 0 && (
                        <Button
                          size="sm"
                          className="h-6 text-[11px] gap-1 gradient-action text-white border-0 hover:opacity-90 transition-opacity"
                          onClick={handleMatrixExport}
                          disabled={exporting}
                          aria-label={`Export ${selectedMatrixIds.size} selected file${selectedMatrixIds.size !== 1 ? "s" : ""}`}
                        >
                          {exporting ? (
                            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                          ) : exportComplete ? (
                            <Check className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <Download className="h-3 w-3" aria-hidden="true" />
                          )}
                          {exportComplete ? "Exported!" : `Export (${selectedMatrixIds.size})`}
                        </Button>
                      )}
                    </div>

                    {/* Select all bar */}
                    {currentMatrixFiles.length > 0 && (
                      <div className="px-3 py-1.5 border-b bg-muted/20 flex items-center justify-between">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox
                            checked={allMatrixSelected}
                            onCheckedChange={toggleAllMatrix}
                            className="h-3.5 w-3.5"
                            aria-label={allMatrixSelected ? "Deselect all files" : "Select all files"}
                          />
                          <span className="text-[11px] text-muted-foreground">Select all</span>
                        </label>
                        {selectedMatrixIds.size > 0 && (
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {selectedMatrixIds.size} of {currentMatrixFiles.length} selected
                          </span>
                        )}
                      </div>
                    )}

                    {/* Active file list */}
                    <div className="divide-y" role="list" aria-label="Active material matrix files">
                      {currentMatrixFiles.map((file) => {
                        const ftConfig = fileTypeConfig[file.fileType] ?? fileTypeConfig.csv;
                        const FileIcon = ftConfig.icon;
                        const isChecked = selectedMatrixIds.has(file.id);
                        return (
                          <div
                            key={file.id}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors group/mfile",
                              isChecked && "bg-nav-accent/5"
                            )}
                            role="listitem"
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleMatrixFile(file.id)}
                              aria-label={`Select ${file.fileName}`}
                              className="shrink-0"
                            />
                            <div className="h-7 w-7 rounded-md bg-status-pre-approved-bg flex items-center justify-center shrink-0">
                              <FileIcon className="h-3.5 w-3.5 text-status-pre-approved" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {file.fileName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-muted-foreground">
                                  {formatFileSize(file.fileSize)}
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  {file.version}
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-[11px] px-1.5 py-0 h-4 bg-status-pre-approved-bg text-status-pre-approved shrink-0">
                              Active
                            </Badge>
                            <Eye className="h-3.5 w-3.5 text-muted-foreground/0 group-hover/mfile:text-muted-foreground transition-colors shrink-0" aria-hidden="true" />
                          </div>
                        );
                      })}
                    </div>

                    {/* History — inline, same container */}
                    {historicalMatrixFiles.length > 0 && (
                      <>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 border-t bg-muted/20 hover:bg-muted/40 transition-colors text-left focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-inset outline-none"
                          onClick={() => setMatrixHistoryOpen(!matrixHistoryOpen)}
                          aria-expanded={matrixHistoryOpen}
                          aria-controls="matrix-history-list"
                        >
                          <span className="flex items-center gap-2">
                            <History className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                            <span className="text-xs font-semibold text-muted-foreground">History</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {historicalMatrixFiles.length}
                            </Badge>
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                              matrixHistoryOpen && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        </button>

                        {matrixHistoryOpen && (
                          <div id="matrix-history-list" className="divide-y bg-muted/10" role="list" aria-label="Historical material matrix files">
                            {historicalMatrixFiles.map((file) => {
                              const ftConfig = fileTypeConfig[file.fileType] ?? fileTypeConfig.csv;
                              const FileIcon = ftConfig.icon;
                              return (
                                <div
                                  key={file.id}
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors group/hfile"
                                  role="listitem"
                                >
                                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0 relative">
                                    <FileIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                    <Lock className="h-2 w-2 text-muted-foreground/60 absolute -bottom-0.5 -right-0.5" aria-hidden="true" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate text-muted-foreground">
                                      {file.fileName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5">
                                        {file.version}
                                      </Badge>
                                      <span className="text-[11px] text-muted-foreground">
                                        {formatFileSize(file.fileSize)}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        {file.confidence}%
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="text-[11px] bg-muted text-muted-foreground shrink-0">
                                    View Only
                                  </Badge>
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground/0 group-hover/hfile:text-muted-foreground transition-colors shrink-0" aria-hidden="true" />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Section 2: Project Specifications — with preview */}
                  <CollapsibleSection
                    title="Project Specifications"
                    icon={BookOpen}
                    count={mockSpecFiles.length}
                    defaultOpen
                    id="section-specs"
                  >
                    <div className="divide-y" role="list" aria-label="Project specification documents">
                      {mockSpecFiles.map((file) => {
                        const ftConfig = fileTypeConfig[file.fileType] ?? fileTypeConfig.pdf;
                        const FileIcon = ftConfig.icon;
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors group/spec"
                            role="listitem"
                          >
                            <div className="h-7 w-7 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                              <FileIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {file.fileName}
                              </p>
                              <span className="text-[11px] text-muted-foreground">
                                {formatFileSize(file.fileSize)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 text-muted-foreground/0 group-hover/spec:text-muted-foreground hover:!text-primary transition-colors"
                              onClick={() => setPreviewSpec(file)}
                              aria-label={`Preview ${file.fileName}`}
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleSection>

                </TabsContent>

                {/* --- Recent Activity Tab --- */}
                <TabsContent value="activity" className="mt-4">
                  {/* Timeline filter */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      Showing activity
                    </span>
                    <Select
                      value={activityFilter}
                      onValueChange={setActivityFilter}
                    >
                      <SelectTrigger className="w-[120px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3d">Last 3 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="1w">Last 1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredLogs.length > 0 ? (
                    <div className="space-y-3" role="feed" aria-label="Recent activity feed">
                      {filteredLogs.map((log) => {
                        const user = mockUsers.find(
                          (u) => u.id === log.userId
                        );
                        return (
                          <div key={log.id} className="flex gap-3">
                            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                              {user?.avatarUrl && (
                                <AvatarImage
                                  src={user.avatarUrl}
                                  alt={user.name}
                                />
                              )}
                              <AvatarFallback className="text-[10px] font-bold">
                                {user ? getInitials(user.name) : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">
                                  {user?.name ?? "Unknown"}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {formatRelativeTime(log.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {log.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No activity in this time range
                    </div>
                  )}
                </TabsContent>

              </Tabs>

            </div>
          )}
        </ScrollArea>
        </div>

        {/* PDF Preview Viewer for Project Specifications */}
        <FullScreenPdfViewer
          open={!!previewSpec}
          onOpenChange={(open) => { if (!open) setPreviewSpec(null); }}
          title={previewSpec?.fileName ?? ""}
          subtitle="Project Specification"
          totalPages={previewSpec?.totalPages ?? 100}
        />
      </SheetContent>
    </Sheet>
  );
}
