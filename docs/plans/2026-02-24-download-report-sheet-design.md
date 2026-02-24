# Download Report Sheet Enhancement — Design

**Date:** 2026-02-24
**Status:** Approved
**Approach:** A — Rewrite existing `DownloadReportSheet` in-place

## Overview

Upgrade the Download Report right-side panel (opened from project card) to mirror the workspace material list structure. Adds search, document/status filters, score chips, status badges, multi-select checkboxes, and a CSV/Excel format picker for export.

## Data Source

Switch from `getDocumentsByVersion()` + `getValidationsByVersion()` to `getMaterialItemsByVersion()` which returns `MaterialItem[]` — provides scores (PS/PI), validation status, spec sections, and decision badges in a single data type.

## State

| State | Type | Purpose |
|---|---|---|
| `selectedIds` | `Set<string>` | Checked material IDs for export |
| `search` | `string` | Search input value |
| `statusFilter` | `Set<ValidationStatus>` | Active status filters |
| `exportFormat` | `"csv" \| "xlsx"` | Export format selection |
| `exporting` | `boolean` | Export in progress |
| `exportComplete` | `boolean` | Export success state |

**Derived:** `filteredMaterials` (filtered by search + status), status counts (per-status totals from unfiltered list), `allSelected` (all filtered items checked).

## Layout

```
Header:  Download icon badge + "Download Report" + project name/job ID
─────────────────────────────────────
Filter:  Search bar (full width)
         Document dropdown | Status filter dropdown
         [Active filter chips when filters applied]
         ☐ Select all                    ✓N ⚠N ✗N
─────────────────────────────────────
List:    Scrollable material items with:
         ☐ + status dot + name + spec section
         PS/PI score chips + status/decision badge
─────────────────────────────────────
Footer:  [Cancel]   [CSV ▼]   [Export (N)]
```

## Material List Items

Each row displays:
- **Checkbox** — left-aligned, for multi-select
- **Status dot** — colored circle (green/orange/red) based on validation status
- **Material name** — filename without extension, truncated
- **Spec section** — monospace code + section title (e.g., `05 29 00 — B-Line Clevis...`)
- **Score chips** — `PS: XX%` + `PI: YY%` color-coded, or single `Score: XX%`
- **Status badge** — right-aligned decision or validation status

## Footer

- Cancel button (outline, left)
- Format Select dropdown (CSV / Excel, center)
- Export button with count badge, gradient-action style, disabled when nothing selected

## Export Success

Centered check icon + "Report Generated" message showing count and format (e.g., "3 documents exported as CSV").

## Files Changed

- `src/components/projects/project-list.tsx` — Rewrite `DownloadReportSheet` body (~250 lines)

## Patterns Reused

- `ScoreChip` pattern from `material-list.tsx`
- `STATUS_OPTIONS` / `VALIDATION_STATUS_CONFIG` for filter UI
- `SearchInput` component for search
- `Select`/`Popover` for filter dropdowns
- Sheet shell pattern (header/scroll/footer) unchanged
