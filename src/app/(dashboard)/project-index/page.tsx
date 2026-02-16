"use client";

import { useState, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Copy,
  Layers,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

interface ProjectVersion {
  id: string;
  versionNumber: number;
  label: string;
  status: "active" | "archived";
  files: ProjectFile[];
  createdAt: string;
}

interface ProjectIndexItem {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  location: string;
  status: "planning" | "active" | "on_hold" | "completed";
  documentsCount: number;
  startDate: string;
  team: string[];
  versions: ProjectVersion[];
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
    status: "completed",
    documentsCount: 34,
    startDate: "01/08/2025",
    team: ["SM", "JC", "MG"],
    versions: [
      {
        id: "pi1-v1", versionNumber: 1, label: "v1.0", status: "archived", createdAt: "01/09/2025",
        files: [
          { id: "f1a-v1", name: "Structural Steel Shop Drawings.pdf", type: "pdf", size: "4.2 MB", uploadDate: "05/09/2025" },
          { id: "f1b-v1", name: "HVAC Equipment Schedule.xlsx", type: "xlsx", size: "1.0 MB", uploadDate: "10/09/2025" },
        ],
      },
      {
        id: "pi1-v2", versionNumber: 2, label: "v2.0", status: "archived", createdAt: "01/10/2025",
        files: [
          { id: "f1a-v2", name: "Structural Steel Shop Drawings Rev2.pdf", type: "pdf", size: "4.5 MB", uploadDate: "01/10/2025" },
          { id: "f1b-v2", name: "HVAC Equipment Schedule.xlsx", type: "xlsx", size: "1.2 MB", uploadDate: "05/10/2025" },
          { id: "f1c-v2", name: "Electrical Riser Diagram.pdf", type: "pdf", size: "2.1 MB", uploadDate: "03/10/2025" },
        ],
      },
      {
        id: "pi1-v3", versionNumber: 3, label: "v3.0", status: "active", createdAt: "01/11/2025",
        files: [
          { id: "f1a", name: "Structural Steel Shop Drawings Rev3.pdf", type: "pdf", size: "4.8 MB", uploadDate: "12/11/2025" },
          { id: "f1b", name: "HVAC Equipment Schedule.xlsx", type: "xlsx", size: "1.2 MB", uploadDate: "20/11/2025" },
          { id: "f1c", name: "Electrical Riser Diagram.pdf", type: "pdf", size: "2.1 MB", uploadDate: "03/10/2025" },
          { id: "f1d", name: "Fire Protection Narrative.docx", type: "docx", size: "820 KB", uploadDate: "15/11/2025" },
        ],
      },
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
    startDate: "01/10/2025",
    team: ["SM", "JC", "DP"],
    versions: [
      {
        id: "pi2-v1", versionNumber: 1, label: "v1.0", status: "archived", createdAt: "01/11/2025",
        files: [
          { id: "f2a-v1", name: "Foundation Plan Rev 1.pdf", type: "pdf", size: "3.0 MB", uploadDate: "01/11/2025" },
        ],
      },
      {
        id: "pi2-v2", versionNumber: 2, label: "v2.0", status: "active", createdAt: "01/12/2025",
        files: [
          { id: "f2a", name: "Foundation Plan Rev 3.pdf", type: "pdf", size: "3.4 MB", uploadDate: "05/12/2025" },
          { id: "f2b", name: "Plumbing Fixture Schedule.xlsx", type: "xlsx", size: "640 KB", uploadDate: "18/12/2025" },
          { id: "f2c", name: "Curtain Wall Details.pdf", type: "pdf", size: "5.2 MB", uploadDate: "02/12/2025" },
        ],
      },
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
    startDate: "01/11/2025",
    team: ["SM", "JC"],
    versions: [
      {
        id: "pi3-v1", versionNumber: 1, label: "v1.0", status: "active", createdAt: "01/12/2025",
        files: [
          { id: "f3a", name: "Track Alignment Survey.pdf", type: "pdf", size: "6.1 MB", uploadDate: "10/12/2025" },
          { id: "f3b", name: "Signal Systems Specification.docx", type: "docx", size: "1.8 MB", uploadDate: "22/12/2025" },
        ],
      },
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
    startDate: "01/01/2026",
    team: ["SM"],
    versions: [
      {
        id: "pi4-v1", versionNumber: 1, label: "v1.0", status: "active", createdAt: "01/01/2026",
        files: [
          { id: "f4a", name: "Site Grading Plan.pdf", type: "pdf", size: "2.4 MB", uploadDate: "08/01/2026" },
          { id: "f4b", name: "Unit Mix Summary.xlsx", type: "xlsx", size: "340 KB", uploadDate: "12/01/2026" },
        ],
      },
    ],
  },
  {
    id: "pi5",
    projectCode: "DOR-2025",
    projectName: "Downtown Office Renovation",
    client: "Metro Business Park Corp",
    location: "Downtown",
    status: "completed",
    documentsCount: 18,
    startDate: "01/06/2025",
    team: ["SM", "MG", "DP"],
    versions: [
      {
        id: "pi5-v1", versionNumber: 1, label: "v1.0", status: "archived", createdAt: "01/07/2025",
        files: [
          { id: "f5a-v1", name: "Demolition Plan.pdf", type: "pdf", size: "1.9 MB", uploadDate: "14/07/2025" },
          { id: "f5b-v1", name: "MEP Coordination Drawings.pdf", type: "pdf", size: "7.3 MB", uploadDate: "02/08/2025" },
        ],
      },
      {
        id: "pi5-v2", versionNumber: 2, label: "v2.0", status: "active", createdAt: "01/09/2025",
        files: [
          { id: "f5a", name: "Demolition Plan Rev 2.pdf", type: "pdf", size: "1.9 MB", uploadDate: "01/09/2025" },
          { id: "f5b", name: "MEP Coordination Drawings.pdf", type: "pdf", size: "7.3 MB", uploadDate: "02/08/2025" },
          { id: "f5c", name: "Finish Schedule.xlsx", type: "xlsx", size: "510 KB", uploadDate: "20/09/2025" },
          { id: "f5d", name: "Occupancy Permit Application.docx", type: "docx", size: "420 KB", uploadDate: "05/09/2025" },
        ],
      },
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
    startDate: "01/02/2026",
    team: ["JC", "MG"],
    versions: [
      {
        id: "pi6-v1", versionNumber: 1, label: "v1.0", status: "active", createdAt: "01/02/2026",
        files: [
          { id: "f6a", name: "Classroom Wing Floor Plans.pdf", type: "pdf", size: "3.6 MB", uploadDate: "05/02/2026" },
          { id: "f6b", name: "AV Systems Requirements.docx", type: "docx", size: "960 KB", uploadDate: "08/02/2026" },
          { id: "f6c", name: "Energy Model Report.pdf", type: "pdf", size: "2.8 MB", uploadDate: "10/02/2026" },
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Status / file-type config                                                 */
/* -------------------------------------------------------------------------- */

const statusConfig: Record<string, { label: string; color: string }> = {
  planning: {
    label: "Planning",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  active: {
    label: "Active",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  on_hold: {
    label: "On Hold",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  completed: {
    label: "Completed",
    color: "bg-status-pre-approved-bg text-status-pre-approved",
  },
};

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

  // Sheet state — right side panel for files
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectIndexItem | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string>("");

  // Full-screen PDF viewer dialog
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<ProjectFile | null>(null);
  const [viewerFiles, setViewerFiles] = useState<ProjectFile[]>([]);

  // Create Version dialog
  const [createVersionOpen, setCreateVersionOpen] = useState(false);
  const [pullFromPrevious, setPullFromPrevious] = useState(true);
  const [createVersionUploading, setCreateVersionUploading] = useState(false);

  // Per-card version selectors
  const [cardVersionMap, setCardVersionMap] = useState<Record<string, string>>({});

  const filtered = mockProjectIndex.filter((item) => {
    const matchSearch =
      item.projectName.toLowerCase().includes(search.toLowerCase()) ||
      item.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getActiveVersion = (project: ProjectIndexItem): ProjectVersion => {
    const cardVerId = cardVersionMap[project.id];
    if (cardVerId) {
      const found = project.versions.find((v) => v.id === cardVerId);
      if (found) return found;
    }
    return project.versions.find((v) => v.status === "active") ?? project.versions[project.versions.length - 1];
  };

  const selectedVersion = useMemo(() => {
    if (!selectedProject || !selectedVersionId) return null;
    return selectedProject.versions.find((v) => v.id === selectedVersionId) ?? null;
  }, [selectedProject, selectedVersionId]);

  const handleCardClick = (project: ProjectIndexItem) => {
    setSelectedProject(project);
    const ver = getActiveVersion(project);
    setSelectedVersionId(ver.id);
    setSheetOpen(true);
  };

  const handleViewFile = (file: ProjectFile, files: ProjectFile[]) => {
    setViewingFile(file);
    setViewerFiles(files);
    setViewerOpen(true);
  };

  const handlePrevFile = () => {
    if (!viewingFile || viewerFiles.length === 0) return;
    const idx = viewerFiles.findIndex((f) => f.id === viewingFile.id);
    const prevIdx = idx <= 0 ? viewerFiles.length - 1 : idx - 1;
    setViewingFile(viewerFiles[prevIdx]);
  };

  const handleNextFile = () => {
    if (!viewingFile || viewerFiles.length === 0) return;
    const idx = viewerFiles.findIndex((f) => f.id === viewingFile.id);
    const nextIdx = idx >= viewerFiles.length - 1 ? 0 : idx + 1;
    setViewingFile(viewerFiles[nextIdx]);
  };

  const handleCreateVersion = () => {
    setCreateVersionUploading(true);
    // Mock creation delay
    setTimeout(() => {
      setCreateVersionUploading(false);
      setCreateVersionOpen(false);
      setPullFromPrevious(true);
    }, 1500);
  };

  const currentFileIndex = viewingFile
    ? viewerFiles.findIndex((f) => f.id === viewingFile.id)
    : -1;

  const previousVersion = selectedProject && selectedVersion
    ? selectedProject.versions.find((v) => v.versionNumber === selectedVersion.versionNumber - 1)
    : null;

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Index</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete index of all projects with version management and file tracking
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
            Completed
          </p>
          <p className="text-2xl font-bold mt-1 text-status-pre-approved">
            {mockProjectIndex.filter((p) => p.status === "completed").length}
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
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const config = statusConfig[item.status];
          const activeVer = getActiveVersion(item);
          return (
            <div
              key={item.id}
              className="rounded-xl border bg-card shadow-card overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
              onClick={() => handleCardClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(item);
                }
              }}
            >
              <div className="flex">
                {/* Left section — main info */}
                <div className="flex-1 p-5 space-y-3 min-w-0">
                  {/* Project code + status + version */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-nav-accent">
                      {item.projectCode}
                    </span>
                    <Badge variant="secondary" className={config.color}>
                      {config.label}
                    </Badge>
                    {/* Version selector on card */}
                    {item.versions.length > 1 ? (
                      <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                        <Select
                          value={cardVersionMap[item.id] || activeVer.id}
                          onValueChange={(v) => setCardVersionMap((prev) => ({ ...prev, [item.id]: v }))}
                        >
                          <SelectTrigger className="h-6 w-auto text-[10px] px-2 gap-1 border-muted-foreground/20">
                            <Layers className="h-3 w-3 text-muted-foreground" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.versions.map((ver) => (
                              <SelectItem key={ver.id} value={ver.id}>
                                {ver.label}{ver.status === "active" ? " (Active)" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {activeVer.label}
                      </span>
                    )}
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
                <div
                  className="flex flex-col items-end justify-between p-5 pl-0 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
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

                  {/* Document count + version file count */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {activeVer.files.length} files
                    </span>
                  </div>
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
      {/*  Right-Side Sheet — Project Files Panel with Version Selector       */}
      {/* ------------------------------------------------------------------ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="sm:max-w-xl w-full flex flex-col p-0">
          {selectedProject && selectedVersion && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-nav-accent">
                    {selectedProject.projectCode}
                  </span>
                  <Badge
                    variant="secondary"
                    className={statusConfig[selectedProject.status].color}
                  >
                    {statusConfig[selectedProject.status].label}
                  </Badge>
                </div>
                <SheetTitle className="text-lg">
                  {selectedProject.projectName}
                </SheetTitle>
                <SheetDescription className="text-sm">
                  {selectedProject.client} &middot; {selectedProject.location}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Version selector + create */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Select
                        value={selectedVersionId}
                        onValueChange={setSelectedVersionId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProject.versions.map((ver) => (
                            <SelectItem key={ver.id} value={ver.id}>
                              {ver.label}
                              {ver.status === "active" ? " (Active)" : " (Archived)"}
                              {" — "}{ver.files.length} file{ver.files.length !== 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold shrink-0"
                      onClick={() => setCreateVersionOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      New Version
                    </Button>
                  </div>

                  {/* Version info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-lg font-bold">{selectedVersion.files.length}</p>
                      <p className="text-[11px] text-muted-foreground">Files</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-lg font-bold">{selectedVersion.label}</p>
                      <p className="text-[11px] text-muted-foreground">Version</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 text-center">
                      <p className="text-lg font-bold capitalize">{selectedVersion.status}</p>
                      <p className="text-[11px] text-muted-foreground">Status</p>
                    </div>
                  </div>

                  {/* Team */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Team
                    </p>
                    <div className="flex -space-x-2">
                      {selectedProject.team.map((initials, i) => (
                        <div
                          key={`sheet-team-${i}`}
                          className="h-8 w-8 rounded-full gradient-accent border-2 border-card flex items-center justify-center"
                        >
                          <span className="text-[11px] font-bold text-white">
                            {initials}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Files list */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Version Files ({selectedVersion.files.length})
                    </p>
                    <div className="space-y-2">
                      {selectedVersion.files.map((file) => {
                        const ftConfig = fileTypeConfig[file.type];
                        const FileIcon = ftConfig.icon;
                        return (
                          <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group"
                            onClick={() => handleViewFile(file, selectedVersion.files)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleViewFile(file, selectedVersion.files);
                              }
                            }}
                          >
                            <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                              <FileIcon className="h-4.5 w-4.5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-nav-accent transition-colors">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant="secondary"
                                  className={`text-[10px] px-1.5 py-0 ${ftConfig.color}`}
                                >
                                  {ftConfig.label}
                                </Badge>
                                <span className="text-[11px] text-muted-foreground">
                                  {file.size}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {file.uploadDate}
                                </span>
                              </div>
                            </div>
                            <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload zone */}
                  <div className="rounded-xl border-2 border-dashed border-border p-6 text-center hover:border-nav-accent/40 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm font-medium">
                      Drop files here to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse &middot; PDF, XLSX, DOCX
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ------------------------------------------------------------------ */}
      {/*  Create New Version Dialog                                          */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={createVersionOpen} onOpenChange={setCreateVersionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              {selectedProject?.projectName ?? "Project"} — next version will be v{((selectedProject?.versions.length ?? 0) + 1)}.0
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Pull from previous */}
            {previousVersion && (
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="pull-previous"
                  checked={pullFromPrevious}
                  onCheckedChange={(checked) => setPullFromPrevious(checked === true)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="pull-previous" className="text-sm font-medium cursor-pointer">
                    Pull files from previous version
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Copy {selectedVersion?.files.length ?? 0} file{(selectedVersion?.files.length ?? 0) !== 1 ? "s" : ""} from {selectedVersion?.label ?? "current version"} as starting point
                  </p>
                  {pullFromPrevious && selectedVersion && (
                    <div className="mt-3 space-y-1.5">
                      {selectedVersion.files.map((f) => (
                        <div key={f.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Copy className="h-3 w-3 shrink-0" />
                          <span className="truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upload new files */}
            <div className="rounded-xl border-2 border-dashed border-border p-6 text-center hover:border-nav-accent/40 transition-colors cursor-pointer">
              <Upload className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-medium">Upload additional files</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, XLSX, DOCX up to 50MB each
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateVersionOpen(false)}>
                Cancel
              </Button>
              <Button
                className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                onClick={handleCreateVersion}
                disabled={createVersionUploading}
              >
                {createVersionUploading ? "Creating..." : "Create Version"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/*  Full-screen PDF Viewer Dialog                                      */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] flex flex-col p-0 gap-0">
          {viewingFile && (
            <>
              {/* Viewer Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b shrink-0 bg-card">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 shrink-0 ${fileTypeConfig[viewingFile.type].color}`}
                  >
                    {fileTypeConfig[viewingFile.type].label}
                  </Badge>

                  {/* File switcher dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold hover:text-nav-accent transition-colors min-w-0 cursor-pointer"
                      >
                        <span className="truncate">{viewingFile.name}</span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-80">
                      {viewerFiles.map((f, i) => {
                        const ft = fileTypeConfig[f.type];
                        const FIcon = ft.icon;
                        return (
                          <DropdownMenuItem
                            key={f.id}
                            className={
                              f.id === viewingFile.id
                                ? "bg-nav-accent/10 text-nav-accent"
                                : ""
                            }
                            onClick={() => setViewingFile(f)}
                          >
                            <FIcon className="h-4 w-4 mr-2 shrink-0" />
                            <span className="truncate">{f.name}</span>
                            <span className="ml-auto text-[10px] text-muted-foreground pl-2 shrink-0">
                              {i + 1}/{viewerFiles.length}
                            </span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                  <span className="text-xs text-muted-foreground mr-2">
                    {currentFileIndex + 1} / {viewerFiles.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handlePrevFile}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleNextFile}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <DialogTitle className="sr-only">
                    Document Viewer — {viewingFile.name}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-1"
                    onClick={() => setViewerOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Viewer body — thumbnail sidebar + main view */}
              <div className="flex flex-1 overflow-hidden">
                {/* Thumbnail sidebar */}
                <div className="w-48 border-r bg-muted/20 shrink-0 hidden md:block">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-2">
                      {viewerFiles.map((f) => {
                        const ft = fileTypeConfig[f.type];
                        const FIcon = ft.icon;
                        const isActive = f.id === viewingFile.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setViewingFile(f)}
                            className={`w-full rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                              isActive
                                ? "border-nav-accent bg-nav-accent/5 ring-1 ring-nav-accent/30"
                                : "border-border bg-card hover:bg-muted/30"
                            }`}
                          >
                            <div className="aspect-[4/3] rounded bg-muted/40 flex items-center justify-center mb-2">
                              <FIcon
                                className={`h-6 w-6 ${
                                  isActive
                                    ? "text-nav-accent"
                                    : "text-muted-foreground/50"
                                }`}
                              />
                            </div>
                            <p
                              className={`text-[11px] font-medium truncate ${
                                isActive ? "text-nav-accent" : "text-foreground"
                              }`}
                            >
                              {f.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {f.size}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Main viewer area */}
                <div className="flex-1 overflow-y-auto bg-muted/10">
                  <div className="min-h-full flex flex-col items-center justify-center p-8">
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <File className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {viewingFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center max-w-sm mt-2">
                      Document preview will render here. This is a placeholder
                      for the integrated file viewer.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                      <span>{viewingFile.size}</span>
                      <span>Uploaded {viewingFile.uploadDate}</span>
                    </div>

                    {/* Mock page representation */}
                    <div className="w-full max-w-lg mt-6 space-y-3">
                      <div className="bg-background rounded-lg border shadow-sm p-6 space-y-3">
                        <div className="h-3 w-3/4 bg-muted rounded" />
                        <div className="h-2 w-full bg-muted/70 rounded" />
                        <div className="h-2 w-full bg-muted/70 rounded" />
                        <div className="h-2 w-5/6 bg-muted/70 rounded" />
                        <div className="h-20 w-full bg-muted/40 rounded mt-4" />
                        <div className="h-2 w-full bg-muted/70 rounded" />
                        <div className="h-2 w-2/3 bg-muted/70 rounded" />
                      </div>
                      <div className="bg-background rounded-lg border shadow-sm p-6 space-y-3">
                        <div className="h-3 w-1/2 bg-muted rounded" />
                        <div className="h-2 w-full bg-muted/70 rounded" />
                        <div className="h-2 w-4/5 bg-muted/70 rounded" />
                        <div className="h-16 w-full bg-muted/40 rounded mt-4" />
                      </div>
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
