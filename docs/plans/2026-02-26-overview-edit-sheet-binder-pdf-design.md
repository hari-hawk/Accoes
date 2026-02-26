# Project Overview Edit Sheet + Submittal Binder PDF Viewer

**Date:** 2026-02-26

## Changes

### 1. Project Details Edit — Right-Side Overlay Sheet

**Current:** Clicking "Edit" button expands inline inputs in the same Project Details card on the overview page.

**New:** Clicking a pen icon opens a right-side `Sheet` overlay panel containing all edit fields. The Project Details card stays view-only at all times.

- **Trigger:** Replace CTA `<Button>Edit</Button>` with a ghost-styled pen icon + "Edit" text
- **Hover effect:** Background highlight, color shift for clear affordance
- **Sheet contents:** All 12+ project fields (Name, Client, Job ID, Location, Status, PM, Owner, Architect, Engineer, Revised Date, Revision #, Customer ID)
- **Sheet layout:** Header ("Edit Project Details"), scrollable body, sticky Save/Cancel footer
- **Component:** Reuse existing `Sheet` from shadcn/ui (already in `src/components/ui/sheet.tsx`)

### 2. Submittal Binder — Full Stacked PDF Viewer

**Current:** Shows a checkbox-style section list with status badges and a summary card.

**New:** Replace entire layout with a stacked full-page PDF viewer.

- **Loading state:** 2-3 second "Compiling Binder..." animation with spinner and progress text
- **After loading:** All 13 pages rendered as stacked white "paper" cards with shadows
- **Page content (from ACCO PDF):**
  - Page 1: Binder cover (ACCO branding)
  - Page 2: Transmittal form
  - Pages 3-7: Material matrix / conformance tables
  - Pages 8-10: Specification cross-reference
  - Pages 11-12: Supporting documentation
  - Page 13: Appendix / AI reasoning summary
- **Header:** Print + Export Binder buttons, back-navigation to Preview Cover Page
- **Scroll indicator:** Floating "Page X of 13" pill in bottom-right corner, updates on scroll
- **Layout:** Stacked vertically, scrollable on page — no dialog/modal

## Files Modified

1. `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx` — Remove inline edit mode, add Sheet overlay, restyle edit trigger
2. `src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx` — Full rewrite with loading state + stacked PDF pages

## Decisions

- Sheet overlay preferred over inline edit because it keeps the view-mode card stable and provides dedicated editing space
- Stacked pages preferred over paginated viewer for print-preview feel
- Loading animation simulates real binder compilation (will be replaced with actual API call in Phase 2)
