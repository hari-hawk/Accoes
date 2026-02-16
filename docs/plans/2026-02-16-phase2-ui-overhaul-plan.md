# Phase 2 UI Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul the Accoes Submittal AI platform with full-screen PDF viewer, redesigned Check Conformance page with PS/PI tabs, restructured project detail sheet, and simplified project cards.

**Architecture:** 8 sprints, each independently testable. Starts with foundational components (mock data, PDF viewer), then modifies pages in dependency order. Each sprint ends with a clean build.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, lucide-react

**Design Reference:** `docs/plans/2026-02-16-phase2-ui-overhaul-design.md`

---

### Sprint 1: Mock Data & Avatar Infrastructure

**Goal:** Add mock profile images to users, add PS/PI score fields to material items, add mock activity logs and project-level comments.

**Files:**
- Modify: `src/data/mock-users.ts`
- Modify: `src/data/mock-material-items.ts`
- Modify: `src/data/types.ts`
- Create: `src/data/mock-activity-logs.ts`
- Create: `src/data/mock-project-comments.ts`

**Step 1:** Add `avatarUrl` to all mock users in `src/data/mock-users.ts`:
```typescript
// Each user gets a unique pravatar URL:
avatarUrl: "https://i.pravatar.cc/150?u=user-1"  // Sarah Mitchell
avatarUrl: "https://i.pravatar.cc/150?u=user-2"  // James Chen
avatarUrl: "https://i.pravatar.cc/150?u=user-3"  // Maria Garcia
avatarUrl: "https://i.pravatar.cc/150?u=user-4"  // David Park
```

**Step 2:** Add `psScore` and `piScore` fields to `MaterialItem` in `src/data/types.ts`:
```typescript
export interface MaterialItem {
  // ... existing fields ...
  psScore: number;  // Project Specification confidence 0-100
  piScore: number;  // Project Index confidence 0-100
  documentRef: string; // e.g., "PHD - Flat Plate Fitting Fig 5000-6040"
  size?: string; // e.g., "1/2\" & 3/4\""
}
```

**Step 3:** Update all 12 entries in `src/data/mock-material-items.ts` to include `psScore`, `piScore`, `documentRef`, and `size` values. Set PS scores generally higher (85-98%) and PI scores lower and more varied (44-92%).

**Step 4:** Create `src/data/mock-activity-logs.ts` with typed activity log entries:
```typescript
import type { User } from "./types";

export interface ActivityLogEntry {
  id: string;
  projectId: string;
  userId: string;
  action: string; // "status_update" | "comment" | "file_upload" | "user_added"
  description: string;
  timestamp: string;
  metadata?: {
    oldStatus?: string;
    newStatus?: string;
  };
}

export const mockActivityLogs: ActivityLogEntry[] = [
  // 8-10 entries covering status changes, comments, file uploads, user additions
];

export function getActivityLogsByProject(projectId: string): ActivityLogEntry[] {
  return mockActivityLogs.filter((l) => l.projectId === projectId);
}
```

**Step 5:** Create `src/data/mock-project-comments.ts`:
```typescript
export interface ProjectComment {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export const mockProjectComments: ProjectComment[] = [
  // 5-8 entries for proj-1 and proj-2
];

export function getProjectComments(projectId: string): ProjectComment[] {
  return mockProjectComments.filter((c) => c.projectId === projectId);
}
```

**Step 6:** Run `npm run build` — expect clean build.

**Step 7:** Commit:
```bash
git add src/data/mock-users.ts src/data/types.ts src/data/mock-material-items.ts src/data/mock-activity-logs.ts src/data/mock-project-comments.ts
git commit -m "feat: Add PS/PI scores, mock avatars, activity logs, project comments data"
```

---

### Sprint 2: Full-Screen PDF Viewer Component

**Goal:** Create a reusable full-screen PDF viewer overlay that covers 85% of viewport with citations sidebar and yellow highlight support.

**Files:**
- Create: `src/components/documents/full-screen-pdf-viewer.tsx`
- Modify: `src/components/documents/document-preview.tsx` (re-export or replace)

**Step 1:** Create `src/components/documents/full-screen-pdf-viewer.tsx`:

The component accepts these props:
```typescript
interface FullScreenPdfViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocType | null;
  highlightText?: string;       // Text to show in yellow highlight box
  highlightPage?: number;       // Page number to navigate to
  citations?: Citation[];       // Right sidebar citations
}

interface Citation {
  id: string;
  label: string;    // "Match" badge text
  page: number;
  excerpt: string;
}
```

Layout structure:
- Uses shadcn `Dialog` (not Sheet) with `DialogContent` at `max-w-[90vw] h-[85vh]`
- Header: Document title (left) + close button (right)
- Body split: Main PDF area (70%) + Citations sidebar (30%)
- Main area: Simulated PDF content (reuse the skeleton from existing PdfViewer but larger)
  - When `highlightText` is provided: Show a green-bordered box with "SPECIFICATION" label and the highlight text in yellow background
  - Full spec document content below (simulated with structured headings: PART 1 - GENERAL, 1.1 SUMMARY, 1.2 PERFORMANCE REQUIREMENTS, etc.)
- Bottom toolbar: `−` button | `100%` display | `+` button | `←` prev | `pageNum/totalPages` | `→` next | expand icon | rotate icon
- Right sidebar: "Citations (N)" header, then cards with "Match" badge + page + excerpt

**Step 2:** Update `src/components/documents/document-preview.tsx` to use `FullScreenPdfViewer` for PDFs instead of the old sheet-based viewer. Keep XLSX and DOCX viewers in a sheet for now but increase their width to `sm:max-w-[85vw]`.

**Step 3:** Run `npm run build` — expect clean.

**Step 4:** Commit:
```bash
git add src/components/documents/full-screen-pdf-viewer.tsx src/components/documents/document-preview.tsx
git commit -m "feat: Add full-screen PDF viewer with citations sidebar and highlight support"
```

---

### Sprint 3: Overview Page Cleanup + Tab Rename

**Goal:** Remove Material Conformance section from overview, rename tab to "Conformance", update button text.

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx`
- Modify: `src/components/layout/workflow-stage-bar.tsx`

**Step 1:** In `workflow-stage-bar.tsx` line 12, change:
```typescript
// FROM:
{ key: "review", label: "Check Conformance", icon: CheckCircle2, path: "/review" },
// TO:
{ key: "review", label: "Conformance", icon: CheckCircle2, path: "/review" },
```

**Step 2:** In version overview `page.tsx`:
- Remove imports: `useState`, `useMemo`, `Search`, `ShieldCheck`, `Table2`, `Input`, `Select/SelectContent/SelectItem/SelectTrigger/SelectValue`, `getMaterialItemsByProject`, `DiscrepancyTable`, `ItemDetailPanel`, `MaterialItem`, `DiscrepancyStatus`
- Remove all material items state (lines 78-138): `allMaterialItems`, `materialSearch`, `materialStatusFilter`, `selectedIds`, `detailItem`, `materialItems`, `filteredMaterials`, `materialSummary`, `handleToggleSelect`, `handleToggleAll`, `handleBulkStatusChange`, `handleItemStatusChange`
- Remove Material Conformance section (lines 380-451)
- Remove ItemDetailPanel render (lines 453-460)
- Change button text from "Open Check Conformance" to "Open Conformance" (line 169)
- Change section header from "Check Conformance" to "Conformance" (line 228)

**Step 3:** Run `npm run build` — expect clean.

**Step 4:** Commit:
```bash
git commit -m "feat: Remove Material Conformance from overview, rename tab to Conformance"
```

---

### Sprint 4: Project Cards — Stage as Text + Mock Avatars

**Goal:** Replace Stage badge with labeled text field, add profile images to avatars.

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/project-list.tsx`

**Step 1:** In `project-card.tsx`, replace the Stage Badge (lines 128-138) with:
```tsx
{/* Row 3: Stage text + Avatar stack */}
<div className="mt-3 flex items-center justify-between gap-3">
  <div className="flex items-center gap-1.5 text-xs">
    <span className="text-muted-foreground">Stage:</span>
    <span className="font-medium">{stageConfig.label}</span>
  </div>
  {/* Avatar stack with images */}
  <AvatarGroup>
    {visibleMembers.map((user) => (
      <Avatar key={user!.id} size="sm">
        {user!.avatarUrl ? (
          <AvatarImage src={user!.avatarUrl} alt={user!.name} />
        ) : (
          <AvatarFallback className="text-[9px] font-medium">
            {getInitials(user!.name)}
          </AvatarFallback>
        )}
      </Avatar>
    ))}
    {overflowCount > 0 && (
      <AvatarGroupCount className="text-[9px]">
        +{overflowCount}
      </AvatarGroupCount>
    )}
  </AvatarGroup>
</div>
```

Add `AvatarImage` to the avatar import.

**Step 2:** In `project-list.tsx`, replace the Stage Badge column with a text display:
```tsx
<div className="shrink-0 hidden md:block text-xs">
  <span className="text-muted-foreground">Stage: </span>
  <span className="font-medium">{stageConfig.label}</span>
</div>
```

Update list header "Stage" column to match.

**Step 3:** Run `npm run build` — expect clean.

**Step 4:** Commit:
```bash
git commit -m "feat: Replace Stage badge with text field, add mock profile images to avatars"
```

---

### Sprint 5: Project Detail Sheet Restructuring

**Goal:** Add tabs (Material Files / Activity Logs / Comments), convert Share Access to dialog, fix scroll, add profile images.

**Files:**
- Modify: `src/components/projects/project-detail-sheet.tsx`
- Create: `src/components/projects/share-access-dialog.tsx`

**Step 1:** Create `src/components/projects/share-access-dialog.tsx`:
```typescript
// Dialog component with:
// - Select dropdown to pick user from mockUsers
// - "Add" button
// - "Who has access" list showing current members with avatar, name, role badge, ⋯ menu
// - Uses Dialog from shadcn, not Sheet
```

**Step 2:** Restructure `project-detail-sheet.tsx`:
- Add `Tabs, TabsContent, TabsList, TabsTrigger` imports from shadcn
- Add `Share2` icon import for the Share button
- Import `ShareAccessDialog`, `getActivityLogsByProject`, `getProjectComments`
- Add `shareDialogOpen` state
- In header: Add "Share" button next to "Edit" button
- Remove the inline "Share Access" section entirely (lines 434-515)
- Replace Material Files + Share Access with a `<Tabs>` component:
  - Tab "Material Files" (default): existing file list + upload zone
  - Tab "Activity Logs": render activity log entries with avatar, action, timestamp
  - Tab "Comments": render project comments with avatar, content, timestamp + "Write a comment" input
- Use `AvatarImage` with `user.avatarUrl` everywhere avatars appear
- Ensure `ScrollArea` wraps the entire content properly (verify `flex-1` and `h-full` on ScrollArea)

**Step 3:** Run `npm run build` — expect clean.

**Step 4:** Commit:
```bash
git commit -m "feat: Restructure project detail with tabs, share dialog, activity logs, comments"
```

---

### Sprint 6: Check Conformance Left Panel Redesign

**Goal:** Redesign the left panel material list with PS/PI score chips, dual filter dropdowns, and updated search.

**Files:**
- Modify: `src/components/workspace/material-list.tsx`
- Modify: `src/hooks/use-materials.ts`

**Step 1:** Update `use-materials.ts` to add PS/PI filter state:
```typescript
const [psFilter, setPsFilter] = useState<string>("all");
const [piFilter, setPiFilter] = useState<string>("all");
```
Add PS/PI filtering logic to `filteredMaterials` useMemo. The hook should also expose `psFilter`, `setPsFilter`, `piFilter`, `setPiFilter` in the return object.

**Step 2:** Rewrite `material-list.tsx` to match screenshots:
- Search input: placeholder "Search from Material Matrix"
- Two filter dropdowns side-by-side: "Project Specification (PS)" and "Project Index (PI)" with All/Select options
- Select all row: checkbox + status counts as colored icons: ○(N) green, △(N) amber, ⊗(N) red
- Material item row:
  - Checkbox
  - Item name (bold, truncated)
  - Sub-text line: `documentRef` from MaterialItem (e.g., "PHD - Flat Plate Fitting Fig 5000-6040")
  - Two score chips: green/amber/red `PS: {psScore}%` + `PI: {piScore}%`
  - Selected state styling with left border accent

**Step 3:** Run `npm run build` — expect clean.

**Step 4:** Commit:
```bash
git commit -m "feat: Redesign left panel with PS/PI score chips and dual filters"
```

---

### Sprint 7: Check Conformance Right Panel Redesign

**Goal:** Replace current evidence panel with PS/PI tabbed content matching screenshots — spec references, index match cards, confidence bar, comments panel.

**Files:**
- Modify: `src/components/workspace/evidence-panel.tsx`
- Create: `src/components/workspace/ps-tab-content.tsx`
- Create: `src/components/workspace/pi-tab-content.tsx`
- Create: `src/components/workspace/comments-activity-panel.tsx`
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/review/page.tsx`

**Step 1:** Create `src/components/workspace/ps-tab-content.tsx`:
- Match indicator: "○ Matches Specification" or "△ Partial Match" based on validation status
- AI Analysis card: bordered box with `aiReasoning.summary` text
- "Relevant References (N)" section with "All Section" dropdown filter
  - Reference cards: numbered label ("Reference 1"), quoted text from evidence items, clickable "Page NNN" button
  - Page button calls `onOpenPdf(document, evidenceItem)` to open FullScreenPdfViewer with highlight

**Step 2:** Create `src/components/workspace/pi-tab-content.tsx`:
- Stacked match cards (vertical), each showing:
  - Header row: "△ Partial Match with Index" + right-aligned "Match Score: 0.95"
  - 2x2 data grid: Category / Sub Category / Size / Item Description
    - Pull values from material item's `projectIndexValue` and related fields
  - Reason box: amber background with `aiReason` text
- Handle multiple index matches by creating mock data for 2-3 matches per item

**Step 3:** Create `src/components/workspace/comments-activity-panel.tsx`:
- Side panel (Sheet from right, ~320px wide) with "Comments & Activity" title + close
- Activity log entries: avatar (with image) + name + timestamp + description
- Comment thread: existing comments rendered
- Bottom: "Write a comment" input + send button
- Pulls from `mockProjectComments` and `mockActivityLogs`

**Step 4:** Rewrite `src/components/workspace/evidence-panel.tsx`:
- Header: material name + description, size (right-aligned)
- Two tab buttons: "Project Specification" (doc icon) | "Project Index" (table icon) — use shadcn Tabs
- Status dropdown (Select with Pre-Approved/Review Required/Action Mandatory)
- Comment icon button (opens CommentsActivityPanel)
- Confidence bar: full-width colored bar with percentage
- Tab content: `<PSTabContent>` or `<PITabContent>` based on active tab

**Step 5:** Update `review/page.tsx`:
- Add `FullScreenPdfViewer` state management (`pdfOpen`, `pdfDocument`, `pdfHighlight`)
- Add `CommentsActivityPanel` state (`commentsOpen`)
- Pass PDF open handler and comments handler down to EvidencePanel
- Update batch actions bar: add "Add Comment" button alongside "Approve All Selected"
- Add Approve dialog (AlertDialog with PS/PI checkboxes)
- Add Comment dialog (Dialog with PS/PI checkboxes + text input)

**Step 6:** Run `npm run build` — expect clean.

**Step 7:** Commit:
```bash
git commit -m "feat: Redesign Check Conformance right panel with PS/PI tabs, references, match cards"
```

---

### Sprint 8: Cross-Platform Audit + Final Polish

**Goal:** Apply mock avatars everywhere, verify all interactions, fix any remaining issues.

**Files:**
- Modify: `src/components/layout/top-nav.tsx` (avatar image for current user)
- Modify: `src/components/projects/create-project-dialog.tsx` (if avatars shown)
- Verify: all pages navigate correctly
- Verify: all dialogs/sheets open and close
- Verify: all scroll areas work
- Verify: all tab components switch correctly

**Step 1:** Update `top-nav.tsx` user menu to use `AvatarImage` with `currentUser.avatarUrl`:
```tsx
<Avatar className="h-7 w-7 border-2 border-nav-gold/40">
  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
  <AvatarFallback className="text-[10px] font-bold gradient-gold text-white">
    {initials}
  </AvatarFallback>
</Avatar>
```

**Step 2:** Manually navigate through every page and interaction:
- `/projects` — cards render, stage as text, avatars show images, grid/list toggle works
- Click project card → detail sheet opens, tabs work, Share dialog works, scroll works
- Navigate to version overview → no Material Conformance section, "Conformance" tab label
- Click "Open Conformance" → review page loads
- Review page: left panel shows PS/PI chips, filters work, search works
- Select item → right panel shows PS/PI tabs, confidence bar, status dropdown
- Click reference "Page 234" → full-screen PDF viewer opens with highlight
- Click comment icon → comments panel opens
- Check multiple items → batch bar appears with Approve/Add Comment
- Click Approve → dialog with PS/PI checkboxes appears
- All dropdowns function, all close buttons work

**Step 3:** Fix any issues discovered during audit.

**Step 4:** Run `npm run build` — expect clean.

**Step 5:** Commit:
```bash
git commit -m "feat: Cross-platform audit — mock avatars, interaction fixes, final polish"
```

**Step 6:** Push to remote:
```bash
git push origin main
```

---

## Summary of Sprints

| Sprint | Focus | Key Files |
|--------|-------|-----------|
| 1 | Mock data infrastructure | types.ts, mock-users.ts, mock-material-items.ts, new mock files |
| 2 | Full-screen PDF viewer | full-screen-pdf-viewer.tsx, document-preview.tsx |
| 3 | Overview cleanup + tab rename | version overview page.tsx, workflow-stage-bar.tsx |
| 4 | Project cards — stage text + avatars | project-card.tsx, project-list.tsx |
| 5 | Detail sheet — tabs + share dialog | project-detail-sheet.tsx, share-access-dialog.tsx |
| 6 | Check Conformance left panel | material-list.tsx, use-materials.ts |
| 7 | Check Conformance right panel | evidence-panel.tsx, ps/pi tab components, comments panel |
| 8 | Cross-platform audit | top-nav.tsx + all pages verified |
