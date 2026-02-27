# Multi-Select Category Filters + Sorting — Design

## Context

The Conformance page material list has 4 filters (Documents, Status, Index Category, System Category). Status already uses multi-select (Popover + Checkboxes). The other two category filters are single-select `<Select>` dropdowns and need to become multi-select. A sort control is also needed.

## Change 1: Convert Index Category & System Category to Multi-Select

**Current:** Single-select `<Select>` dropdowns (`string` state, `=== "all"` check)
**New:** Popover + Checkbox pattern matching Status filter

- State changes from `string` → `Set<string>` for both `indexCategoryFilter` and `systemCategoryFilter`
- Hook filtering uses `set.has()` instead of `===` equality
- Each filter trigger button shows "All Categories" / "2 Categories" / single name
- Popover with checkbox list + "Clear all" link
- Active selections shown as removable filter chips alongside status chips

## Change 2: Sort Control

An `ArrowUpDown` icon button to the right of the search input on Row 1. Opens a Popover with radio options:

| Option | Behavior |
|--------|----------|
| Name A-Z | Alphabetical by `fileName` ascending — **default** |
| Name Z-A | Alphabetical by `fileName` descending |
| By Index Category | Group by `indexCategory` alphabetically, then by name within group |

Active sort highlighted on button when non-default.

## Files Changed

| File | What |
|------|------|
| `src/hooks/use-materials.ts` | `indexCategoryFilter`/`systemCategoryFilter` → `Set<string>`, add toggle/clear callbacks, add `sortBy` state + sort logic |
| `src/components/workspace/material-list.tsx` | Row 3 `<Select>` → Popover+Checkbox, sort button on Row 1, update props |
| `src/app/(workspace)/.../review/page.tsx` | Wire new Set-based props + sort props |
