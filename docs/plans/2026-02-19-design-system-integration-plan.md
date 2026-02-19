# Design System Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace OKLCH color tokens with exact HEX values from the Accoes Design System, add full palette scales, tag colors, typography utilities, and fix hardcoded colors in components.

**Architecture:** CSS-only token migration in `globals.css`. The `@theme inline` block gets new palette tokens (prefixed `ds-`), the `:root` block swaps OKLCH→HEX, the `.dark` block gets derived dark HEX values, and `@layer utilities` gets typography classes. One component file (`project-list.tsx`) has hardcoded hex colors to fix.

**Tech Stack:** Tailwind CSS v4, CSS Custom Properties, Next.js 16, shadcn/ui

---

### Task 1: Replace `:root` light theme tokens with DS HEX values

**Files:**
- Modify: `src/app/globals.css:66-132`

**Step 1: Replace the entire `:root` block**

Replace lines 66-132 of `src/app/globals.css` with:

```css
:root {
  --radius: 0.625rem;

  /* Background & Foreground — from DS neutral + bg palette */
  --background: #F9FAFB;
  --foreground: #333333;
  --card: #FFFFFF;
  --card-foreground: #333333;
  --popover: #FFFFFF;
  --popover-foreground: #333333;
  --muted: #F0F0F0;
  --muted-foreground: #787878;
  --border: #D8D8D8;
  --input: #D8D8D8;
  --ring: #00529B;

  /* Primary: DS primary-800 */
  --primary: #00529B;
  --primary-foreground: #FFFFFF;

  /* Secondary */
  --secondary: #F0F0F0;
  --secondary-foreground: #333333;

  /* Accent: Accoes Gold (kept — not in DS) */
  --accent: #e1a41d;
  --accent-foreground: #3D3000;

  /* Destructive: DS accent-critical */
  --destructive: #F02C36;

  /* Charts — DS palette */
  --chart-1: #00529B;
  --chart-2: #e1a41d;
  --chart-3: #009966;
  --chart-4: #8B5CF6;
  --chart-5: #F54900;

  /* Top Navigation: DS primary-900 */
  --nav: #003075;
  --nav-foreground: #F0F0F0;
  --nav-accent: #1A7FD4;
  --nav-gold: #e1a41d;

  /* Sidebar (shadcn compat) — DS bg + neutral */
  --sidebar: #F9FAFB;
  --sidebar-foreground: #4A4A4A;
  --sidebar-primary: #00529B;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #EFF4FF;
  --sidebar-accent-foreground: #333333;
  --sidebar-border: #D8D8D8;
  --sidebar-ring: #909090;

  /* Validation Status — DS tag colors */
  --status-pre-approved: #009966;
  --status-pre-approved-bg: #ECFDF5;
  --status-review-required: #F54900;
  --status-review-required-bg: #FFF7ED;
  --status-action-mandatory: #E70008;
  --status-action-mandatory-bg: #FBF3F2;

  /* Confidence — same as status */
  --confidence-high: #009966;
  --confidence-medium: #F54900;
  --confidence-low: #E70008;
}
```

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: Replace :root OKLCH tokens with DS HEX values"
```

---

### Task 2: Replace `.dark` theme tokens with derived HEX values

**Files:**
- Modify: `src/app/globals.css:134-176`

**Step 1: Replace the entire `.dark` block**

Replace lines 134-176 of `src/app/globals.css` with:

```css
.dark {
  /* Dark theme — derived from DS HEX, WCAG AA compliant */
  --background: #1a1f2e;
  --foreground: #F0F0F0;
  --card: #222838;
  --card-foreground: #F0F0F0;
  --popover: #222838;
  --popover-foreground: #F0F0F0;
  --muted: #2a3040;
  --muted-foreground: #A8A8A8;
  --border: #3a4050;
  --input: #3a4050;
  --ring: #309AE8;
  --primary: #309AE8;
  --primary-foreground: #0a0f1a;
  --secondary: #2a3040;
  --secondary-foreground: #F0F0F0;
  --accent: #e1a41d;
  --accent-foreground: #1a1200;
  --destructive: #F02C36;
  --nav: #0f1520;
  --nav-foreground: #D8D8D8;
  --nav-accent: #309AE8;
  --nav-gold: #e1a41d;
  --chart-1: #309AE8;
  --chart-2: #e1a41d;
  --chart-3: #009966;
  --chart-4: #8B5CF6;
  --chart-5: #F54900;
  --sidebar: #1a1f2e;
  --sidebar-foreground: #D8D8D8;
  --sidebar-primary: #309AE8;
  --sidebar-primary-foreground: #0a0f1a;
  --sidebar-accent: #2a3040;
  --sidebar-accent-foreground: #F0F0F0;
  --sidebar-border: #3a4050;
  --sidebar-ring: #787878;

  /* Dark mode status background variants */
  --status-pre-approved-bg: #1a3029;
  --status-review-required-bg: #2e2118;
  --status-action-mandatory-bg: #2e1a1a;
}
```

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: Replace .dark OKLCH tokens with derived DS HEX values"
```

---

### Task 3: Add DS palette tokens to `@theme inline` block

**Files:**
- Modify: `src/app/globals.css:7-64`

**Step 1: Add new palette tokens inside the `@theme inline` block**

After the existing `--color-nav-gold` line (line 63), add the following before the closing `}`:

```css

  /* ============================================
     DS Full Palette — Primary Blue
     ============================================ */
  --color-ds-primary-900: #003075;
  --color-ds-primary-800: #00529B;
  --color-ds-primary-700: #006288;
  --color-ds-primary-600: #1A7FD4;
  --color-ds-primary-500: #309AE8;
  --color-ds-primary-400: #6084F2;
  --color-ds-primary-300: #9ACE87;
  --color-ds-primary-200: #C2E2FB;
  --color-ds-primary-100: #E6F3FD;

  /* ============================================
     DS Full Palette — Secondary Green
     ============================================ */
  --color-ds-secondary-900: #3D4F2E;
  --color-ds-secondary-800: #536640;
  --color-ds-secondary-700: #6A8753;
  --color-ds-secondary-600: #87A48A;
  --color-ds-secondary-500: #9DB882;
  --color-ds-secondary-400: #B4CC9E;
  --color-ds-secondary-300: #CADCBA;
  --color-ds-secondary-200: #DFEDD5;
  --color-ds-secondary-100: #F2F8EE;

  /* ============================================
     DS Full Palette — Neutral Gray
     ============================================ */
  --color-ds-neutral-900: #333333;
  --color-ds-neutral-800: #4A4A4A;
  --color-ds-neutral-700: #616161;
  --color-ds-neutral-600: #787878;
  --color-ds-neutral-500: #909090;
  --color-ds-neutral-400: #A8A8A8;
  --color-ds-neutral-300: #C0C0C0;
  --color-ds-neutral-200: #D8D8D8;
  --color-ds-neutral-100: #F0F0F0;

  /* ============================================
     DS Tag Colors — Solid + Light pairs
     ============================================ */
  --color-tag-blue: #1550FC;
  --color-tag-blue-light: #EFF4FF;
  --color-tag-green: #009966;
  --color-tag-green-light: #ECFDF5;
  --color-tag-red: #E70008;
  --color-tag-red-light: #FBF3F2;
  --color-tag-orange: #F9FE0B;
  --color-tag-orange-light: #FBF3C7;
  --color-tag-orange2: #F54900;
  --color-tag-orange2-light: #FFF7ED;
  --color-tag-purple: #8B5CF6;
  --color-tag-purple-light: #EDE9FE;
  --color-tag-brown: #78350F;
  --color-tag-brown-light: #FEF3C7;
  --color-tag-black: #1F2937;
  --color-tag-black-light: #E5E7EB;

  /* ============================================
     DS Accent & Background
     ============================================ */
  --color-ds-accent-critical: #F02C36;
  --color-ds-accent-special: #FFFBE8;
  --color-ds-bg-gray: #F3F4F6;
  --color-ds-bg-blue-light: #EFF4FF;
  --color-ds-bg-gray-light: #F9FAFB;
```

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds. New Tailwind classes like `bg-ds-primary-800`, `text-tag-green`, `bg-ds-bg-gray` are now available.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: Add DS full palette tokens (primary, secondary, neutral, tags, accents)"
```

---

### Task 4: Update gradient/glass utilities from OKLCH to HEX

**Files:**
- Modify: `src/app/globals.css:200-265` (the `@layer utilities` gradients and glass effects)

**Step 1: Replace OKLCH values in utility classes**

Replace the gradient and glass section (lines 200-265) with:

```css
  /* ---- Glass Effects ---- */
  .glass {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .dark .glass {
    background: rgba(26, 31, 46, 0.80);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.70);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  .dark .glass-card {
    background: rgba(34, 40, 56, 0.60);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  /* ---- Gradient Border ---- */
  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(0, 82, 155, 0.30), rgba(225, 164, 29, 0.30));
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* ---- Gradients ---- */
  .gradient-accent {
    background: linear-gradient(135deg, #00529B, #003075);
  }
  .gradient-gold {
    background: linear-gradient(135deg, #e1a41d, #c48a14);
  }
  .gradient-hero {
    background: linear-gradient(135deg, #003075 0%, #00529B 50%, #002060 100%);
  }
  .gradient-page {
    background: linear-gradient(180deg, #EFF4FF 0%, #F9FAFB 100%);
  }
  .text-gradient {
    background: linear-gradient(135deg, #00529B, #1A7FD4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .text-gradient-gold {
    background: linear-gradient(135deg, #e1a41d, #c48a14);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
```

Also update the shadow utilities (lines 267-291) to replace OKLCH:

```css
  /* ---- Shadows ---- */
  .shadow-glow {
    box-shadow: 0 0 24px rgba(0, 82, 155, 0.18);
  }
  .dark .shadow-glow {
    box-shadow: 0 0 32px rgba(48, 154, 232, 0.25);
  }
  .shadow-gold {
    box-shadow: 0 0 20px rgba(225, 164, 29, 0.15);
  }
  .dark .shadow-gold {
    box-shadow: 0 0 28px rgba(225, 164, 29, 0.22);
  }
  .shadow-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
  }
  .dark .shadow-card {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.30), 0 8px 24px rgba(0, 0, 0, 0.20);
  }
  .shadow-card-hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 32px rgba(0, 0, 0, 0.06);
  }
  .dark .shadow-card-hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), 0 24px 48px rgba(0, 0, 0, 0.25);
  }
```

And update the dot-pattern (line 302-304):

```css
  .dot-pattern {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
```

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: Replace OKLCH values in gradient/glass/shadow utilities with HEX/rgba"
```

---

### Task 5: Add typography utility classes

**Files:**
- Modify: `src/app/globals.css` — append inside `@layer utilities` block before the closing `}`

**Step 1: Add typography classes**

Add the following before the closing `}` of `@layer utilities` (before line 321):

```css

  /* ============================================
     DS Typography Utilities
     ============================================ */

  /* Headings — Semi Bold 600 */
  .text-heading-1 { font-size: 48px; font-weight: 600; line-height: normal; }
  .text-heading-2 { font-size: 40px; font-weight: 600; line-height: normal; }
  .text-heading-3 { font-size: 32px; font-weight: 600; line-height: normal; }
  .text-heading-4 { font-size: 24px; font-weight: 600; line-height: normal; }
  .text-heading-5 { font-size: 20px; font-weight: 600; line-height: normal; }
  .text-heading-6 { font-size: 18px; font-weight: 600; line-height: normal; }
  .text-heading-7 { font-size: 16px; font-weight: 600; line-height: normal; }

  /* Sub Headings — Medium 500 */
  .text-subheading-1 { font-size: 48px; font-weight: 500; line-height: normal; }
  .text-subheading-2 { font-size: 40px; font-weight: 500; line-height: normal; }
  .text-subheading-3 { font-size: 32px; font-weight: 500; line-height: normal; }
  .text-subheading-4 { font-size: 24px; font-weight: 500; line-height: normal; }
  .text-subheading-5 { font-size: 20px; font-weight: 500; line-height: normal; }
  .text-subheading-6 { font-size: 18px; font-weight: 500; line-height: normal; }
  .text-subheading-7 { font-size: 16px; font-weight: 500; line-height: normal; }

  /* Body — Regular 400 */
  .text-body-xxl { font-size: 24px; font-weight: 400; line-height: normal; }
  .text-body-xl  { font-size: 20px; font-weight: 400; line-height: normal; }
  .text-body-l   { font-size: 18px; font-weight: 400; line-height: normal; }
  .text-body-m   { font-size: 16px; font-weight: 400; line-height: normal; }
  .text-body-s   { font-size: 14px; font-weight: 400; line-height: normal; }
  .text-body-xs  { font-size: 12px; font-weight: 400; line-height: normal; }
  .text-body-xxs { font-size: 10px; font-weight: 400; line-height: normal; }

  /* Utility */
  .text-button-m { font-size: 16px; font-weight: 500; line-height: normal; }
  .text-button   { font-size: 14px; font-weight: 500; line-height: normal; }
  .text-label    { font-size: 14px; font-weight: 400; line-height: 20px; }
  .text-helper   { font-size: 16px; font-weight: 400; line-height: normal; }
```

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: Add DS typography utility classes (headings, subheadings, body, utility)"
```

---

### Task 6: Fix hardcoded hex colors in project-list.tsx

**Files:**
- Modify: `src/components/projects/project-list.tsx` — lines 237, 246, 255, 264, 271, 275, 279, 283

**Step 1: Replace all 8 hardcoded hex colors**

These are inline `style={{ backgroundColor: "#..." }}` for the hero stacked bar chart and legend dots.

Replace all occurrences:
- `"#3b82f6"` → `"var(--chart-1)"` (Active → DS primary-800 blue)
- `"#f59e0b"` → `"var(--nav-gold)"` (In Progress → Accoes Gold)
- `"#22c55e"` → `"var(--status-pre-approved)"` (Completed → DS tag-green)
- `"#6b7280"` → `"var(--ds-neutral-600, #787878)"` (On Hold → DS neutral-600)

Each color appears twice (once for the bar segment, once for the legend dot) = 8 replacements total.

**Step 2: Verify the build compiles**

Run: `npm run build` from `accoes-submittal-ai/`
Expected: Build succeeds with no errors

**Step 3: Visual check**

Run: `npm run dev` and navigate to `/projects`
Expected: The pipeline bar and legend should display the updated DS colors (blue, gold, green, gray).

**Step 4: Commit**

```bash
git add src/components/projects/project-list.tsx
git commit -m "fix: Replace hardcoded hex colors with DS CSS variables in project-list hero"
```

---

### Task 7: Final build verification + deploy

**Files:**
- No file changes — verification only

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Run production build**

Run: `npm run build`
Expected: All pages compile successfully

**Step 3: Commit all changes and push**

```bash
git push origin main
```

**Step 4: Deploy to Vercel**

Run: `npx vercel --prod --yes`
Expected: Deployment succeeds at `accoes-submittal-ai.vercel.app`

---

## Task Summary

| Task | Description | Files | Est. Time |
|------|-------------|-------|-----------|
| 1 | Replace `:root` OKLCH → DS HEX | globals.css | 3 min |
| 2 | Replace `.dark` OKLCH → derived HEX | globals.css | 3 min |
| 3 | Add DS palette tokens to @theme | globals.css | 3 min |
| 4 | Update gradient/glass/shadow utilities | globals.css | 5 min |
| 5 | Add typography utility classes | globals.css | 3 min |
| 6 | Fix hardcoded hex in project-list | project-list.tsx | 3 min |
| 7 | Final build + deploy | — | 5 min |

**Total:** ~25 minutes
