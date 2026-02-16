# Phase 2 UI Overhaul — Design Document

**Date:** 2026-02-16
**Status:** Approved

## 1. Overview Page — Remove Material Conformance

Remove the entire Material Conformance section from the version overview page (`/projects/[id]/versions/[id]`). This includes the summary mini-cards, search/filter, DiscrepancyTable, and ItemDetailPanel.

Keep: hero banner, stats, document list.

Rename workflow tab label: "Check Conformance" → "Conformance".

## 2. Full-Screen PDF Viewer Overlay (Platform-Wide)

Replace the current `DocumentPreview` sheet (right-side, max-w-2xl) with a full-screen overlay component (`FullScreenPdfViewer`) covering 80-90% of viewport width and height.

### Layout
- **Header:** Document title (e.g., "Division 23 - Heating, Ventilation and Air Conditioning") + close button
- **Main area (~70%):** Simulated PDF page content
  - When opened from a reference link: yellow highlight box at mock position with "SPECIFICATION" label and referenced text
  - Bottom toolbar: zoom controls (−/100%/+), page navigation (← pageNum/totalPages →), expand, rotate
- **Right sidebar (~30%):** "Citations (N)" panel
  - Match cards: "Match" badge + page number + excerpt text
  - Each citation clickable to navigate to that page

### Usage
Reuse this component everywhere documents are viewed: overview doc clicks, reference link clicks in Check Conformance, any file preview throughout the platform.

## 3. Project Detail Sheet — Restructure with Tabs

### 3A. Fix ScrollArea
Ensure the full sheet content scrolls properly end-to-end. Currently the Share Access area cannot be scrolled to reach the Add Member input.

### 3B. Tab-Based Bottom Content
Replace the current linear layout with 3 tabs below Project Information:

| Tab | Content |
|---|---|
| Material Files (default) | File list + upload drop zone |
| Activity Logs | Timeline of status changes, file uploads, user additions |
| Comments | Project-level comment thread with send input |

### 3C. Share Access as Dialog
Remove inline Share Access section from sheet. Add a "Share" button next to "Edit" in the header. Opens a dialog with:
- Select dropdown to pick user + "Add" button
- "Who has access" list: avatar + name + role (Owner/Collaborator) + action menu (⋯)

### 3D. Mock Profile Images
Replace text-initial AvatarFallback with AvatarImage using placeholder URLs (`https://i.pravatar.cc/150?u={userId}`). Apply everywhere avatars appear in the platform.

## 4. Project Cards — Simplify Stage Display

Remove the colored Stage badge. Replace with a labeled text field: "Stage: Review Required" (muted label + normal-weight value). This separates Stage from the Status badge visually and removes confusion.

Apply mock profile images to avatar stacks on cards.

## 5. Check Conformance Page — Major Redesign

### 5A. Left Panel (~25%)

**Header:**
- Search: "Search from Material Matrix"
- Two filter dropdowns: Project Specification (PS) | Project Index (PI)
- Select all checkbox + status counts: ○(N) △(N) ⊗(N)

**Material items list** — each item:
- Checkbox
- Material name (e.g., "Centrifugal Chiller, Water-Cooled, 500 Ton...")
- Sub-text: document reference (e.g., "PHD - Flat Plate Fitting Fig 5000-6040")
- Two score chips: `PS: 98%` + `PI: 74%` with color coding (green/amber/red based on thresholds)

### 5B. Right Panel (~75%)

**Header:**
- Material name + description, size info (right)
- Two tab buttons: "Project Specification" | "Project Index"
- Status dropdown (Pre-Approved/Review Required/Action Mandatory)
- Comment icon (opens Comments & Activity side panel)
- Confidence bar: percentage + colored progress bar

**Project Specification tab:**
- Match indicator: "○ Matches Specification" (green) or "△ Partial Match" (amber)
- AI Analysis card: bordered box with analysis text
- Relevant References (N) with "All Section" filter dropdown
  - Reference cards: label + quoted spec text + clickable "Page NNN" button
  - Page button opens FullScreenPdfViewer with yellow highlight at referenced section

**Project Index tab:**
- Stacked match cards (not tabs), each showing:
  - Header: "△ Partial Match with Index" + "Match Score: 0.95"
  - 2-column data grid: Category/Sub Category, Size/Item Description
  - Reason box: amber background with AI explanation
- Multiple cards if multiple index matches exist

### 5C. Batch Actions
Bottom bar when items checked: "N items selected" | Approve | Add Comment | Close

- Approve dialog: checkboxes for PS/PI + Approve button
- Add Comment dialog: checkboxes for PS/PI + text input + Send

### 5D. Comments & Activity Side Panel
Opens via comment icon on any item. Project-level (not per-PS/PI).
- Activity log: avatar + name + timestamp + action
- Comment thread with send input at bottom

## 6. Cross-Platform Interaction Audit

Verify across all pages:
- Navigation links work correctly
- All dialogs open/close properly
- All dropdowns function
- All scroll areas scroll
- All buttons have hover/active states
- Tab switching works on all tab components
- Batch actions function correctly
