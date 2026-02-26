# Project Information Fields — Design Doc

**Date:** 2026-02-26
**Status:** Approved

## Problem

The project creation form and detail panel are missing fields that appear on real-world submittal cover sheets (see reference screenshots). Currently only 7 fields exist; the business requires 14+ fields to capture full project metadata.

## Gap Analysis

| Field | Exists? | Change Needed |
|-------|---------|---------------|
| Job ID (mandatory) | Yes | None |
| Project Name (mandatory) | Yes | None |
| Company/Client (mandatory) | Yes | None |
| Created Date (mandatory) | Yes | None |
| Location (mandatory) | Yes — but optional | Make mandatory |
| Priority (optional) | Yes | None |
| Project Type (mandatory) | Yes | None |
| Project Manager (mandatory) | **No** | Add — dropdown + manual override |
| Owner (optional) | **No** | Add — free-text + company field |
| Architect (optional) | **No** | Add — free-text + firm field |
| Engineer (optional) | **No** | Add — free-text + firm field |
| Revised Date (optional) | **No** | Add — date input |
| Revision # (optional) | **No** | Add — text input |
| Customer ID (optional) | **No** | Add — manual entry text input |

## Design Decisions

1. **Project Manager**: Dropdown selecting from system users (mockUsers) with a "Custom" option that reveals a free-text input for external PMs not in the system.
2. **Owner / Architect / Engineer**: Each gets a name input + optional company/firm input, stacked within a single grid cell. These are external contacts.
3. **Form layout**: Mandatory fields stay in the top 3-column grid. Non-mandatory fields go in a collapsible "Additional Details" section below.

## Data Model

New fields added to `Project` interface in `types.ts`:

```typescript
projectManager: string;           // User ID or "__custom__"
projectManagerCustom?: string;    // Custom name when PM is external
owner?: string;
ownerCompany?: string;
architect?: string;
architectCompany?: string;
engineer?: string;
engineerCompany?: string;
revisedDate?: string;             // ISO date
revisionNumber?: string;
customerId?: string;
```

## Create Job Form Layout

### Mandatory Section (3-column grid)
- Row 1: Job ID | Project Name | Company/Client
- Row 2: Created Date | Location | Project Type
- Row 3: Project Manager (dropdown + override) | Priority | (empty)

### Collapsible "Additional Details" Section (3-column grid)
- Row 1: Owner (name + company stacked) | Architect (name + firm stacked) | Engineer (name + firm stacked)
- Row 2: Revised Date | Revision # | Customer ID

## Project Detail Sheet

### View Mode
New rows in the 2-column info grid:
- Project Manager (name, with "PM" role indicator)
- Owner + company
- Architect + firm
- Engineer + firm
- Revised Date + Revision #
- Customer ID

### Edit Mode
Same field types as create form, populated from project data.

## Files to Modify

1. `src/data/types.ts` — Add fields to Project interface
2. `src/data/mock-projects.ts` — Add values to all mock entries
3. `src/components/projects/create-job-form.tsx` — PM in mandatory section, collapsible Additional Details
4. `src/components/projects/create-project-dialog.tsx` — Add fields to step 2
5. `src/components/projects/project-detail-sheet.tsx` — View + edit mode for new fields

## Validation

- Location changes from optional to mandatory in `canCreate` check
- Project Manager is mandatory (must select user or enter custom name)
- All other new fields are optional (no validation blocking)
