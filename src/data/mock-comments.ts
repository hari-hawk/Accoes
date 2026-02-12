import type { Comment } from "./types";

export const mockComments: Comment[] = [
  {
    id: "cmt-1",
    validationResultId: "val-2",
    authorId: "user-1",
    content: "We need the fireproofing details before we can approve. Please request from the steel fabricator.",
    createdAt: "2026-01-12T09:30:00Z",
  },
  {
    id: "cmt-2",
    validationResultId: "val-2",
    authorId: "user-2",
    content: "Contacted fabricator. They confirmed fireproofing details will be in a supplemental submittal next week.",
    createdAt: "2026-01-12T14:15:00Z",
  },
  {
    id: "cmt-3",
    validationResultId: "val-3",
    authorId: "user-3",
    content: "The chiller undersizing is a critical issue. This needs to go back to the mechanical engineer.",
    createdAt: "2026-01-13T10:00:00Z",
  },
  {
    id: "cmt-4",
    validationResultId: "val-5",
    authorId: "user-1",
    content: "Can we verify if the manufacturer offers an extended 20-year warranty option?",
    createdAt: "2026-01-14T11:00:00Z",
  },
  {
    id: "cmt-5",
    validationResultId: "val-6",
    authorId: "user-3",
    content: "Wind load calcs are essential for coastal location. This cannot be approved without them.",
    createdAt: "2026-01-14T16:30:00Z",
  },
];

export function getCommentsByValidation(validationResultId: string): Comment[] {
  return mockComments.filter((c) => c.validationResultId === validationResultId);
}
