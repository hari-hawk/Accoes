# Product Index, Category Pills, PM Input & Milestone Fixes

**Date:** 2026-02-26
**Status:** Approved

## Changes Overview

Five changes in one package:

1. **PM Field to Input** — Replace dropdown with plain text input
2. **Product Index Table** — New page on Preview Cover with full material index
3. **Index Category + System Category Pills** — Two new pills on material cards + filter dropdowns
4. **Product Index on Preview** — Combined with #2, read-only view before binder
5. **Milestone Bugs** — Re-verify and fix completion + equal spacing

## Change 1: PM Field to Input

### Files Modified
- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx` (Overview edit sheet)
- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx` (Preview edit sheet)

### What Changes
- Replace `<Select>` with `<Input>` for Project Manager field
- Remove `editProjectManagerCustom` state and `__custom__` logic
- PM becomes a free-text input field

## Change 2: Product Index Table on Preview Cover Page

### Files Created
- `src/data/mock-product-index.ts` — Structured data from the PDF (10 categories, ~370 items)

### Files Modified
- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/preview-cover/page.tsx`

### Design
- New "Page 3 — Product Index" section below transmittal page
- Single scrollable table in document-styled container
- Header: Project name, subtitle, job number, yellow legend
- Columns: CATEGORY, ITEM #, CATEGORY name, ITEM DESCRIPTION, SIZE, SPECIFICATION, SPEC. LOCATION
- Section headers for each L1 group (bold rows)
- Blue/white theme matching existing cover pages
- Footer notes section

## Change 3: Index Category + System Category Pills & Filters

### Files Modified
- `src/data/types.ts` — Add `indexCategory` and `systemCategory` to Document
- `src/data/mock-documents.ts` — Populate category values for all 16 documents
- `src/components/workspace/material-list.tsx` — Add pills to cards + filter dropdowns
- `src/hooks/use-materials.ts` — Add category filtering logic

### Data Model
```typescript
// Added to Document interface
indexCategory?: string;   // e.g. "Hangers & Supports", "Fittings"
systemCategory?: string;  // e.g. "All Systems", "Chilled Water"
```

### Card Layout
Below existing score chips, add two new pills:
- Index Category pill (blue tint)
- System Category pill (slate tint)

### Filter Layout
New filter row with two dropdowns:
- Index Category dropdown (All Categories + unique values)
- System Category dropdown (All Systems + unique values)

## Change 5: Milestone Bugs

### Files Modified
- `src/components/layout/milestone-progress-bar.tsx`

### Issues to Verify & Fix
1. Preview Cover Page not showing as ticked when active
2. Equal spacing not rendering correctly
