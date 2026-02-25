# Project Card Visual Overhaul

## Problem
Project cards on the /projects dashboard have visual issues:
1. "Active" status badge uses blue that blends with the card's overall blue scheme
2. Confidence bar is a thin single-color strip that doesn't communicate the validation breakdown
3. Validation counts (icon + number) are too subtle to scan quickly

## Changes

### 1. Status Badge Colors
Give each of the 5 statuses a distinct color:
- Extracting: Amber (keep)
- In Progress: Cyan/Teal (`bg-cyan-100 text-cyan-700`)
- Active: Indigo (`bg-indigo-100 text-indigo-700`)
- On Hold: Gray (keep)
- Completed: Green (keep)

### 2. Stacked Segment Confidence Bar
Replace single-color thin bar with a thicker stacked bar:
- Height: h-2.5 (up from h-1.5)
- Three colored segments: green (pre-approved), orange (review), red (action mandatory)
- Width proportional to count / total
- Rounded ends on outer segments

### 3. Colored Mini-Pill Validation Badges
Replace icon+number with colored pill badges:
- Each count gets a `bg-status-*-bg` background tint
- Includes abbreviated label for clarity
- More scannable than plain text

## Files Changed
- `src/lib/constants.ts` — Update PROJECT_STATUS_CONFIG colors
- `src/components/projects/project-card.tsx` — Stacked bar + pill badges
