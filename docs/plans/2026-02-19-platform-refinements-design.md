# Platform Refinements — 9 Items Design

**Date:** 2026-02-19
**Status:** Approved

## Item 1 — "Create New Job" → "Create Project"
Rename page title and CTA button text in `create-job-form.tsx`. "Create Job" → "Create Project", "Save as Draft" dialog also updated.

## Item 2 — "Viewer" → "Reviewer"
Rename display label in role config objects and `<SelectItem>` dropdowns in both `create-job-form.tsx` and `project-detail-sheet.tsx`. Internal value key stays `"viewer"` — only label changes to "Reviewer".

## Item 3 — Timeline Duration
Update mock data `createdAt` dates to recent values (2-3 days ago) so timeline shows realistic day counts. No UI code change needed.

## Item 4 — Conformance Filters → Search + Document Dropdown
On workspace review page conformance tab: remove status/PA dropdown filters. Keep search input. Add Document `<Select>` populated from 9 CSV file names (mockMigFiles). Selected document filters the conformance items list below.

## Item 5 — PI Match Score → Neutral Colors
Remove color differentiation from `scoreTextColor()`. All match scores display in `text-ds-neutral-700` — informational, not visually highlighted.

## Item 6 — Remove "Pending (Reset)" Status
Remove `<SelectItem value="pending">Pending (Reset)</SelectItem>` from evidence panel status dropdown. Keep: Approved, Revisit, Pre-Approved, Review Required, Action Mandatory.

## Item 7 — Gold CTA → Green Accent `#87a46a`
Create `.gradient-action` CSS class using `#87a46a` (sage green). Replace `gradient-gold` on all primary CTA buttons. Gold remains for nav accent/branding. Verify WCAG AA contrast with white text — darken to ~`#7a9660` if needed.

## Item 8 — Download Reports Panel
Remove "Conformance" (Material Matrix CSV) tab from download panel. Replace with conformance document file names from project overview conformance section. Fix cropped/compressed panel — widen and ensure overflow handling.

## Item 9 — Project Index Accordion
Remove Edit button and Save/Cancel action bar. Compact expansion layout: merge 2-column structure into single flowing label:value pairs format. No blank spaces, scannable and compact.
