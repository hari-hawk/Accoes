# Project Index Expansion Panel Redesign

**Date:** 2026-02-25

## Summary

Redesign the expandable row content on the Project Index page to remove redundant description text and add 5 new boolean fields from the Hydro Matrix Excel source.

## Changes

### 1. Remove Index Description paragraph
The `indexDescription` text shown in the expansion panel is nearly identical to the `description` already visible in the table row. Remove it to reduce redundancy.

### 2. Switch to 4-column layout with additional fields
Current: 3-column × 2-row grid (6 fields)
New: 4-column × 3-row grid (11 fields)

Layout:
| Index ID | Trade | Subcategory | Fitting Mfr |
| Sizes | Material | From Matrix | Non Default |
| Manual Entry | Non Matrix Desc/Ftg Mfr | Non Matrix Size Edited | |

### 3. Boolean field display
All 5 new fields display as plain text ("TRUE" / "FALSE") with the same styling as other fields — no color badges.

### 4. Data model changes
Add to `HydroMatrixEntry`:
- `fromMatrix: boolean`
- `nonDefault: boolean`
- `manualEntry: boolean`
- `nonMatrixDescOrFtgMfrEdited: boolean`
- `nonMatrixSizeEdited: boolean`

Update all 35 mock entries with values matching the Excel file.

## Files Modified
- `src/data/mock-project-index.ts` — type + mock data
- `src/app/(dashboard)/project-index/page.tsx` — ExpandedEntryContent component + CSV export
