"use client";

import { createContext, useContext, useState, useCallback } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DraftFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "xlsx" | "docx" | "csv" | "other";
  category: "material_metrics" | "project_specification" | "project_documents";
}

export interface DraftLink {
  id: string;
  url: string;
}

export interface DraftMember {
  userId: string;
  role: "collaborator" | "viewer";
}

export interface DraftData {
  id: string;
  files: DraftFile[];
  links: DraftLink[];
  jobId: string;
  customerName: string;
  priority: "high" | "medium" | "low";
  bidDate: string;
  points: number;
  assignedEstimator: string;
  notes: string;
  members: DraftMember[];
  savedAt: string; // ISO timestamp
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

interface DraftContextValue {
  drafts: DraftData[];
  addDraft: (draft: Omit<DraftData, "id" | "savedAt">) => void;
  removeDraft: (id: string) => void;
  getDraft: (id: string) => DraftData | undefined;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);

  const addDraft = useCallback(
    (draft: Omit<DraftData, "id" | "savedAt">) => {
      const newDraft: DraftData = {
        ...draft,
        id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        savedAt: new Date().toISOString(),
      };
      setDrafts((prev) => [newDraft, ...prev]);
    },
    []
  );

  const removeDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const getDraft = useCallback(
    (id: string) => drafts.find((d) => d.id === id),
    [drafts]
  );

  return (
    <DraftContext.Provider value={{ drafts, addDraft, removeDraft, getDraft }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDrafts() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDrafts must be used within DraftProvider");
  return ctx;
}
