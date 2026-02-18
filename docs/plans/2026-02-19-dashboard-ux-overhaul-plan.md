# Dashboard UX Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Overhaul the projects dashboard with business-impact metrics, streamlined filters, clearer card interactions, and consistent project-name-click behavior across workspace pages.

**Architecture:** Four independent areas modified in sequence — hero metrics, filters/sort hook, project cards/list, and workspace header/overview page. Each area is self-contained and can be built-verified independently.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui, lucide-react

---

### Task 1: Streamline Filters & Sort Hook

**Files:**
- Modify: `src/hooks/use-projects.ts`
- Modify: `src/components/projects/project-filters.tsx`
- Modify: `src/components/projects/project-list.tsx`

**What to do:**

1. In `use-projects.ts`:
   - Change `SortBy` type from `"updated" | "name" | "status"` to `"updated" | "name-asc" | "name-desc"`
   - Remove `allJobIds` and `allLocations` exports (lines 11-12)
   - Remove `jobFilter` and `locationFilter` state (lines 17-18)
   - Remove job/location filter logic in `filteredProjects` (lines 39-45)
   - Remove `jobFilter`/`setJobFilter`/`locationFilter`/`setLocationFilter` from the return object
   - Remove them from the `useMemo` deps array
   - Update sort switch: keep `updated` case, rename `name` to `name-asc`, add `name-desc` case (`b.name.localeCompare(a.name)`), remove `status` case

2. In `project-filters.tsx`:
   - Remove `allJobIds, allLocations` import
   - Remove `jobFilter`/`onJobChange`/`locationFilter`/`onLocationChange` from props interface
   - Remove the Job and Location `<Select>` elements (lines 71-96)
   - Update Sort select options: "Last Updated" (`updated`), "A → Z" (`name-asc`), "Z → A" (`name-desc`)

3. In `project-list.tsx` (`ProjectList` component):
   - Remove `jobFilter`/`locationFilter` destructuring from `useProjects()` call
   - Remove `jobFilter`/`onJobChange`/`locationFilter`/`onLocationChange` props passed to `<ProjectFilters>`

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/hooks/use-projects.ts src/components/projects/project-filters.tsx src/components/projects/project-list.tsx
git commit -m "refactor: Streamline filters — remove Job/Location, add A→Z/Z→A sort"
```

---

### Task 2: Hero Section — 3 Business-Impact Metrics

**Files:**
- Modify: `src/components/projects/project-list.tsx` (HeroSection function, lines 74-144)

**What to do:**

Replace the entire `HeroSection` function with 3 metric cards:

1. **Overall Confidence** — average of `overallConfidence` across scored projects. Display as large `text-3xl font-bold` number. Include an SVG arc/ring indicator (120px diameter, stroke-dasharray technique). Gold stroke for filled, white/10 for background track.

2. **Review Pipeline** — show `activeCount` Active + `inProgressCount` In Progress. Include a mini stacked horizontal bar showing the ratio of active/in-progress/completed/on-hold as colored segments inside a `h-2 rounded-full` bar.

3. **Compliance Rate** — compute `totalPreApproved` and `totalItems` across all projects' `confidenceSummary`. Show as `"72 / 95"` fraction with a percentage below. Include a small progress-bar-style fill.

Each metric card: `rounded-xl bg-white/[0.06] backdrop-blur-sm p-5` inside a `grid grid-cols-1 sm:grid-cols-3 gap-4` container.

Keep the existing greeting text ("Welcome back, Sarah") and decorative elements.

Remove the old 6-tile stats grid entirely.

Also remove the now-unused imports: `Activity`, `Clock`, `FileStack` from lucide-react (only if they're not used elsewhere in the file — `Clock` IS used in the DownloadReportSheet area, so keep it; check each).

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/components/projects/project-list.tsx
git commit -m "feat: Replace hero tiles with 3 business-impact metric cards"
```

---

### Task 3: Project Card — New Click Behavior & Single Action

**Files:**
- Modify: `src/components/projects/project-card.tsx`
- Modify: `src/components/projects/project-list.tsx` (ProjectList component)

**What to do:**

1. In `project-card.tsx`:
   - Add `useRouter` import from `next/navigation`
   - Change props: add `onNameClick?: (project: Project) => void` alongside existing `onCardClick` and `onDownloadReport`
   - Card body click: if `hasVersions`, navigate via `router.push(overviewHref)`. If no versions, call `onNameClick?.(project)` to open detail panel.
   - Project name (`<h3>`): wrap in a `<button>` with `onClick={(e) => { e.stopPropagation(); onNameClick?.(project); }}`. Style: `hover:underline hover:text-nav-accent cursor-pointer transition-colors`. Keep truncate.
   - Remove the `onCardClick` prop usage entirely (replaced by router navigation)
   - Row 6 actions: remove the Overview `<Link>` and Material Index Grid `<Link>`. Keep only the Download Report button. For no-versions case, only show disabled Download Report span.
   - Remove unused imports: `Eye`, `ShieldCheck` from lucide-react
   - Remove `materialIndexGridHref` variable

2. In `project-list.tsx` (`ProjectList` component):
   - Rename `handleCardClick` to `handleNameClick` (or keep and just change what it does — it already opens the detail sheet, which is correct)
   - Pass `onNameClick={handleCardClick}` to `<ProjectCard>` (opens detail panel)
   - Remove `onCardClick` prop from `<ProjectCard>` (card click now navigates internally)
   - Update `<ProjectListRow>` similarly: row click navigates to overview page, project name click opens detail panel. Pass both `onNavigate` and `onNameClick` callbacks.
   - In `ProjectListRow`: row click → `router.push(overviewHref)` (if versions exist, else open detail panel). Name cell → `stopPropagation` + call `onNameClick`. Actions column → Download only.
   - Remove Eye and ShieldCheck links from `ProjectListRow` actions. Keep Download button only.
   - Update list header columns to remove the extra actions width.

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/components/projects/project-card.tsx src/components/projects/project-list.tsx
git commit -m "feat: Card click navigates to overview, name click opens detail panel, single Download action"
```

---

### Task 4: Version Info Header — Clickable Project Name, Remove Version Name

**Files:**
- Modify: `src/components/workspace/version-info-header.tsx`

**What to do:**

1. Add `onProjectNameClick?: () => void` to the component props
2. Remove `version.name` from breadcrumb (remove the `/` separator span and `version.name` span on line 29-30)
3. Keep `StatusIndicator` showing `version.status`
4. Make `project.name` a clickable `<button>`:
   ```tsx
   <button
     type="button"
     className="text-sm font-semibold truncate hover:underline hover:text-nav-accent transition-colors cursor-pointer"
     onClick={() => onProjectNameClick?.()}
     aria-label={`View details for ${project.name}`}
   >
     {project.name}
   </button>
   ```
5. Remove `version.specificationRef` from the sub-row (line 34-36)

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/components/workspace/version-info-header.tsx
git commit -m "refactor: Clickable project name in header, remove version name and spec ref"
```

---

### Task 5: Workspace Layout — Wire ProjectDetailSheet

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/layout.tsx`

**What to do:**

1. Add `useState` import from React
2. Import `ProjectDetailSheet` from `@/components/projects/project-detail-sheet`
3. Import `Project` type from `@/data/types`
4. Add state: `const [detailOpen, setDetailOpen] = useState(false)`
5. Create handler: `const handleProjectNameClick = () => setDetailOpen(true)`
6. Pass `onProjectNameClick={handleProjectNameClick}` to `<VersionInfoHeader>`
7. Render `<ProjectDetailSheet project={project} open={detailOpen} onOpenChange={setDetailOpen} />` after `</WorkspaceProvider>` closing tag — actually, it must be INSIDE the return JSX. Place it as a sibling after `<main>`, still inside the fragment/div wrapper.

Since the layout currently returns:
```tsx
<WorkspaceProvider>
  <VersionInfoHeader />
  <WorkflowStageBar />
  <main>{children}</main>
</WorkspaceProvider>
```

Change to:
```tsx
<WorkspaceProvider>
  <VersionInfoHeader onProjectNameClick={handleProjectNameClick} />
  <WorkflowStageBar />
  <main>{children}</main>
  <ProjectDetailSheet project={project} open={detailOpen} onOpenChange={setDetailOpen} />
</WorkspaceProvider>
```

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/app/(workspace)/projects/[projectId]/versions/[versionId]/layout.tsx
git commit -m "feat: Wire ProjectDetailSheet into workspace layout via project name click"
```

---

### Task 6: Overview Page — Rename to Project Details, Remove Spec Ref, Update HeroBanner

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx`

**What to do:**

1. **HeroBanner component** (lines 104-180):
   - Remove `versionName` and `specRef` from props
   - Change `<h2>` from `{versionName}` to `{projectName}`
   - Change subtitle from `{projectName} — {specRef}` to `{project.client}` (show client name instead)
   - Update the HeroBanner call site (line 605-612): remove `versionName` and `specRef` props

2. **Sidebar "Version Details" card** (lines 635-683):
   - Change title from "Version Details" to "Project Details"
   - Remove the "Spec Reference" row (lines 666-672)
   - Keep: Created, Last Updated, Team Members, Overall Score

**Step: Build verify**
Run: `npx tsc --noEmit && npm run build`

**Step: Commit**
```
git add src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx
git commit -m "refactor: Rename Version Details to Project Details, remove spec ref, update HeroBanner"
```

---

### Task 7: Final Build Verify + Push + Deploy

**Step 1: Full build verification**
```
npx tsc --noEmit && npm run build
```

**Step 2: Push to remote**
```
git push origin main
```

**Step 3: Deploy to Vercel**
```
npx vercel --yes --prod
```
