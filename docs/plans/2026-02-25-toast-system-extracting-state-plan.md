# Toast Notification System & Extracting State — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global auto-dismissing toast system (success/caution/error) using Sonner, and implement a project "extracting" state that blocks navigation and fires toasts when clicked.

**Architecture:** Install Sonner, add `<Toaster>` to root layout, create a thin custom wrapper for styled toast variants. Add `"extracting"` to ProjectStatus, update StatusIndicator + ProjectCard for the new state, wire toasts into all existing action handlers across the platform.

**Tech Stack:** Sonner, React 19, Next.js 16, Tailwind v4, shadcn/ui, lucide-react

---

### Task 1: Install Sonner & Add Toaster to Root Layout

**Files:**
- Modify: `package.json` (install sonner)
- Modify: `src/app/layout.tsx:21-42` (add Toaster)

**Step 1: Install sonner**

Run: `npm install sonner`

**Step 2: Add Toaster to root layout**

In `src/app/layout.tsx`, add the import and Toaster component:

```tsx
// Add import at top
import { Toaster } from "sonner";

// Inside the body, after TooltipProvider:
<TooltipProvider>{children}</TooltipProvider>
<Toaster
  position="top-center"
  offset={64}
  duration={5000}
  visibleToasts={3}
  toastOptions={{
    unstyled: true,
    classNames: {
      toast: "w-full max-w-md flex items-start gap-3 rounded-xl border px-4 py-3 shadow-card text-sm font-medium pointer-events-auto",
      title: "text-sm font-semibold",
      description: "text-xs text-muted-foreground mt-0.5",
      success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300",
      warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300",
      error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300",
      info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300",
    },
  }}
/>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with Toaster rendered globally.

**Step 4: Commit**

```bash
git add package.json package-lock.json src/app/layout.tsx
git commit -m "feat: install sonner, add global Toaster to root layout"
```

---

### Task 2: Add "extracting" to ProjectStatus Type & Constants

**Files:**
- Modify: `src/data/types.ts:3-7` (add "extracting" to ProjectStatus union)
- Modify: `src/lib/constants.ts:44-52` (add extracting config to PROJECT_STATUS_CONFIG)
- Modify: `src/components/shared/status-indicator.tsx:33` (add "extracting" to PULSE_STATUSES)

**Step 1: Update ProjectStatus type**

In `src/data/types.ts`, add `"extracting"` as the first union member:

```typescript
export type ProjectStatus =
  | "extracting"
  | "in_progress"
  | "active"
  | "on_hold"
  | "completed";
```

**Step 2: Add extracting config to PROJECT_STATUS_CONFIG**

In `src/lib/constants.ts`, add the extracting entry:

```typescript
export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  extracting: { label: "Extracting", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_progress: { label: "In Progress", color: "bg-status-review-required-bg text-status-review-required" },
  active: { label: "Active", color: "bg-ds-primary-100 text-ds-primary-800" },
  on_hold: { label: "On Hold", color: "bg-muted text-muted-foreground" },
  completed: { label: "Completed", color: "bg-status-pre-approved-bg text-status-pre-approved" },
};
```

**Step 3: Add "extracting" to PULSE_STATUSES**

In `src/components/shared/status-indicator.tsx`:

```typescript
const PULSE_STATUSES: StatusType[] = ["extracting", "active", "processing"];
```

**Step 4: Verify type check**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 5: Commit**

```bash
git add src/data/types.ts src/lib/constants.ts src/components/shared/status-indicator.tsx
git commit -m "feat: add extracting status to ProjectStatus type and constants"
```

---

### Task 3: Add Mock Extracting Project

**Files:**
- Modify: `src/data/mock-projects.ts` (add one extracting project)

**Step 1: Add extracting project to mockProjects array**

Add a new project at position 2 (after UCD, before NET) in the `mockProjects` array:

```typescript
{
  id: "proj-new",
  name: "SFO Terminal B",
  client: "San Francisco International Airport",
  jobId: "80241033",
  location: "San Francisco, CA",
  status: "extracting",
  createdAt: "2026-02-25T08:30:00Z",
  updatedAt: "2026-02-25T08:30:00Z",
  ownerId: "user-1",
  memberIds: ["user-1", "user-4"],
  versionIds: [],
  latestVersionId: "",
  totalDocuments: 0,
  confidenceSummary: {
    preApproved: 0,
    reviewRequired: 0,
    actionMandatory: 0,
    total: 0,
    overallConfidence: 0,
  },
  stage: "extraction",
  projectType: "design_job",
},
```

Note: This project has `latestVersionId: ""` and empty versions so the card won't try to navigate.

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/data/mock-projects.ts
git commit -m "feat: add mock extracting project (SFO Terminal B)"
```

---

### Task 4: Update ProjectCard for Extracting State

**Files:**
- Modify: `src/components/projects/project-card.tsx` (full file — add extracting visual treatment and click interception)

**Step 1: Add extracting visual treatment**

Import `Loader2` from lucide-react and `toast` from sonner.

Add an `isExtracting` flag derived from `project.status === "extracting"`.

Changes needed:

1. **Top of card — animated progress bar**: When `isExtracting`, render a thin indeterminate progress bar at the top of the card (replacing the existing hover accent line):

```tsx
{/* Top accent — extracting progress bar or hover line */}
{isExtracting ? (
  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-100 overflow-hidden" aria-label="Extraction in progress">
    <div className="h-full w-1/3 bg-amber-400 rounded-full animate-indeterminate" />
  </div>
) : (
  <div className="absolute top-0 left-0 right-0 h-0.5 gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
)}
```

2. **Confidence section**: When `isExtracting`, show "Extracting..." instead of percentage, and zero the bar:

```tsx
<span className={cn("font-bold text-xs", isExtracting ? "text-amber-600" : confidenceColor)}>
  {isExtracting ? "Extracting..." : confidence > 0 ? `${confidence}%` : "Pending"}
</span>
```

3. **Breakdown badges**: When `isExtracting`, show `—` placeholders instead of counts.

4. **Footer**: When `isExtracting`, show "Processing documents..." instead of Download Report.

5. **Card wrapper**: When `isExtracting`, replace the `<Link>` wrapper with a `<div>` that fires a caution toast on click:

```tsx
if (isExtracting) {
  return (
    <article
      className="group relative rounded-xl border bg-card shadow-card transition-all duration-300 overflow-hidden animate-fade-up opacity-90 cursor-not-allowed"
      aria-label={`${project.name} — Extracting documents`}
      onClick={() => {
        toast.warning("Document extraction & conformance report in progress.", {
          description: "We'll notify you once it's ready.",
        });
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toast.warning("Document extraction & conformance report in progress.", {
            description: "We'll notify you once it's ready.",
          });
        }
      }}
    >
      {cardContent}
    </article>
  );
}
```

**Step 2: Add indeterminate animation to globals.css**

In `src/app/globals.css`, add:

```css
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
.animate-indeterminate {
  animation: indeterminate 1.5s ease-in-out infinite;
}
```

**Step 3: Verify build**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/projects/project-card.tsx src/app/globals.css
git commit -m "feat: extracting state on project card with progress bar and toast"
```

---

### Task 5: Wire Toast into Create Project Form

**Files:**
- Modify: `src/components/projects/create-job-form.tsx:334-336` (add toast on create)

**Step 1: Add toast on project creation**

Import `toast` from sonner. Update `handleCreate`:

```tsx
const handleCreate = () => {
  toast.success("Project created!", {
    description: "Document extraction has started. We'll notify you when it's ready.",
  });
  router.push("/projects");
};
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/projects/create-job-form.tsx
git commit -m "feat: fire success toast on project creation"
```

---

### Task 6: Wire Toast into Upload Dialog (Overview Page)

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx:759-765` (toast on upload confirm)

**Step 1: Add toast on upload confirmation**

Import `toast` from sonner. Update `handleConfirmUpload`:

```tsx
const handleConfirmUpload = () => {
  const fileCount = uploadFiles.length;
  setUploading(true);
  setTimeout(() => {
    setUploading(false);
    setUploadDialogOpen(false);
    setUploadFiles([]);
    toast.success(`${fileCount} file${fileCount !== 1 ? "s" : ""} uploaded successfully`, {
      description: "Files have been queued for AI processing.",
    });
  }, 1200);
};
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/\(workspace\)/projects/\[projectId\]/versions/\[versionId\]/page.tsx
git commit -m "feat: fire success toast on file upload confirmation"
```

---

### Task 7: Wire Toast into Download Report Export

**Files:**
- Modify: `src/components/projects/project-list.tsx:590-597` (toast on export)

**Step 1: Add toast on export**

Import `toast` from sonner. Update `handleExport`:

```tsx
const handleExport = (format: "csv" | "xlsx") => {
  setExportFormat(format);
  setExporting(true);
  setTimeout(() => {
    setExporting(false);
    setExportComplete(true);
    toast.success(`Report exported as ${format === "csv" ? "CSV" : "Excel"}`, {
      description: `${selectedIds.size} document${selectedIds.size !== 1 ? "s" : ""} included in the report.`,
    });
  }, 1500);
};
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "feat: fire success toast on report export"
```

---

### Task 8: Wire Toast into Share Copy Link

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/layout.tsx:31-34` (toast on copy)

**Step 1: Add toast on link copy**

Import `toast` from sonner. Update `handleCopyLink`:

```tsx
const handleCopyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  toast.success("Link copied to clipboard");
  setTimeout(() => setCopied(false), 2000);
};
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/app/\(workspace\)/projects/\[projectId\]/versions/\[versionId\]/layout.tsx
git commit -m "feat: fire success toast on share link copy"
```

---

### Task 9: Mock Extraction Timer & Notification Panel Integration

**Files:**
- Modify: `src/components/projects/project-list.tsx` (add extraction timer that transitions project and fires toast + notification)

**Step 1: Add extraction simulation**

In the ProjectList component, add a `useEffect` that simulates extraction completion for the mock extracting project after 30 seconds:

- Track extracting project IDs in state
- After 30s, remove from extracting set
- Fire success toast: `"SFO Terminal B is ready for review!"`
- Note: The mock data is static, so this will be a visual simulation only. In Phase 2, this becomes a real polling/webhook mechanism.

For now, add a comment `// TODO: Phase 2 — replace with real extraction status polling` and keep the mock timer simple.

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "feat: mock extraction timer with toast notification on completion"
```

---

### Task 10: Final Verification & Push

**Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors.

**Step 2: Lint**

Run: `npm run lint`
Expected: No errors.

**Step 3: Full build**

Run: `npm run build`
Expected: All pages build successfully.

**Step 4: Push**

Run: `git push`
