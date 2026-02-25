# Review → Submittal Binder Navigation

## Problem
The review page has no way to advance to the next workflow stage (Submittal Binder). Users must discover the top milestone stepper bar to navigate forward, which is a UX gap in a linear workflow.

## Solution
Add a sticky bottom progress bar to the review page that:
1. Shows a live count of decided vs total materials (e.g. "12/16 reviewed")
2. Displays a colored progress segment that fills as materials are decided
3. Unlocks a "Proceed to Submittal Binder" button once **all** materials have a decision
4. Navigates to `/projects/[projectId]/versions/[versionId]/submittal-binder`

## Trigger Rule
The proceed button is enabled only when every material has a non-pending decision (`approved`, `approved_with_notes`, `revision_requested`, `rejected`, or `revisit`).

## Placement
Sticky bottom bar as the last flex child inside the `absolute inset-0 flex flex-col` layout:
```
[Read-only banner?]
[Batch actions bar?]
[ResizablePanelGroup]  <- flex-1
[Review Progress Bar]  <- shrink-0, new
```

Hidden in read-only mode (`?mode=readonly`).

## Implementation
Single file change: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/review/page.tsx`
- Destructure `allMaterials` from `useMaterials()` (already exposed)
- Add `useRouter` import
- Compute `decidedCount` from `decisions` map
- Render sticky bar between `</ResizablePanelGroup>` and the comment dialog
- Uses `useMemo` for decided count to avoid recalculating on every render

## Visual Design
- Height: ~48px, border-top, bg-card
- Left: progress bar (green fill) + "X/Y reviewed" text
- Right: Proceed button (gradient-accent when enabled, muted when disabled)
- Subtle animation when bar transitions from partial to complete (scale/glow)
