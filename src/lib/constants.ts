import type {
  WorkflowStage,
  ProjectStatus,
  ProjectStage,
  VersionStatus,
  ValidationStatus,
  DecisionStatus,
  UserRole,
  DiscrepancyStatus,
} from "@/data/types";

export const WORKFLOW_STAGES: {
  key: WorkflowStage;
  label: string;
  description: string;
}[] = [
  {
    key: "project",
    label: "Project",
    description: "Project overview and version selection",
  },
  {
    key: "upload",
    label: "Upload",
    description: "Upload submittal documents",
  },
  {
    key: "process",
    label: "Process",
    description: "AI validation and analysis",
  },
  {
    key: "review",
    label: "Review",
    description: "Review AI results and make decisions",
  },
  {
    key: "export",
    label: "Export",
    description: "Generate and download reports",
  },
];

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  extracting: { label: "Extracting", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_progress: { label: "In Progress", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  active: { label: "Active", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  on_hold: { label: "On Hold", color: "bg-muted text-muted-foreground" },
  completed: { label: "Completed", color: "bg-status-pre-approved-bg text-status-pre-approved" },
};

export const VERSION_STATUS_CONFIG: Record<
  VersionStatus,
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  uploading: { label: "Uploading", color: "bg-ds-primary-100 text-ds-primary-800" },
  processing: { label: "Processing", color: "bg-status-review-required-bg text-status-review-required" },
  in_review: { label: "In Review", color: "bg-ds-primary-100 text-ds-primary-800" },
  complete: { label: "Complete", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  error: { label: "Error", color: "bg-status-action-mandatory-bg text-status-action-mandatory" },
};

export const VALIDATION_STATUS_CONFIG: Record<
  ValidationStatus,
  { label: string; color: string; bgColor: string }
> = {
  pre_approved: {
    label: "Pre-Approved (80-100%)",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
  },
  review_required: {
    label: "Review Required (70-79%)",
    color: "text-status-review-required",
    bgColor: "bg-status-review-required-bg",
  },
  action_mandatory: {
    label: "Action Required (0-69%)",
    color: "text-status-action-mandatory",
    bgColor: "bg-status-action-mandatory-bg",
  },
};

export const DECISION_STATUS_CONFIG: Record<
  DecisionStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground" },
  approved: { label: "Approved (100%)", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  approved_with_notes: { label: "Approved with Notes", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  revision_requested: { label: "Revision Requested", color: "bg-status-review-required-bg text-status-review-required" },
  rejected: { label: "Rejected", color: "bg-status-action-mandatory-bg text-status-action-mandatory" },
  revisit: { label: "Revisit", color: "bg-status-review-required-bg text-status-review-required" },
  no_acco_id: { label: "No ACCO ID", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  sent_to_acco_review: { label: "Sent to ACCO Review Team", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  defer_to_future: { label: "Defer to future Submittal", color: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400" },
};

export const PROJECT_STAGE_CONFIG: Record<
  ProjectStage,
  { label: string; color: string; bgColor: string }
> = {
  extraction: {
    label: "Extraction",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  review_required: {
    label: "Review Required",
    color: "text-status-review-required",
    bgColor: "bg-status-review-required-bg",
  },
  action_mandatory: {
    label: "Action Required",
    color: "text-status-action-mandatory",
    bgColor: "bg-status-action-mandatory-bg",
  },
  pre_approved: {
    label: "Pre-Approved",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
  },
  approved: {
    label: "Approved",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
  },
};

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string }
> = {
  admin: { label: "Owner", color: "bg-ds-primary-100 text-ds-primary-800" },
  collaborator: { label: "Collaborator", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  viewer: { label: "Reviewer", color: "bg-muted text-muted-foreground" },
  // Legacy roles — map to new names for backwards compatibility
  global_viewer: { label: "Reviewer", color: "bg-muted text-muted-foreground" },
  submitter: { label: "Collaborator", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  reviewer: { label: "Collaborator", color: "bg-status-review-required-bg text-status-review-required" },
};

export const DISCREPANCY_STATUS_CONFIG: Record<
  DiscrepancyStatus,
  { label: string; color: string; bgColor: string }
> = {
  pre_approved: {
    label: "Pre-Approved",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
  },
  review_required: {
    label: "Review Required",
    color: "text-status-review-required",
    bgColor: "bg-status-review-required-bg",
  },
  action_mandatory: {
    label: "Action Required",
    color: "text-status-action-mandatory",
    bgColor: "bg-status-action-mandatory-bg",
  },
};

export const PROCESSING_STEPS = [
  "Document Parsing",
  "Content Extraction",
  "Specification Matching",
  "Compliance Analysis",
  "Report Generation",
];
