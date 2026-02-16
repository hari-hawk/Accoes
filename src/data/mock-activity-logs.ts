export interface ActivityLogEntry {
  id: string;
  projectId: string;
  userId: string;
  action: "status_update" | "comment" | "file_upload" | "user_added";
  description: string;
  timestamp: string;
  metadata?: {
    oldStatus?: string;
    newStatus?: string;
  };
}

export const mockActivityLogs: ActivityLogEntry[] = [
  {
    id: "al-1",
    projectId: "proj-1",
    userId: "user-1",
    action: "status_update",
    description: "Status update: Action Mandatory to Pre Approve",
    timestamp: "2026-02-15T10:46:00Z",
    metadata: { oldStatus: "action_mandatory", newStatus: "pre_approved" },
  },
  {
    id: "al-2",
    projectId: "proj-1",
    userId: "user-2",
    action: "file_upload",
    description: "Uploaded Structural Steel Shop Drawings.pdf",
    timestamp: "2026-02-14T14:30:00Z",
  },
  {
    id: "al-3",
    projectId: "proj-1",
    userId: "user-3",
    action: "status_update",
    description: "Status update: Review Required to Action Mandatory",
    timestamp: "2026-02-14T10:46:00Z",
    metadata: { oldStatus: "review_required", newStatus: "action_mandatory" },
  },
  {
    id: "al-4",
    projectId: "proj-1",
    userId: "user-3",
    action: "comment",
    description:
      "Commented: There is mismatch. This should be re-evaluated by the team",
    timestamp: "2026-02-14T10:46:00Z",
  },
  {
    id: "al-5",
    projectId: "proj-1",
    userId: "user-1",
    action: "user_added",
    description: "Added Maria Garcia as Reviewer",
    timestamp: "2026-02-13T09:00:00Z",
  },
  {
    id: "al-6",
    projectId: "proj-1",
    userId: "user-2",
    action: "file_upload",
    description: "Uploaded HVAC Equipment Schedule.xlsx",
    timestamp: "2026-02-12T16:00:00Z",
  },
  {
    id: "al-7",
    projectId: "proj-2",
    userId: "user-1",
    action: "status_update",
    description: "Status update: Review Required to Pre Approved",
    timestamp: "2026-02-10T11:00:00Z",
    metadata: { oldStatus: "review_required", newStatus: "pre_approved" },
  },
  {
    id: "al-8",
    projectId: "proj-2",
    userId: "user-4",
    action: "comment",
    description:
      "Commented: Curtain wall extrusion spec confirmed with manufacturer",
    timestamp: "2026-02-09T14:00:00Z",
  },
];

export function getActivityLogsByProject(
  projectId: string
): ActivityLogEntry[] {
  return mockActivityLogs
    .filter((l) => l.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}
