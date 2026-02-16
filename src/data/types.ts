export type UserRole = "admin" | "global_viewer" | "submitter" | "reviewer";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed";

export type VersionStatus =
  | "draft"
  | "uploading"
  | "processing"
  | "in_review"
  | "complete"
  | "error";

export type WorkflowStage =
  | "project"
  | "upload"
  | "process"
  | "review"
  | "export";

export type ValidationStatus =
  | "pre_approved"
  | "review_required"
  | "action_mandatory";

export type DecisionStatus =
  | "pending"
  | "approved"
  | "approved_with_notes"
  | "revision_requested"
  | "rejected";

export type DRStatus = "not_started" | "processing" | "ready_for_review";

export type DocumentType = "pdf" | "xlsx" | "docx";

export type ExportFormat = "pdf" | "csv" | "xlsx";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface ConfidenceSummary {
  preApproved: number;
  reviewRequired: number;
  actionMandatory: number;
  total: number;
  overallConfidence: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  jobId: string;
  location: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  memberIds: string[];
  versionIds: string[];
  latestVersionId: string;
  totalDocuments: number;
  confidenceSummary: ConfidenceSummary;
}

export interface ProcessingLogEntry {
  timestamp: string;
  message: string;
  level: "info" | "warning" | "error" | "success";
}

export interface ProcessingProgress {
  currentStep: string;
  stepsCompleted: number;
  totalSteps: number;
  percentComplete: number;
  estimatedTimeRemaining?: number;
  log: ProcessingLogEntry[];
}

export interface Version {
  id: string;
  projectId: string;
  name: string;
  status: VersionStatus;
  workflowStage: WorkflowStage;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  specificationRef: string;
  documentIds: string[];
  confidenceSummary: ConfidenceSummary;
  processingProgress?: ProcessingProgress;
}

export interface Document {
  id: string;
  versionId: string;
  fileName: string;
  fileType: DocumentType;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  specSection: string;
  specSectionTitle: string;
  previewUrl?: string;
}

export interface EvidenceItem {
  id: string;
  sourceDocumentId: string;
  sourceFileName: string;
  pageNumber?: number;
  excerpt: string;
  relevance: "supports" | "contradicts" | "neutral";
  confidence: number;
}

export interface AiReasoning {
  summary: string;
  keyFindings: string[];
  complianceAssessment: string;
  recommendation: string;
}

export interface SpecReference {
  sectionNumber: string;
  sectionTitle: string;
  requirements: string[];
  sourceDocument: string;
}

export type ValidationCategory = "overall" | "project_assets" | "performance_index";

export interface ValidationResult {
  id: string;
  documentId: string;
  versionId: string;
  status: ValidationStatus;
  confidenceScore: number;
  decision: DecisionStatus;
  decisionBy?: string;
  decisionAt?: string;
  decisionNotes?: string;
  evidenceItems: EvidenceItem[];
  aiReasoning: AiReasoning;
  specReference: SpecReference;
  category?: ValidationCategory;
}

export interface Comment {
  id: string;
  validationResultId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface ReportConfig {
  versionId: string;
  format: ExportFormat;
  includeEvidence: boolean;
  includeComments: boolean;
  includeAiReasoning: boolean;
}

export interface DescriptiveReport {
  id: string;
  projectId: string;
  name: string;
  purpose: string;
  status: DRStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  materialMatrixFile?: string;
  projectSpecFile?: string;
}

export type DiscrepancyStatus =
  | "pre_approved"
  | "review_required"
  | "action_mandatory";

export interface ItemComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface MaterialItem {
  id: string;
  drId: string;
  itemName: string;
  description: string;
  specSection: string;
  materialMatrixValue: string;
  projectSpecValue: string;
  projectIndexValue: string;
  status: DiscrepancyStatus;
  confidenceScore: number;
  aiReason: string;
  comments: ItemComment[];
}
