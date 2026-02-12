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

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Reviewer";
  createdDate: string;
  projects: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
}

const mockUserData: UserRow[] = [
  { id: "u1", name: "Alex Thompson", email: "alexthompson@domain.com", role: "Admin", createdDate: "Jan 5, 2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=alex" },
  { id: "u2", name: "Ethan Parker", email: "ethanparker@domain.com", role: "User", createdDate: "Jan 10, 2026", projects: "All", isCurrentUser: true, avatarUrl: "https://i.pravatar.cc/150?u=ethan" },
  { id: "u3", name: "David Lee", email: "davidlee@domain.com", role: "Reviewer", createdDate: "Jan 15, 2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=david" },
  { id: "u4", name: "Emily Carter", email: "emilycarter@domain.com", role: "Reviewer", createdDate: "Jan 20, 2026", projects: "dcjc", avatarUrl: "https://i.pravatar.cc/150?u=emily" },
  { id: "u5", name: "Sophia Johnson", email: "sophiajohnson@domain.com", role: "User", createdDate: "Jan 25, 2026", projects: "dcjc, lawa +3", avatarUrl: "https://i.pravatar.cc/150?u=sophia" },
  { id: "u6", name: "James Chen", email: "jameschen@domain.com", role: "Admin", createdDate: "Feb 1, 2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=james" },
  { id: "u7", name: "Maria Garcia", email: "mariagarcia@domain.com", role: "Reviewer", createdDate: "Feb 3, 2026", projects: "All", avatarUrl: "https://i.pravatar.cc/150?u=maria" },
  { id: "u8", name: "David Park", email: "davidpark@domain.com", role: "User", createdDate: "Feb 5, 2026", projects: "dcjc, lawa", avatarUrl: "https://i.pravatar.cc/150?u=park" },
];

const roleColors: Record<string, string> = {
  Admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  User: "bg-status-pre-approved-bg text-status-pre-approved",
  Reviewer: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
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

  const filtered = mockUserData.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalUsers = mockUserData.length;
  const adminCount = mockUserData.filter((u) => u.role === "Admin").length;
  const userCount = mockUserData.filter((u) => u.role === "User").length;
  const reviewerCount = mockUserData.filter((u) => u.role === "Reviewer").length;

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
      label: "Users",
      count: userCount,
      icon: User,
      color: "text-status-pre-approved",
      bg: "bg-status-pre-approved-bg",
    },
    {
      label: "Reviewers",
      count: reviewerCount,
      icon: Eye,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="px-6 py-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team members and their access across projects
          </p>
        </div>
        <Button className="gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold">
          <Plus className="mr-1.5 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Summary Cards — consistent: metrics first */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border bg-card shadow-card p-4 flex items-center gap-4"
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

      {/* Search + Filters — consistent: below metrics */}
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Reviewer">Reviewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Cards Grid — 3 columns for more space */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => {
          const initials = getInitials(user.name);
          return (
            <div
              key={user.id}
              className="relative rounded-xl border bg-card shadow-card p-4 hover:shadow-card-hover transition-shadow group"
            >
              {/* Three-dot menu — top right, visible on hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem>Manage Projects</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Profile image + Name + Role pill — horizontal layout */}
              <div className="flex items-center gap-3">
                {/* Avatar image */}
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

                {/* Name + Email + Role inline */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate leading-tight">
                      {user.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${roleColors[user.role]} text-[10px] font-medium shrink-0`}
                    >
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

              {/* Bottom row — created date + projects */}
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
    </div>
  );
}
