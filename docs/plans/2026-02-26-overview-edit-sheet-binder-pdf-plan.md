# Project Overview Edit Sheet + Submittal Binder PDF Viewer — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move Project Details editing into a right-side Sheet overlay and replace the Submittal Binder section list with a stacked full-page PDF viewer with loading state.

**Architecture:** Two independent changes. Task 1 refactors the overview page's inline edit into a Sheet panel. Task 2 rewrites the submittal-binder page with a loading animation followed by 13 stacked PDF-style pages rendered from mock data matching the ACCO submittal PDF.

**Tech Stack:** Next.js 16, React 19, shadcn/ui Sheet component, Tailwind v4, TypeScript

---

### Task 1: Move Project Details edit into a right-side Sheet overlay

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx`

**What changes:**
1. Add imports for `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` from `@/components/ui/sheet`
2. Replace the `detailEditing` boolean state with `editSheetOpen` boolean
3. Replace the inline edit CTA button (lines 879-884) with a ghost-styled pen icon trigger with hover effects
4. Remove the entire inline edit JSX block (lines 887-987 — the `{detailEditing ? (...) : (...)}` ternary)
5. Keep only the view-mode JSX in the card body (always visible)
6. Add a `<Sheet>` component at the bottom of the return block containing all edit fields, with a sticky footer for Save/Cancel
7. Rename `startDetailEdit` → opens sheet, `saveDetailEdit` → saves + closes sheet, `cancelDetailEdit` → closes sheet

**Step 1: Update imports and state**

Remove unused `Save` from lucide imports (will be used inside Sheet). Add Sheet imports:

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
```

Replace state (line 745):
```tsx
// Old: const [detailEditing, setDetailEditing] = useState(false);
const [editSheetOpen, setEditSheetOpen] = useState(false);
```

Update functions:
```tsx
const startDetailEdit = () => {
  // ... same field initialization ...
  setEditSheetOpen(true);
};
const saveDetailEdit = () => {
  setEditSheetOpen(false);
};
const cancelDetailEdit = () => {
  setEditSheetOpen(false);
};
```

**Step 2: Replace edit button with ghost pen icon**

Replace lines 879-884 with:
```tsx
<button
  type="button"
  onClick={startDetailEdit}
  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2 py-1.5 transition-all cursor-pointer group"
  aria-label="Edit project details"
>
  <Pencil className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
  <span className="font-medium">Edit</span>
</button>
```

**Step 3: Remove inline edit ternary, keep view-only**

Remove the entire `{detailEditing ? (...) : (...)}` ternary (lines 887-1107). Keep ONLY the view-mode content (the `<div className="space-y-3 text-sm">` block starting at line 990).

**Step 4: Add Sheet component at end of return**

Add before the closing `</main>` tag, after the FullScreenPdfViewer:
```tsx
{/* Edit Project Details — Right-side Sheet */}
<Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
  <SheetContent side="right" className="w-[420px] sm:w-[460px] flex flex-col p-0">
    <SheetHeader className="px-6 py-4 border-b shrink-0">
      <SheetTitle className="text-base">Edit Project Details</SheetTitle>
    </SheetHeader>

    <ScrollArea className="flex-1 px-6 py-5">
      <div className="space-y-4">
        {/* All edit fields go here — same fields as before */}
        {/* Project Name, Client, Job ID, Location, Status, PM, Owner, Architect, Engineer, Customer ID, Revised Date, Revision # */}
      </div>
    </ScrollArea>

    {/* Sticky footer */}
    <div className="border-t px-6 py-4 flex items-center gap-2 shrink-0 bg-background">
      <Button size="sm" onClick={saveDetailEdit} className="gap-1.5">
        <Save className="h-3.5 w-3.5" />
        Save Changes
      </Button>
      <Button variant="ghost" size="sm" onClick={cancelDetailEdit}>
        Cancel
      </Button>
    </div>
  </SheetContent>
</Sheet>
```

**Step 5: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean compile, no errors

**Step 6: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx"
git commit -m "refactor: move Project Details edit into right-side Sheet overlay"
```

---

### Task 2: Rewrite Submittal Binder as stacked PDF viewer with loading state

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx`

**What changes:**
Replace the entire section-list layout with:
1. A loading animation (2.5s simulated compile) on mount
2. After loading: 13 stacked "paper" pages rendered inline
3. Print/Export header buttons retained
4. Back navigation retained
5. Floating page indicator in bottom-right corner

**Step 1: Add loading state and page content**

Key state additions:
```tsx
const [loading, setLoading] = useState(true);
const [currentVisiblePage, setCurrentVisiblePage] = useState(1);
```

Loading effect:
```tsx
useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 2500);
  return () => clearTimeout(timer);
}, []);
```

Scroll observer for page indicator:
```tsx
// IntersectionObserver on each page div to track which page is visible
```

**Step 2: Build loading state UI**

```tsx
{loading && (
  <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
    <div className="h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center animate-pulse">
      <BookOpen className="h-8 w-8 text-white" />
    </div>
    <div className="text-center space-y-2">
      <h2 className="text-lg font-bold">Compiling Binder...</h2>
      <p className="text-sm text-muted-foreground">Assembling 13 pages from project data</p>
    </div>
    <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full gradient-accent animate-loading-bar" />
    </div>
  </div>
)}
```

**Step 3: Build 13 stacked page components**

Each page is a white card with A4-like proportions:
```tsx
<div className="bg-white dark:bg-card rounded-lg shadow-md border mx-auto"
     style={{ width: "100%", maxWidth: "816px", minHeight: "1056px", padding: "48px" }}>
  {/* Page content */}
</div>
```

Page content breakdown (matching the ACCO submittal PDF):
- **Page 1:** ACCO Binder Cover — navy header bar, "Process Piping Submittal Binder" title, project metadata grid, ACCO logo placeholder
- **Page 2:** Transmittal form — 2-col metadata, description, submitted-for, review status stamps
- **Pages 3-5:** Material conformance matrix tables — headers: Item #, Description, Specified, Submitted, Status, Confidence
- **Pages 6-7:** Specification cross-reference — spec section mapping table
- **Pages 8-10:** Supporting documentation — cut sheet summaries with reference IDs
- **Pages 11-12:** Product data sheets — simulated technical spec content
- **Page 13:** Appendix — AI reasoning log with timestamp entries

**Step 4: Add floating page indicator**

Fixed-position pill in the bottom-right that shows "Page X of 13":
```tsx
{!loading && (
  <div className="fixed bottom-6 right-6 z-40 bg-background/90 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
    <span className="text-xs font-medium tabular-nums">
      Page {currentVisiblePage} of 13
    </span>
  </div>
)}
```

**Step 5: Add CSS animation for loading bar**

Add to `globals.css` or use inline keyframes:
```css
@keyframes loading-bar {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 95%; }
}
.animate-loading-bar {
  animation: loading-bar 2.5s ease-out forwards;
}
```

**Step 6: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean compile, no errors

**Step 7: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx"
git commit -m "feat: replace binder section list with stacked PDF viewer + loading state"
```

---

### Task 3: Final verification + push

**Step 1:** Run full build: `npm run build`
**Step 2:** Push: `git push origin main`
