# Projects v2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new "Projects v2" page with an accordion data table showing L1 project rows that expand to reveal L2 material/conformance rows — enabling cross-project comparison in a single view.

**Architecture:** New route at `/projects-v2` within the `(dashboard)` layout. A `useProjectsV2` hook flattens existing mock data (projects → documents → validations) into typed row objects. The page reuses the Project Index filter bar and table patterns. A "Projects v2" nav item is added to the top nav.

**Tech Stack:** Next.js 16 + React 19, Tailwind v4, shadcn/ui (Select, Input, Badge, Button, Checkbox), lucide-react icons, TypeScript

---

### Task 1: Create Projects v2 types and mock data utility

**Files:**
- Create: `src/data/mock-projects-v2.ts`

**Context:** All existing mock validations reference `ver-5` (which belongs to `proj-2`). To show data for multiple projects, we'll generate synthetic material rows for other projects based on existing validation patterns. Types define the L1/L2 row shapes.

**Step 1: Create the data file with types and flattening logic**

```typescript
// src/data/mock-projects-v2.ts
import { mockProjects } from "./mock-projects";
import { mockDocuments } from "./mock-documents";
import { mockValidations } from "./mock-validations";
import type {
  Project,
  ProjectStatus,
  ValidationStatus,
  DecisionStatus,
} from "./types";
import type { HydroTrade, HydroSystemCategory, HydroMaterialCategory } from "./mock-project-index";

/* ── Row types ─────────────────────────────────────────────────── */

export interface MaterialV2Row {
  id: string;
  specSection: string;       // e.g. "05 29 00"
  catalogTitle: string;      // document fileName
  description: string;       // specSectionTitle or validation summary
  sizes: string;             // pipe-delimited sizes or "—"
  subcategory: string;       // indexCategory from document
  trade: HydroTrade;
  aiStatus: ValidationStatus;
  decision: DecisionStatus;
  system: string;            // systemCategory from document
  confidenceScore: number;
}

export interface ProjectV2Row {
  id: string;
  name: string;
  jobId: string;
  type: string;              // projectType display label
  status: ProjectStatus;
  overallConfidence: number;
  materialCategory: string;  // derived from materials
  materials: MaterialV2Row[];
}

/* ── Status display labels ─────────────────────────────────────── */

export const PROJECT_V2_STATUS_OPTIONS: ProjectStatus[] = [
  "active",
  "in_progress",
  "completed",
  "on_hold",
  "extracting",
];

export const AI_STATUS_OPTIONS: ValidationStatus[] = [
  "pre_approved",
  "review_required",
  "action_mandatory",
];

export const DECISION_OPTIONS: DecisionStatus[] = [
  "pending",
  "approved",
  "approved_with_notes",
  "revision_requested",
  "rejected",
  "revisit",
];

/* ── Label helpers ─────────────────────────────────────────────── */

export function formatProjectType(type: string): string {
  return type === "dr" ? "Design Review" : "Design Job";
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ── Material category derivation ──────────────────────────────── */

const SYSTEM_TO_MATERIAL: Record<string, HydroMaterialCategory> = {
  "Chilled Water": "Carbon Steel",
  "Condenser Water": "Copper",
  "All Systems": "Carbon Steel",
};

/* ── Trade assignment by index category ────────────────────────── */

const CATEGORY_TO_TRADE: Record<string, HydroTrade> = {
  "Finishes": "Mechanical",
  "Hangers & Supports": "Mechanical",
  "Anchors": "Mechanical",
  "Fittings": "Plumbing",
  "Pipe": "Plumbing",
  "Valves": "Mechanical",
  "Insulation": "Mechanical",
  "Specialties": "Electrical",
};

/* ── Build the flat data structure ─────────────────────────────── */

function buildMaterialRows(project: Project): MaterialV2Row[] {
  // Find documents for this project's latest version
  const docs = mockDocuments.filter(
    (d) => d.versionId === project.latestVersionId
  );

  if (docs.length === 0) return [];

  return docs.map((doc) => {
    // Find the first validation for this document
    const validation = mockValidations.find(
      (v) => v.documentId === doc.id && v.versionId === doc.versionId
    );

    return {
      id: `${project.id}-${doc.id}`,
      specSection: doc.specSection,
      catalogTitle: doc.fileName,
      description: doc.specSectionTitle,
      sizes: "—",
      subcategory: doc.indexCategory ?? "—",
      trade: (CATEGORY_TO_TRADE[doc.indexCategory ?? ""] ?? "Mechanical") as HydroTrade,
      aiStatus: validation?.status ?? "review_required",
      decision: validation?.decision ?? "pending",
      system: doc.systemCategory ?? "—",
      confidenceScore: validation?.confidenceScore ?? 0,
    };
  });
}

/** Synthetic materials for projects that don't have real documents */
function buildSyntheticMaterials(project: Project): MaterialV2Row[] {
  const syntheticData: Array<{
    specSection: string;
    catalogTitle: string;
    description: string;
    subcategory: string;
    system: string;
    trade: HydroTrade;
    aiStatus: ValidationStatus;
    decision: DecisionStatus;
    confidence: number;
  }> = [
    {
      specSection: "23 21 13",
      catalogTitle: "Hydronic Piping",
      description: "SCH 40 Black Steel Pipe — Chilled Water",
      subcategory: "Pipe",
      system: "Chilled Water",
      trade: "Mechanical",
      aiStatus: "pre_approved",
      decision: "approved",
      confidence: 94,
    },
    {
      specSection: "23 21 13",
      catalogTitle: "Pipe Fittings",
      description: "Butt-Weld Fittings ASTM A234",
      subcategory: "Fittings",
      system: "Chilled Water",
      trade: "Plumbing",
      aiStatus: "pre_approved",
      decision: "pending",
      confidence: 88,
    },
    {
      specSection: "23 05 23",
      catalogTitle: "Ball Valve",
      description: "2-Piece Full Port Ball Valve",
      subcategory: "Valves",
      system: "Condenser Water",
      trade: "Mechanical",
      aiStatus: "review_required",
      decision: "pending",
      confidence: 72,
    },
    {
      specSection: "23 07 19",
      catalogTitle: "Pipe Insulation",
      description: "Fiberglass Pipe Insulation 1.5\" Thick",
      subcategory: "Insulation",
      system: "Chilled Water",
      trade: "Mechanical",
      aiStatus: "action_mandatory",
      decision: "revision_requested",
      confidence: 45,
    },
  ];

  // Use project confidence to pick a subset
  const count = Math.max(2, Math.min(syntheticData.length, Math.ceil(project.totalDocuments / 8)));
  return syntheticData.slice(0, count).map((s, i) => ({
    id: `${project.id}-syn-${i}`,
    specSection: s.specSection,
    catalogTitle: s.catalogTitle,
    description: s.description,
    sizes: "—",
    subcategory: s.subcategory,
    trade: s.trade,
    aiStatus: s.aiStatus,
    decision: s.decision,
    system: s.system,
    confidenceScore: s.confidence,
  }));
}

function deriveMaterialCategory(materials: MaterialV2Row[]): string {
  const systems = new Set(materials.map((m) => m.system));
  if (systems.has("Chilled Water")) return "Carbon Steel";
  if (systems.has("Condenser Water")) return "Copper";
  return "n/a";
}

export function getProjectV2Rows(): ProjectV2Row[] {
  return mockProjects
    .filter((p) => p.status !== "extracting") // exclude projects with no data
    .map((project) => {
      let materials = buildMaterialRows(project);
      // If no real documents, generate synthetic ones
      if (materials.length === 0) {
        materials = buildSyntheticMaterials(project);
      }

      return {
        id: project.id,
        name: project.name,
        jobId: project.jobId,
        type: formatProjectType(project.projectType),
        status: project.status,
        overallConfidence: project.confidenceSummary.overallConfidence,
        materialCategory: deriveMaterialCategory(materials),
        materials,
      };
    });
}
```

**Step 2: Verify types compile**

Run: `cd "/Users/harivershan/Library/CloudStorage/GoogleDrive-hari.sr@techjays.com/My Drive/Accoes Platform/accoes-submittal-ai" && npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/data/mock-projects-v2.ts
git commit -m "feat: add Projects v2 types and mock data flattening utility"
```

---

### Task 2: Create `useProjectsV2` hook

**Files:**
- Create: `src/hooks/use-projects-v2.ts`

**Context:** This hook mirrors `src/hooks/use-hydro-matrix.ts` (lines 21–158) but operates on `ProjectV2Row[]` instead of `HydroMatrixEntry[]`. It manages search, filters, expansion state, and selection.

**Step 1: Create the hook**

```typescript
// src/hooks/use-projects-v2.ts
"use client";

import { useState, useMemo, useCallback } from "react";
import {
  getProjectV2Rows,
  PROJECT_V2_STATUS_OPTIONS,
  AI_STATUS_OPTIONS,
  DECISION_OPTIONS,
  type ProjectV2Row,
  type MaterialV2Row,
} from "@/data/mock-projects-v2";
import type { ProjectStatus, ValidationStatus, DecisionStatus } from "@/data/types";
import type { HydroTrade, HydroSystemCategory, HydroMaterialCategory } from "@/data/mock-project-index";
import { HYDRO_TRADE_ORDER, HYDRO_CATEGORY_ORDER } from "@/data/mock-project-index";
import type { HydroIndexCategory } from "@/data/mock-project-index";

export function useProjectsV2() {
  const [allRows] = useState<ProjectV2Row[]>(() => getProjectV2Rows());

  // Filters
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState<HydroTrade | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<HydroIndexCategory | "all">("all");
  const [systemFilter, setSystemFilter] = useState<HydroSystemCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [materialFilter, setMaterialFilter] = useState<HydroMaterialCategory | "all">("all");

  // Expansion
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Selection (checkboxes)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        const allSelected = ids.every((id) => prev.has(id));
        if (allSelected) return new Set();
        return new Set(ids);
      });
    },
    []
  );

  // Filtered rows — filters apply to both L1 and L2 data
  const filteredRows = useMemo(() => {
    let result = allRows;

    // Status filter applies at L1 level
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Material category filter at L1 level
    if (materialFilter !== "all") {
      result = result.filter((r) => r.materialCategory === materialFilter);
    }

    // Search, trade, category, system filters — filter L2 materials, keep L1 if any L2 matches
    if (search || tradeFilter !== "all" || categoryFilter !== "all" || systemFilter !== "all") {
      result = result
        .map((row) => {
          let materials = row.materials;

          if (search) {
            const lower = search.toLowerCase();
            materials = materials.filter(
              (m) =>
                m.catalogTitle.toLowerCase().includes(lower) ||
                m.description.toLowerCase().includes(lower) ||
                m.specSection.toLowerCase().includes(lower) ||
                m.subcategory.toLowerCase().includes(lower) ||
                row.name.toLowerCase().includes(lower) ||
                row.jobId.toLowerCase().includes(lower)
            );
          }

          if (tradeFilter !== "all") {
            materials = materials.filter((m) => m.trade === tradeFilter);
          }

          if (categoryFilter !== "all") {
            materials = materials.filter((m) => m.subcategory === categoryFilter);
          }

          if (systemFilter !== "all") {
            materials = materials.filter((m) => m.system === systemFilter);
          }

          return { ...row, materials };
        })
        .filter((row) => row.materials.length > 0);
    }

    return result;
  }, [allRows, search, tradeFilter, categoryFilter, systemFilter, statusFilter, materialFilter]);

  const hasActiveFilters =
    search !== "" ||
    tradeFilter !== "all" ||
    categoryFilter !== "all" ||
    systemFilter !== "all" ||
    statusFilter !== "all" ||
    materialFilter !== "all";

  const clearFilters = useCallback(() => {
    setSearch("");
    setTradeFilter("all");
    setCategoryFilter("all");
    setSystemFilter("all");
    setStatusFilter("all");
    setMaterialFilter("all");
  }, []);

  const totalMaterials = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.materials.length, 0),
    [filteredRows]
  );

  return {
    // Data
    filteredRows,
    totalProjects: allRows.length,
    filteredProjectCount: filteredRows.length,
    totalMaterials,
    // Filters
    search,
    setSearch,
    tradeFilter,
    setTradeFilter,
    trades: HYDRO_TRADE_ORDER,
    categoryFilter,
    setCategoryFilter,
    categories: HYDRO_CATEGORY_ORDER,
    systemFilter,
    setSystemFilter,
    statusFilter,
    setStatusFilter,
    statusOptions: PROJECT_V2_STATUS_OPTIONS,
    materialFilter,
    setMaterialFilter,
    hasActiveFilters,
    clearFilters,
    // Expansion
    expandedId,
    toggleExpand,
    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
  };
}
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/hooks/use-projects-v2.ts
git commit -m "feat: add useProjectsV2 hook with filtering, expansion, selection"
```

---

### Task 3: Add "Projects v2" nav item

**Files:**
- Modify: `src/components/layout/top-nav.tsx:6-7,45-49`

**Step 1: Add the import and nav entry**

At line 6, add `Layers` to the lucide-react import:
```typescript
import {
  FolderKanban,
  Users,
  FileStack,
  Layers,          // ← add
  Bell,
  // ... rest unchanged
```

At line 45–49, add the new nav item:
```typescript
const mainNavItems = [
  { title: "Projects", href: "/projects", icon: FolderKanban },
  { title: "Projects v2", href: "/projects-v2", icon: Layers },   // ← add
  { title: "User Management", href: "/user-management", icon: Users },
  { title: "Project Index", href: "/project-index", icon: FileStack },
];
```

**Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/components/layout/top-nav.tsx
git commit -m "feat: add Projects v2 nav item to top navigation"
```

---

### Task 4: Create the Projects v2 page

**Files:**
- Create: `src/app/(dashboard)/projects-v2/page.tsx`

**Context:** This is the main page component. It follows the same patterns as `src/app/(dashboard)/project-index/page.tsx` for the filter bar, table, and expansion. Key differences:
- Two-level rows (L1 = project, L2 = material)
- Checkboxes on L1 rows
- Status badge colors for project status and AI status
- L2 rows render inside an accordion expansion below L1

**Step 1: Create the page file**

The page should contain these inline components (same pattern as project-index/page.tsx):

1. **`ProjectsV2Page`** (default export) — page layout with header, stats strip, filter bar, and table
2. **`FiltersBar`** — search + 5 dropdown filters + clear button
3. **`ProjectsV2Table`** — the `<table>` with L1 header and row mapping
4. **`ProjectRow`** — single L1 `<tr>` with expansion toggle, checkbox, project data, and conditional L2 `<tr>` below
5. **`MaterialRows`** — maps `materials[]` into L2 `<tr>` elements inside the expanded area

Key implementation details:

**Page header (light style, matches project-index):**
- Title: "Projects v2"
- Description: "Cross-project material conformance overview"
- Right side: stat badges (Projects count, Materials count)

**FiltersBar layout (same flex-wrap as project-index):**
- Search input (w-[280px])
- Trade dropdown (w-[160px])
- Category dropdown (w-[170px])
- System dropdown (w-[170px])
- Status dropdown (w-[160px])
- Material dropdown (w-[160px])
- Clear Filters button (conditional)

**L1 table columns:**
| Width | Column |
|-------|--------|
| w-10 | Checkbox |
| w-10 | Expand chevron |
| flex | Project Name |
| w-[120px] | Job ID (mono) |
| w-[120px] hidden md: | Type |
| w-[100px] | Status (badge) |
| w-[100px] hidden lg: | Confidence (% + color) |
| w-[130px] hidden xl: | Material Category (badge) |

**L2 table columns (nested inside `<td colSpan={8}>`):**
| Column |
|--------|
| Spec Section (mono) |
| Catalog Title |
| Description |
| Sizes |
| Subcategory |
| Trade |
| AI Status (badge) |
| Decision (badge) |
| System (badge) |

**Status badge colors (reuse pattern from project-index):**
```typescript
const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-ds-neutral-100 text-ds-neutral-700 dark:bg-ds-neutral-800 dark:text-ds-neutral-300",
  on_hold: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  extracting: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const AI_STATUS_COLORS: Record<string, string> = {
  pre_approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  review_required: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  action_mandatory: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const DECISION_COLORS: Record<string, string> = {
  pending: "bg-ds-neutral-100 text-ds-neutral-600",
  approved: "bg-emerald-100 text-emerald-700",
  approved_with_notes: "bg-teal-100 text-teal-700",
  revision_requested: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  revisit: "bg-violet-100 text-violet-700",
};
```

**Expansion animation:**
```tsx
{expandedId === row.id && (
  <tr>
    <td colSpan={8} className="p-0 border-b border-border/50">
      <div className="animate-accordion-down overflow-hidden">
        <div className="px-6 py-3 bg-muted/20">
          <table className="w-full text-xs">
            {/* L2 header + material rows */}
          </table>
        </div>
      </div>
    </td>
  </tr>
)}
```

**Confidence column coloring:**
```tsx
function confidenceColor(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}
```

**Step 2: Verify build passes**

Run: `npm run build`
Expected: Successful build with no errors

**Step 3: Commit**

```bash
git add src/app/\(dashboard\)/projects-v2/page.tsx
git commit -m "feat: add Projects v2 page with accordion data table and filters"
```

---

### Task 5: Final verification and push

**Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: 0 errors

**Step 2: Production build**

Run: `npm run build`
Expected: Successful build, no warnings

**Step 3: Push to remote**

```bash
git push origin main
```

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `src/data/mock-projects-v2.ts` | Create | Types (ProjectV2Row, MaterialV2Row) + data flattening from existing mocks |
| `src/hooks/use-projects-v2.ts` | Create | Hook: filtering, search, expansion, checkbox selection |
| `src/components/layout/top-nav.tsx` | Modify (lines 6, 45–49) | Add Layers icon import + "Projects v2" nav item |
| `src/app/(dashboard)/projects-v2/page.tsx` | Create | Full page: header, filters, accordion table with L1/L2 rows |

## Reference Files

These files should be consulted during implementation for pattern consistency:
- `src/app/(dashboard)/project-index/page.tsx` — FiltersBar, table, CategoryGroup, ExpandedEntryContent patterns
- `src/hooks/use-hydro-matrix.ts` — Hook pattern for filtering + state management
- `src/data/mock-project-index.ts` — Type constants (HYDRO_TRADE_ORDER, HYDRO_CATEGORY_ORDER, etc.)
- `src/data/types.ts` — Core types (Project, Document, ValidationResult, etc.)
- `src/components/layout/top-nav.tsx` — Nav item structure
