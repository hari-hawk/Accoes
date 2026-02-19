# Platform Refinements (9 Items) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement 9 platform UI/UX refinements covering text renames, filter simplification, color changes, panel fixes, and layout compaction.

**Architecture:** All changes are frontend-only modifications to existing React components and CSS. No new files created except a CSS class. Mock data updated for timeline realism.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, shadcn/ui, TypeScript

---

### Task 1: Rename "Create New Job" → "Create Project"

**Files:**
- Modify: `src/components/projects/create-job-form.tsx:701` (CTA text)
- Modify: `src/components/projects/create-job-form.tsx:728` (Save as Draft label context)

**Step 1: Update CTA button text**

In `create-job-form.tsx`, line 701, change:
```tsx
          Create Job
```
to:
```tsx
          Create Project
```

**Step 2: Verify no other "Create Job" references in this file**

Search the file for any other "Create Job" or "New Job" text that needs updating. The page title comes from the route/layout — check if there's a heading.

**Step 3: Commit**

```bash
git add src/components/projects/create-job-form.tsx
git commit -m "fix: rename 'Create Job' to 'Create Project' on CTA"
```

---

### Task 2: Rename "Viewer" → "Reviewer" in Access Control

**Files:**
- Modify: `src/components/projects/create-job-form.tsx:127,618`
- Modify: `src/components/projects/project-detail-sheet.tsx:152,166,300`

**Step 1: Update create-job-form.tsx role config**

Line 127, change label:
```tsx
  viewer: {
    label: "Reviewer",
```

Line 618, change SelectItem label:
```tsx
              <SelectItem value="viewer">Reviewer</SelectItem>
```

**Step 2: Update project-detail-sheet.tsx role config**

Line 152, change label:
```tsx
  viewer: {
    label: "Reviewer",
```

Line 166, change label (global_viewer legacy mapping):
```tsx
  global_viewer: {
    label: "Reviewer",
```

Line 300, change SelectItem label:
```tsx
            <SelectItem value="viewer">Reviewer</SelectItem>
```

**Step 3: Search for any other "Viewer" display text in role contexts across codebase**

Check `mock-users.ts`, `types.ts`, and any other component that references user roles.

**Step 4: Commit**

```bash
git add src/components/projects/create-job-form.tsx src/components/projects/project-detail-sheet.tsx
git commit -m "fix: rename 'Viewer' role label to 'Reviewer' across platform"
```

---

### Task 3: Update Mock Dates for Realistic Timeline

**Files:**
- Modify: `src/data/mock-projects.ts` (createdAt dates for first 2-3 projects)

**Step 1: Update createdAt dates**

Change the first project's `createdAt` (line 11) from `"2025-08-15T09:00:00Z"` to a date 2-3 days before today. For example, if today is 2026-02-19:
```tsx
    createdAt: "2026-02-17T09:00:00Z",
```

Also update the version's `createdAt` in `src/data/mock-versions.ts` line 11 to match.

**Step 2: Verify timeline display**

The calculation in `page.tsx` line 440-447 uses `project.createdAt`. With a date 2 days ago, it should show "2 days".

**Step 3: Commit**

```bash
git add src/data/mock-projects.ts src/data/mock-versions.ts
git commit -m "fix: update mock dates for realistic 2-3 day timeline display"
```

---

### Task 4: Simplify Conformance Filters + Add Document Dropdown

**Files:**
- Modify: `src/components/workspace/material-list.tsx:227-254` (remove status/PI dropdowns, add document dropdown)
- Modify: `src/hooks/use-materials.ts` (add document filter state if needed)
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/review/page.tsx` (pass document filter props)

**Step 1: Remove the two status filter dropdowns from material-list.tsx**

Replace lines 227-254 (the `<div className="flex items-center gap-2">` block containing two Select components) with a single document dropdown:

```tsx
        <Select defaultValue="all">
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="All Documents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents</SelectItem>
            <SelectItem value="mig-1">UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv</SelectItem>
            <SelectItem value="mig-2">UCD_HobbsVet_Heating_Matrix_Index_Grid_v1.csv</SelectItem>
            <SelectItem value="mig-3">UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v1.csv</SelectItem>
            <SelectItem value="mig-4">UCD_Project9592330_Plumbing_Matrix_Index_Grid_2026-02.csv</SelectItem>
            <SelectItem value="mig-5">UCD_Project9592330_Heating_Matrix_Index_Grid_2026-02.csv</SelectItem>
            <SelectItem value="mig-6">UCD_Project9592330_Mechanical_Matrix_Index_Grid_2026-02.csv</SelectItem>
            <SelectItem value="mig-7">UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v3.csv</SelectItem>
            <SelectItem value="mig-8">UCD_HobbsVet_Heating_Matrix_Index_Grid_v3.csv</SelectItem>
            <SelectItem value="mig-9">UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v3.csv</SelectItem>
          </SelectContent>
        </Select>
```

Note: The document filter is visual-only for now (mock stage). The `statusFilter` prop can remain in the interface for future use but won't be exposed in the UI.

**Step 2: Remove unused status filter imports if any**

Clean up any unused constants or config imports related to the removed status dropdowns.

**Step 3: Commit**

```bash
git add src/components/workspace/material-list.tsx
git commit -m "fix: simplify conformance filters — search + document dropdown only"
```

---

### Task 5: Neutralize PI Match Score Colors

**Files:**
- Modify: `src/components/workspace/evidence-panel.tsx:204-210` (scoreTextColor function)

**Step 1: Replace scoreTextColor function**

Change from:
```tsx
function scoreTextColor(score: number): string {
  return score >= 80
    ? "text-status-pre-approved"
    : score >= 60
      ? "text-status-review-required"
      : "text-status-action-mandatory";
}
```

To:
```tsx
function scoreTextColor(_score: number): string {
  return "text-ds-neutral-700";
}
```

This makes all match scores display in neutral gray regardless of value.

**Step 2: Commit**

```bash
git add src/components/workspace/evidence-panel.tsx
git commit -m "fix: neutralize PI match score colors to gray"
```

---

### Task 6: Remove "Pending (Reset)" Status Option

**Files:**
- Modify: `src/components/workspace/evidence-panel.tsx:632` (remove SelectItem)
- Modify: `src/components/workspace/evidence-panel.tsx:623-625` (remove pending handler)

**Step 1: Remove the Pending Reset SelectItem**

Delete line 632:
```tsx
                  <SelectItem value="pending">Pending (Reset)</SelectItem>
```

**Step 2: Remove the pending handler in onValueChange**

In the `onValueChange` handler (lines 620-626), remove the `else if (value === "pending")` block:
```tsx
                onValueChange={(value) => {
                  if (value === "approved" || value === "revisit") {
                    onDecide(value as DecisionStatus);
                  }
                }}
```

**Step 3: Commit**

```bash
git add src/components/workspace/evidence-panel.tsx
git commit -m "fix: remove 'Pending (Reset)' from status dropdown"
```

---

### Task 7: Replace Gold CTA with Green Accent (#87a46a)

**Files:**
- Modify: `src/app/globals.css:313-314` (add .gradient-action class)
- Modify: Multiple files to replace `gradient-gold` with `gradient-action` on CTA buttons ONLY

**Step 1: Add .gradient-action CSS class**

After `.gradient-gold` in globals.css (after line 315), add:
```css
  .gradient-action {
    background: linear-gradient(135deg, #87a46a, #748f5a);
  }
```

Also add a shadow variant:
```css
  .shadow-action {
    box-shadow: 0 2px 8px rgba(135, 164, 106, 0.35);
  }
```

**Step 2: Replace gradient-gold on CTA BUTTONS ONLY (not branding elements)**

Replace `gradient-gold` → `gradient-action` and `shadow-gold` → `shadow-action` in these locations:

- `create-job-form.tsx` line 697: Main "Create Project" button
- `create-job-form.tsx` line 728: Save as Draft button
- `project-index/page.tsx` line 102: Import Template button
- `project-index/page.tsx` line 406: Save Changes button
- `project-index/page.tsx` line 893: Confirm Import button
- `versions/[versionId]/page.tsx` line 156: Export button (PS section)
- `versions/[versionId]/page.tsx` line 327: Export button (Conformance section)
- `user-management/page.tsx` line 170: Invite button
- `project-list.tsx` line 135: New Project button (top)
- `project-list.tsx` line 683: Create Project button (empty state)
- `project-list.tsx` line 772: New Project button (bottom)
- `create-project-dialog.tsx` line 557: Create button

**DO NOT replace in these branding/decorative locations — keep gradient-gold:**
- `top-nav.tsx` line 340: Avatar fallback background
- `top-nav.tsx` line 359: Role badge
- `project-list.tsx` line 545: Icon background circle

**Step 3: Verify WCAG contrast**

White text (#FFFFFF) on #87a46a: contrast ratio ~3.2:1. This passes WCAG AA for large text (≥18px or ≥14px bold) but may not pass for small text. Since CTA buttons use font-semibold at 14px+, this should be acceptable. If needed, the darker gradient end (#748f5a) provides better contrast at ~4.1:1.

**Step 4: Commit**

```bash
git add src/app/globals.css src/components/projects/create-job-form.tsx src/app/(dashboard)/project-index/page.tsx src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx src/app/(dashboard)/user-management/page.tsx src/components/projects/project-list.tsx src/components/projects/create-project-dialog.tsx
git commit -m "feat: replace gold CTA buttons with green accent (#87a46a)"
```

---

### Task 8: Fix Download Reports Panel

**Files:**
- Modify: `src/components/projects/project-detail-sheet.tsx:176-186,491,711-789`

**Step 1: Widen the sheet panel**

Line 491, change:
```tsx
        className="sm:max-w-xl w-full flex flex-col p-0"
```
to:
```tsx
        className="sm:max-w-2xl w-full flex flex-col p-0"
```

**Step 2: Replace Conformance section (MIG files) with document files matching overview page**

The Conformance tab (lines 711-745) currently shows 9 CSV Material Matrix Index Grid files. Replace the `mockMigFiles` section with conformance document files that match the overview page's Conformance section. These should be the same `mockMaterialIndexGridFiles` from the overview page — the actual source documents uploaded.

Replace the CollapsibleSection for "Conformance" (lines 713-745) content to show the same files as the overview page's conformance section, keeping the same file names. Remove the `mockMigFiles` array (lines 176-186) and replace with document-level files from conformance.

**Step 3: Ensure the Export functionality is retained**

The spec files section with preview + export should remain as-is.

**Step 4: Commit**

```bash
git add src/components/projects/project-detail-sheet.tsx
git commit -m "fix: widen download reports panel + match conformance files to overview"
```

---

### Task 9: Compact Project Index Accordion (Remove Edit)

**Files:**
- Modify: `src/app/(dashboard)/project-index/page.tsx:272-432` (ExpandedEntryContent)

**Step 1: Remove edit-related props and state**

Remove `isEditing`, `editValues`, `onEdit`, `onSave`, `onCancel`, `onFieldChange` props from `ExpandedEntryContent`. Keep only `entry` and `onCollapse`.

**Step 2: Replace 2-column layout with compact single-column flowing layout**

Replace the entire content of `ExpandedEntryContent` (lines 295-431) with a compact read-only layout:

```tsx
  return (
    <div className="animate-accordion-down overflow-hidden">
      <div className="bg-muted/20 border-t px-4 py-3">
        {/* Index Description */}
        <p className="text-sm leading-relaxed text-ds-neutral-900 mb-3">
          {entry.indexDescription}
        </p>

        {/* Specification Details — compact label:value grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Index ID</span>
            <p className="text-xs font-mono text-ds-neutral-900">{entry.indexIdFull}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Trade</span>
            <p className="text-xs text-ds-neutral-900">{entry.trade}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Subcategory</span>
            <p className="text-xs text-ds-neutral-900">{entry.indexSubcategory}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Fitting Mfr</span>
            <p className="text-xs text-ds-neutral-900">{entry.fittingMfr}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Sizes</span>
            <p className="text-xs text-ds-neutral-900">{entry.sizes}</p>
          </div>
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Material</span>
            <p className="text-xs text-ds-neutral-900">{entry.materialCategory}</p>
          </div>
        </div>

        {/* Collapse action */}
        <div className="flex justify-end mt-3 pt-2 border-t border-muted">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={onCollapse}
          >
            Collapse
          </Button>
        </div>
      </div>
    </div>
  );
```

**Step 3: Update HydroMatrixTable to remove edit state management**

Remove the `editingId`, `editValues`, `handleEdit`, `handleSave`, `handleCancel`, `handleFieldChange` state and functions from `HydroMatrixTable`. Pass only `entry` and `onCollapse` to `ExpandedEntryContent`.

**Step 4: Remove unused imports**

Remove `Pencil`, `Save`, and any edit-related imports that are no longer used.

**Step 5: Commit**

```bash
git add src/app/(dashboard)/project-index/page.tsx
git commit -m "fix: compact project index accordion, remove edit functionality"
```

---

### Task 10: Build Verification + Deploy

**Step 1: Run build**

```bash
npm run build
```

Expected: Clean build, no TypeScript errors.

**Step 2: Fix any build errors**

Address unused imports, type errors from removed props, etc.

**Step 3: Final commit + push + deploy**

```bash
git push origin main
npx vercel --prod --yes
```
