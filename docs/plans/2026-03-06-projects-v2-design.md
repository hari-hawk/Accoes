# Projects v2 — Accordion Data Table Design

## Problem
Users need to view conformance/material data across multiple projects in a single view. Currently this requires navigating into each project individually and checking the conformance page per project. A flattened table view across all projects would enable faster cross-project comparison.

## Solution
A new "Projects v2" page accessible from the top nav. Single data table with two-level rows:

- **L1 (Project rows):** Summary info per project — expandable via accordion
- **L2 (Material rows):** Conformance/material items nested under each project

## Layout

```
┌──────────────────────────────────────────────────────┐
│  Projects v2                          [Import][Export]│
├──────────────────────────────────────────────────────┤
│  [Search] [Trade ▾] [Category ▾] [System ▾]         │
│           [Status ▾] [Material ▾]                    │
├──┬──┬────────────┬────────┬──────┬────────┬──────────┤
│☐ │▸ │ Project A  │ J-1001 │ Mech │ Active │ 92% │ CS│
├──┴──┴────────────┴────────┴──────┴────────┴──────────┤
│☐ │▾ │ Project B  │ J-1002 │ Plmb │ Review │ 87% │ Cu│
│  ├──────────────────────────────────────────────────┤ │
│  │ 01.01.01 │ Valve  │ 2" Ball │ 1/2-4 │ Mech │ ✓ ││
│  │ 01.02.03 │ Fitting│ Elbow   │ 1/2-2 │ Mech │ ✓ ││
│  │ 02.01.01 │ Pipe   │ SCH 40  │ 2-12  │ Plmb │ ? ││
│  └──────────────────────────────────────────────────┘ │
│☐ │▸ │ Project C  │ J-1003 │ Elec │ Done   │ 95% │ CS│
└──────────────────────────────────────────────────────┘
```

## L1 Columns (Project Rows)

| # | Column | Source |
|---|--------|--------|
| 1 | Checkbox | Local select state |
| 2 | Expand chevron | Toggle L2 visibility |
| 3 | Project Name | `project.name` |
| 4 | Job ID | `project.jobId` |
| 5 | Type | `project.type` |
| 6 | Status | `project.status` |
| 7 | Overall Confidence | Average of `validation.confidence` across materials |
| 8 | Material Category | Derived from materials (e.g., "Carbon Steel") |

## L2 Columns (Material/Conformance Rows)

| # | Column | Source |
|---|--------|--------|
| 1 | Spec Section (Index ID) | `document.indexIdFull` or hydro entry ref |
| 2 | Catalog Title | `document.catalogTitle` or filename |
| 3 | Description | `validation.decision` or `document.description` |
| 4 | Sizes | `hydroEntry.sizes` |
| 5 | Subcategory | `hydroEntry.indexSubcategory` |
| 6 | Trade | `hydroEntry.trade` |
| 7 | AI Status | `validation.status` (Approved/Rejected/Pending) |
| 8 | Decision | `validation.decision` |
| 9 | System | `hydroEntry.systemCategory` |

## Filters

| Filter | Type | Values |
|--------|------|--------|
| Search | Text input | Searches across project name, job ID, material descriptions |
| Trade | Multi-select | Mechanical, Electrical, Plumbing, Fire Protection |
| Index Category | Multi-select | All 10 hydro categories |
| System | Multi-select | Chilled Water, Condenser Water, Generic |
| Status | Multi-select | Active, Review, Done, Pending |
| Material Category | Multi-select | Carbon Steel, Copper, n/a |

## Data Flow

```
mock-projects.ts (existing)
  → per project: get documents (mock-documents)
  → per document: get validations (mock-validation-results)
  → flatten into: ProjectV2Row { project info, materials: MaterialV2Row[] }
  → useProjectsV2 hook manages state, filtering, expansion
```

## New Files

| File | Purpose |
|------|---------|
| `src/app/(dashboard)/projects-v2/page.tsx` | Page component with table, filters, expansion |
| `src/hooks/use-projects-v2.ts` | Data hook: fetching, filtering, expansion state |
| `src/data/mock-projects-v2.ts` | Data flattening utilities (optional, may inline) |

## Modified Files

| File | Change |
|------|--------|
| `src/components/layout/top-nav.tsx` | Add "Projects v2" nav item |

## Design Decisions

- **Single table, not master-detail:** Better for cross-project comparison without context-switching
- **Mock data only:** No backend; all data from existing mock sources
- **Reuse Project Index patterns:** Same filter bar, table structure, and styling conventions
- **Accordion expansion:** One project expanded at a time (consistent with standard accordion UX)
