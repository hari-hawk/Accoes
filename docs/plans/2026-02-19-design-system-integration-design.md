# Design System Integration — Design Document

**Date:** 2026-02-19
**Scope:** Integrate Accoes Design System tokens into the existing Next.js platform

## Overview

Replace OKLCH color values in `globals.css` with exact HEX values from the Accoes Design System. Add full-palette color scales, tag colors, typography utility classes, and fix hardcoded colors in components.

## Approach

**CSS Variables Only (Token Layer)** — update `globals.css` @theme inline block with design system tokens. No separate config file. Preserves Tailwind v4 + shadcn/ui architecture.

## Color Token Mapping

### Semantic Tokens (`:root` block)

| Token | Old (OKLCH) | New (DS HEX) | Source |
|-------|-------------|--------------|--------|
| `--background` | `oklch(0.965 0.008 250)` | `#F9FAFB` | bg-gray-light |
| `--foreground` | `oklch(0.16 0.01 250)` | `#333333` | neutral-900 |
| `--card` | `oklch(0.995 0.002 250)` | `#FFFFFF` | bg-white |
| `--card-foreground` | `oklch(0.16 0.01 250)` | `#333333` | neutral-900 |
| `--popover` | `oklch(0.995 0.002 250)` | `#FFFFFF` | bg-white |
| `--popover-foreground` | `oklch(0.16 0.01 250)` | `#333333` | neutral-900 |
| `--muted` | `oklch(0.94 0.006 250)` | `#F0F0F0` | neutral-100 |
| `--muted-foreground` | `oklch(0.48 0.01 250)` | `#787878` | neutral-600 |
| `--border` | `oklch(0.90 0.005 250)` | `#D8D8D8` | neutral-200 |
| `--input` | `oklch(0.90 0.005 250)` | `#D8D8D8` | neutral-200 |
| `--ring` | `oklch(0.50 0.12 250)` | `#00529B` | primary-800 |
| `--primary` | `oklch(0.42 0.14 255)` | `#00529B` | primary-800 |
| `--primary-foreground` | `oklch(0.98 0 0)` | `#FFFFFF` | white |
| `--secondary` | `oklch(0.94 0.01 250)` | `#F0F0F0` | neutral-100 |
| `--secondary-foreground` | `oklch(0.22 0.05 250)` | `#333333` | neutral-900 |
| `--accent` | `oklch(0.75 0.16 85)` | `#e1a41d` | **KEPT** (Accoes Gold, not in DS) |
| `--accent-foreground` | `oklch(0.20 0.05 85)` | `#3D3000` | derived |
| `--destructive` | `oklch(0.55 0.2 25)` | `#F02C36` | accent-critical |

### Navigation Tokens

| Token | New HEX | Source |
|-------|---------|--------|
| `--nav` | `#003075` | primary-900 |
| `--nav-foreground` | `#F0F0F0` | neutral-100 |
| `--nav-accent` | `#1A7FD4` | primary-600 |
| `--nav-gold` | `#e1a41d` | Accoes Gold (kept) |

### Sidebar Tokens

| Token | New HEX | Source |
|-------|---------|--------|
| `--sidebar` | `#F9FAFB` | bg-gray-light |
| `--sidebar-foreground` | `#4A4A4A` | neutral-800 |
| `--sidebar-primary` | `#00529B` | primary-800 |
| `--sidebar-primary-foreground` | `#FFFFFF` | white |
| `--sidebar-accent` | `#EFF4FF` | bg-blue-light |
| `--sidebar-accent-foreground` | `#333333` | neutral-900 |
| `--sidebar-border` | `#D8D8D8` | neutral-200 |
| `--sidebar-ring` | `#909090` | neutral-500 |

### Status & Confidence (preserved, updated to DS)

| Token | New HEX | Source |
|-------|---------|--------|
| `--status-pre-approved` | `#009966` | tag-green |
| `--status-pre-approved-bg` | `#ECFDF5` | tag-green-light |
| `--status-review-required` | `#F54900` | tag-orange2 |
| `--status-review-required-bg` | `#FFF7ED` | tag-orange2-light |
| `--status-action-mandatory` | `#E70008` | tag-red |
| `--status-action-mandatory-bg` | `#FBF3F2` | tag-red-light |
| `--confidence-high` | `#009966` | tag-green |
| `--confidence-medium` | `#F54900` | tag-orange2 |
| `--confidence-low` | `#E70008` | tag-red |

### Chart Colors

| Token | New HEX | Source |
|-------|---------|--------|
| `--chart-1` | `#00529B` | primary-800 |
| `--chart-2` | `#e1a41d` | Accoes Gold |
| `--chart-3` | `#009966` | tag-green |
| `--chart-4` | `#8B5CF6` | tag-purple |
| `--chart-5` | `#F54900` | tag-orange2 |

## New Palette Tokens (@theme inline)

Prefix with `ds-` to avoid collision with Tailwind built-ins.

### Primary Blue Scale
`--color-ds-primary-100` (#E6F3FD) → `--color-ds-primary-900` (#003075)

### Secondary Green Scale
`--color-ds-secondary-100` (#F2F8EE) → `--color-ds-secondary-900` (#3D4F2E)

### Neutral Gray Scale
`--color-ds-neutral-100` (#F0F0F0) → `--color-ds-neutral-900` (#333333)

### Tag Colors (solid + light)
16 tokens: `--color-tag-blue`, `--color-tag-blue-light`, ..., `--color-tag-black`, `--color-tag-black-light`

### Accent Additions
- `--color-ds-accent-critical`: #F02C36
- `--color-ds-accent-special`: #FFFBE8

### Background Tokens
- `--color-ds-bg-gray`: #F3F4F6
- `--color-ds-bg-blue-light`: #EFF4FF
- `--color-ds-bg-gray-light`: #F9FAFB

## Dark Theme

Derive dark values from DS HEX base. Strategy:
- Backgrounds: darken to ~10-18% luminance
- Foregrounds: lighten to ~90-96% luminance
- Primary: lighten to primary-500 (#309AE8) for contrast
- Borders: darken neutral-200 proportionally
- Status colors: keep hue, darken backgrounds

## Typography

Add to `@layer utilities`:

### Headings (Semi Bold 600)
- `.text-heading-1` through `.text-heading-7` (48px → 16px)

### Sub Headings (Medium 500)
- `.text-subheading-1` through `.text-subheading-7` (48px → 16px)

### Body (Regular 400)
- `.text-body-xxl` through `.text-body-xxs` (24px → 10px)

### Utility
- `.text-button-m` (16px, Medium)
- `.text-button` (14px, Medium)
- `.text-label` (14px, Regular, 20px line-height)
- `.text-helper` (16px, Regular)

## Component Fixes

### project-list.tsx
Replace 4 hardcoded hex colors with CSS variable-based Tailwind classes:
- `#3b82f6` → `bg-ds-primary-600` or `bg-[var(--chart-1)]`
- `#f59e0b` → Accoes Gold var
- `#22c55e` → `bg-tag-green`
- `#6b7280` → `bg-ds-neutral-600`

## Inferred Tokens (not in DS)

| Use Case | Solid | Light BG | Source |
|----------|-------|----------|--------|
| Warning/Caution | `#F54900` | `#FFF7ED` | tag-orange2 |
| Success/Positive | `#009966` | `#ECFDF5` | tag-green |
| Info/Neutral | `#1550FC` | `#EFF4FF` | tag-blue |
| Error/Danger | `#F02C36` | `#FBF3F2` | accent-critical + tag-red-light |

## Files Modified

1. `src/app/globals.css` — Primary changes (color tokens, dark theme, typography utilities)
2. `src/components/projects/project-list.tsx` — Fix hardcoded hex colors
3. Any components discovered with inline hex during implementation

## Not In Scope

- Tailwind config file creation (staying with @theme inline)
- TypeScript token export file
- Component redesign (only token/color swaps)
- Custom spacing overrides (Tailwind default 4px base is compatible)
