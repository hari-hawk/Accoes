# Milestone Spacing + Binder Cleanup — Design

## Date: 2026-02-26

## Changes

### 1. Remove Page 14 (AI Reasoning Log) from Submittal Binder

Delete `AppendixAILog` component and its page render. Update `TOTAL_PAGES` 14 → 13. Update Table of Contents to remove the appendix entry. Supporting Documentation becomes the last page.

### 2. Fix Milestone Completion — Preview Cover Page Ticked on Binder

When on `/submittal-binder`, set `pathIndex = 4` (beyond all milestone indices) so all prior milestones including Preview Cover Page show as completed.

### 3. Remove Back + Title from Submittal Binder Header

Remove the entire left section (Back link, divider, BookOpen icon, title, project name). Keep only the Export PDF button right-aligned. The milestone bar already provides navigation and context.

### 4. Equal Spacing on Milestone Bar via CSS Grid

Replace flex layout with `grid grid-cols-4`. Each milestone gets one equal-width column with centered icon+label. Connector lines span evenly between columns regardless of label text width. Widen container from `max-w-2xl` to a wider value to give breathing room.

## Files Modified

- `src/app/(workspace)/projects/[projectId]/versions/[versionId]/submittal-binder/page.tsx`
- `src/components/layout/milestone-progress-bar.tsx`
