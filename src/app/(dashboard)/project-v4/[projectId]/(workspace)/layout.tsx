"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Share2, Link2, Mail, Check, Plus, ChevronDown, Flag, Activity } from "lucide-react";
import { MilestoneProgressBar } from "@/components/layout/milestone-progress-bar";
import { VersionInfoHeader } from "@/components/workspace/version-info-header";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { ProjectDetailSheet } from "@/components/projects/project-detail-sheet";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { TeamAccessSheet } from "@/components/projects/team-access-sheet";
import { mockUsers } from "@/data/mock-users";
import type { Project, ProjectStatus } from "@/data/types";
import { mockProjects } from "@/data/mock-projects";
import { getVersion } from "@/data/mock-versions";

/* -------------------------------------------------------------------------- */
/*  Status & Priority configs                                                  */
/* -------------------------------------------------------------------------- */

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "active", label: "Active", color: "bg-emerald-500" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { value: "on_hold", label: "On Hold", color: "bg-amber-500" },
  { value: "completed", label: "Completed", color: "bg-zinc-400" },
];

const PRIORITY_OPTIONS: { value: "high" | "medium" | "low"; label: string; color: string }[] = [
  { value: "high", label: "High", color: "bg-red-500" },
  { value: "medium", label: "Medium", color: "bg-amber-500" },
  { value: "low", label: "Low", color: "bg-blue-500" },
];

/* -------------------------------------------------------------------------- */
/*  Header Actions — Share + Team                                              */
/* -------------------------------------------------------------------------- */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function HeaderActions({
  project,
  projectStatus,
  onStatusChange,
  projectPriority,
  onPriorityChange,
}: {
  project: Project;
  projectStatus: ProjectStatus;
  onStatusChange: (status: ProjectStatus) => void;
  projectPriority: "high" | "medium" | "low";
  onPriorityChange: (priority: "high" | "medium" | "low") => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [teamSheetOpen, setTeamSheetOpen] = useState(false);

  const members = project.memberIds
    .map((id) => mockUsers.find((u) => u.id === id))
    .filter(Boolean);
  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Accoes — ${project.name}`);
    const body = encodeURIComponent(
      `Here's the link to the project:\n${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    setShareOpen(false);
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === projectStatus) ?? STATUS_OPTIONS[0];
  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === projectPriority) ?? PRIORITY_OPTIONS[1];

  return (
    <>
      {/* Project Status Selector */}
      <Select
        value={projectStatus}
        onValueChange={(v) => {
          onStatusChange(v as ProjectStatus);
          const label = STATUS_OPTIONS.find((s) => s.value === v)?.label ?? v;
          toast.success(`Project status changed to ${label}`);
        }}
      >
        <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs gap-1.5 border-border/60" aria-label="Change project status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full shrink-0 ${opt.color}`} />
                {opt.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Project Priority Selector */}
      <Select
        value={projectPriority}
        onValueChange={(v) => {
          onPriorityChange(v as "high" | "medium" | "low");
          const label = PRIORITY_OPTIONS.find((p) => p.value === v)?.label ?? v;
          toast.success(`Priority changed to ${label}`);
        }}
      >
        <SelectTrigger className="h-7 w-auto min-w-[100px] text-xs gap-1.5 border-border/60" aria-label="Change project priority">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {PRIORITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              <div className="flex items-center gap-2">
                <Flag className={`h-3 w-3 shrink-0 ${
                  opt.value === "high" ? "text-red-500" : opt.value === "medium" ? "text-amber-500" : "text-blue-500"
                }`} />
                {opt.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Team member avatars */}
      <AvatarGroup>
        {visibleMembers.map((user) => (
          <Avatar key={user!.id} size="sm">
            {user!.avatarUrl && <AvatarImage src={user!.avatarUrl} alt={user!.name} />}
            <AvatarFallback className="text-[9px] font-medium">
              {getInitials(user!.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflowCount > 0 && (
          <AvatarGroupCount className="text-[9px]">+{overflowCount}</AvatarGroupCount>
        )}
        <button
          type="button"
          className="size-6 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-nav-accent hover:bg-nav-accent/5 transition-colors ml-0.5"
          onClick={() => setTeamSheetOpen(true)}
          aria-label="Manage team access"
          title="Manage team"
        >
          <Plus className="h-3 w-3 text-muted-foreground" />
        </button>
      </AvatarGroup>

      {/* Share */}
      <Popover open={shareOpen} onOpenChange={setShareOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5"
            aria-label="Share project"
          >
            <Share2 className="h-3 w-3" aria-hidden="true" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end" sideOffset={8}>
          <div className="space-y-1" role="menu" aria-label="Share options">
            <button
              type="button"
              className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-xs hover:bg-muted/60 transition-colors text-left"
              onClick={handleCopyLink}
              role="menuitem"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-status-pre-approved shrink-0" aria-hidden="true" />
              ) : (
                <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              )}
              <span className="font-medium">
                {copied ? "Link copied!" : "Copy link"}
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-xs hover:bg-muted/60 transition-colors text-left"
              onClick={handleEmailShare}
              role="menuitem"
            >
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
              <span className="font-medium">Share via email</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Team Access Sheet */}
      <TeamAccessSheet
        project={project}
        open={teamSheetOpen}
        onOpenChange={setTeamSheetOpen}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout                                                                     */
/* -------------------------------------------------------------------------- */

export default function V4WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ projectId: string }>();
  const project = mockProjects.find((p) => p.id === params.projectId);
  const version = project ? getVersion(project.latestVersionId) : undefined;

  const [detailOpen, setDetailOpen] = useState(false);
  const [projectStatus, setProjectStatus] = useState(project?.status ?? "active");
  const [projectPriority, setProjectPriority] = useState(project?.priority ?? "medium");
  const handleProjectNameClick = () => setDetailOpen(true);

  if (!project || !version) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project or version not found.</p>
      </div>
    );
  }

  return (
    <WorkspaceProvider project={project} version={version}>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <VersionInfoHeader
          version={version}
          project={project}
          onProjectNameClick={handleProjectNameClick}
          backHref="/project-v4"
          actions={
            <HeaderActions
              project={project}
              projectStatus={projectStatus}
              onStatusChange={setProjectStatus}
              projectPriority={projectPriority}
              onPriorityChange={setProjectPriority}
            />
          }
        />
        <MilestoneProgressBar
          currentStage={version.workflowStage}
          projectId={project.id}
          versionId={version.id}
          basePath={`/project-v4/${project.id}`}
        />
        <main className="flex-1 min-h-0 overflow-hidden relative">{children}</main>
      </div>
      <ProjectDetailSheet project={project} open={detailOpen} onOpenChange={setDetailOpen} />
    </WorkspaceProvider>
  );
}
