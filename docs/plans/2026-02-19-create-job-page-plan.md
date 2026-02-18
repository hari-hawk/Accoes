# Create New Job Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 3-step dialog wizard with a dedicated full-page "Create New Job" form at `/projects/create` with file-first UX, auto-categorization, auto-populated fields, drafts panel, and access control.

**Architecture:** Single dashboard route page (`/projects/create`) with extracted form component. Drafts stored in a React context provider for in-memory session persistence. File cards as compact horizontal cards with ✕ at top-right. Job ID auto-generated from mock metadata. TopNav gets a `+ New Job` button.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui (Sheet, Dialog, Input, Select, Badge, Avatar, Button, ScrollArea, Textarea), lucide-react icons.

**Design Doc:** `docs/plans/2026-02-19-create-job-page-design.md`

---

### Task 1: Job ID Generator Utility

**Files:**
- Create: `src/lib/job-id-generator.ts`

**Step 1: Create the job-id-generator utility**

This utility generates Job IDs in the format `{3-4 letter abbreviation}-{year}-{sequential number}`.

```typescript
// src/lib/job-id-generator.ts

let counter = 0;

/**
 * Generate a short abbreviation from a client/project name.
 * Takes first letters of each word, up to 4 chars, uppercased.
 * Falls back to "JOB" if no name provided.
 */
function abbreviate(name: string): string {
  if (!name.trim()) return "JOB";
  const letters = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  return letters || "JOB";
}

/**
 * Generate a unique Job ID. Format: ABR-YYYY-NNN
 * Example: "ACX-2026-001"
 */
export function generateJobId(clientOrProjectName?: string): string {
  counter += 1;
  const abbr = abbreviate(clientOrProjectName ?? "");
  const year = new Date().getFullYear();
  const seq = String(counter).padStart(3, "0");
  return `${abbr}-${year}-${seq}`;
}

/** Reset counter (useful for tests) */
export function resetJobIdCounter(): void {
  counter = 0;
}
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/lib/job-id-generator.ts
git commit -m "feat: add job ID generator utility"
```

---

### Task 2: Draft Context Provider

**Files:**
- Create: `src/providers/draft-provider.tsx`

**Step 1: Create the draft context provider**

This provider stores draft job forms in-memory (session only). It provides add, remove, get, and list operations. Shared between the create page and the drafts panel.

```typescript
// src/providers/draft-provider.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

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

interface DraftContextValue {
  drafts: DraftData[];
  addDraft: (draft: Omit<DraftData, "id" | "savedAt">) => void;
  removeDraft: (id: string) => void;
  getDraft: (id: string) => DraftData | undefined;
}

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<DraftData[]>([]);

  const addDraft = useCallback((draft: Omit<DraftData, "id" | "savedAt">) => {
    const newDraft: DraftData = {
      ...draft,
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      savedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
  }, []);

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
```

**Step 2: Wrap the root layout with DraftProvider**

Modify `src/app/layout.tsx` — add `DraftProvider` inside the `ThemeProvider`:

```tsx
// Add import at top:
import { DraftProvider } from "@/providers/draft-provider";

// Wrap children:
<ThemeProvider ...>
  <DraftProvider>
    <TooltipProvider>{children}</TooltipProvider>
  </DraftProvider>
</ThemeProvider>
```

**Step 3: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 4: Commit**

```bash
git add src/providers/draft-provider.tsx src/app/layout.tsx
git commit -m "feat: add in-memory draft context provider"
```

---

### Task 3: File Upload Card Component

**Files:**
- Create: `src/components/projects/file-upload-card.tsx`

**Step 1: Create the file upload card component**

A compact card showing file type icon, filename, size, and ✕ at top-right corner. Matches the reference design.

```typescript
// src/components/projects/file-upload-card.tsx
"use client";

import { X, FileText, FileSpreadsheet, FileType, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fileTypeConfig: Record<string, { icon: typeof FileText; bgColor: string; iconColor: string; label: string }> = {
  pdf:  { icon: FileText,        bgColor: "bg-red-100 dark:bg-red-900/30",       iconColor: "text-red-600 dark:text-red-400",       label: "PDF" },
  xlsx: { icon: FileSpreadsheet, bgColor: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", label: "XLS" },
  xls:  { icon: FileSpreadsheet, bgColor: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", label: "XLS" },
  csv:  { icon: FileSpreadsheet, bgColor: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", label: "CSV" },
  docx: { icon: FileType,        bgColor: "bg-blue-100 dark:bg-blue-900/30",     iconColor: "text-blue-600 dark:text-blue-400",     label: "DOC" },
  other:{ icon: File,            bgColor: "bg-amber-100 dark:bg-amber-900/30",   iconColor: "text-amber-600 dark:text-amber-400",   label: "FILE" },
};

interface FileUploadCardProps {
  name: string;
  size: string;
  type: string;
  onRemove: () => void;
}

export function FileUploadCard({ name, size, type, onRemove }: FileUploadCardProps) {
  const config = fileTypeConfig[type] ?? fileTypeConfig.other;
  const FileIcon = config.icon;

  return (
    <div className="relative group rounded-xl border bg-card shadow-card p-3 pr-8 flex items-center gap-3 min-w-[200px] max-w-[260px]">
      {/* Remove button — top-right corner */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-5 w-5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* File icon */}
      <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", config.bgColor)}>
        <FileIcon className={cn("h-4 w-4", config.iconColor)} aria-hidden="true" />
      </div>

      {/* File info */}
      <div className="min-w-0">
        <p className="text-xs font-medium truncate">{name}</p>
        <p className="text-[10px] text-muted-foreground">{size}</p>
      </div>
    </div>
  );
}
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/projects/file-upload-card.tsx
git commit -m "feat: add file upload card component"
```

---

### Task 4: Drafts Panel Component

**Files:**
- Create: `src/components/projects/drafts-panel.tsx`

**Step 1: Create the drafts panel (Sheet)**

Right-side Sheet panel showing saved draft cards. Title: "Saved Drafts". Each card matches the reference: customer name (bold heading), job ID + priority badge, timeline + file/link counts. Click loads draft, delete on hover.

```typescript
// src/components/projects/drafts-panel.tsx
"use client";

import { Trash2, Clock, Paperclip } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDrafts, type DraftData } from "@/providers/draft-provider";
import { cn } from "@/lib/utils";

const priorityConfig: Record<string, { label: string; color: string }> = {
  high:   { label: "HIGH",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  medium: { label: "MEDIUM", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  low:    { label: "LOW",    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

interface DraftsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadDraft: (draft: DraftData) => void;
}

export function DraftsPanel({ open, onOpenChange, onLoadDraft }: DraftsPanelProps) {
  const { drafts, removeDraft } = useDrafts();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md w-full flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b pr-12 shrink-0">
          <SheetTitle className="text-base font-bold">Saved Drafts</SheetTitle>
          <SheetDescription className="sr-only">
            Your saved draft jobs. Click a card to resume editing.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="absolute inset-0">
            <div className="p-6 space-y-3">
              {drafts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No drafts saved</p>
                </div>
              ) : (
                drafts.map((draft) => {
                  const pConfig = priorityConfig[draft.priority] ?? priorityConfig.medium;

                  return (
                    <div
                      key={draft.id}
                      className="relative group rounded-xl border bg-card shadow-card p-4 cursor-pointer hover:shadow-card-hover hover:border-nav-accent/30 transition-all"
                      role="button"
                      tabIndex={0}
                      aria-label={`Resume draft: ${draft.customerName || "Untitled"}, ${draft.jobId}`}
                      onClick={() => {
                        onLoadDraft(draft);
                        onOpenChange(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onLoadDraft(draft);
                          onOpenChange(false);
                        }
                      }}
                    >
                      {/* Delete — hover only, top-right */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDraft(draft.id);
                        }}
                        aria-label={`Delete draft ${draft.jobId}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>

                      {/* Line 1: Customer name */}
                      <p className="font-semibold text-sm pr-6 truncate">
                        {draft.customerName || "Untitled Job"}
                      </p>

                      {/* Line 2: Job ID + Priority badge */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-muted-foreground font-mono">
                          {draft.jobId || "No Job ID"}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px] font-bold px-1.5 py-0", pConfig.color)}
                        >
                          {pConfig.label}
                        </Badge>
                      </div>

                      {/* Line 3: Timeline + file/link counts */}
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {formatRelativeTime(draft.savedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" aria-hidden="true" />
                          {draft.files.length} file{draft.files.length !== 1 ? "s" : ""}, {draft.links.length} link{draft.links.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/projects/drafts-panel.tsx
git commit -m "feat: add saved drafts panel component"
```

---

### Task 5: Create Job Form Component

**Files:**
- Create: `src/components/projects/create-job-form.tsx`

**Step 1: Build the complete form component**

This is the main form with all 5 sections: Upload, Links, Job Details, Notes, Access Control. Plus footer CTAs and cancel confirmation dialog.

The component accepts an optional `initialDraft` prop for loading draft data. It manages all form state internally.

This is the largest file. Key sections:

1. **Upload Documents** — drop zone + file cards in flex-wrap grid, grouped by category
2. **Add Link(s)** — URL input + Add button + link list
3. **Job Details** — 3×2 grid: Job ID, Customer Name, Priority, Bid Date, Points, Assigned Estimator
4. **Notes / Comments** — textarea
5. **Access Control** — add member input + role select + member list
6. **Footer** — Cancel + Create Job buttons
7. **Cancel Dialog** — Save as Draft / Discard / Go Back

The mock upload handler simulates file upload by generating a batch of pre-named files with auto-categorization. After upload, job details are auto-populated from mock metadata.

**Auto-categorization logic** (enhanced from existing):
- `.csv`, `.xls`, `.xlsx` → Material Metrics
- `.pdf` → Project Specification
- Filename contains "matrix"/"metric" → Material Metrics
- Filename contains "spec"/"specification" → Project Specification
- Everything else → Project Documents

**Component code:** Due to the size (~500 lines), this should be built incrementally. The full component structure:

```typescript
// src/components/projects/create-job-form.tsx
"use client";

// Imports: useState, useRouter, lucide icons, shadcn components,
// DraftProvider types, FileUploadCard, generateJobId, useDrafts, mockUsers

// Types: UploadedFile (with category: material_metrics | project_specification | project_documents),
//        LinkEntry, MemberEntry

// Helper functions: categorizeFile(), getFileType(), getInitials(), formatFileSize()

// Main component: CreateJobForm({ initialDraft?, onDraftSave? })
//   - All form state as useState hooks
//   - Mock upload handlers (handleUploadFiles, handleAddMoreFiles)
//   - Auto-populate on first upload
//   - Link add/remove handlers
//   - Member add/remove handlers
//   - Cancel confirmation dialog state
//   - handleCreate → navigate to /projects
//   - handleSaveAsDraft → call addDraft from context, navigate to /projects
//
// JSX structure:
//   <div className="space-y-8">
//     Section 1: Upload Documents (drop zone + file cards)
//     Section 2: Add Link(s)
//     Section 3: Job Details (3×2 grid)
//     Section 4: Notes / Comments
//     Section 5: Access Control
//     Footer: Cancel + Create Job
//     <Dialog> Cancel confirmation
//   </div>
```

**IMPORTANT implementation details:**

- File cards: use `<FileUploadCard>` component from Task 3
- File cards layout: `flex flex-wrap gap-3` within each category group
- Category labels: emerald Badge for "Material Metrics", blue Badge for "Project Specification", amber Badge for "Project Documents"
- Drop zone: `role="button"`, `tabIndex={0}`, Enter/Space activation, `focus-visible:ring-2`
- Required fields: Job ID, Customer Name, Assigned Estimator — red asterisk on labels
- All form inputs: `htmlFor`/`id` label association, `aria-required` on required inputs
- Priority Select: options "High" (default), "Medium", "Low"
- Points: number input with `type="number"`, min 0
- Bid Date: `type="date"` input
- Create Job button: disabled until `files.length > 0 && jobId.trim() && customerName.trim() && assignedEstimator.trim()`
- Cancel dialog: uses shadcn AlertDialog with 3 actions

**Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/components/projects/create-job-form.tsx
git commit -m "feat: add create job form component with all sections"
```

---

### Task 6: Create Job Page Route

**Files:**
- Create: `src/app/(dashboard)/projects/create/page.tsx`

**Step 1: Create the page component**

Simple page wrapper that renders the form with a page header (title + draft button).

```typescript
// src/app/(dashboard)/projects/create/page.tsx
"use client";

import { useState, useCallback } from "react";
import { CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateJobForm } from "@/components/projects/create-job-form";
import { DraftsPanel } from "@/components/projects/drafts-panel";
import { useDrafts, type DraftData } from "@/providers/draft-provider";

export default function CreateJobPage() {
  const { drafts } = useDrafts();
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [activeDraft, setActiveDraft] = useState<DraftData | null>(null);

  const handleLoadDraft = useCallback((draft: DraftData) => {
    setActiveDraft(draft);
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto p-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Create New Job</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload project documents to begin automated takeoff and pricing
          </p>
        </div>

        {/* Draft icon */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 relative"
          onClick={() => setDraftsOpen(true)}
          aria-label={`Open saved drafts${drafts.length > 0 ? ` (${drafts.length})` : ""}`}
        >
          <CloudOff className="h-3.5 w-3.5" />
          Drafts
          {drafts.length > 0 && (
            <Badge className="h-4 min-w-4 px-1 text-[9px] font-bold gradient-gold text-white border-0 ml-1">
              {drafts.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Form */}
      <CreateJobForm
        key={activeDraft?.id ?? "new"}
        initialDraft={activeDraft ?? undefined}
      />

      {/* Drafts Panel */}
      <DraftsPanel
        open={draftsOpen}
        onOpenChange={setDraftsOpen}
        onLoadDraft={handleLoadDraft}
      />
    </div>
  );
}
```

**Step 2: Verify the page renders**

Run: `npm run build`
Expected: Build succeeds, route `/projects/create` appears in route list.

**Step 3: Commit**

```bash
git add src/app/\(dashboard\)/projects/create/page.tsx
git commit -m "feat: add /projects/create page route"
```

---

### Task 7: TopNav — Add "+ New Job" Button

**Files:**
- Modify: `src/components/layout/top-nav.tsx` (lines ~302-306 — right-side controls area)

**Step 1: Add the button**

Insert a `+ New Job` Link/Button before the notifications bell in the right-side controls div (line 305, inside `<div className="flex items-center gap-1.5">`).

Add at top of file:
```tsx
import Link from "next/link"; // may already exist — check
import { Plus } from "lucide-react"; // may already exist — check
```

Insert before the `{/* Notifications */}` comment (around line 306):

```tsx
{/* + New Job */}
<Button
  asChild
  size="sm"
  className="h-8 text-xs gap-1 gradient-gold text-white border-0 shadow-gold hover:opacity-90 transition-opacity font-semibold mr-1"
>
  <Link href="/projects/create">
    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
    New Job
  </Link>
</Button>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/components/layout/top-nav.tsx
git commit -m "feat: add + New Job button to top navigation"
```

---

### Task 8: Update Project List — Replace Dialog with Page Link

**Files:**
- Modify: `src/components/projects/project-list.tsx`

**Step 1: Replace dialog trigger with navigation**

In `ProjectList` component:

1. Remove `createOpen` state and `<CreateProjectDialog>` render
2. Remove import of `CreateProjectDialog`
3. Change `onNewProject` callback in `HeroSection` to use `router.push("/projects/create")` instead of `setCreateOpen(true)`
4. Change empty state button to use `<Link href="/projects/create">` instead of `onClick={() => setCreateOpen(true)}`

Add imports:
```tsx
import Link from "next/link";
import { useRouter } from "next/navigation";
```

In `ProjectList`:
```tsx
const router = useRouter();
// Remove: const [createOpen, setCreateOpen] = useState(false);
```

Hero section button change:
```tsx
// Change: onClick={onNewProject} where onNewProject was () => setCreateOpen(true)
// To: onClick={() => router.push("/projects/create")}
```

Empty state button change:
```tsx
// Change:
<Button className="gradient-gold text-white border-0" onClick={() => setCreateOpen(true)}>
// To:
<Button className="gradient-gold text-white border-0" asChild>
  <Link href="/projects/create">
    <Plus className="mr-1.5 h-4 w-4" />
    New Project
  </Link>
</Button>
```

Remove from JSX (near bottom):
```tsx
// Remove: <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. No references to CreateProjectDialog.

**Step 3: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "refactor: replace create project dialog with page navigation"
```

---

### Task 9: Build Verification & Final Cleanup

**Files:**
- Verify: All created/modified files

**Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: no errors

**Step 2: Full build**

Run: `npm run build`
Expected: Build succeeds, `/projects/create` route appears in output

**Step 3: Visual verification checklist**

Run `npm run dev` and manually check:

- [ ] TopNav shows `+ New Job` button (gold, with Plus icon)
- [ ] Clicking `+ New Job` navigates to `/projects/create`
- [ ] Page shows title "Create New Job" with Draft button top-right
- [ ] Drop zone renders with dashed border and teal accent
- [ ] Clicking drop zone shows mock uploaded file cards (grouped by category)
- [ ] File cards show icon + name + size + ✕ at top-right corner
- [ ] Job Details auto-populates after file upload
- [ ] Job ID is editable
- [ ] Required fields show red asterisk
- [ ] Add Link section works (add + remove)
- [ ] Access Control section works (add member + remove)
- [ ] Create Job disabled until required fields filled + files present
- [ ] Cancel → shows confirmation dialog with Save as Draft / Discard / Go Back
- [ ] Save as Draft → saves to drafts, navigates to /projects
- [ ] Drafts button shows count badge when drafts exist
- [ ] Drafts panel opens, shows cards matching reference design
- [ ] Clicking draft card loads it into the form
- [ ] Hover on draft card shows delete icon
- [ ] Projects page hero "New Project" button navigates to /projects/create
- [ ] Projects page empty state button navigates to /projects/create

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Create New Job page — full-page form, drafts, auto-categorize"
```

**Step 5: Push**

```bash
git push
```

---

## File Summary

| Action | File Path |
|--------|-----------|
| Create | `src/lib/job-id-generator.ts` |
| Create | `src/providers/draft-provider.tsx` |
| Create | `src/components/projects/file-upload-card.tsx` |
| Create | `src/components/projects/drafts-panel.tsx` |
| Create | `src/components/projects/create-job-form.tsx` |
| Create | `src/app/(dashboard)/projects/create/page.tsx` |
| Modify | `src/app/layout.tsx` (add DraftProvider) |
| Modify | `src/components/layout/top-nav.tsx` (add + New Job button) |
| Modify | `src/components/projects/project-list.tsx` (replace dialog with Link) |
| Keep   | `src/components/projects/create-project-dialog.tsx` (remove later) |
