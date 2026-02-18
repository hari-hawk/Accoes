# Dashboard UX Overhaul — Design Document

**Date:** 2026-02-19
**Status:** Approved

## Overview

Overhaul the projects dashboard and workspace pages to provide more business-meaningful metrics, streamlined filters, clearer card interactions, and consistent project-name-click behavior across the app.

## Area A: Hero Metrics

Replace 6 status-count tiles with 3 business-impact metric cards.

### Metrics

| Metric | Value | Visual | Business Value |
|--------|-------|--------|----------------|
| **Overall Confidence** | Avg confidence % across scored projects | Large number + SVG arc/ring indicator | "Are my submittals likely to pass?" |
| **Review Pipeline** | Active + In Progress counts | Mini stacked progress bar | "How much work is flowing?" |
| **Compliance Rate** | Pre-approved / total items | Fraction + percentage | "What % of items need no action?" |

### Visual Design
- 3-column grid inside the existing `gradient-hero` container
- Each metric in a `rounded-xl bg-white/[0.06] backdrop-blur` card
- Large prominent number (text-2xl+ bold)
- Supporting visual element (ring, bar, or fraction)
- Concise label below
- Generous padding for premium feel

## Area B: Filters & Sort

### Remove
- Job filter select
- Location filter select

### Keep
- Search input (filters on name, client, jobId)
- Status filter select (All Status, In Progress, Active, On Hold, Completed)
- View mode toggle (Grid / List)

### Modify Sort Options
- `updated` → "Last Updated" (default, descending by `updatedAt`)
- `name-asc` → "A → Z" (ascending alphabetical)
- `name-desc` → "Z → A" (descending alphabetical)

### Files
- `project-filters.tsx` — remove Job + Location selects, update sort options
- `use-projects.ts` — remove `jobFilter`/`locationFilter` state + filtering, update `SortBy` type, add `name-desc` case
- `project-list.tsx` — remove job/location filter props

## Area C: Project Cards & List Rows

### New Click Behavior

| Interaction | Action |
|-------------|--------|
| Click card body | Navigate to overview page (`/projects/{id}/versions/{latestVersionId}`) |
| Click project name (hover: underline + accent) | Open ProjectDetailSheet (stopPropagation) |
| Bottom actions | Download Report only (remove Overview + Material Index links) |
| Projects without versions | Card click → open detail panel. Download disabled. |

### Files
- `project-card.tsx` — card click navigates via `router.push`, name click opens detail sheet, remove 2 of 3 action buttons
- `project-list.tsx` — update `ProjectListRow` with same behavior, update `ProjectList` handlers to pass both callbacks, update list header columns

## Area D: Overview Page & Workspace Header

### D1. Remove version name from headings
- HeroBanner: use `project.name` as heading, not `version.name`
- Version Info Header breadcrumb: show `project.name` only, remove `version.name`

### D2. Rename "Version Details" → "Project Details"
- Sidebar card on overview page: rename title
- Remove "Spec Reference" row
- Keep: Created, Last Updated, Team Members, Overall Score

### D3. Clickable project name → detail panel
- Version Info Header: `project.name` becomes a button
- Style: `hover:underline hover:text-nav-accent cursor-pointer`
- Opens `ProjectDetailSheet` in right panel

### D4. Wire ProjectDetailSheet into workspace layout
- `layout.tsx` (version layout): manage sheet state
- Pass `onProjectNameClick` callback down to `VersionInfoHeader`
- Render `ProjectDetailSheet` at the layout level so it works across all workspace pages (overview, review, processing, export, upload)
