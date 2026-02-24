# Toast Notification System & Project Extracting State

**Date**: 2026-02-25
**Status**: Approved

## Overview

Two related features:
1. A global toast notification system with auto-dismiss banners (success/caution/error)
2. A "extracting" state for newly created projects that blocks navigation until document processing completes

## Feature 1: Global Toast System

### Library

**Sonner** — lightweight (10KB), shadcn/ui-compatible toast library. Provides stacking, auto-dismiss, and smooth animations out of the box.

### Position & Behavior

- **Position**: Fixed below TopNav (offset ~56px from top), centered horizontally
- **Auto-dismiss**: 5 seconds, no manual dismiss button
- **Stacking**: Vertical, newest on top, max 3 visible at once
- **Animation**: Slide down from below nav, fade out on dismiss

### Variants

| Variant | Border | Background | Icon | Semantic |
|---------|--------|------------|------|----------|
| Success | `border-green-200` | `bg-green-50` | CheckCircle2 (green) | Completed actions |
| Caution | `border-amber-200` | `bg-amber-50` | AlertTriangle (amber) | Warnings, in-progress |
| Error | `border-red-200` | `bg-red-50` | XCircle (red) | Failures |

### API

```tsx
import { toast } from "sonner";

toast.success("Project created successfully");
toast.warning("Document extraction in progress...");
toast.error("Upload failed — please try again");
```

### Integration Point

`<Toaster>` component added to root `src/app/layout.tsx` inside the provider tree. Configured with:
- `position="top-center"`
- `offset` set to nav bar height
- `duration={5000}`
- `toastOptions` with custom className for each variant

## Feature 2: Project Extracting State

### Flow

1. User submits create project form
2. Success toast: "Project created! Document extraction has started."
3. Redirect to `/projects` page (same as current)
4. Newly created project card appears with **extracting state**

### Card Visual Treatment

- **Status badge**: Amber-colored "Extracting" with animated Loader2 spinner icon
- **Progress bar**: Thin animated/pulsing bar along top edge of card (indeterminate — no real backend)
- **Metrics**: Score shows `—` or `0%`, validation breakdown empty/zeroed
- **Interaction**: `opacity-90` + `cursor-not-allowed` on hover. Click fires caution toast instead of navigating
- **Toast on click**: "Document extraction & conformance report in progress. We'll notify you once it's ready."

### Mock Timer (Phase 1)

- After 30 seconds, extracting project transitions to `"active"` status
- Success toast fires: "{Project Name} is ready for review!"
- Notification added to bell panel: type `success`, "Extraction Complete — {name} ready for review"

### Data Model

Add `"extracting"` to `ProjectStatus` type:
```typescript
type ProjectStatus = "extracting" | "in_progress" | "active" | "on_hold" | "completed";
```

One mock project in `mockProjects` starts with `status: "extracting"` to demonstrate the state.

## Integration Points

| Location | Event | Variant | Message |
|----------|-------|---------|---------|
| Create project form | Submitted | Success | "Project created! Document extraction has started." |
| Project card (extracting) | Clicked | Caution | "Document extraction in progress. We'll notify you once it's ready." |
| Project card (ready) | Timer completes | Success | "{name} is ready for review!" |
| Upload dialog (overview) | Files uploaded | Success | "{count} files uploaded successfully" |
| Export CSV/Excel | Exported | Success | "Report exported as {format}" |
| Share popover | Link copied | Success | "Link copied to clipboard" |

## Files to Create/Modify

### New
- Install `sonner` package
- Custom Toaster wrapper (optional — for styled variants)

### Modified
- `src/app/layout.tsx` — add `<Toaster>` to provider tree
- `src/data/types.ts` — add `"extracting"` to ProjectStatus
- `src/data/mock-projects.ts` — add extracting mock project
- `src/components/projects/project-card.tsx` — extracting visual state + click interception
- `src/components/projects/create-job-form.tsx` — fire success toast on submit
- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/page.tsx` — toast on upload
- `src/components/projects/project-list.tsx` — toast on export
- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/layout.tsx` — toast on share/copy
