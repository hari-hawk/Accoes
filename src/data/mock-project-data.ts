/**
 * Per-project mock data — each project gets unique material files,
 * project specifications, activity logs, and conformance data.
 */

export interface ProjectMaterialFile {
  id: string;
  fileName: string;
  fileType: "csv" | "pdf" | "xlsx" | "docx";
  fileSize: number;
  uploadedAt: string;
  trade: string;
  version: string;
  processedAt?: string;
  confidence?: number;
  approved?: boolean;
}

export interface ProjectSpecFile {
  id: string;
  fileName: string;
  fileType: "pdf" | "xlsx" | "docx";
  fileSize: number;
  uploadedAt: string;
  totalPages: number;
}

export interface ProjectActivity {
  id: number;
  action: string;
  detail: string;
  time: string;
  type: "success" | "warning" | "error" | "info";
  user: string;
}

export interface ProjectOverviewData {
  currentMaterialFiles: ProjectMaterialFile[];
  historicalMaterialFiles: ProjectMaterialFile[];
  projectSpecs: ProjectSpecFile[];
  recentActivity: ProjectActivity[];
}

/* -------------------------------------------------------------------------- */
/*  Per-project data definitions                                               */
/* -------------------------------------------------------------------------- */

const projectDataMap: Record<string, ProjectOverviewData> = {
  /* ── proj-1 — Mayo Clinic ─────────────────────────────────────────────── */
  "proj-1": {
    currentMaterialFiles: [
      { id: "mc-mig-7", fileName: "MayoClinic_Mechanical_Matrix_Index_Grid_v4.csv", fileType: "csv", fileSize: 612352, uploadedAt: "2026-02-20T10:30:00Z", trade: "Mechanical", version: "v4" },
      { id: "mc-mig-8", fileName: "MayoClinic_Plumbing_Matrix_Index_Grid_v4.csv", fileType: "csv", fileSize: 578560, uploadedAt: "2026-02-20T10:35:00Z", trade: "Plumbing", version: "v4" },
      { id: "mc-mig-9", fileName: "MayoClinic_Fire_Protection_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 445440, uploadedAt: "2026-02-20T10:40:00Z", trade: "Fire Protection", version: "v2" },
    ],
    historicalMaterialFiles: [
      { id: "mc-mig-1", fileName: "MayoClinic_Mechanical_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 598016, uploadedAt: "2026-02-10T10:00:00Z", trade: "Mechanical", version: "v3", processedAt: "2026-02-11T14:00:00Z", confidence: 89, approved: true },
      { id: "mc-mig-2", fileName: "MayoClinic_Plumbing_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 565248, uploadedAt: "2026-02-10T10:05:00Z", trade: "Plumbing", version: "v3", processedAt: "2026-02-11T14:05:00Z", confidence: 85, approved: true },
      { id: "mc-mig-3", fileName: "MayoClinic_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 556032, uploadedAt: "2026-02-01T10:00:00Z", trade: "Mechanical", version: "v2", processedAt: "2026-02-02T09:00:00Z", confidence: 82, approved: true },
      { id: "mc-mig-4", fileName: "MayoClinic_Plumbing_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 542720, uploadedAt: "2026-02-01T10:05:00Z", trade: "Plumbing", version: "v2", processedAt: "2026-02-02T09:05:00Z", confidence: 79, approved: true },
      { id: "mc-mig-5", fileName: "MayoClinic_Fire_Protection_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 419840, uploadedAt: "2026-01-25T10:10:00Z", trade: "Fire Protection", version: "v1", processedAt: "2026-01-26T14:00:00Z", confidence: 71, approved: false },
    ],
    projectSpecs: [
      { id: "mc-ps-1", fileName: "MayoClinic_Project60080059_Specification_Vol1_2026-02.pdf", fileType: "pdf", fileSize: 18874368, uploadedAt: "2026-02-17T09:00:00Z", totalPages: 412 },
      { id: "mc-ps-2", fileName: "MayoClinic_Project60080059_Specification_Vol2_2026-02.pdf", fileType: "pdf", fileSize: 15728640, uploadedAt: "2026-02-17T09:05:00Z", totalPages: 328 },
      { id: "mc-ps-3", fileName: "MayoClinic_Addendum_01_2026-02.pdf", fileType: "pdf", fileSize: 2097152, uploadedAt: "2026-02-19T11:00:00Z", totalPages: 45 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "Copper Pipe Type L — Pre-Approved (96%)", time: "1 hour ago", type: "success", user: "AI System" },
      { id: 2, action: "Review flagged", detail: "Fire Sprinkler Riser Assembly — Missing UL listing", time: "2 hours ago", type: "warning", user: "Sarah Mitchell" },
      { id: 3, action: "Action required", detail: "Chiller Piping Schedule — Undersized headers", time: "3 hours ago", type: "error", user: "Michael Torres" },
      { id: 4, action: "Document validated", detail: "Black Malleable Iron Fittings — Pre-Approved (94%)", time: "4 hours ago", type: "success", user: "AI System" },
      { id: 5, action: "Document uploaded", detail: "Fire Protection Addendum uploaded", time: "5 hours ago", type: "info", user: "Sarah Mitchell" },
      { id: 6, action: "AI processing complete", detail: "34 documents analyzed in 6m 12s", time: "5 hours ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-2 — UCD ─────────────────────────────────────────────────────── */
  "proj-2": {
    currentMaterialFiles: [
      { id: "ucd-mig-7", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 548864, uploadedAt: "2026-02-18T10:30:00Z", trade: "Plumbing", version: "v3" },
      { id: "ucd-mig-8", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 516096, uploadedAt: "2026-02-18T10:35:00Z", trade: "Heating", version: "v3" },
      { id: "ucd-mig-9", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 483328, uploadedAt: "2026-02-18T10:40:00Z", trade: "Mechanical", version: "v3" },
    ],
    historicalMaterialFiles: [
      { id: "ucd-mig-1", fileName: "UCD_HobbsVet_Plumbing_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 524288, uploadedAt: "2026-02-05T10:00:00Z", trade: "Plumbing", version: "v1", processedAt: "2026-02-06T14:00:00Z", confidence: 72, approved: true },
      { id: "ucd-mig-2", fileName: "UCD_HobbsVet_Heating_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 491520, uploadedAt: "2026-02-05T10:05:00Z", trade: "Heating", version: "v1", processedAt: "2026-02-06T14:05:00Z", confidence: 68, approved: true },
      { id: "ucd-mig-3", fileName: "UCD_HobbsVet_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 458752, uploadedAt: "2026-02-05T10:10:00Z", trade: "Mechanical", version: "v1", processedAt: "2026-02-06T14:10:00Z", confidence: 75, approved: true },
      { id: "ucd-mig-4", fileName: "UCD_Project9592330_Plumbing_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 537600, uploadedAt: "2026-02-10T10:15:00Z", trade: "Plumbing", version: "v2", processedAt: "2026-02-11T09:00:00Z", confidence: 81, approved: true },
      { id: "ucd-mig-5", fileName: "UCD_Project9592330_Heating_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 503808, uploadedAt: "2026-02-10T10:20:00Z", trade: "Heating", version: "v2", processedAt: "2026-02-11T09:05:00Z", confidence: 78, approved: false },
      { id: "ucd-mig-6", fileName: "UCD_Project9592330_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 471040, uploadedAt: "2026-02-10T10:25:00Z", trade: "Mechanical", version: "v2", processedAt: "2026-02-11T09:10:00Z", confidence: 83, approved: true },
    ],
    projectSpecs: [
      { id: "ucd-ps-1", fileName: "UCD_Project9592330_Project_Specification_Volume_1_2026-02.pdf", fileType: "pdf", fileSize: 16482304, uploadedAt: "2026-02-05T09:00:00Z", totalPages: 342 },
      { id: "ucd-ps-2", fileName: "UCD_Project9592330_Project_Specification_Volume_2_2026-02.pdf", fileType: "pdf", fileSize: 13107200, uploadedAt: "2026-02-05T09:05:00Z", totalPages: 278 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "Fire-Rated Gypsum Board — Pre-Approved (96%)", time: "2 hours ago", type: "success", user: "AI System" },
      { id: 2, action: "Review flagged", detail: "Structural Steel Shop Drawings — Missing fireproofing details", time: "3 hours ago", type: "warning", user: "Sarah Wilson" },
      { id: 3, action: "Action required", detail: "HVAC Equipment Schedule — Chiller undersized by 50 tons", time: "4 hours ago", type: "error", user: "James Chen" },
      { id: 4, action: "Document validated", detail: "Concrete Mix Design Report — Pre-Approved (93%)", time: "5 hours ago", type: "success", user: "AI System" },
      { id: 5, action: "Document uploaded", detail: "Elevator Specifications.pdf uploaded", time: "6 hours ago", type: "info", user: "James Chen" },
      { id: 6, action: "AI processing complete", detail: "22 documents analyzed in 4m 23s", time: "6 hours ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-3 — NET ─────────────────────────────────────────────────────── */
  "proj-3": {
    currentMaterialFiles: [
      { id: "net-mig-1", fileName: "NET_Portland_HVAC_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 389120, uploadedAt: "2026-02-16T09:00:00Z", trade: "HVAC", version: "v2" },
      { id: "net-mig-2", fileName: "NET_Portland_Electrical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 356352, uploadedAt: "2026-02-16T09:05:00Z", trade: "Electrical", version: "v1" },
    ],
    historicalMaterialFiles: [
      { id: "net-mig-3", fileName: "NET_Portland_HVAC_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 372736, uploadedAt: "2026-02-08T10:00:00Z", trade: "HVAC", version: "v1", processedAt: "2026-02-09T14:00:00Z", confidence: 65, approved: false },
    ],
    projectSpecs: [
      { id: "net-ps-1", fileName: "NET_Project60682217_Engineering_Specs_2026-02.pdf", fileType: "pdf", fileSize: 9437184, uploadedAt: "2026-02-14T08:00:00Z", totalPages: 196 },
    ],
    recentActivity: [
      { id: 1, action: "Document uploaded", detail: "Electrical Matrix Index Grid uploaded", time: "1 hour ago", type: "info", user: "Lisa Park" },
      { id: 2, action: "Review flagged", detail: "HVAC Ductwork Schedule — Size mismatch in Zone 3", time: "3 hours ago", type: "warning", user: "AI System" },
      { id: 3, action: "AI processing complete", detail: "15 documents analyzed in 3m 08s", time: "4 hours ago", type: "info", user: "AI System" },
      { id: 4, action: "Action required", detail: "Electrical Panel B — Breaker capacity exceeded", time: "5 hours ago", type: "error", user: "Lisa Park" },
    ],
  },

  /* ── proj-4 — KPMG ────────────────────────────────────────────────────── */
  "proj-4": {
    currentMaterialFiles: [
      { id: "kpmg-mig-1", fileName: "KPMG_NYC_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 268288, uploadedAt: "2026-02-19T08:00:00Z", trade: "Mechanical", version: "v1" },
    ],
    historicalMaterialFiles: [],
    projectSpecs: [
      { id: "kpmg-ps-1", fileName: "KPMG_Project60621999_Office_Fit_Out_Specs_2026-02.pdf", fileType: "pdf", fileSize: 5242880, uploadedAt: "2026-02-18T09:00:00Z", totalPages: 118 },
    ],
    recentActivity: [
      { id: 1, action: "Document uploaded", detail: "Mechanical Matrix Index Grid uploaded", time: "30 minutes ago", type: "info", user: "Sarah Mitchell" },
      { id: 2, action: "AI processing started", detail: "4 documents queued for analysis", time: "45 minutes ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-5 — PSL ─────────────────────────────────────────────────────── */
  "proj-5": {
    currentMaterialFiles: [
      { id: "psl-mig-1", fileName: "PSL_Seattle_Structural_Matrix_Index_Grid_v3.csv", fileType: "csv", fileSize: 423936, uploadedAt: "2026-02-15T10:00:00Z", trade: "Structural", version: "v3" },
      { id: "psl-mig-2", fileName: "PSL_Seattle_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 401408, uploadedAt: "2026-02-15T10:05:00Z", trade: "Mechanical", version: "v2" },
      { id: "psl-mig-3", fileName: "PSL_Seattle_Plumbing_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 378880, uploadedAt: "2026-02-15T10:10:00Z", trade: "Plumbing", version: "v2" },
    ],
    historicalMaterialFiles: [
      { id: "psl-mig-4", fileName: "PSL_Seattle_Structural_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 412672, uploadedAt: "2026-02-08T10:00:00Z", trade: "Structural", version: "v2", processedAt: "2026-02-09T14:00:00Z", confidence: 86, approved: true },
      { id: "psl-mig-5", fileName: "PSL_Seattle_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 389120, uploadedAt: "2026-02-01T10:00:00Z", trade: "Mechanical", version: "v1", processedAt: "2026-02-02T09:00:00Z", confidence: 77, approved: true },
      { id: "psl-mig-6", fileName: "PSL_Seattle_Structural_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 395264, uploadedAt: "2026-02-01T10:05:00Z", trade: "Structural", version: "v1", processedAt: "2026-02-02T09:05:00Z", confidence: 74, approved: false },
    ],
    projectSpecs: [
      { id: "psl-ps-1", fileName: "PSL_Project60650411_Structural_Specs_2026-02.pdf", fileType: "pdf", fileSize: 12582912, uploadedAt: "2026-02-12T08:30:00Z", totalPages: 267 },
      { id: "psl-ps-2", fileName: "PSL_Project60650411_MEP_Specs_2026-02.pdf", fileType: "pdf", fileSize: 10485760, uploadedAt: "2026-02-12T08:35:00Z", totalPages: 224 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "Structural Steel W-Shapes — Pre-Approved (91%)", time: "1 hour ago", type: "success", user: "AI System" },
      { id: 2, action: "Review flagged", detail: "Base Plate Connections — Weld detail inconsistency", time: "2 hours ago", type: "warning", user: "Thomas Reed" },
      { id: 3, action: "Document validated", detail: "Copper Pipe Type M — Pre-Approved (89%)", time: "3 hours ago", type: "success", user: "AI System" },
      { id: 4, action: "Action required", detail: "Seismic Bracing Schedule — Missing zone classification", time: "4 hours ago", type: "error", user: "Thomas Reed" },
      { id: 5, action: "AI processing complete", detail: "18 documents analyzed in 3m 45s", time: "5 hours ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-6 — DCJC ────────────────────────────────────────────────────── */
  "proj-6": {
    currentMaterialFiles: [
      { id: "dcjc-mig-1", fileName: "DCJC_Washington_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 445440, uploadedAt: "2026-02-17T10:00:00Z", trade: "Mechanical", version: "v2" },
      { id: "dcjc-mig-2", fileName: "DCJC_Washington_Plumbing_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 423936, uploadedAt: "2026-02-17T10:05:00Z", trade: "Plumbing", version: "v2" },
    ],
    historicalMaterialFiles: [
      { id: "dcjc-mig-3", fileName: "DCJC_Washington_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 434176, uploadedAt: "2026-02-10T10:00:00Z", trade: "Mechanical", version: "v1", processedAt: "2026-02-11T14:00:00Z", confidence: 78, approved: true },
      { id: "dcjc-mig-4", fileName: "DCJC_Washington_Plumbing_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 412672, uploadedAt: "2026-02-10T10:05:00Z", trade: "Plumbing", version: "v1", processedAt: "2026-02-11T14:05:00Z", confidence: 74, approved: false },
    ],
    projectSpecs: [
      { id: "dcjc-ps-1", fileName: "DCJC_Project60920597_Govt_Building_Specs_2026-02.pdf", fileType: "pdf", fileSize: 14680064, uploadedAt: "2026-02-15T10:00:00Z", totalPages: 305 },
      { id: "dcjc-ps-2", fileName: "DCJC_Project60920597_Addendum_A_2026-02.pdf", fileType: "pdf", fileSize: 3145728, uploadedAt: "2026-02-18T14:00:00Z", totalPages: 62 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "Stainless Steel Flanges — Pre-Approved (93%)", time: "1 hour ago", type: "success", user: "AI System" },
      { id: 2, action: "Review flagged", detail: "Medical Gas Piping — Certification pending", time: "3 hours ago", type: "warning", user: "Elena Rodriguez" },
      { id: 3, action: "Action required", detail: "ADA Compliance Review — Fixture heights", time: "4 hours ago", type: "error", user: "Marcus Thompson" },
      { id: 4, action: "Document validated", detail: "Bronze 125# Fittings — Pre-Approved (90%)", time: "5 hours ago", type: "success", user: "AI System" },
      { id: 5, action: "AI processing complete", detail: "12 documents analyzed in 2m 56s", time: "6 hours ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-7 — IEUA ────────────────────────────────────────────────────── */
  "proj-7": {
    currentMaterialFiles: [
      { id: "ieua-mig-1", fileName: "IEUA_Chino_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 468992, uploadedAt: "2026-02-16T09:00:00Z", trade: "Mechanical", version: "v2" },
      { id: "ieua-mig-2", fileName: "IEUA_Chino_Plumbing_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 445440, uploadedAt: "2026-02-16T09:05:00Z", trade: "Plumbing", version: "v2" },
      { id: "ieua-mig-3", fileName: "IEUA_Chino_Process_Piping_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 356352, uploadedAt: "2026-02-16T09:10:00Z", trade: "Process Piping", version: "v1" },
    ],
    historicalMaterialFiles: [
      { id: "ieua-mig-4", fileName: "IEUA_Chino_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 456704, uploadedAt: "2026-02-08T10:00:00Z", trade: "Mechanical", version: "v1", processedAt: "2026-02-09T14:00:00Z", confidence: 81, approved: true },
      { id: "ieua-mig-5", fileName: "IEUA_Chino_Plumbing_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 434176, uploadedAt: "2026-02-08T10:05:00Z", trade: "Plumbing", version: "v1", processedAt: "2026-02-09T14:05:00Z", confidence: 77, approved: true },
    ],
    projectSpecs: [
      { id: "ieua-ps-1", fileName: "IEUA_Project60612294_Water_Treatment_Specs_2026-02.pdf", fileType: "pdf", fileSize: 11534336, uploadedAt: "2026-02-13T08:00:00Z", totalPages: 248 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "PVC Pipe Schedule 80 — Pre-Approved (94%)", time: "1 hour ago", type: "success", user: "AI System" },
      { id: 2, action: "Review flagged", detail: "Chemical Feed Piping — Material compatibility review", time: "2 hours ago", type: "warning", user: "Sandra Kim" },
      { id: 3, action: "Document validated", detail: "SS 316L Fittings — Pre-Approved (91%)", time: "3 hours ago", type: "success", user: "AI System" },
      { id: 4, action: "AI processing complete", detail: "20 documents analyzed in 4m 15s", time: "5 hours ago", type: "info", user: "AI System" },
    ],
  },

  /* ── proj-8 — PF ──────────────────────────────────────────────────────── */
  "proj-8": {
    currentMaterialFiles: [
      { id: "pf-mig-1", fileName: "PF_SanFrancisco_Structural_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 501760, uploadedAt: "2026-02-14T10:00:00Z", trade: "Structural", version: "v2" },
      { id: "pf-mig-2", fileName: "PF_SanFrancisco_Mechanical_Matrix_Index_Grid_v2.csv", fileType: "csv", fileSize: 478208, uploadedAt: "2026-02-14T10:05:00Z", trade: "Mechanical", version: "v2" },
    ],
    historicalMaterialFiles: [
      { id: "pf-mig-3", fileName: "PF_SanFrancisco_Structural_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 491520, uploadedAt: "2026-02-05T10:00:00Z", trade: "Structural", version: "v1", processedAt: "2026-02-06T14:00:00Z", confidence: 88, approved: true },
      { id: "pf-mig-4", fileName: "PF_SanFrancisco_Mechanical_Matrix_Index_Grid_v1.csv", fileType: "csv", fileSize: 468992, uploadedAt: "2026-02-05T10:05:00Z", trade: "Mechanical", version: "v1", processedAt: "2026-02-06T14:05:00Z", confidence: 84, approved: true },
    ],
    projectSpecs: [
      { id: "pf-ps-1", fileName: "PF_Project60682194_Foundation_Specs_2026-02.pdf", fileType: "pdf", fileSize: 13631488, uploadedAt: "2026-02-05T09:00:00Z", totalPages: 289 },
      { id: "pf-ps-2", fileName: "PF_Project60682194_Structural_Calcs_2026-02.pdf", fileType: "pdf", fileSize: 8388608, uploadedAt: "2026-02-05T09:05:00Z", totalPages: 176 },
    ],
    recentActivity: [
      { id: 1, action: "Document validated", detail: "Concrete Mix Design 5000 PSI — Pre-Approved (97%)", time: "1 day ago", type: "success", user: "AI System" },
      { id: 2, action: "Document approved", detail: "All 26 items approved — Project Complete", time: "1 day ago", type: "success", user: "Andrew Chen" },
      { id: 3, action: "AI processing complete", detail: "26 documents analyzed in 5m 32s", time: "2 days ago", type: "info", user: "AI System" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Accessor                                                                   */
/* -------------------------------------------------------------------------- */

/** Default fallback for projects without specific data */
const defaultProjectData: ProjectOverviewData = {
  currentMaterialFiles: [],
  historicalMaterialFiles: [],
  projectSpecs: [],
  recentActivity: [
    { id: 1, action: "Project created", detail: "Project initialized and ready for document upload", time: "Recently", type: "info", user: "AI System" },
  ],
};

/** Get overview data for a specific project */
export function getProjectOverviewData(projectId: string): ProjectOverviewData {
  return projectDataMap[projectId] ?? defaultProjectData;
}
