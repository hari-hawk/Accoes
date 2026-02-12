import type {
  WorkflowStage,
  ProjectStatus,
  VersionStatus,
  ValidationStatus,
  DecisionStatus,
  UserRole,
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
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  active: { label: "Active", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  in_review: { label: "In Review", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  complete: { label: "Complete", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground" },
};

export const VERSION_STATUS_CONFIG: Record<
  VersionStatus,
  { label: string; color: string }
> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  uploading: { label: "Uploading", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  processing: { label: "Processing", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  in_review: { label: "In Review", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  complete: { label: "Complete", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  error: { label: "Error", color: "bg-status-action-mandatory-bg text-status-action-mandatory" },
};

export const VALIDATION_STATUS_CONFIG: Record<
  ValidationStatus,
  { label: string; color: string; bgColor: string }
> = {
  pre_approved: {
    label: "Pre-approved",
    color: "text-status-pre-approved",
    bgColor: "bg-status-pre-approved-bg",
  },
  review_required: {
    label: "Review Required",
    color: "text-status-review-required",
    bgColor: "bg-status-review-required-bg",
  },
  action_mandatory: {
    label: "Action Mandatory",
    color: "text-status-action-mandatory",
    bgColor: "bg-status-action-mandatory-bg",
  },
};

export const DECISION_STATUS_CONFIG: Record<
  DecisionStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground" },
  approved: { label: "Approved", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  approved_with_notes: { label: "Approved with Notes", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  revision_requested: { label: "Revision Requested", color: "bg-status-review-required-bg text-status-review-required" },
  rejected: { label: "Rejected", color: "bg-status-action-mandatory-bg text-status-action-mandatory" },
};

export const ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string }
> = {
  owner: { label: "Owner", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  collaborator: { label: "Collaborator", color: "bg-status-pre-approved-bg text-status-pre-approved" },
  reviewer: { label: "Reviewer", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
};

export const PROCESSING_STEPS = [
  "Document Parsing",
  "Content Extraction",
  "Specification Matching",
  "Compliance Analysis",
  "Report Generation",
];
