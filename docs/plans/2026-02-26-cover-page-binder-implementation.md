# Preview Cover Page + Submittal Binder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder Preview Cover Page with two stacked full-page document previews (Binder Cover + Transmittal Form) with inline editing, update the Submittal Binder with click-to-preview sections, and make milestone completion navigation-based.

**Architecture:** The Preview Cover Page becomes a single-page component with two simulated document previews stacked vertically. Transmittal-specific data (description, notes, review stamps) is managed as local component state. The milestone bar gets a path-aware completion index so navigating forward auto-completes previous milestones. The Submittal Binder gets a section-click handler that opens the existing FullScreenPdfViewer.

**Tech Stack:** Next.js 16 + React 19, Tailwind v4, shadcn/ui, TypeScript, lucide-react icons

---

### Task 1: Update milestone completion logic to be navigation-based

**Files:**
- Modify: `src/components/layout/milestone-progress-bar.tsx`

**Step 1: Update `getCompletedIndex` to factor in pathname**

The function currently only uses `workflowStage`. Add a `pathname` parameter and use `Math.max` of stage-based and path-based indices.

```typescript
function getCompletedIndex(currentStage: WorkflowStage, pathname: string): number {
  // Stage-based completion
  let stageIndex = 0;
  if (currentStage === "export") stageIndex = 3;
  else if (currentStage === "review") stageIndex = 1;

  // Path-based completion — navigating forward marks previous as complete
  let pathIndex = 0;
  if (pathname.includes("/submittal-binder")) pathIndex = 3;
  else if (pathname.includes("/preview-cover")) pathIndex = 2;
  else if (pathname.includes("/review") || pathname.includes("/processing")) pathIndex = 1;

  return Math.max(stageIndex, pathIndex);
}
```

**Step 2: Update the component to pass pathname to `getCompletedIndex`**

In `MilestoneProgressBar`, change:
```typescript
const completedUpTo = getCompletedIndex(currentStage, pathname);
```

**Step 3: Verify build**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit`
Expected: Clean — no errors

**Step 4: Commit**

```bash
git add src/components/layout/milestone-progress-bar.tsx
git commit -m "feat: make milestone completion navigation-based using pathname"
```

---

### Task 2: Rewrite Preview Cover Page — Binder Cover (Page 1)

**Files:**
- Rewrite: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx`

**Step 1: Build the page structure with edit state**

Replace the entire file. The new component has:
- `editing` state (boolean) toggled by Edit/Save/Cancel buttons
- Edit state variables for all project fields (same pattern as overview page)
- Transmittal-specific state: `description`, `submittedFor`, `knownSubstitutions`, `notes`, `accoTransmittalNumber`, `transmittalDate`, `submittedBy`, `reviewStatus`, `reviewedBy`, `reviewDate`
- Two full-page document previews stacked vertically

Imports needed:
```typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Download, Printer, Pencil, Save, X, ArrowRight, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/providers/workspace-provider";
import { mockUsers } from "@/data/mock-users";
```

**Step 2: Build Binder Cover section**

Page 1 layout — a white document card (max-w-3xl, mx-auto) with:
- Top bar: left side has project metadata fields in a grid, right side has ACCO logo placeholder
- Fields: PROJECT NAME, Project Address (location), ACCO PROJECT NUMBER (jobId), PROJECT MANAGER, DATE, REVISED DATE, REVISION #, CUSTOMER, OWNER, ARCHITECT, ENGINEER
- Center: bold title derived from project type — e.g. "PROCESS PIPING SUBMITTAL BINDER"
- Industrial image placeholder (dark blue-gray gradient with text overlay)
- Footer: ACCO Engineered Systems | 5600 Owens Drive | Pleasanton, CA 94588 | (510) 316-4300

In edit mode, each field becomes an Input. In view mode, they render as styled text matching the ACCO cover layout.

**Step 3: Verify the page renders**

Run: `cd "accoes-submittal-ai" && npm run build`
Expected: Clean build, `/preview-cover` route listed

**Step 4: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx"
git commit -m "feat: build Binder Cover preview on Preview Cover Page"
```

---

### Task 3: Add Transmittal Form (Page 2) to Preview Cover Page

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx`

**Step 1: Add the Transmittal Form below the Binder Cover**

Second white document card stacked below with:
- Header: "Transmittal" title + ACCO logo
- Two-column grid:
  - Left: PROJECT NAME, JOB NUMBER, OWNER, CUSTOMER, CUSTOMER ID
  - Right: ACCO TRANSMITTAL # (auto), TRANSMITTAL DATE, REVISION #, REVISION DATE, SUBMITTED BY
- DESCRIPTION: Textarea
- SUBMITTED FOR: RadioGroup with 4 options (Review & Approval, Information, Review & Comment, Record Only)
- KNOWN SUBSTITUTIONS FROM CONTRACT DOCUMENTS/SPECS: Yes/No radio
- NOTES: Textarea
- Review row: Approved / Approved as Noted / Not Approved radios + Reviewed By input + Date input
- REVIEW STAMPS section: 3-column grid (Architect / Engineer / General Contractor) with placeholder stamp areas

In edit mode, all fields become interactive inputs. In view mode, they render as styled text.

**Step 2: Add "Proceed to Submittal Binder" button at the bottom**

```tsx
<div className="flex justify-end pt-4">
  <Button
    size="lg"
    className="gradient-accent text-white border-0 gap-2"
    onClick={() => router.push(`/projects/${project.id}/versions/${version.id}/submittal-binder`)}
  >
    <BookOpen className="h-4 w-4" />
    Proceed to Submittal Binder
    <ArrowRight className="h-4 w-4" />
  </Button>
</div>
```

**Step 3: Verify build**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit && npm run build`
Expected: Clean

**Step 4: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx"
git commit -m "feat: add Transmittal Form preview + proceed button to cover page"
```

---

### Task 4: Update Submittal Binder with click-to-preview sections

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx`

**Step 1: Add FullScreenPdfViewer integration**

Import:
```typescript
import { FullScreenPdfViewer } from "@/components/documents/full-screen-pdf-viewer";
```

Add state for preview:
```typescript
const [previewSection, setPreviewSection] = useState<string | null>(null);
```

**Step 2: Make binder section rows clickable**

Wrap each section row in a clickable div that sets `previewSection`. Add cursor-pointer and hover styles.

**Step 3: Add "Proceed" navigation from preview-cover and back-nav**

Add a "Back to Preview Cover Page" link at the top for back-navigation. The Submittal Binder is the final milestone, so no "Proceed" button needed — instead show a completion message or "Finalize & Export" action.

**Step 4: Add the FullScreenPdfViewer at the bottom**

```tsx
<FullScreenPdfViewer
  open={!!previewSection}
  onOpenChange={(open) => { if (!open) setPreviewSection(null); }}
  title={previewSection ?? ""}
  subtitle="Submittal Binder Section"
  totalPages={10}
/>
```

**Step 5: Verify build**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit && npm run build`
Expected: Clean

**Step 6: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx"
git commit -m "feat: add click-to-preview sections to Submittal Binder"
```

---

### Task 5: Final build verification + push

**Step 1: Full build check**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit && npm run build`
Expected: All pages compile, no errors

**Step 2: Push to production**

```bash
git push origin main
```
