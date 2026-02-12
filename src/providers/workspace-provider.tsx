"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Project, Version } from "@/data/types";

interface WorkspaceContextValue {
  project: Project;
  version: Version;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

export function WorkspaceProvider({
  project,
  version,
  children,
}: {
  project: Project;
  version: Version;
  children: ReactNode;
}) {
  return (
    <WorkspaceContext.Provider value={{ project, version }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
