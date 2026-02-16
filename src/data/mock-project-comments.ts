export interface ProjectComment {
  id: string;
  projectId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export const mockProjectComments: ProjectComment[] = [
  {
    id: "pc-1",
    projectId: "proj-1",
    authorId: "user-1",
    content:
      "All structural steel submittals need to reference the updated F3125 standard.",
    createdAt: "2026-02-15T10:30:00Z",
  },
  {
    id: "pc-2",
    projectId: "proj-1",
    authorId: "user-3",
    content:
      "Fireproofing density issue flagged — need engineer confirmation on 14 pcf vs 15 pcf requirement.",
    createdAt: "2026-02-14T14:00:00Z",
  },
  {
    id: "pc-3",
    projectId: "proj-1",
    authorId: "user-2",
    content:
      "Anchor bolt coating has been corrected. Resubmittal incoming.",
    createdAt: "2026-02-13T09:30:00Z",
  },
  {
    id: "pc-4",
    projectId: "proj-1",
    authorId: "user-1",
    content:
      "HVAC ductwork gauge issue — contractor aware, awaiting updated submittal.",
    createdAt: "2026-02-12T16:30:00Z",
  },
  {
    id: "pc-5",
    projectId: "proj-1",
    authorId: "user-3",
    content: "Overall progress looking good. 7 of 10 items pre-approved.",
    createdAt: "2026-02-11T11:00:00Z",
  },
  {
    id: "pc-6",
    projectId: "proj-2",
    authorId: "user-1",
    content:
      "Curtain wall system approved. IGU argon fill needs verification.",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "pc-7",
    projectId: "proj-2",
    authorId: "user-4",
    content: "Glass manufacturer confirmed argon fill on all units.",
    createdAt: "2026-02-09T15:00:00Z",
  },
];

export function getProjectComments(projectId: string): ProjectComment[] {
  return mockProjectComments
    .filter((c) => c.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
