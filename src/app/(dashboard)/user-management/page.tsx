"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";

type UserRoleLabel = "Admin" | "Global Viewer" | "Submitter" | "Reviewer";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRoleLabel;
  createdDate: string;
  projects: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

const mockUserData: UserRow[] = [
  { id: "u1", name: "Sarah Mitchell", email: "sarah.mitchell@accoes.com", role: "Admin", createdDate: "05/01/2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "u2", name: "James Chen", email: "james.chen@accoes.com", role: "Submitter", createdDate: "10/01/2026", projects: "RCT, HDM, MLE", isCurrentUser: true, avatarUrl: "https://i.pravatar.cc/150?u=james" },
  { id: "u3", name: "Maria Garcia", email: "maria.garcia@accoes.com", role: "Reviewer", createdDate: "15/01/2026", projects: "RCT, DOR", avatarUrl: "https://i.pravatar.cc/150?u=maria" },
  { id: "u4", name: "David Park", email: "david.park@accoes.com", role: "Global Viewer", createdDate: "20/01/2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=david" },
  { id: "u5", name: "Emily Carter", email: "emily.carter@accoes.com", role: "Reviewer", createdDate: "25/01/2026", projects: "HDM, PRC", avatarUrl: "https://i.pravatar.cc/150?u=emily" },
  { id: "u6", name: "Sophia Johnson", email: "sophia.johnson@accoes.com", role: "Submitter", createdDate: "01/02/2026", projects: "MLE, CCA", avatarUrl: "https://i.pravatar.cc/150?u=sophia" },
  { id: "u7", name: "Alex Thompson", email: "alex.thompson@accoes.com", role: "Admin", createdDate: "03/02/2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=alex" },
  { id: "u8", name: "Rachel Kim", email: "rachel.kim@accoes.com", role: "Global Viewer", createdDate: "05/02/2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=rachel" },
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Change Role dialog
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [changeRoleUser, setChangeRoleUser] = useState<UserRow | null>(null);
  const [newRole, setNewRole] = useState<UserRoleLabel>("Submitter");

  // Transfer Ownership dialog
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferUser, setTransferUser] = useState<UserRow | null>(null);

  const filtered = mockUserData.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalUsers = mockUserData.length;
  const adminCount = mockUserData.filter((u) => u.role === "Admin").length;
  const submitterCount = mockUserData.filter((u) => u.role === "Submitter").length;
  const reviewerCount = mockUserData.filter((u) => u.role === "Reviewer").length;
  const viewerCount = mockUserData.filter((u) => u.role === "Global Viewer").length;

  const summaryCards = [
    {
      label: "Total Users",
      count: totalUsers,
      icon: Users,
      color: "text-foreground",
      bg: "bg-muted/50",
    },
    {
      label: "Admins",
      count: adminCount,
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Submitters",
      count: submitterCount,
      icon: User,
      color: "text-status-pre-approved",
      bg: "bg-status-pre-approved-bg",
    },
    {
      label: "Reviewers",
      count: reviewerCount + viewerCount,
      icon: Eye,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  const handleOpenChangeRole = (user: UserRow) => {
    setChangeRoleUser(user);
    setNewRole(user.role);
    setChangeRoleOpen(true);
  };

  const handleOpenTransfer = (user: UserRow) => {
    setTransferUser(user);
    setTransferOpen(true);
  };

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
        <Button className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold">
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
              className="relative rounded-xl border bg-card shadow-card p-4 hover:shadow-card-hover transition-all hover-lift animate-fade-up group"
            >
              {/* Three-dot menu */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <DropdownMenuItem>
                      <FolderOpen className="mr-2 h-3.5 w-3.5" />
                      Update Access
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
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
                        className="text-[9px] px-1 py-0 font-medium shrink-0"
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
                  <span className="truncate">{user.projects}</span>
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
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setChangeRoleOpen(false)}>
                Cancel
              </Button>
              <Button
                className="gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                onClick={() => setChangeRoleOpen(false)}
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
                onClick={() => setTransferOpen(false)}
              >
                Confirm Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
