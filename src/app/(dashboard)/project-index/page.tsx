"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  FileText,
  Calendar,
  MapPin,
  Upload,
  Eye,
  FileSpreadsheet,
  FileType,
  File,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface ProjectFile {
  id: string;
  name: string;
  type: "pdf" | "xlsx" | "docx";
  size: string;
  uploadDate: string;
}

interface ProjectIndexItem {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  location: string;
  status: "active" | "complete" | "on_hold" | "archived";
  documentsCount: number;
  startDate: string;
  team: string[];
  files: ProjectFile[];
}

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const mockProjectIndex: ProjectIndexItem[] = [
  {
    id: "pi1",
    projectCode: "RCT-2025",
    projectName: "Riverside Commercial Tower",
    client: "Meridian Development Group",
    location: "Downtown Riverside",
    status: "complete",
    documentsCount: 34,
    startDate: "Aug 2025",
    team: ["SM", "JC", "MG"],
    files: [
      { id: "f1a", name: "Structural Steel Shop Drawings.pdf", type: "pdf", size: "4.8 MB", uploadDate: "Sep 12, 2025" },
      { id: "f1b", name: "HVAC Equipment Schedule.xlsx", type: "xlsx", size: "1.2 MB", uploadDate: "Sep 20, 2025" },
      { id: "f1c", name: "Electrical Riser Diagram.pdf", type: "pdf", size: "2.1 MB", uploadDate: "Oct 03, 2025" },
      { id: "f1d", name: "Fire Protection Narrative.docx", type: "docx", size: "820 KB", uploadDate: "Oct 15, 2025" },
    ],
  },
  {
    id: "pi2",
    projectCode: "HDM-2025",
    projectName: "Harbor District Mixed Use",
    client: "Coastal Properties LLC",
    location: "Harbor District",
    status: "active",
    documentsCount: 22,
    startDate: "Oct 2025",
    team: ["SM", "JC", "DP"],
    files: [
      { id: "f2a", name: "Foundation Plan Rev 3.pdf", type: "pdf", size: "3.4 MB", uploadDate: "Nov 05, 2025" },
      { id: "f2b", name: "Plumbing Fixture Schedule.xlsx", type: "xlsx", size: "640 KB", uploadDate: "Nov 18, 2025" },
      { id: "f2c", name: "Curtain Wall Details.pdf", type: "pdf", size: "5.2 MB", uploadDate: "Dec 02, 2025" },
    ],
  },
  {
    id: "pi3",
    projectCode: "MLE-2025",
    projectName: "Metro Line Extension Phase 3",
    client: "City Transit Authority",
    location: "Metro Area",
    status: "active",
    documentsCount: 15,
    startDate: "Nov 2025",
    team: ["SM", "JC"],
    files: [
      { id: "f3a", name: "Track Alignment Survey.pdf", type: "pdf", size: "6.1 MB", uploadDate: "Dec 10, 2025" },
      { id: "f3b", name: "Signal Systems Specification.docx", type: "docx", size: "1.8 MB", uploadDate: "Dec 22, 2025" },
    ],
  },
  {
    id: "pi4",
    projectCode: "PRC-2026",
    projectName: "Parkview Residential Complex",
    client: "Greenfield Homes Inc.",
    location: "Parkview",
    status: "on_hold",
    documentsCount: 0,
    startDate: "Jan 2026",
    team: ["SM"],
    files: [
      { id: "f4a", name: "Site Grading Plan.pdf", type: "pdf", size: "2.4 MB", uploadDate: "Jan 08, 2026" },
      { id: "f4b", name: "Unit Mix Summary.xlsx", type: "xlsx", size: "340 KB", uploadDate: "Jan 12, 2026" },
    ],
  },
  {
    id: "pi5",
    projectCode: "DOR-2025",
    projectName: "Downtown Office Renovation",
    client: "Metro Business Park Corp",
    location: "Downtown",
    status: "complete",
    documentsCount: 18,
    startDate: "Jun 2025",
    team: ["SM", "MG", "DP"],
    files: [
      { id: "f5a", name: "Demolition Plan.pdf", type: "pdf", size: "1.9 MB", uploadDate: "Jul 14, 2025" },
      { id: "f5b", name: "MEP Coordination Drawings.pdf", type: "pdf", size: "7.3 MB", uploadDate: "Aug 02, 2025" },
      { id: "f5c", name: "Finish Schedule.xlsx", type: "xlsx", size: "510 KB", uploadDate: "Aug 20, 2025" },
      { id: "f5d", name: "Occupancy Permit Application.docx", type: "docx", size: "420 KB", uploadDate: "Sep 05, 2025" },
    ],
  },
  {
    id: "pi6",
    projectCode: "CCA-2026",
    projectName: "Central Campus Addition",
    client: "State University",
    location: "University District",
    status: "active",
    documentsCount: 8,
    startDate: "Feb 2026",
    team: ["JC", "MG"],
    files: [
      { id: "f6a", name: "Classroom Wing Floor Plans.pdf", type: "pdf", size: "3.6 MB", uploadDate: "Feb 05, 2026" },
      { id: "f6b", name: "AV Systems Requirements.docx", type: "docx", size: "960 KB", uploadDate: "Feb 08, 2026" },
      { id: "f6c", name: "Energy Model Report.pdf", type: "pdf", size: "2.8 MB", uploadDate: "Feb 10, 2026" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Status config                                                             */
/* -------------------------------------------------------------------------- */

const statusConfig: Record<string, { label: string; color: string }> = {
  active: {
    label: "Active",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  complete: {
    label: "Complete",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
  on_hold: {
    label: "On Hold",
    color: "bg-status-review-required-bg text-status-review-required",
  },
  archived: {
    label: "Archived",
    color: "bg-muted text-muted-foreground",
  },
};

/* -------------------------------------------------------------------------- */
/*  File type helpers                                                         */
/* -------------------------------------------------------------------------- */

const fileTypeConfig: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  pdf: {
    label: "PDF",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: FileText,
  },
  xlsx: {
    label: "XLSX",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: FileSpreadsheet,
  },
  docx: {
    label: "DOCX",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: FileType,
  },
};

/* -------------------------------------------------------------------------- */
/*  Page component                                                            */
/* -------------------------------------------------------------------------- */

export default function ProjectIndexPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dialog state
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectIndexItem | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<ProjectFile | null>(null);

  const filtered = mockProjectIndex.filter((item) => {
    const matchSearch =
      item.projectName.toLowerCase().includes(search.toLowerCase()) ||
      item.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openFilesDialog = (project: ProjectIndexItem) => {
    setSelectedProject(project);
    setSelectedFileId(project.files[0]?.id ?? null);
    setViewingFile(null);
    setFilesDialogOpen(true);
  };

  const handleViewFile = (file: ProjectFile) => {
    setViewingFile(file);
  };

  const handleBackToList = () => {
    setViewingFile(null);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Index</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete index of all projects with codes, locations, and team
          assignments
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Projects
          </p>
          <p className="text-2xl font-bold mt-1">{mockProjectIndex.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Active
          </p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {mockProjectIndex.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Complete
          </p>
          <p className="text-2xl font-bold mt-1 text-status-pre-approved">
            {mockProjectIndex.filter((p) => p.status === "complete").length}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Documents
          </p>
          <p className="text-2xl font-bold mt-1">
            {mockProjectIndex.reduce((sum, p) => sum + p.documentsCount, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const config = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className="rounded-xl border bg-card shadow-card overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="flex">
                {/* Left section — main info */}
                <div className="flex-1 p-5 space-y-3 min-w-0">
                  {/* Project code + status */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold text-nav-accent">
                      {item.projectCode}
                    </span>
                    <Badge variant="secondary" className={config.color}>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Project name */}
                  <h3 className="font-semibold text-base leading-snug truncate">
                    {item.projectName}
                  </h3>

                  {/* Client */}
                  <p className="text-sm text-muted-foreground truncate">
                    {item.client}
                  </p>

                  {/* Meta row: date + location */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.startDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Right section — team, docs, actions */}
                <div className="flex flex-col items-end justify-between p-5 pl-0 shrink-0">
                  {/* Actions dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Team avatars */}
                  <div className="flex -space-x-1.5">
                    {item.team.map((initials, i) => (
                      <div
                        key={`${item.id}-team-${i}`}
                        className="h-7 w-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center"
                      >
                        <span className="text-[10px] font-bold text-primary">
                          {initials}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Document count — clickable */}
                  <button
                    type="button"
                    onClick={() => openFilesDialog(item)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-nav-accent transition-colors cursor-pointer group"
                  >
                    <FileText className="h-3.5 w-3.5 group-hover:text-nav-accent" />
                    <span className="font-medium">
                      {item.documentsCount} docs
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No projects match your search criteria.</p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*  File Overlay Dialog                                                */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={filesDialogOpen} onOpenChange={setFilesDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Project Files &mdash; {selectedProject?.projectName}
            </DialogTitle>
            <DialogDescription>
              Browse and view documents associated with this project.
            </DialogDescription>
          </DialogHeader>

          {selectedProject && !viewingFile && (
            <>
              {/* File tab selector */}
              <div className="flex gap-1 overflow-x-auto border-b pb-0">
                {selectedProject.files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedFileId(file.id)}
                    className={`px-3 py-2 text-xs font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                      selectedFileId === file.id
                        ? "border-nav-accent text-nav-accent bg-nav-accent/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {file.name.length > 28
                      ? file.name.slice(0, 28) + "..."
                      : file.name}
                  </button>
                ))}
              </div>

              {/* File list */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2">
                {selectedProject.files.map((file) => {
                  const ftConfig = fileTypeConfig[file.type];
                  const FileIcon = ftConfig.icon;
                  const isSelected = selectedFileId === file.id;

                  return (
                    <div
                      key={file.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        isSelected
                          ? "border-nav-accent/30 bg-nav-accent/5"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedFileId(file.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedFileId(file.id);
                      }}
                    >
                      {/* File icon */}
                      <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-1.5 py-0 ${ftConfig.color}`}
                          >
                            {ftConfig.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {file.size}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {file.uploadDate}
                          </span>
                        </div>
                      </div>

                      {/* View button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(file);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Upload button */}
              <DialogFooter className="border-t pt-4">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Additional Files
                </Button>
              </DialogFooter>
            </>
          )}

          {/* File viewer */}
          {selectedProject && viewingFile && (
            <>
              {/* Back button + filename */}
              <div className="flex items-center gap-3 border-b pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="gap-1.5"
                >
                  &larr; Back to files
                </Button>
                <div className="flex items-center gap-2 min-w-0">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 shrink-0 ${fileTypeConfig[viewingFile.type].color}`}
                  >
                    {fileTypeConfig[viewingFile.type].label}
                  </Badge>
                  <span className="text-sm font-medium truncate">
                    {viewingFile.name}
                  </span>
                </div>
              </div>

              {/* Mock PDF viewer area */}
              <div className="flex-1 overflow-y-auto">
                <div className="rounded-xl bg-muted/40 border border-dashed border-border min-h-[320px] flex flex-col items-center justify-center gap-4 p-8">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <File className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    PDF Viewer &mdash; {viewingFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground text-center max-w-sm">
                    Document preview will render here. This is a placeholder for
                    the integrated file viewer.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>{viewingFile.size}</span>
                    <span>Uploaded {viewingFile.uploadDate}</span>
                  </div>

                  {/* Mock page representation */}
                  <div className="w-full max-w-md mt-4 space-y-3">
                    <div className="bg-background rounded-lg border shadow-sm p-6 space-y-3">
                      <div className="h-3 w-3/4 bg-muted rounded" />
                      <div className="h-2 w-full bg-muted/70 rounded" />
                      <div className="h-2 w-full bg-muted/70 rounded" />
                      <div className="h-2 w-5/6 bg-muted/70 rounded" />
                      <div className="h-16 w-full bg-muted/40 rounded mt-4" />
                      <div className="h-2 w-full bg-muted/70 rounded" />
                      <div className="h-2 w-2/3 bg-muted/70 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
