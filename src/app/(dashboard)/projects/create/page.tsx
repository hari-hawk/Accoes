"use client";

import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateJobForm } from "@/components/projects/create-job-form";
import { DraftsPanel } from "@/components/projects/drafts-panel";
import { useDrafts, type DraftData } from "@/providers/draft-provider";

export default function CreateJobPage() {
  const { drafts } = useDrafts();
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [loadedDraft, setLoadedDraft] = useState<DraftData | undefined>(
    undefined
  );

  /** When a draft card is clicked, set it as the active draft to load */
  const handleLoadDraft = (draft: DraftData) => {
    setLoadedDraft(draft);
  };

  return (
    <div className="px-6 py-8 max-w-[1000px] mx-auto animate-fade-up">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create new project
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload required project documents to generate automated conformance results
          </p>
        </div>

        {/* Drafts button */}
        <Button
          variant="outline"
          size="sm"
          className="relative gap-1.5"
          onClick={() => setDraftsOpen(true)}
          aria-label={`Saved drafts${drafts.length > 0 ? ` (${drafts.length})` : ""}`}
        >
          <CloudUpload className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Drafts</span>
          {drafts.length > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-[20px] px-1.5 text-[10px] font-bold bg-nav-accent text-white"
            >
              {drafts.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Form */}
      <CreateJobForm
        key={loadedDraft?.id ?? "new"}
        initialDraft={loadedDraft}
      />

      {/* Drafts side panel */}
      <DraftsPanel
        open={draftsOpen}
        onOpenChange={setDraftsOpen}
        onLoadDraft={handleLoadDraft}
      />
    </div>
  );
}
