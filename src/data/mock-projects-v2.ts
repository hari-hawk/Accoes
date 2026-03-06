import { mockProjects } from "./mock-projects";
import { mockDocuments } from "./mock-documents";
import { mockValidations } from "./mock-validations";
import type {
  Project,
  ProjectStatus,
  ValidationStatus,
  DecisionStatus,
} from "./types";
import type {
  HydroTrade,
  HydroMaterialCategory,
} from "./mock-project-index";

/* ── Row types ─────────────────────────────────────────────────── */

export interface MaterialV2Row {
  id: string;
  specSection: string;
  catalogTitle: string;
  description: string;
  sizes: string;
  subcategory: string;
  trade: HydroTrade;
  aiStatus: ValidationStatus;
  decision: DecisionStatus;
  system: string;
  confidenceScore: number;
}

export interface ProjectV2Row {
  id: string;
  name: string;
  jobId: string;
  type: string;
  status: ProjectStatus;
  overallConfidence: number;
  materialCategory: string;
  materials: MaterialV2Row[];
}

/* ── Constants ─────────────────────────────────────────────────── */

export const PROJECT_V2_STATUS_OPTIONS: ProjectStatus[] = [
  "active",
  "in_progress",
  "completed",
  "on_hold",
  "extracting",
];

export const AI_STATUS_OPTIONS: ValidationStatus[] = [
  "pre_approved",
  "review_required",
  "action_mandatory",
];

export const DECISION_OPTIONS: DecisionStatus[] = [
  "pending",
  "approved",
  "approved_with_notes",
  "revision_requested",
  "rejected",
  "revisit",
];

/* ── Label helpers ─────────────────────────────────────────────── */

export function formatProjectType(type: string): string {
  return type === "dr" ? "Design Review" : "Design Job";
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ── Trade / material derivation ───────────────────────────────── */

const CATEGORY_TO_TRADE: Record<string, HydroTrade> = {
  Finishes: "Mechanical",
  "Hangers & Supports": "Mechanical",
  Anchors: "Mechanical",
  Fittings: "Plumbing",
  Pipe: "Plumbing",
  Valves: "Mechanical",
  Insulation: "Mechanical",
  Specialties: "Electrical",
};

function deriveMaterialCategory(materials: MaterialV2Row[]): string {
  const systems = new Set(materials.map((m) => m.system));
  if (systems.has("Chilled Water")) return "Carbon Steel";
  if (systems.has("Condenser Water")) return "Copper";
  return "n/a";
}

/* ── Build material rows from real documents ───────────────────── */

function buildMaterialRows(project: Project): MaterialV2Row[] {
  const docs = mockDocuments.filter(
    (d) => d.versionId === project.latestVersionId
  );
  if (docs.length === 0) return [];

  return docs.map((doc) => {
    const validation = mockValidations.find(
      (v) => v.documentId === doc.id && v.versionId === doc.versionId
    );
    return {
      id: `${project.id}-${doc.id}`,
      specSection: doc.specSection,
      catalogTitle: doc.fileName,
      description: doc.specSectionTitle,
      sizes: "—",
      subcategory: doc.indexCategory ?? "—",
      trade: (CATEGORY_TO_TRADE[doc.indexCategory ?? ""] ??
        "Mechanical") as HydroTrade,
      aiStatus: validation?.status ?? "review_required",
      decision: validation?.decision ?? "pending",
      system: doc.systemCategory ?? "—",
      confidenceScore: validation?.confidenceScore ?? 0,
    };
  });
}

/* ── Synthetic materials for projects without real documents ───── */

const SYNTHETIC_DATA: Array<{
  specSection: string;
  catalogTitle: string;
  description: string;
  subcategory: string;
  system: string;
  trade: HydroTrade;
  aiStatus: ValidationStatus;
  decision: DecisionStatus;
  confidence: number;
}> = [
  {
    specSection: "23 21 13",
    catalogTitle: "Hydronic Piping",
    description: "SCH 40 Black Steel Pipe — Chilled Water",
    subcategory: "Pipe",
    system: "Chilled Water",
    trade: "Mechanical",
    aiStatus: "pre_approved",
    decision: "approved",
    confidence: 94,
  },
  {
    specSection: "23 21 13",
    catalogTitle: "Pipe Fittings",
    description: "Butt-Weld Fittings ASTM A234",
    subcategory: "Fittings",
    system: "Chilled Water",
    trade: "Plumbing",
    aiStatus: "pre_approved",
    decision: "pending",
    confidence: 88,
  },
  {
    specSection: "23 05 23",
    catalogTitle: "Ball Valve",
    description: "2-Piece Full Port Ball Valve",
    subcategory: "Valves",
    system: "Condenser Water",
    trade: "Mechanical",
    aiStatus: "review_required",
    decision: "pending",
    confidence: 72,
  },
  {
    specSection: "23 07 19",
    catalogTitle: "Pipe Insulation",
    description: "Fiberglass Pipe Insulation 1.5\" Thick",
    subcategory: "Insulation",
    system: "Chilled Water",
    trade: "Mechanical",
    aiStatus: "action_mandatory",
    decision: "revision_requested",
    confidence: 45,
  },
];

function buildSyntheticMaterials(project: Project): MaterialV2Row[] {
  const count = Math.max(
    2,
    Math.min(SYNTHETIC_DATA.length, Math.ceil(project.totalDocuments / 8))
  );
  return SYNTHETIC_DATA.slice(0, count).map((s, i) => ({
    id: `${project.id}-syn-${i}`,
    specSection: s.specSection,
    catalogTitle: s.catalogTitle,
    description: s.description,
    sizes: "—",
    subcategory: s.subcategory,
    trade: s.trade,
    aiStatus: s.aiStatus,
    decision: s.decision,
    system: s.system,
    confidenceScore: s.confidence,
  }));
}

/* ── Public API ─────────────────────────────────────────────────── */

export function getProjectV2Rows(): ProjectV2Row[] {
  return mockProjects
    .filter((p) => p.status !== "extracting")
    .map((project) => {
      let materials = buildMaterialRows(project);
      if (materials.length === 0) {
        materials = buildSyntheticMaterials(project);
      }
      return {
        id: project.id,
        name: project.name,
        jobId: project.jobId,
        type: formatProjectType(project.projectType),
        status: project.status,
        overallConfidence: project.confidenceSummary.overallConfidence,
        materialCategory: deriveMaterialCategory(materials),
        materials,
      };
    });
}
