# Project V3 Redesign — Design Specification

**Date:** 2026-03-12
**Status:** Approved

## Overview

Redesign the Project V3 page from a static Project Index clone into a unified material review experience. The page combines the Project Index's grouped data table with the Conformance page's inline review capabilities (PS/PI tabs, comments, status updates).

## Approach

**Materials-first (Approach A):** Use `useMaterials` as the primary data source. Enrich the `Document` type with 4 new fields (`trade`, `sizes`, `indexSubcategory`, `materialCategory`) to support the table columns. Reuse the existing `EvidencePanel` component for inline expansion.

## Section 1: Page Layout and Header

### Removed from Current Project Index

- Import Template button
- Export Template button
- Version dropdown

### Header Structure

Title "Project V3" with subtitle. Below the title:

1. **Search input** (full-width, searches descriptions, IDs, spec sections, subcategories)
2. **Filter row** (6 controls in a responsive grid):
   - Project Files: multi-select popover listing matrix files (same pattern as Generate Submittal's "All Documents" filter)
   - Trade: single select (All Trades / Mechanical / Electrical / Plumbing / Fire Protection)
   - Category: single select (All Categories / Pipe / Fittings / Valves / etc.)
   - System Category: single select (All Systems / Chilled Water / Condenser Water / Generic)
   - Material Type: single select (All Materials / Carbon Steel / Copper / N/A)
   - Sort: single select (Name A-Z / Name Z-A / Index Category)
3. **Status counts bar**: green checkmark count, amber warning count, red X count (matching conformance page pattern)

## Section 2: Data Table

### Grouping

Rows grouped by **Trade** (not Index Category). Each trade section has a collapsible header with trade name badge and entry count. Trade order: Mechanical, Electrical, Plumbing, Fire Protection.

### Table Columns (10)

| # | Column | Source | Notes |
|---|--------|--------|-------|
| 1 | Chevron | — | Expand/collapse trigger |
| 2 | Spec Section # | `document.specSection` | Mono font |
| 3 | Catalogue Title | `document.specSectionTitle` | Primary text |
| 4 | Description | `document.fileName` (cleaned) | Truncated, tooltip |
| 5 | Size | `document.sizes` (new) | Pipe sizes |
| 6 | Trade | `document.trade` (new) | Badge pill |
| 7 | Subcategory | `document.indexSubcategory` (new) | Truncated |
| 8 | Material Type | `document.materialCategory` (new) | Badge pill |
| 9 | AI Status | `validation.status` | Color dot + badge |
| 10 | SP# | Derived | "SP#Rev1" or dash |

### Row Behavior

- Clickable rows with hover state
- Blue left border accent on expanded row
- Only one row expanded at a time

## Section 3: Inline Expansion

When a row is clicked, it expands below to show the conformance-style review panel.

### Expansion Content

Reuses the existing `EvidencePanel` component rendered inline within a `<td colSpan>` row. The expansion area contains:

1. **Header**: File name, spec section breadcrumb, status dropdown, comment toggle button
2. **PS/PI Tabs** with confidence bar:
   - PS Tab: match indicator, AI analysis card, evidence items, spec references
   - PI Tab: index matches (EXACT/PARTIAL/ALTERNATE), match cards, discrepancy cards
3. **Comments panel**: toggles within expansion area, chat-style thread, activity log tab, comment input

### Expansion Behavior

- Max-height with internal scroll to prevent pushing the table too far
- One row expanded at a time (clicking another collapses current)
- Status dropdown updates decision (all 8 statuses available)
- Comments persist in session state via `useMaterials` hook

### Props to EvidencePanel

```typescript
<EvidencePanel
  material={selectedMaterial}
  decision={decisions[material.document.id]}
  onDecide={(decision) => updateDecision(docId, decision)}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
  projectId="proj-2"  // hardcoded for now (dashboard context, no workspace provider)
/>
```

## Section 4: Data Model Changes

### Document Interface (types.ts)

Add 4 optional fields:

```typescript
interface Document {
  // ... existing fields ...
  trade?: string;
  sizes?: string;
  indexSubcategory?: string;
  materialCategory?: string;
}
```

### Mock Documents (mock-documents.ts)

Populate the 4 new fields on all existing mock document entries. Values derived from the existing HydroMatrix mock data to maintain consistency (same trades, categories, sizes).

## Files Affected

| File | Action |
|------|--------|
| `src/app/(dashboard)/project-v3/page.tsx` | Rewrite — new page with header, filters, grouped table, inline expansion |
| `src/data/types.ts` | Modify — add 4 optional fields to Document interface |
| `src/data/mock-documents.ts` | Modify — populate new fields on existing entries |

## Files Reused Without Changes

| File | Provides |
|------|----------|
| `src/hooks/use-materials.ts` | Filtering, sorting, decisions, alternatives |
| `src/components/workspace/evidence-panel.tsx` | PS/PI tabs, comments, status, confidence |
| `src/lib/constants.ts` | Status configs (8 statuses), validation configs |
| `src/data/mock-validations.ts` | AI results, evidence items |

## Not Included

- Import/Export Template buttons
- Version dropdown
- Batch actions bar
- Resizable panels (EvidencePanel is inline, not in a split layout)
