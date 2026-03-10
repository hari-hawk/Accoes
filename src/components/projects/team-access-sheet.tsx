"use client";

import { useState } from "react";
import {
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/shared/search-input";
import { mockUsers } from "@/data/mock-users";
import { ROLE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Project, UserRole } from "@/data/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const ASSIGNABLE_ROLES: { key: UserRole; label: string }[] = [
  { key: "viewer", label: "Reviewer" },
  { key: "collaborator", label: "Collaborator" },
  { key: "admin", label: "Owner" },
];

export function TeamAccessSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("viewer");

  // Resolve member IDs to user objects (typed filter eliminates null assertions)
  const members = (project?.memberIds ?? [])
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const handleInvite = () => {
    if (!search.trim()) {
      toast.error("Enter a name or email to invite");
      return;
    }
    toast.success(`Invitation sent to ${search}`, {
      description: `Role: ${ROLE_CONFIG[inviteRole]?.label ?? inviteRole}`,
    });
    setSearch("");
  };

  const handleRemove = (userName: string) => {
    toast.success(`${userName} removed from project`, {
      description: "They will no longer have access to this project.",
    });
  };

  const handleChangeRole = (userName: string, newRole: UserRole) => {
    toast.success(`${userName}'s role updated`, {
      description: `New role: ${ROLE_CONFIG[newRole]?.label ?? newRole}`,
    });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSearch("");
      setInviteRole("viewer");
    }
    onOpenChange(isOpen);
  };

  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col p-0"
        aria-label={`Team access for ${project.name}`}
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-ds-primary-100 flex items-center justify-center shrink-0">
              <UserPlus className="h-4 w-4 text-ds-primary-800" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">Team Access</SheetTitle>
              <SheetDescription className="text-xs mt-0.5 truncate">
                {project.name} — {project.jobId}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Add Member Section */}
        <div className="px-6 py-4 border-b space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
            Add Team Member
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by name or email..."
                value={search}
                onChange={setSearch}
                className="[&_input]:h-8 [&_input]:text-xs"
              />
            </div>
            <Button
              size="sm"
              className="h-8 text-xs gradient-accent text-white border-0 shadow-glow hover:opacity-90 transition-opacity"
              onClick={handleInvite}
              disabled={!search.trim()}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              Invite
            </Button>
          </div>
          <div className="flex gap-1.5">
            {ASSIGNABLE_ROLES.map((role) => (
              <button
                key={role.key}
                type="button"
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border",
                  inviteRole === role.key
                    ? "border-nav-accent bg-nav-accent/10 text-nav-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                )}
                onClick={() => setInviteRole(role.key)}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Team */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Current Team{" "}
              <span className="font-normal">
                ({members.length} member{members.length !== 1 ? "s" : ""})
              </span>
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 pb-4 space-y-1" role="list" aria-label="Team members">
            {members.map((user) => {
              const roleConfig = ROLE_CONFIG[user.role] ?? {
                label: user.role,
                color: "bg-muted text-muted-foreground",
              };
              return (
                <div
                  key={user.id}
                  role="listitem"
                  className="flex items-center gap-3 py-2.5 border-b border-b-border/50 last:border-b-0"
                >
                  <Avatar size="default">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    )}
                    <AvatarFallback className="text-xs font-medium">
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
                    className={cn(
                      "text-[10px] font-semibold border-0 rounded-md",
                      roleConfig.color
                    )}
                  >
                    {roleConfig.label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {ASSIGNABLE_ROLES.filter((r) => r.key !== user.role).map(
                        (role) => (
                          <DropdownMenuItem
                            key={role.key}
                            onClick={() => handleChangeRole(user.name, role.key)}
                          >
                            Change to {role.label}
                          </DropdownMenuItem>
                        )
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemove(user.name)}
                      >
                        Remove Access
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
