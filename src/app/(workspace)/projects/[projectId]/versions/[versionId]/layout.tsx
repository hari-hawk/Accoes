"use client";

import { useParams } from "next/navigation";
import { WorkflowStageBar } from "@/components/layout/workflow-stage-bar";
import { VersionInfoHeader } from "@/components/workspace/version-info-header";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { mockProjects } from "@/data/mock-projects";
import { getVersion } from "@/data/mock-versions";

export default function VersionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ projectId: string; versionId: string }>();
  const project = mockProjects.find((p) => p.id === params.projectId);
  const version = getVersion(params.versionId);

  if (!project || !version) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Project or version not found.</p>
      </div>
    );
  }

  return (
    <WorkspaceProvider project={project} version={version}>
      <VersionInfoHeader version={version} project={project} />
      <WorkflowStageBar
        currentStage={version.workflowStage}
        projectId={project.id}
        versionId={version.id}
      />
      <main className="flex-1 min-h-0 overflow-hidden relative">{children}</main>
    </WorkspaceProvider>
  );
}
