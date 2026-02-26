# Preview Cover Page + Submittal Binder Redesign

**Date:** 2026-02-26
**Status:** Approved

## Context

The Preview Cover Page and Submittal Binder milestones need real content matching the actual ACCO submittal workflow. Reference screenshots show two cover documents and a multi-page binder PDF.

## Preview Cover Page

### Layout

Two full-page document previews stacked vertically, scrollable like a continuous PDF. A page-level header provides Print, Export, and Edit controls.

### Page 1: Binder Cover

Mimics the branded ACCO cover sheet:
- Top section: ACCO Engineered Systems logo (right), project metadata (left)
- Fields displayed: Project Name, Project Address (location), City/State/Zip, ACCO Project Number (jobId), Project Manager, Date (createdAt), Revised Date, Revision #, Customer, Owner, Architect, Engineer
- Center: bold title e.g. "PROCESS PIPING SUBMITTAL BINDER" — derived from project type
- Hero image area (static placeholder industrial image)
- Footer: ACCO Engineered Systems address/phone (static)

All project fields auto-populate from `project.*`. Editing toggles inline inputs.

### Page 2: Transmittal Form

Structured form matching ACCO's transmittal template:
- Header: "Transmittal" title + ACCO logo
- Left column: Project Name, Job Number, Owner, Customer, Customer ID
- Right column: ACCO Transmittal # (auto-generated), Transmittal Date, Revision #, Revision Date, Submitted By
- Description: multi-line textarea
- Submitted For: radio group — Review & Approval, Information, Review & Comment, Record Only
- Known Substitutions from Contract Documents/Specs: Yes / No radio
- Notes: multi-line textarea
- Review: Approved / Approved as Noted / Not Approved radios, Reviewed By, Signature (placeholder), Date
- Review Stamps: 3-column grid — Architect / Engineer / General Contractor (placeholder stamp areas)

All fields are editable. Project-sourced fields auto-populate. Transmittal-specific fields (Description, Notes, Submitted For, Review Stamps) are new state managed locally on the page.

### Edit Mode

A single Edit button in the page header toggles all fields to editable. Save/Cancel buttons appear. Project fields that are edited here update the project (mock save — same pattern as overview page).

### Navigation

"Proceed to Submittal Binder" button at the bottom. Clicking it navigates forward and the milestone bar shows Preview Cover Page as completed.

## Submittal Binder

### Layout

Document list with click-to-preview, plus summary stats.

### Summary Card

Three stats: Total Documents, Pre-Approved count, Overall Confidence (same as current).

### Binder Sections List

Clickable list of binder sections. Each section shows status (Complete / Pending). Clicking a section opens the full-screen PDF viewer (existing `FullScreenPdfViewer` component).

Sections:
1. Cover Sheet — renders Binder Cover preview
2. Transmittal — renders Transmittal form preview
3. Material Matrix Summary — conformance results
4. Specification Cross-Reference — spec-to-material mapping
5. Supporting Documentation — cut sheets, certifications
6. Appendices — AI reasoning logs

### Actions

- Print: opens browser print dialog for the binder
- Export Binder: simulates download of assembled PDF package

## Milestone Completion Logic

Navigation-based:

- `getCompletedIndex` considers both `workflowStage` AND current pathname
- When on Preview Cover Page → Conformance shows completed (index 2)
- When on Submittal Binder → Conformance + Preview Cover show completed (index 3)
- All unlocked milestones remain clickable for back-navigation
- Each milestone page has a "Proceed to [next]" button at the bottom

The `MilestoneProgressBar` component uses `Math.max(stageBasedIndex, pathBasedIndex)` to determine completion — whichever is higher wins.

## New Data Fields

Transmittal-specific fields stored in component state (not on Project type) since they are document-level, not project-level:
- `description: string`
- `submittedFor: "review_approval" | "information" | "review_comment" | "record_only"`
- `knownSubstitutions: boolean`
- `notes: string`
- `accoTransmittalNumber: string` (auto-generated)
- `transmittalDate: string`
- `submittedBy: string`
- `reviewStatus: "approved" | "approved_as_noted" | "not_approved" | ""`
- `reviewedBy: string`
- `reviewDate: string`

## Files to Modify

1. `milestone-progress-bar.tsx` — update `getCompletedIndex` to factor in pathname
2. `preview-cover/page.tsx` — full rewrite with two-page stacked preview + edit mode
3. `submittal-binder/page.tsx` — add click-to-preview for binder sections
4. `review/page.tsx` — ensure "Proceed" button routes to preview-cover (already done)
