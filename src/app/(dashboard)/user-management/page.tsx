"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  ShieldCheck,
  User,
  Eye,
  Calendar,
  FolderOpen,
  ArrowRightLeft,
  UserCog,
  KeyRound,
  UserMinus,
  Mail,
  Clock,
  FileText,
  MessageSquare,
  Activity,
  Upload,
  CheckCircle2,
  X,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// ─── Types ──────────────────────────────────────────

type UserRoleLabel = "Admin" | "Global Viewer" | "Submitter" | "Reviewer";
type PanelMode = "add" | "detail" | "access" | null;

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRoleLabel;
  createdDate: string;
  projectIds: string[];
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

interface UserActivity {
  id: string;
  action: string;
  project: string;
  timestamp: string;
  type: "status" | "comment" | "upload" | "review";
}

interface UserComment {
  id: string;
  content: string;
  project: string;
  timestamp: string;
}

// ─── Constants ──────────────────────────────────────

const AVAILABLE_PROJECTS = [
  { id: "proj-1", name: "Mayo Clinic", abbr: "MC" },
  { id: "proj-2", name: "UCD", abbr: "UCD" },
  { id: "proj-new", name: "SFO Terminal B", abbr: "SFO" },
  { id: "proj-3", name: "NET", abbr: "NET" },
  { id: "proj-4", name: "KPMG", abbr: "KPMG" },
  { id: "proj-5", name: "PSL", abbr: "PSL" },
  { id: "proj-6", name: "DCJC", abbr: "DCJC" },
  { id: "proj-7", name: "IEUA", abbr: "IEUA" },
  { id: "proj-8", name: "PF", abbr: "PF" },
];

const ALL_PROJECT_IDS = AVAILABLE_PROJECTS.map((p) => p.id);

const INITIAL_USERS: UserRow[] = [
  { id: "u1", name: "Sarah Mitchell", email: "sarah.mitchell@accoes.com", role: "Admin", createdDate: "05/01/2026", projectIds: [...ALL_PROJECT_IDS], avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "u2", name: "James Chen", email: "james.chen@accoes.com", role: "Submitter", createdDate: "10/01/2026", projectIds: ["proj-1", "proj-2", "proj-3"], isCurrentUser: true, avatarUrl: "https://i.pravatar.cc/150?u=james" },
  { id: "u3", name: "Maria Garcia", email: "maria.garcia@accoes.com", role: "Reviewer", createdDate: "15/01/2026", projectIds: ["proj-1", "proj-6"], avatarUrl: "https://i.pravatar.cc/150?u=maria" },
  { id: "u4", name: "David Park", email: "david.park@accoes.com", role: "Global Viewer", createdDate: "20/01/2026", projectIds: [...ALL_PROJECT_IDS], avatarUrl: "https://i.pravatar.cc/150?u=david" },
  { id: "u5", name: "Emily Carter", email: "emily.carter@accoes.com", role: "Reviewer", createdDate: "25/01/2026", projectIds: ["proj-2", "proj-5"], avatarUrl: "https://i.pravatar.cc/150?u=emily" },
  { id: "u6", name: "Sophia Johnson", email: "sophia.johnson@accoes.com", role: "Submitter", createdDate: "01/02/2026", projectIds: ["proj-3", "proj-6"], avatarUrl: "https://i.pravatar.cc/150?u=sophia" },
  { id: "u7", name: "Alex Thompson", email: "alex.thompson@accoes.com", role: "Admin", createdDate: "03/02/2026", projectIds: [...ALL_PROJECT_IDS], avatarUrl: "https://i.pravatar.cc/150?u=alex" },
  { id: "u8", name: "Rachel Kim", email: "rachel.kim@accoes.com", role: "Global Viewer", createdDate: "05/02/2026", projectIds: [...ALL_PROJECT_IDS], avatarUrl: "https://i.pravatar.cc/150?u=rachel" },
];

const roleColors: Record<UserRoleLabel, string> = {
  Admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Global Viewer": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Submitter: "bg-status-pre-approved-bg text-status-pre-approved",
  Reviewer: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const roleIcons: Record<UserRoleLabel, typeof User> = {
  Admin: ShieldCheck,
  "Global Viewer": Eye,
  Submitter: User,
  Reviewer: UserCog,
};

const MOCK_USER_ACTIVITIES: Record<string, UserActivity[]> = {
  u1: [
    { id: "a1", action: "Approved submittal for Structural Steel Shop Drawings", project: "Mayo Clinic", timestamp: "2026-02-24T10:30:00Z", type: "review" },
    { id: "a2", action: "Updated status: Review Required → Pre Approved", project: "UCD", timestamp: "2026-02-23T14:00:00Z", type: "status" },
    { id: "a3", action: "Added Maria Garcia as Reviewer", project: "Mayo Clinic", timestamp: "2026-02-22T09:00:00Z", type: "status" },
    { id: "a4", action: "Uploaded HVAC Equipment Schedule.xlsx", project: "KPMG", timestamp: "2026-02-21T16:00:00Z", type: "upload" },
  ],
  u2: [
    { id: "a5", action: "Uploaded Structural Steel Shop Drawings.pdf", project: "Mayo Clinic", timestamp: "2026-02-24T14:30:00Z", type: "upload" },
    { id: "a6", action: "Submitted resubmittal for anchor bolt coating", project: "NET", timestamp: "2026-02-23T11:00:00Z", type: "upload" },
    { id: "a7", action: "Updated status: Action Mandatory → Review Required", project: "UCD", timestamp: "2026-02-22T10:00:00Z", type: "status" },
  ],
  u3: [
    { id: "a8", action: "Flagged fireproofing density issue", project: "Mayo Clinic", timestamp: "2026-02-24T10:46:00Z", type: "review" },
    { id: "a9", action: "Updated status: Review Required → Action Mandatory", project: "DCJC", timestamp: "2026-02-23T10:46:00Z", type: "status" },
    { id: "a10", action: "Reviewed curtain wall specification", project: "Mayo Clinic", timestamp: "2026-02-22T15:00:00Z", type: "review" },
  ],
  u4: [
    { id: "a11", action: "Viewed project progress report", project: "UCD", timestamp: "2026-02-24T09:00:00Z", type: "review" },
    { id: "a12", action: "Confirmed argon fill on all IGU units", project: "IEUA", timestamp: "2026-02-23T15:00:00Z", type: "comment" },
  ],
  u5: [
    { id: "a13", action: "Reviewed HVAC ductwork submittal", project: "UCD", timestamp: "2026-02-24T11:00:00Z", type: "review" },
    { id: "a14", action: "Updated status: Pre Approved → Approved", project: "PSL", timestamp: "2026-02-23T16:00:00Z", type: "status" },
  ],
  u6: [
    { id: "a15", action: "Uploaded piping specification docs", project: "NET", timestamp: "2026-02-24T09:30:00Z", type: "upload" },
    { id: "a16", action: "Submitted initial package for review", project: "DCJC", timestamp: "2026-02-23T10:00:00Z", type: "upload" },
  ],
  u7: [
    { id: "a17", action: "Created project SFO Terminal B", project: "SFO Terminal B", timestamp: "2026-02-25T08:30:00Z", type: "status" },
    { id: "a18", action: "Updated global permissions for viewers", project: "All", timestamp: "2026-02-24T14:00:00Z", type: "status" },
  ],
  u8: [
    { id: "a19", action: "Viewed compliance dashboard", project: "PSL", timestamp: "2026-02-24T10:00:00Z", type: "review" },
    { id: "a20", action: "Downloaded export report", project: "PF", timestamp: "2026-02-23T11:00:00Z", type: "review" },
  ],
};

const MOCK_USER_COMMENTS: Record<string, UserComment[]> = {
  u1: [
    { id: "c1", content: "All structural steel submittals need to reference the updated F3125 standard.", project: "Mayo Clinic", timestamp: "2026-02-24T10:30:00Z" },
    { id: "c2", content: "HVAC ductwork gauge issue — contractor aware, awaiting updated submittal.", project: "KPMG", timestamp: "2026-02-22T16:30:00Z" },
    { id: "c3", content: "Curtain wall system approved. IGU argon fill needs verification.", project: "UCD", timestamp: "2026-02-21T10:00:00Z" },
  ],
  u2: [
    { id: "c4", content: "Anchor bolt coating has been corrected. Resubmittal incoming.", project: "Mayo Clinic", timestamp: "2026-02-23T09:30:00Z" },
    { id: "c5", content: "Updated shop drawings per RFI #42 response.", project: "NET", timestamp: "2026-02-22T14:00:00Z" },
  ],
  u3: [
    { id: "c6", content: "Fireproofing density issue flagged — need engineer confirmation on 14 pcf vs 15 pcf requirement.", project: "Mayo Clinic", timestamp: "2026-02-24T14:00:00Z" },
    { id: "c7", content: "Overall progress looking good. 7 of 10 items pre-approved.", project: "DCJC", timestamp: "2026-02-23T11:00:00Z" },
    { id: "c8", content: "There is mismatch. This should be re-evaluated by the team.", project: "Mayo Clinic", timestamp: "2026-02-22T10:46:00Z" },
  ],
  u4: [
    { id: "c9", content: "Glass manufacturer confirmed argon fill on all units.", project: "IEUA", timestamp: "2026-02-23T15:00:00Z" },
  ],
  u5: [
    { id: "c10", content: "Ductwork gauge discrepancy noted in section 23 3113.", project: "UCD", timestamp: "2026-02-24T11:30:00Z" },
    { id: "c11", content: "PSL items fully verified against specification Rev C.", project: "PSL", timestamp: "2026-02-23T16:30:00Z" },
  ],
  u6: [
    { id: "c12", content: "Piping material certs uploaded for contractor review.", project: "NET", timestamp: "2026-02-24T10:00:00Z" },
  ],
  u7: [
    { id: "c13", content: "SFO project initialized. Awaiting first document upload.", project: "SFO Terminal B", timestamp: "2026-02-25T09:00:00Z" },
  ],
  u8: [
    { id: "c14", content: "Compliance check complete for PSL — no issues found.", project: "PSL", timestamp: "2026-02-24T10:30:00Z" },
  ],
};

// ─── Helpers ────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getProjectsDisplay(projectIds: string[]): string {
  if (projectIds.length >= AVAILABLE_PROJECTS.length) return "All";
  if (projectIds.length === 0) return "None";
  return projectIds
    .map((id) => AVAILABLE_PROJECTS.find((p) => p.id === id)?.abbr ?? id)
    .join(", ");
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date("2026-02-25T12:00:00Z");
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const activityTypeIcons: Record<UserActivity["type"], typeof Activity> = {
  status: Activity,
  comment: MessageSquare,
  upload: Upload,
  review: CheckCircle2,
};

const activityTypeColors: Record<UserActivity["type"], string> = {
  status: "text-blue-500",
  comment: "text-amber-500",
  upload: "text-green-500",
  review: "text-purple-500",
};

// ─── Page Component ─────────────────────────────────

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Panel state (single panel at a time)
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [panelUser, setPanelUser] = useState<UserRow | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "activity" | "comments">("overview");

  // Add User form
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<UserRoleLabel>("Submitter");
  const [addProjectIds, setAddProjectIds] = useState<string[]>([]);

  // Access panel edit state
  const [accessProjectIds, setAccessProjectIds] = useState<string[]>([]);

  // Change Role dialog
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [changeRoleUser, setChangeRoleUser] = useState<UserRow | null>(null);
  const [newRole, setNewRole] = useState<UserRoleLabel>("Submitter");

  // Transfer Ownership dialog
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferUser, setTransferUser] = useState<UserRow | null>(null);

  // Remove User dialog
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<UserRow | null>(null);

  // ── Filtering ──

  const filtered = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Summary counts ──

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "Admin").length;
  const submitterCount = users.filter((u) => u.role === "Submitter").length;
  const reviewerCount = users.filter((u) => u.role === "Reviewer").length;
  const viewerCount = users.filter((u) => u.role === "Global Viewer").length;

  const summaryCards = [
    { label: "Total Users", count: totalUsers, icon: Users, color: "text-foreground", bg: "bg-muted/50" },
    { label: "Admins", count: adminCount, icon: ShieldCheck, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Submitters", count: submitterCount, icon: User, color: "text-status-pre-approved", bg: "bg-status-pre-approved-bg" },
    { label: "Reviewers", count: reviewerCount + viewerCount, icon: Eye, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
  ];

  // ── Panel openers ──

  const openAddPanel = () => {
    setAddName("");
    setAddEmail("");
    setAddRole("Submitter");
    setAddProjectIds([]);
    setPanelUser(null);
    setPanelMode("add");
  };

  const openDetailPanel = (user: UserRow) => {
    setPanelUser(user);
    setDetailTab("overview");
    setPanelMode("detail");
  };

  const openAccessPanel = (user: UserRow) => {
    setPanelUser(user);
    setAccessProjectIds([...user.projectIds]);
    setPanelMode("access");
  };

  const closePanel = () => {
    setPanelMode(null);
    setPanelUser(null);
  };

  // ── Handlers ──

  const handleAddUser = useCallback(() => {
    if (!addName.trim() || !addEmail.trim()) return;

    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const newUser: UserRow = {
      id: `u${Date.now()}`,
      name: addName.trim(),
      email: addEmail.trim().toLowerCase(),
      role: addRole,
      createdDate: formatted,
      projectIds: addRole === "Admin" || addRole === "Global Viewer" ? [...ALL_PROJECT_IDS] : [...addProjectIds],
      avatarUrl: `https://i.pravatar.cc/150?u=${addEmail.trim().toLowerCase()}`,
    };

    setUsers((prev) => [newUser, ...prev]);
    closePanel();
    toast.success(`${newUser.name} added successfully`, {
      description: `Assigned as ${newUser.role} with access to ${getProjectsDisplay(newUser.projectIds)}`,
    });
  }, [addName, addEmail, addRole, addProjectIds]);

  const handleChangeRole = useCallback(() => {
    if (!changeRoleUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === changeRoleUser.id
          ? {
              ...u,
              role: newRole,
              projectIds: newRole === "Admin" || newRole === "Global Viewer" ? [...ALL_PROJECT_IDS] : u.projectIds,
            }
          : u
      )
    );
    const userName = changeRoleUser.name;
    setChangeRoleOpen(false);
    setChangeRoleUser(null);
    toast.success(`Role updated for ${userName}`, {
      description: `Now assigned as ${newRole}`,
    });
  }, [changeRoleUser, newRole]);

  const handleTransfer = useCallback(() => {
    if (!transferUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === transferUser.id ? { ...u, role: "Admin" as UserRoleLabel } : u
      )
    );
    const userName = transferUser.name;
    setTransferOpen(false);
    setTransferUser(null);
    toast.success(`Ownership transferred to ${userName}`, {
      description: "They are now the primary admin",
    });
  }, [transferUser]);

  const handleRemoveUser = useCallback(() => {
    if (!removeUser) return;
    const userName = removeUser.name;
    setUsers((prev) => prev.filter((u) => u.id !== removeUser.id));
    setRemoveOpen(false);
    setRemoveUser(null);
    if (panelUser?.id === removeUser.id) closePanel();
    toast.success(`${userName} has been removed`, {
      description: "Their access has been revoked",
    });
  }, [removeUser, panelUser]);

  const handleUpdateAccess = useCallback(() => {
    if (!panelUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === panelUser.id ? { ...u, projectIds: [...accessProjectIds] } : u
      )
    );
    const userName = panelUser.name;
    closePanel();
    toast.success(`Access updated for ${userName}`, {
      description: `Now has access to ${getProjectsDisplay(accessProjectIds)}`,
    });
  }, [panelUser, accessProjectIds]);

  const handleOpenChangeRole = (user: UserRow) => {
    setChangeRoleUser(user);
    setNewRole(user.role);
    setChangeRoleOpen(true);
  };

  const handleOpenTransfer = (user: UserRow) => {
    setTransferUser(user);
    setTransferOpen(true);
  };

  const handleOpenRemove = (user: UserRow) => {
    setRemoveUser(user);
    setRemoveOpen(true);
  };

  // ── Toggle project in access list ──

  const toggleAddProject = (projectId: string) => {
    setAddProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const toggleAccessProject = (projectId: string) => {
    setAccessProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  // ── Render ──

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team members, roles, and project access
          </p>
        </div>
        <Button
          className="gradient-action text-white border-0 shadow-action hover:opacity-90 transition-opacity font-semibold"
          onClick={openAddPanel}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border bg-card shadow-card p-4 flex items-center gap-4 hover-lift animate-fade-up"
            >
              <div className={`h-10 w-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <IconComp className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{card.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Global Viewer">Global Viewer</SelectItem>
            <SelectItem value="Submitter">Submitter</SelectItem>
            <SelectItem value="Reviewer">Reviewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => {
          const initials = getInitials(user.name);
          const RoleIcon = roleIcons[user.role];
          return (
            <div
              key={user.id}
              className="relative rounded-xl border bg-card shadow-card p-4 hover:shadow-card-hover transition-all hover-lift animate-fade-up group cursor-pointer"
              onClick={() => openDetailPanel(user)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetailPanel(user);
                }
              }}
            >
              {/* Three-dot menu */}
              <div
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenChangeRole(user)}>
                      <KeyRound className="mr-2 h-3.5 w-3.5" />
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenTransfer(user)}>
                      <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                      Transfer Ownership
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAccessPanel(user)}>
                      <FolderOpen className="mr-2 h-3.5 w-3.5" />
                      Update Access
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleOpenRemove(user)}
                      disabled={user.isCurrentUser}
                    >
                      <UserMinus className="mr-2 h-3.5 w-3.5" />
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile + Name + Role */}
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full shrink-0 overflow-hidden bg-muted">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full gradient-accent flex items-center justify-center">
                      <span className="text-xs font-semibold text-white">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate leading-tight">
                      {user.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${roleColors[user.role]} text-[10px] font-medium shrink-0`}
                    >
                      <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                      {user.role}
                    </Badge>
                    {user.isCurrentUser && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1 py-0 font-medium shrink-0"
                      >
                        You
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {user.createdDate}
                </span>
                <span className="flex items-center gap-1 truncate ml-2">
                  <FolderOpen className="h-3 w-3 shrink-0" />
                  <span className="truncate">{getProjectsDisplay(user.projectIds)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border bg-card shadow-card p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-base font-medium">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* RIGHT SIDE SHEET — Add User / Detail / Access  */}
      {/* ═══════════════════════════════════════════════ */}

      <Sheet open={panelMode !== null} onOpenChange={(open) => { if (!open) closePanel(); }}>
        <SheetContent side="right" className="sm:max-w-lg w-full p-0 flex flex-col">

          {/* ─── ADD USER PANEL ─── */}
          {panelMode === "add" && (
            <>
              <SheetHeader className="p-5 pb-0">
                <SheetTitle>Add New User</SheetTitle>
                <SheetDescription>Invite a team member, assign their role, and set project access</SheetDescription>
              </SheetHeader>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}
                className="flex-1 overflow-y-auto p-5 space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="add-name" className="text-xs text-muted-foreground">Full Name</Label>
                  <Input
                    id="add-name"
                    placeholder="e.g. John Doe"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    autoFocus
                  />
                </div>
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="add-email" className="text-xs text-muted-foreground">Email Address</Label>
                  <Input
                    id="add-email"
                    type="email"
                    placeholder="e.g. john.doe@accoes.com"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                  />
                </div>
                {/* Role */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <Select value={addRole} onValueChange={(v) => setAddRole(v as UserRoleLabel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Global Viewer">Global Viewer</SelectItem>
                      <SelectItem value="Submitter">Submitter</SelectItem>
                      <SelectItem value="Reviewer">Reviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Project Access */}
                {addRole !== "Admin" && addRole !== "Global Viewer" && (
                  <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Project Access</Label>
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
                      {AVAILABLE_PROJECTS.map((project) => (
                        <label
                          key={project.id}
                          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1.5 -mx-2 transition-colors"
                        >
                          <Checkbox
                            checked={addProjectIds.includes(project.id)}
                            onCheckedChange={() => toggleAddProject(project.id)}
                          />
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-medium">{project.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {project.abbr}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {addProjectIds.length === 0
                        ? "No projects selected"
                        : `${addProjectIds.length} project${addProjectIds.length !== 1 ? "s" : ""} selected`}
                    </p>
                  </div>
                )}
                {(addRole === "Admin" || addRole === "Global Viewer") && (
                  <div className="rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {addRole}s automatically have access to all projects.
                    </p>
                  </div>
                )}
                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={closePanel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                    disabled={!addName.trim() || !addEmail.trim()}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add User
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* ─── USER DETAIL PANEL ─── */}
          {panelMode === "detail" && panelUser && (() => {
            const activities = MOCK_USER_ACTIVITIES[panelUser.id] || [];
            const comments = MOCK_USER_COMMENTS[panelUser.id] || [];
            const userProjects = AVAILABLE_PROJECTS.filter((p) =>
              panelUser.projectIds.includes(p.id)
            );
            const RoleIcon = roleIcons[panelUser.role];

            return (
              <>
                <SheetHeader className="p-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full shrink-0 overflow-hidden bg-muted">
                      {panelUser.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={panelUser.avatarUrl} alt={panelUser.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full gradient-accent flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">{getInitials(panelUser.name)}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-base">{panelUser.name}</SheetTitle>
                      <SheetDescription className="mt-0.5">{panelUser.email}</SheetDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={`${roleColors[panelUser.role]} text-[10px] font-medium`}>
                      <RoleIcon className="h-2.5 w-2.5 mr-0.5" />
                      {panelUser.role}
                    </Badge>
                    {panelUser.isCurrentUser && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 font-medium">You</Badge>
                    )}
                  </div>
                </SheetHeader>

                {/* Tab navigation */}
                <div className="flex border-b px-5">
                  {(["overview", "activity", "comments"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors capitalize ${
                        detailTab === tab
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-5">
                  {/* Overview Tab */}
                  {detailTab === "overview" && (
                    <div className="space-y-5">
                      {/* Info fields */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Email</span>
                          <span className="ml-auto font-medium truncate">{panelUser.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Role</span>
                          <span className="ml-auto font-medium">{panelUser.role}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">Joined</span>
                          <span className="ml-auto font-medium">{panelUser.createdDate}</span>
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Projects ({userProjects.length})
                        </h4>
                        <div className="space-y-1.5">
                          {userProjects.map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
                            >
                              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium">{project.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono ml-auto">{project.abbr}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => { closePanel(); handleOpenChangeRole(panelUser); }}>
                          <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                          Change Role
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { closePanel(); setTimeout(() => openAccessPanel(panelUser), 150); }}>
                          <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                          Update Access
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Activity Tab */}
                  {detailTab === "activity" && (
                    <div className="space-y-1">
                      {activities.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No activity recorded yet</p>
                      )}
                      {activities.map((activity) => {
                        const TypeIcon = activityTypeIcons[activity.type];
                        return (
                          <div key={activity.id} className="flex gap-3 py-2.5 border-b border-border/40 last:border-0">
                            <div className={`h-7 w-7 rounded-full bg-muted/60 flex items-center justify-center shrink-0 mt-0.5`}>
                              <TypeIcon className={`h-3.5 w-3.5 ${activityTypeColors[activity.type]}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-snug">{activity.action}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                                  {activity.project}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatRelativeTime(activity.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Comments Tab */}
                  {detailTab === "comments" && (
                    <div className="space-y-1">
                      {comments.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No comments yet</p>
                      )}
                      {comments.map((comment) => (
                        <div key={comment.id} className="py-2.5 border-b border-border/40 last:border-0">
                          <p className="text-sm leading-relaxed">{comment.content}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                              {comment.project}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {formatRelativeTime(comment.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          {/* ─── UPDATE ACCESS PANEL ─── */}
          {panelMode === "access" && panelUser && (
            <>
              <SheetHeader className="p-5 pb-0">
                <SheetTitle>Update Access</SheetTitle>
                <SheetDescription>Manage project access for {panelUser.name}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {(panelUser.role === "Admin" || panelUser.role === "Global Viewer") ? (
                  <div className="rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      {panelUser.role}s automatically have access to all projects. Change their role to restrict access to specific projects.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {accessProjectIds.length} of {AVAILABLE_PROJECTS.length} projects selected
                      </p>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => setAccessProjectIds([...ALL_PROJECT_IDS])}
                        >
                          Select All
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => setAccessProjectIds([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
                      {AVAILABLE_PROJECTS.map((project) => (
                        <label
                          key={project.id}
                          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1.5 -mx-2 transition-colors"
                        >
                          <Checkbox
                            checked={accessProjectIds.includes(project.id)}
                            onCheckedChange={() => toggleAccessProject(project.id)}
                          />
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-sm font-medium">{project.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono ml-auto">{project.abbr}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={closePanel}>Cancel</Button>
                  <Button
                    className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                    onClick={handleUpdateAccess}
                    disabled={panelUser.role === "Admin" || panelUser.role === "Global Viewer"}
                  >
                    Save Access
                  </Button>
                </div>
              </div>
            </>
          )}

        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════ */}
      {/* DIALOGS — Change Role / Transfer / Remove      */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Change Role Dialog */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update role for {changeRoleUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Current Role</Label>
              <p className="text-sm font-medium">{changeRoleUser?.role}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">New Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRoleLabel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Global Viewer">Global Viewer</SelectItem>
                  <SelectItem value="Submitter">Submitter</SelectItem>
                  <SelectItem value="Reviewer">Reviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newRole === "Admin" || newRole === "Global Viewer") && changeRoleUser && changeRoleUser.role !== "Admin" && changeRoleUser.role !== "Global Viewer" && (
              <div className="rounded-lg border bg-blue-50 dark:bg-blue-900/20 p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Changing to {newRole} will grant access to all projects.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setChangeRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                onClick={handleChangeRole}
                disabled={newRole === changeRoleUser?.role}
              >
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
            <DialogDescription>
              Transfer admin ownership to {transferUser?.name}. This will make them the primary admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border bg-amber-50 dark:bg-amber-900/20 p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This action will transfer primary admin privileges to this user. You will retain your current role but lose ownership status.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setTransferOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleTransfer}
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove User Dialog */}
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {removeUser?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-xs text-red-700 dark:text-red-400">
                This will revoke all access for {removeUser?.name} ({removeUser?.email}). This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setRemoveOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRemoveUser}>
                <UserMinus className="mr-1.5 h-3.5 w-3.5" />
                Remove User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
