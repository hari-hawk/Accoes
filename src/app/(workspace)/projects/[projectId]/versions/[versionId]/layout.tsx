"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Download, Share2, Link2, Mail, Check } from "lucide-react";
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
import { mockProjects } from "@/data/mock-projects";
import { getVersion } from "@/data/mock-versions";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Header Actions — Share + Export                                            */
/* -------------------------------------------------------------------------- */

function HeaderActions({
  exportEnabled,
  projectName,
}: {
  exportEnabled: boolean;
  projectName: string;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Accoes — ${projectName}`);
    const body = encodeURIComponent(
      `Here's the link to the project:\n${window.location.href}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
    setShareOpen(false);
  };

  return (
    <>
      {/* Export */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-7 text-xs gap-1.5 transition-opacity",
          !exportEnabled && "opacity-40 pointer-events-none"
        )}
        disabled={!exportEnabled}
        aria-label={
          exportEnabled
            ? "Export project data"
            : "Export unavailable on this page"
        }
      >
        <Download className="h-3 w-3" aria-hidden="true" />
        Export
      </Button>

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
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout                                                                     */
/* -------------------------------------------------------------------------- */

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ projectId: string; versionId: string }>();
  const pathname = usePathname();
  const project = mockProjects.find((p) => p.id === params.projectId);
  const version = getVersion(params.versionId);

  const [detailOpen, setDetailOpen] = useState(false);
  const handleProjectNameClick = () => setDetailOpen(true);

  if (!project || !version) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project or version not found.</p>
      </div>
    );
  }

  // Export is enabled on pages that have exportable content
  const exportableSegments = ["/review", "/export", "/submittal-binder"];
  const canExport = exportableSegments.some((seg) => pathname.endsWith(seg));

  return (
    <WorkspaceProvider project={project} version={version}>
      <VersionInfoHeader
        version={version}
        project={project}
        onProjectNameClick={handleProjectNameClick}
        actions={
          <HeaderActions
            exportEnabled={canExport}
            projectName={project.name}
          />
        }
      />
      <MilestoneProgressBar
        currentStage={version.workflowStage}
        projectId={project.id}
        versionId={version.id}
      />
      <main className="flex-1 min-h-0 overflow-hidden relative">{children}</main>
      <ProjectDetailSheet project={project} open={detailOpen} onOpenChange={setDetailOpen} />
    </WorkspaceProvider>
  );
}
