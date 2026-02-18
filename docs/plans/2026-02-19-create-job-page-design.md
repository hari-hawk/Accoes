# Create New Job — Full Page Design

**Date:** 2026-02-19
**Status:** Approved
**Replaces:** Multi-step dialog wizard in `create-project-dialog.tsx`

## Overview

Replace the current 3-step dialog wizard for project creation with a dedicated full-page form at `/projects/create`. The page follows a file-first UX pattern — users drop files first, and the system auto-categorizes and auto-populates job details from file metadata.

## Route & Layout

- **Route:** `/projects/create` under the `(dashboard)` route group
- **Layout:** Reuses existing dashboard layout (TopNav + scrollable main)
- **Max width:** `1000px`, centered
- **Entry point:** `+ New Job` button in the TopNav (always accessible from any page)

## Page Structure (top to bottom)

### Page Header

- Title: "Create New Job"
- Subtitle: "Upload project documents to begin automated takeoff and pricing"
- Draft icon (cloud icon) at top-right corner of header row — opens Drafts Sheet panel

### Section 1: Upload Documents

- Dashed-border drop zone with teal accent color
- Upload icon centered, text: "Drag & drop files or **click to browse**"
- Subtext: "Upload your files (PDF, DWG, RVT, MAJ — Max 10MB each)"
- Mock file picker (simulated, no real `<input type="file">` in Phase 1)

**After files uploaded — file cards:**
- Displayed as compact horizontal cards in a responsive flex-wrap grid
- Each card: file type icon (colored bg) + filename (truncated) + file size + ✕ remove button at **top-right corner** of card
- Cards grouped by auto-detected category with section labels

**Auto-categorization rules:**

| Condition | Category | Badge Color |
|-----------|----------|-------------|
| `.csv`, `.xls`, `.xlsx` extension | Material Metrics | Emerald |
| `.pdf` extension | Project Specification | Blue |
| Filename contains "matrix" or "metric" | Material Metrics | Emerald |
| Filename contains "spec" or "specification" | Project Specification | Blue |
| Other extensions (`.dwg`, `.rvt`, `.maj`) | Project Documents | Amber |

**Auto-population trigger:** Once files are uploaded, Section 3 (Job Details) auto-populates with mock-extracted metadata.

### Section 2: Add Link(s)

- Section title: "Add link(s)"
- URL text input + teal "Add" button
- Added links appear as rows: link icon + URL text + ✕ remove
- Enter key also adds the link

### Section 3: Job Details (auto-populated)

3-column × 2-row grid inside a card section:

| Row 1 | Job ID * | Customer Name * | Priority |
|-------|----------|-----------------|----------|
| Row 2 | Bid Date | Points | Assigned Estimator * |

- **Job ID** — Auto-generated format: `{3-4 letter abbreviation}-{year}-{sequential}` (e.g., `ACX-2026-001`). Editable by user.
- **Customer Name** — Text input, auto-populated from file metadata. Required.
- **Priority** — Select dropdown: High, Medium, Low. Default: "High".
- **Bid Date** — Date input with calendar icon.
- **Points** — Number input with stepper arrows.
- **Assigned Estimator** — Text input. Required.
- Required fields marked with red asterisk `*`.

### Section 4: Notes / Comments

- Textarea with placeholder: "Add any additional notes or comments about this project..."
- Helper text below: "This information will be saved with the project record"

### Section 5: Access Control

- Section title: "Access Control"
- Add member: search input (UserPlus icon) + Role select (Collaborator / Viewer) + Add button
- Team member rows: Avatar + name + email + role badge + remove button on hover
- Reuses existing share access pattern from the detail sheet

### Footer CTAs

- **Cancel** — secondary/outline button. On click:
  - If form has data → confirmation dialog: "You have unsaved changes"
  - Options: **Save as Draft** / **Discard** / **Go Back**
  - If form is empty → navigate directly to `/projects`
- **Create Job** — `gradient-gold` primary CTA
  - Disabled until: at least 1 file uploaded AND all required fields filled (Job ID, Customer Name, Assigned Estimator)
  - On click: mock creation → navigate to `/projects`

## Draft System

### Storage
- In-memory state (session only, lost on page refresh)
- Stored in a React context or module-level state shared between the create page and drafts panel

### Save Trigger
- User clicks Cancel → selects "Save as Draft" in confirmation dialog
- Draft captures: all form state (files, fields, links, notes, members)

### Draft Icon
- Cloud/draft icon in the page header row (top-right)
- Shows a count badge if drafts exist
- Clicking opens a right-side Sheet panel

### Draft Panel (Sheet, side="right")
- Title: "**Saved Drafts**" with ✕ close button in top-right
- List of draft cards, each card layout (matching reference):
  - **Line 1:** Customer Name — bold, primary text size, the visual heading of the card
  - **Line 2:** Job ID (muted) + Priority badge (colored: red for HIGH, amber for MEDIUM, green for LOW)
  - **Line 3:** Clock icon + relative time (e.g., "2 hours ago") | Paperclip icon + "{n} files, {n} links"
- Cards have subtle border, slight shadow (`shadow-card`), rounded corners (`rounded-xl`)
- **Click/tap anywhere on the card** → loads the draft into the form (replaces current form state)
- **Delete icon (Trash2)** — appears on hover at top-right corner of each card, red on hover
- Empty state: "No drafts saved"

## TopNav Changes

- Add `+ New Job` button in the right-side controls area of TopNav
- Styled: `gradient-gold text-white` with Plus icon
- Links to `/projects/create` via `<Link>`
- Visible on all pages (both dashboard and workspace routes)

## File Components

### New Files
- `src/app/(dashboard)/projects/create/page.tsx` — the main Create Job page
- `src/components/projects/create-job-form.tsx` — the form component (extracted for reuse/testing)
- `src/components/projects/drafts-panel.tsx` — the right-side drafts Sheet
- `src/components/projects/file-upload-card.tsx` — individual uploaded file card component
- `src/lib/job-id-generator.ts` — Job ID generation logic

### Modified Files
- `src/components/layout/top-nav.tsx` — add `+ New Job` button
- `src/components/projects/project-list.tsx` — update "New Project" buttons to link to `/projects/create` instead of opening dialog

### Potentially Removed
- `src/components/projects/create-project-dialog.tsx` — replaced by the new page (keep for reference during migration, remove after)

## Design System Compliance

- Cards: `rounded-xl border bg-card shadow-card`
- Primary CTA: `gradient-gold text-white border-0 shadow-gold`
- Drop zone: `border-2 border-dashed border-muted-foreground/20 hover:border-nav-accent/40`
- File type colors: red (PDF), emerald (CSV/XLS), blue (DOCX), amber (other)
- Form labels: `text-xs font-medium text-muted-foreground` with red asterisk for required
- WCAG 2.2: all interactive elements need `aria-label`, `focus-visible` rings, `role` attributes

## WCAG 2.2 Accessibility

- Drop zone: `role="button"`, `tabIndex={0}`, keyboard activation (Enter/Space)
- File cards: `role="listitem"` within `role="list"`, ✕ button has `aria-label="Remove {filename}"`
- Form inputs: `htmlFor`/`id` label association, `aria-required="true"` on required fields
- Draft cards: `role="button"`, `tabIndex={0}`, `aria-label` describing the draft
- Delete on hover: also accessible via keyboard focus (`focus-visible`)
- Sheet panel: `aria-label="Saved drafts"`, `role="complementary"`
