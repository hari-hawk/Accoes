# Multi-Select Category Filters + Sorting — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert Index Category and System Category filters from single-select dropdowns to multi-select Popover+Checkbox pattern, and add an inline sort control to the conformance page material list.

**Architecture:** Three files changed. The hook (`use-materials.ts`) owns all filter/sort state. The UI component (`material-list.tsx`) renders the Popover+Checkbox pattern (already proven by the Status filter) and the sort button. The review page wires them together. No new files, no new dependencies.

**Tech Stack:** Next.js 16 + React 19, Tailwind v4, shadcn/ui, TypeScript

---

### Task 1: Convert Hook State from String to Set + Add Sort

**Files:**
- Modify: `src/hooks/use-materials.ts`

**Step 1: Change filter state types**

Replace lines 25-26:
```typescript
// OLD:
const [indexCategoryFilter, setIndexCategoryFilter] = useState<string>("all");
const [systemCategoryFilter, setSystemCategoryFilter] = useState<string>("all");

// NEW:
const [indexCategoryFilter, setIndexCategoryFilter] = useState<Set<string>>(new Set());
const [systemCategoryFilter, setSystemCategoryFilter] = useState<Set<string>>(new Set());
const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "index-category">("name-asc");
```

**Step 2: Update filtering logic**

Replace lines 63-73 (the two category filter blocks) with:
```typescript
if (indexCategoryFilter.size > 0) {
  result = result.filter(
    (m) => m.document.indexCategory != null && indexCategoryFilter.has(m.document.indexCategory)
  );
}

if (systemCategoryFilter.size > 0) {
  result = result.filter(
    (m) => m.document.systemCategory != null && systemCategoryFilter.has(m.document.systemCategory)
  );
}
```

**Step 3: Add sort logic after filtering**

Before `return result;` (currently line 75), add:
```typescript
// Sort
result = [...result];
switch (sortBy) {
  case "name-asc":
    result.sort((a, b) => a.document.fileName.localeCompare(b.document.fileName));
    break;
  case "name-desc":
    result.sort((a, b) => b.document.fileName.localeCompare(a.document.fileName));
    break;
  case "index-category":
    result.sort((a, b) => {
      const catA = a.document.indexCategory ?? "";
      const catB = b.document.indexCategory ?? "";
      const catCmp = catA.localeCompare(catB);
      if (catCmp !== 0) return catCmp;
      return a.document.fileName.localeCompare(b.document.fileName);
    });
    break;
}
```

Update the `filteredMaterials` memo dependency array to include `sortBy`:
```typescript
}, [materials, search, statusFilter, decisions, indexCategoryFilter, systemCategoryFilter, sortBy]);
```

**Step 4: Add toggle/clear callbacks for the two category filters**

After the existing `clearStatusFilter` callback (~line 153), add:
```typescript
const toggleIndexCategoryFilter = useCallback((cat: string) => {
  setIndexCategoryFilter((prev) => {
    const next = new Set(prev);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    return next;
  });
}, []);

const clearIndexCategoryFilter = useCallback(() => setIndexCategoryFilter(new Set()), []);

const toggleSystemCategoryFilter = useCallback((sys: string) => {
  setSystemCategoryFilter((prev) => {
    const next = new Set(prev);
    if (next.has(sys)) next.delete(sys);
    else next.add(sys);
    return next;
  });
}, []);

const clearSystemCategoryFilter = useCallback(() => setSystemCategoryFilter(new Set()), []);
```

**Step 5: Update return object**

Replace the existing category filter returns:
```typescript
// OLD:
indexCategoryFilter,
setIndexCategoryFilter,
systemCategoryFilter,
setSystemCategoryFilter,

// NEW:
indexCategoryFilter,
toggleIndexCategoryFilter,
clearIndexCategoryFilter,
systemCategoryFilter,
toggleSystemCategoryFilter,
clearSystemCategoryFilter,
sortBy,
setSortBy,
```

**Step 6: Verify types**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit`
Expected: Errors in `material-list.tsx` and `review/page.tsx` (they still use old prop types). That's expected — fixed in Tasks 2 and 3.

**Step 7: Commit**

```bash
git add src/hooks/use-materials.ts
git commit -m "feat: convert category filters to Set<string>, add sort state"
```

---

### Task 2: Replace Category Dropdowns with Multi-Select Popovers + Add Sort Button

**Files:**
- Modify: `src/components/workspace/material-list.tsx`

**Step 1: Add `ArrowUpDown` to lucide imports**

Change the lucide import (line 4-11) to include `ArrowUpDown`:
```typescript
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  X,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
```

**Step 2: Update MaterialList props**

Replace the prop types for category filters (lines 249-252, 258-259):
```typescript
// OLD:
indexCategoryFilter: string;
systemCategoryFilter: string;
indexCategories: string[];
systemCategories: string[];
// ...
onIndexCategoryChange: (value: string) => void;
onSystemCategoryChange: (value: string) => void;

// NEW:
indexCategoryFilter: Set<string>;
systemCategoryFilter: Set<string>;
indexCategories: string[];
systemCategories: string[];
sortBy: "name-asc" | "name-desc" | "index-category";
onIndexCategoryToggle: (cat: string) => void;
onIndexCategoryClear: () => void;
onSystemCategoryToggle: (sys: string) => void;
onSystemCategoryClear: () => void;
onSortChange: (sort: "name-asc" | "name-desc" | "index-category") => void;
```

Update the destructuring accordingly. Remove `onIndexCategoryChange` and `onSystemCategoryChange` from the destructuring; add the new props.

**Step 3: Add popover state variables**

After `const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);` (line 261), add:
```typescript
const [indexCatPopoverOpen, setIndexCatPopoverOpen] = useState(false);
const [systemCatPopoverOpen, setSystemCatPopoverOpen] = useState(false);
const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
```

**Step 4: Compute combined active filter count**

Replace line 293:
```typescript
// OLD:
const activeFilterCount = statusFilter.size;

// NEW:
const activeStatusCount = statusFilter.size;
const activeIndexCatCount = indexCategoryFilter.size;
const activeSystemCatCount = systemCategoryFilter.size;
const totalActiveFilters = activeStatusCount + activeIndexCatCount + activeSystemCatCount;
```

**Step 5: Add sort button next to search (Row 1)**

Replace lines 299-305 (the SearchInput) with:
```tsx
{/* Row 1: Search + Sort */}
<div className="flex items-center gap-2">
  <SearchInput
    placeholder="Search materials..."
    value={search}
    onChange={onSearchChange}
    className="[&_input]:h-8 flex-1"
  />
  <Popover open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-8 w-8 shrink-0",
          sortBy !== "name-asc" && "border-primary/40 bg-primary/5"
        )}
        aria-label="Sort materials"
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-48 p-2" align="end">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted-foreground px-2 py-1">Sort by</span>
        <div className="h-px bg-border" />
        {([
          { key: "name-asc" as const, label: "Name A → Z" },
          { key: "name-desc" as const, label: "Name Z → A" },
          { key: "index-category" as const, label: "Index Category" },
        ]).map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={cn(
              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left",
              sortBy === opt.key ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
            )}
            onClick={() => { onSortChange(opt.key); setSortPopoverOpen(false); }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </PopoverContent>
  </Popover>
</div>
```

**Step 6: Replace Row 3 single-select dropdowns with Popover+Checkbox**

Replace lines 386-411 (the entire "Row 3: Category filter dropdowns" block) with:
```tsx
{/* Row 3: Category multi-select popovers */}
<div className="grid grid-cols-2 gap-2 [&>*]:min-w-0">
  {/* Index Category multi-select */}
  <Popover open={indexCatPopoverOpen} onOpenChange={setIndexCatPopoverOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 w-full text-xs justify-between font-normal px-3",
          activeIndexCatCount > 0 && "border-primary/40 bg-primary/5"
        )}
      >
        <span className="truncate">
          {activeIndexCatCount === 0
            ? "All Categories"
            : activeIndexCatCount === 1
              ? [...indexCategoryFilter][0]
              : `${activeIndexCatCount} Categories`}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 p-2" align="start">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-muted-foreground">Index Category</span>
          {activeIndexCatCount > 0 && (
            <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={onIndexCategoryClear}>
              Clear all
            </button>
          )}
        </div>
        <div className="h-px bg-border" />
        {indexCategories.map((cat) => {
          const isActive = indexCategoryFilter.has(cat);
          return (
            <label key={cat} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors", isActive ? "bg-primary/5" : "hover:bg-muted/50")}>
              <Checkbox checked={isActive} onCheckedChange={() => onIndexCategoryToggle(cat)} className="h-3.5 w-3.5" />
              <span className="text-xs font-medium flex-1 truncate">{cat}</span>
            </label>
          );
        })}
      </div>
    </PopoverContent>
  </Popover>

  {/* System Category multi-select */}
  <Popover open={systemCatPopoverOpen} onOpenChange={setSystemCatPopoverOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 w-full text-xs justify-between font-normal px-3",
          activeSystemCatCount > 0 && "border-primary/40 bg-primary/5"
        )}
      >
        <span className="truncate">
          {activeSystemCatCount === 0
            ? "All Systems"
            : activeSystemCatCount === 1
              ? [...systemCategoryFilter][0]
              : `${activeSystemCatCount} Systems`}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 p-2" align="start">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-muted-foreground">System</span>
          {activeSystemCatCount > 0 && (
            <button type="button" className="text-[11px] text-primary hover:underline font-medium" onClick={onSystemCategoryClear}>
              Clear all
            </button>
          )}
        </div>
        <div className="h-px bg-border" />
        {systemCategories.map((sys) => {
          const isActive = systemCategoryFilter.has(sys);
          return (
            <label key={sys} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors", isActive ? "bg-primary/5" : "hover:bg-muted/50")}>
              <Checkbox checked={isActive} onCheckedChange={() => onSystemCategoryToggle(sys)} className="h-3.5 w-3.5" />
              <span className="text-xs font-medium flex-1 truncate">{sys}</span>
            </label>
          );
        })}
      </div>
    </PopoverContent>
  </Popover>
</div>
```

**Step 7: Expand filter chips to include category chips**

Replace lines 413-444 (the filter chips block) with a version that shows ALL active filters (status + index category + system category):
```tsx
{/* Active filter chips — show when any filter is active */}
{totalActiveFilters > 0 && (
  <div className="flex items-center gap-1.5 flex-wrap">
    {/* Status chips */}
    {STATUS_OPTIONS.filter((s) => statusFilter.has(s.key)).map((opt) => (
      <span
        key={opt.key}
        className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", opt.bgColor, opt.color)}
      >
        {opt.label}
        <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onToggleStatusFilter(opt.key)} aria-label={`Remove ${opt.label} filter`}>
          <X className="h-2.5 w-2.5" />
        </button>
      </span>
    ))}
    {/* Index category chips */}
    {[...indexCategoryFilter].map((cat) => (
      <span key={`idx-${cat}`} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700">
        {cat}
        <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onIndexCategoryToggle(cat)} aria-label={`Remove ${cat} filter`}>
          <X className="h-2.5 w-2.5" />
        </button>
      </span>
    ))}
    {/* System category chips */}
    {[...systemCategoryFilter].map((sys) => (
      <span key={`sys-${sys}`} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600">
        {sys}
        <button type="button" className="hover:opacity-70 transition-opacity" onClick={() => onSystemCategoryToggle(sys)} aria-label={`Remove ${sys} filter`}>
          <X className="h-2.5 w-2.5" />
        </button>
      </span>
    ))}
    <button
      type="button"
      className="text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
      onClick={() => { onClearStatusFilter(); onIndexCategoryClear(); onSystemCategoryClear(); }}
    >
      Clear
    </button>
  </div>
)}
```

**Step 8: Remove unused Select imports**

Since `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` are still used by the Documents dropdown in Row 2, keep them. No import changes needed beyond adding `ArrowUpDown`.

**Step 9: Commit**

```bash
git add src/components/workspace/material-list.tsx
git commit -m "feat: multi-select category popovers and inline sort button"
```

---

### Task 3: Wire New Props in Review Page

**Files:**
- Modify: `src/app/(workspace)/projects/[projectId]/versions/[versionId]/review/page.tsx`

**Step 1: Update destructured values from useMaterials**

Replace lines 64-69:
```typescript
// OLD:
indexCategoryFilter,
setIndexCategoryFilter,
systemCategoryFilter,
setSystemCategoryFilter,
indexCategories,
systemCategories,

// NEW:
indexCategoryFilter,
toggleIndexCategoryFilter,
clearIndexCategoryFilter,
systemCategoryFilter,
toggleSystemCategoryFilter,
clearSystemCategoryFilter,
indexCategories,
systemCategories,
sortBy,
setSortBy,
```

**Step 2: Update MaterialList props**

Replace lines 195-206 (the category + callback props on `<MaterialList>`):
```tsx
// OLD:
indexCategoryFilter={indexCategoryFilter}
systemCategoryFilter={systemCategoryFilter}
indexCategories={indexCategories}
systemCategories={systemCategories}
onSelect={setSelectedId}
onToggleCheck={toggleCheck}
onSearchChange={setSearch}
onToggleStatusFilter={toggleStatusFilter}
onClearStatusFilter={clearStatusFilter}
onIndexCategoryChange={setIndexCategoryFilter}
onSystemCategoryChange={setSystemCategoryFilter}

// NEW:
indexCategoryFilter={indexCategoryFilter}
systemCategoryFilter={systemCategoryFilter}
indexCategories={indexCategories}
systemCategories={systemCategories}
sortBy={sortBy}
onSelect={setSelectedId}
onToggleCheck={toggleCheck}
onSearchChange={setSearch}
onToggleStatusFilter={toggleStatusFilter}
onClearStatusFilter={clearStatusFilter}
onIndexCategoryToggle={toggleIndexCategoryFilter}
onIndexCategoryClear={clearIndexCategoryFilter}
onSystemCategoryToggle={toggleSystemCategoryFilter}
onSystemCategoryClear={clearSystemCategoryFilter}
onSortChange={setSortBy}
```

**Step 3: Build verification**

Run: `cd "accoes-submittal-ai" && npm run build`
Expected: Clean build, zero errors.

**Step 4: Commit**

```bash
git add "src/app/(workspace)/projects/[projectId]/versions/[versionId]/review/page.tsx"
git commit -m "feat: wire multi-select category filters and sort to review page"
```

---

## Execution Order

1. **Task 1** — Hook state changes (data layer)
2. **Task 2** — UI component changes (depends on Task 1 types)
3. **Task 3** — Review page wiring (depends on Tasks 1+2)

Tasks are sequential — each depends on the previous for type compatibility.

---

## Final Verification

After all tasks:
1. `npm run build` — clean production build
2. Visual verification in dev server:
   - Index Category filter opens Popover with checkboxes, multi-select works
   - System Category filter opens Popover with checkboxes, multi-select works
   - Selected categories appear as removable chips (blue for index, slate for system)
   - Sort button next to search opens dropdown with 3 options
   - Name A-Z, Z-A, and By Index Category sorting all work
   - "Clear" button clears ALL active filters (status + both categories)
3. Push to remote
