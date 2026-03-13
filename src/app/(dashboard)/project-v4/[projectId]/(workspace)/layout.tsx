"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Share2, Link2, Mail, Check, Plus } from "lucide-react";
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
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { TeamAccessSheet } from "@/components/projects/team-access-sheet";
import { mockUsers } from "@/data/mock-users";
import type { Project } from "@/data/types";
import { mockProjects } from "@/data/mock-projects";
import { getVersion } from "@/data/mock-versions";

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

function HeaderActions({ project }: { project: Project }) {
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

  return (
    <>
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
          actions={<HeaderActions project={project} />}
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
