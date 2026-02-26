# Project Information Fields — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 7 missing project metadata fields (Project Manager, Owner, Architect, Engineer, Revised Date, Revision #, Customer ID) to the data model, create form, and detail sheet — plus make Location mandatory.

**Architecture:** Extend the `Project` interface with optional string fields. The create form gets a new Project Manager dropdown+override in the mandatory section, plus a collapsible "Additional Details" section for optional fields. The detail sheet gets matching view/edit support.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui (Input, Select, Collapsible)

---

### Task 1: Extend Project Type Interface

**Files:**
- Modify: `src/data/types.ts:67-84`

**Step 1: Add new fields to Project interface**

Add these fields after line 83 (`projectType: ProjectType;`), before the closing `}`:

```typescript
  // Project stakeholders
  projectManager: string;          // User ID or "__custom__" for external PM
  projectManagerCustom?: string;   // Custom name when projectManager === "__custom__"
  owner?: string;                  // Building/project owner name
  ownerCompany?: string;           // Owner's company/organization
  architect?: string;              // Architect name
  architectCompany?: string;       // Architect's firm
  engineer?: string;               // Engineer name
  engineerCompany?: string;        // Engineer's firm
  // Additional metadata
  revisedDate?: string;            // ISO date string
  revisionNumber?: string;         // e.g. "3", "Rev A"
  customerId?: string;             // Manual entry customer reference ID
```

**Step 2: Verify no type errors**

Run: `cd "accoes-submittal-ai" && npx tsc --noEmit 2>&1 | head -30`
Expected: Type errors in `mock-projects.ts` — missing `projectManager` field (expected, fixed in Task 2)

**Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat: add project stakeholder and metadata fields to Project interface"
```

---

### Task 2: Update Mock Projects Data

**Files:**
- Modify: `src/data/mock-projects.ts` (all 10 entries)

**Step 1: Add `projectManager` + optional fields to every mock project entry**

For each project, add after the `projectType` field. Use `"user-1"` (Sarah Mitchell) as PM for most projects. Add realistic sample data for some projects' optional fields, leave others undefined:

```typescript
// proj-1 (Mayo Clinic) — fully populated example:
    projectType: "dr",
    projectManager: "user-1",
    owner: "Mayo Clinic Foundation",
    ownerCompany: "Mayo Clinic",
    architect: "Robert A. Stern",
    architectCompany: "RAMSA Architects",
    engineer: "Michael Torres",
    engineerCompany: "Arup Engineering",
    revisedDate: "2026-02-20",
    revisionNumber: "3",
    customerId: "MC-2026-0059",

// proj-2 (UCD) — partial data:
    projectType: "design_job",
    projectManager: "user-1",
    owner: "UC Davis Facilities",
    ownerCompany: "University of California Davis",
    architect: "Jennifer Walsh",
    architectCompany: "Flad Architects",
    engineer: "David Liu",
    engineerCompany: "WSP Global",

// proj-new (SFO) — minimal, new project:
    projectType: "design_job",
    projectManager: "user-1",

// proj-3 (NET):
    projectType: "dr",
    projectManager: "user-2",
    owner: "National Engineering & Technology",
    architect: "Lisa Park",
    architectCompany: "ZGF Architects",

// proj-4 (KPMG):
    projectType: "design_job",
    projectManager: "user-1",
    owner: "KPMG LLP",
    ownerCompany: "KPMG International",

// proj-5 (PSL):
    projectType: "dr",
    projectManager: "user-4",
    engineer: "Thomas Reed",
    engineerCompany: "Jacobs Engineering",

// proj-6 (DCJC):
    projectType: "design_job",
    projectManager: "user-2",
    owner: "DC Government",
    ownerCompany: "DC Joint Commission",
    architect: "Elena Rodriguez",
    architectCompany: "Perkins&Will",
    engineer: "Marcus Thompson",
    engineerCompany: "HDR Inc.",
    revisedDate: "2026-02-18",
    revisionNumber: "2",

// proj-7 (IEUA):
    projectType: "dr",
    projectManager: "user-1",
    owner: "Inland Empire Utilities Agency",
    engineer: "Sandra Kim",
    engineerCompany: "Black & Veatch",
    customerId: "IEUA-PR-2294",

// proj-8 (PF):
    projectType: "design_job",
    projectManager: "user-3",
    owner: "Pacific Foundations Inc.",
    architect: "Andrew Chen",
    architectCompany: "SOM",
    revisedDate: "2026-02-15",
    revisionNumber: "1",

// proj-9 (Test Project):
    projectType: "dr",
    projectManager: "user-1",
```

**Step 2: Build check**

Run: `npx tsc --noEmit`
Expected: Clean — no errors

**Step 3: Commit**

```bash
git add src/data/mock-projects.ts
git commit -m "feat: populate mock projects with stakeholder and metadata fields"
```

---

### Task 3: Add Project Manager + Location Mandatory to Create Form

**Files:**
- Modify: `src/components/projects/create-job-form.tsx`

**Step 1: Add new imports**

Add `ChevronDown` and `User` to the lucide-react imports:
```typescript
import {
  Upload, X, UserPlus, Briefcase, MapPin, Calendar, Hash, Users, Building2, Layers,
  ChevronDown, User,
} from "lucide-react";
```

**Step 2: Add new state variables**

After `const [projectType, setProjectType] = useState<ProjectType>("dr");` (line 226), add:

```typescript
  const [projectManager, setProjectManager] = useState("");
  const [projectManagerCustom, setProjectManagerCustom] = useState("");
```

**Step 3: Make Location mandatory + add PM to validation**

Update the `canCreate` derived value (line 252-256) to:

```typescript
  const canCreate =
    files.length > 0 &&
    jobId.trim() !== "" &&
    projectName.trim() !== "" &&
    companyClient.trim() !== "" &&
    location.trim() !== "" &&
    (projectManager !== "" && (projectManager !== "__custom__" || projectManagerCustom.trim() !== ""));
```

**Step 4: Add mandatory asterisk to Location label**

Change the Location label from `Location` to:
```tsx
Location <span className="text-destructive">*</span>
```
Also add `aria-required="true"` to the Location input.

**Step 5: Add Project Manager field to Row 3 (before Priority)**

After the Project Type field (ends around line 672), add a new field in the existing Row 3. Move Project Type to Row 2 col 3 (replacing the Location position), and create Row 3 with PM + Priority. Or simpler: just add PM as the second item in Row 3 after Project Type:

Replace the current Row 3 section (the Project Type select, lines 651-673) and extend the grid. The Row 3 should become:

```tsx
          {/* Row 3 */}
          <div className="space-y-2">
            <label
              htmlFor="project-type"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Layers className="h-3 w-3" aria-hidden="true" />
              Project Type <span className="text-destructive">*</span>
            </label>
            <Select
              value={projectType}
              onValueChange={(v) => setProjectType(v as ProjectType)}
            >
              <SelectTrigger id="project-type" className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr">Discrepancy Report</SelectItem>
                <SelectItem value="design_job">Design Job</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-manager"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <User className="h-3 w-3" aria-hidden="true" />
              Project Manager <span className="text-destructive">*</span>
            </label>
            <Select
              value={projectManager}
              onValueChange={(v) => {
                setProjectManager(v);
                if (v !== "__custom__") setProjectManagerCustom("");
              }}
            >
              <SelectTrigger id="project-manager" className="h-10 w-full">
                <SelectValue placeholder="Select project manager" />
              </SelectTrigger>
              <SelectContent>
                {mockUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">Custom (External PM)</SelectItem>
              </SelectContent>
            </Select>
            {projectManager === "__custom__" && (
              <Input
                placeholder="Enter PM name"
                value={projectManagerCustom}
                onChange={(e) => setProjectManagerCustom(e.target.value)}
                className="h-10 mt-2"
                aria-label="Custom project manager name"
                aria-required="true"
              />
            )}
          </div>
```

**Step 6: Build check**

Run: `npx tsc --noEmit && npm run build 2>&1 | tail -5`
Expected: Clean

**Step 7: Commit**

```bash
git add "src/components/projects/create-job-form.tsx"
git commit -m "feat: add Project Manager dropdown + make Location mandatory in create form"
```

---

### Task 4: Add Collapsible "Additional Details" Section to Create Form

**Files:**
- Modify: `src/components/projects/create-job-form.tsx`

**Step 1: Add state for optional fields and collapsible toggle**

After the `projectManagerCustom` state, add:

```typescript
  // Additional details (optional)
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [ownerCompany, setOwnerCompany] = useState("");
  const [architect, setArchitect] = useState("");
  const [architectCompany, setArchitectCompany] = useState("");
  const [engineer, setEngineer] = useState("");
  const [engineerCompany, setEngineerCompany] = useState("");
  const [revisedDate, setRevisedDate] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
```

**Step 2: Add collapsible "Additional Details" section**

After the closing `</div>` of the 3-column grid (after all mandatory fields), but still inside the `<SectionCard>` for "Project Information", add:

```tsx
        {/* Collapsible Additional Details */}
        <div className="mt-5 border-t pt-4">
          <button
            type="button"
            className="flex items-center gap-2 w-full text-left group"
            onClick={() => setAdditionalOpen(!additionalOpen)}
            aria-expanded={additionalOpen}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                !additionalOpen && "-rotate-90"
              )}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              Additional Details
            </span>
            <span className="text-[10px] text-muted-foreground">
              (Optional)
            </span>
          </button>

          {additionalOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-5 mt-4 animate-accordion-down">
              {/* Owner — stacked name + company */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  Owner
                </label>
                <Input
                  placeholder="Owner name"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Company / Organization"
                  value={ownerCompany}
                  onChange={(e) => setOwnerCompany(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Architect — stacked name + firm */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  Architect
                </label>
                <Input
                  placeholder="Architect name"
                  value={architect}
                  onChange={(e) => setArchitect(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Firm name"
                  value={architectCompany}
                  onChange={(e) => setArchitectCompany(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Engineer — stacked name + firm */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  Engineer
                </label>
                <Input
                  placeholder="Engineer name"
                  value={engineer}
                  onChange={(e) => setEngineer(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Firm name"
                  value={engineerCompany}
                  onChange={(e) => setEngineerCompany(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {/* Revised Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  Revised Date
                </label>
                <Input
                  type="date"
                  value={revisedDate}
                  onChange={(e) => setRevisedDate(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Revision # */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="h-3 w-3" aria-hidden="true" />
                  Revision #
                </label>
                <Input
                  placeholder="e.g. 3 or Rev A"
                  value={revisionNumber}
                  onChange={(e) => setRevisionNumber(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Customer ID */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="h-3 w-3" aria-hidden="true" />
                  Customer ID
                </label>
                <Input
                  placeholder="Manual entry"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          )}
        </div>
```

**Step 3: Build check**

Run: `npx tsc --noEmit && npm run build 2>&1 | tail -5`
Expected: Clean

**Step 4: Commit**

```bash
git add "src/components/projects/create-job-form.tsx"
git commit -m "feat: add collapsible Additional Details section with Owner, Architect, Engineer, dates, Customer ID"
```

---

### Task 5: Update Project Detail Sheet — View Mode

**Files:**
- Modify: `src/components/projects/project-detail-sheet.tsx`

**Step 1: Add new icon imports**

Add `User` and `Hash` to the existing lucide-react import block.

**Step 2: Add new fields to the view mode info grid**

In the "Project Information" view section (lines 639-690), expand the `grid grid-cols-2` to show the new fields. After the existing fields (Job ID, Location, Created, Members, Confidence), add:

```tsx
                    {/* Project Manager */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        PM:{" "}
                        {project.projectManager === "__custom__"
                          ? project.projectManagerCustom ?? "—"
                          : mockUsers.find((u) => u.id === project.projectManager)?.name ?? "—"}
                      </span>
                    </div>
                    {/* Owner */}
                    {project.owner && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">
                          Owner: {project.owner}
                          {project.ownerCompany && ` (${project.ownerCompany})`}
                        </span>
                      </div>
                    )}
                    {/* Architect */}
                    {project.architect && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">
                          Architect: {project.architect}
                          {project.architectCompany && ` (${project.architectCompany})`}
                        </span>
                      </div>
                    )}
                    {/* Engineer */}
                    {project.engineer && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="truncate">
                          Engineer: {project.engineer}
                          {project.engineerCompany && ` (${project.engineerCompany})`}
                        </span>
                      </div>
                    )}
                    {/* Revised Date + Revision # */}
                    {(project.revisedDate || project.revisionNumber) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {project.revisedDate
                            ? `Revised ${new Date(project.revisedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}`
                            : ""}
                          {project.revisionNumber ? ` (Rev ${project.revisionNumber})` : ""}
                        </span>
                      </div>
                    )}
                    {/* Customer ID */}
                    {project.customerId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-3.5 w-3.5" />
                        <span>Customer: {project.customerId}</span>
                      </div>
                    )}
```

**Step 3: Neutralize the confidence color in view mode**

Also, replace the tiered confidence color logic (lines 672-688) with the neutral style we applied to cards:

```tsx
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-bold text-foreground">
                        {project.confidenceSummary.overallConfidence > 0
                          ? `${project.confidenceSummary.overallConfidence}% confidence`
                          : "Pending"}
                      </span>
                    </div>
```

**Step 4: Build check**

Run: `npx tsc --noEmit && npm run build 2>&1 | tail -5`
Expected: Clean

**Step 5: Commit**

```bash
git add "src/components/projects/project-detail-sheet.tsx"
git commit -m "feat: add stakeholder fields to project detail view + neutralize confidence color"
```

---

### Task 6: Update Project Detail Sheet — Edit Mode

**Files:**
- Modify: `src/components/projects/project-detail-sheet.tsx`

**Step 1: Add edit state for new fields**

After the existing `editStatus` state (line 416), add:

```typescript
  const [editProjectManager, setEditProjectManager] = useState("");
  const [editProjectManagerCustom, setEditProjectManagerCustom] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editOwnerCompany, setEditOwnerCompany] = useState("");
  const [editArchitect, setEditArchitect] = useState("");
  const [editArchitectCompany, setEditArchitectCompany] = useState("");
  const [editEngineer, setEditEngineer] = useState("");
  const [editEngineerCompany, setEditEngineerCompany] = useState("");
  const [editRevisedDate, setEditRevisedDate] = useState("");
  const [editRevisionNumber, setEditRevisionNumber] = useState("");
  const [editCustomerId, setEditCustomerId] = useState("");
```

**Step 2: Populate on startEdit**

Extend the `startEdit` function to also set:

```typescript
    setEditProjectManager(project.projectManager);
    setEditProjectManagerCustom(project.projectManagerCustom ?? "");
    setEditOwner(project.owner ?? "");
    setEditOwnerCompany(project.ownerCompany ?? "");
    setEditArchitect(project.architect ?? "");
    setEditArchitectCompany(project.architectCompany ?? "");
    setEditEngineer(project.engineer ?? "");
    setEditEngineerCompany(project.engineerCompany ?? "");
    setEditRevisedDate(project.revisedDate ?? "");
    setEditRevisionNumber(project.revisionNumber ?? "");
    setEditCustomerId(project.customerId ?? "");
```

**Step 3: Add edit form fields**

In the editing block (lines 558-637), after the Status select and before the Save/Cancel buttons, add:

```tsx
                    {/* Project Manager */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Project Manager
                      </label>
                      <Select
                        value={editProjectManager}
                        onValueChange={(v) => {
                          setEditProjectManager(v);
                          if (v !== "__custom__") setEditProjectManagerCustom("");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select PM" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUsers.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="__custom__">Custom (External PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      {editProjectManager === "__custom__" && (
                        <Input
                          placeholder="Enter PM name"
                          value={editProjectManagerCustom}
                          onChange={(e) => setEditProjectManagerCustom(e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>
                    {/* Stakeholder contacts — 2-col grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Owner</label>
                        <Input value={editOwner} onChange={(e) => setEditOwner(e.target.value)} placeholder="Owner name" />
                        <Input value={editOwnerCompany} onChange={(e) => setEditOwnerCompany(e.target.value)} placeholder="Company" className="text-xs h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Architect</label>
                        <Input value={editArchitect} onChange={(e) => setEditArchitect(e.target.value)} placeholder="Architect name" />
                        <Input value={editArchitectCompany} onChange={(e) => setEditArchitectCompany(e.target.value)} placeholder="Firm" className="text-xs h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Engineer</label>
                        <Input value={editEngineer} onChange={(e) => setEditEngineer(e.target.value)} placeholder="Engineer name" />
                        <Input value={editEngineerCompany} onChange={(e) => setEditEngineerCompany(e.target.value)} placeholder="Firm" className="text-xs h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Customer ID</label>
                        <Input value={editCustomerId} onChange={(e) => setEditCustomerId(e.target.value)} placeholder="Manual entry" />
                      </div>
                    </div>
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Revised Date</label>
                        <Input type="date" value={editRevisedDate} onChange={(e) => setEditRevisedDate(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Revision #</label>
                        <Input value={editRevisionNumber} onChange={(e) => setEditRevisionNumber(e.target.value)} placeholder="e.g. 3" />
                      </div>
                    </div>
```

**Step 4: Build check**

Run: `npx tsc --noEmit && npm run build 2>&1 | tail -5`
Expected: Clean

**Step 5: Commit**

```bash
git add "src/components/projects/project-detail-sheet.tsx"
git commit -m "feat: add stakeholder field editing to project detail sheet edit mode"
```

---

### Task 7: Final Build Verification + Deploy

**Step 1: Full build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean, all routes compile

**Step 2: Push to production**

```bash
git push origin main
```

**Step 3: Verify deployment**

Check the live URL to confirm:
- Create form shows new PM field + collapsible Additional Details
- Project detail sheet shows stakeholder fields in view mode
- Edit mode includes all new fields
