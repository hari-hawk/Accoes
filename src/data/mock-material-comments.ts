/**
 * Per-material comments — tied to a specific document (material item).
 * Each material can have a bi-directional thread with multiple participants.
 */

export interface MaterialComment {
  id: string;
  documentId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export const mockMaterialComments: MaterialComment[] = [
  // doc-28 — Finishes (2 comments)
  {
    id: "mc-1",
    documentId: "doc-28",
    authorId: "user-1",
    content: "Electro-galvanized finish confirmed per ASTM A153. Pre-approved.",
    createdAt: "2026-02-16T09:30:00Z",
  },
  {
    id: "mc-2",
    documentId: "doc-28",
    authorId: "user-3",
    content: "Agreed — finish spec matches. No issues from our end.",
    createdAt: "2026-02-16T10:15:00Z",
  },

  // doc-29 — Clevis Hanger (Type 1) (4 comments — multi-person thread)
  {
    id: "mc-3",
    documentId: "doc-29",
    authorId: "user-2",
    content: "Submitted B3100 series clevis hangers. Load ratings are per the MIG requirements.",
    createdAt: "2026-02-14T08:00:00Z",
  },
  {
    id: "mc-4",
    documentId: "doc-29",
    authorId: "user-1",
    content: "B3100 rated at 610 lbs for 2\" — spec calls for 600 lbs minimum. Margin looks good.",
    createdAt: "2026-02-14T09:20:00Z",
  },
  {
    id: "mc-5",
    documentId: "doc-29",
    authorId: "user-3",
    content: "Can we confirm the hanger rod size matches? I see 3/8\" in the submittal but spec calls for 1/2\" on 4\" and above.",
    createdAt: "2026-02-14T11:45:00Z",
  },
  {
    id: "mc-6",
    documentId: "doc-29",
    authorId: "user-2",
    content: "Good catch — updating the submittal to specify 1/2\" rod for 4\" pipe and above. Corrected version incoming.",
    createdAt: "2026-02-14T14:30:00Z",
  },

  // doc-30 — Riser Clamps (Type 8) (3 comments)
  {
    id: "mc-7",
    documentId: "doc-30",
    authorId: "user-3",
    content: "Riser clamp B3373 spec shows carbon steel. Project requires stainless steel for exterior risers per 05 29 00.",
    createdAt: "2026-02-15T08:30:00Z",
  },
  {
    id: "mc-8",
    documentId: "doc-30",
    authorId: "user-1",
    content: "Confirmed — exterior risers need SS or HDG. Please resubmit with B3373SS for those locations.",
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "mc-9",
    documentId: "doc-30",
    authorId: "user-2",
    content: "Will separate into interior (carbon steel) and exterior (SS) riser clamps in the updated submittal.",
    createdAt: "2026-02-15T13:15:00Z",
  },

  // doc-31 — Standard Pipe Strap (Type 26) (2 comments)
  {
    id: "mc-10",
    documentId: "doc-31",
    authorId: "user-1",
    content: "B2400 pipe strap looks compliant. Coating matches spec requirements.",
    createdAt: "2026-02-13T11:00:00Z",
  },
  {
    id: "mc-11",
    documentId: "doc-31",
    authorId: "user-4",
    content: "Noted. Adding this to the pre-approved batch for final sign-off.",
    createdAt: "2026-02-13T14:20:00Z",
  },

  // doc-32 — Beam Clamp (Type 19) (3 comments — disagreement thread)
  {
    id: "mc-12",
    documentId: "doc-32",
    authorId: "user-3",
    content: "Beam clamp submitted is rated for W8 flange. Some locations use W10 — need verification on capacity.",
    createdAt: "2026-02-12T09:00:00Z",
  },
  {
    id: "mc-13",
    documentId: "doc-32",
    authorId: "user-1",
    content: "The B3034 universal fits W8–W12 flanges. Please confirm the model number in the submittal matches.",
    createdAt: "2026-02-12T10:30:00Z",
  },
  {
    id: "mc-14",
    documentId: "doc-32",
    authorId: "user-2",
    content: "Confirmed B3034 universal. Updated the submittal to clearly state flange range compatibility.",
    createdAt: "2026-02-12T15:45:00Z",
  },

  // doc-33 — Trapeze Hanger Assembly (5 comments — complex thread)
  {
    id: "mc-15",
    documentId: "doc-33",
    authorId: "user-2",
    content: "Trapeze assembly submitted with 1-5/8\" channel. Includes seismic bracing per ASCE 7.",
    createdAt: "2026-02-11T07:30:00Z",
  },
  {
    id: "mc-16",
    documentId: "doc-33",
    authorId: "user-3",
    content: "Seismic category needs to match project seismic design category D. Current submittal references SDC C.",
    createdAt: "2026-02-11T09:00:00Z",
  },
  {
    id: "mc-17",
    documentId: "doc-33",
    authorId: "user-1",
    content: "Critical issue — SDC D requires additional lateral bracing. This needs an engineering review before approval.",
    createdAt: "2026-02-11T10:15:00Z",
  },
  {
    id: "mc-18",
    documentId: "doc-33",
    authorId: "user-2",
    content: "Engineering team reviewing now. Will provide updated calculations for SDC D within 48 hours.",
    createdAt: "2026-02-11T11:30:00Z",
  },
  {
    id: "mc-19",
    documentId: "doc-33",
    authorId: "user-4",
    content: "Flagging this for the weekly coordination meeting. Priority item for Thursday review.",
    createdAt: "2026-02-11T14:00:00Z",
  },

  // doc-34 — U-Bolt (Type 36) (1 comment)
  {
    id: "mc-20",
    documentId: "doc-34",
    authorId: "user-1",
    content: "U-bolt specification verified. HDG coating confirmed for exterior applications.",
    createdAt: "2026-02-10T16:00:00Z",
  },

  // doc-35 — Spring Hanger (Type 12) (3 comments)
  {
    id: "mc-21",
    documentId: "doc-35",
    authorId: "user-3",
    content: "Spring hanger travel range is 1\" — project has vertical movement up to 1.5\". Undersized.",
    createdAt: "2026-02-13T08:00:00Z",
  },
  {
    id: "mc-22",
    documentId: "doc-35",
    authorId: "user-1",
    content: "Agree. Need to upsize to B268 with 2\" travel range. Current model won't accommodate thermal expansion.",
    createdAt: "2026-02-13T09:30:00Z",
  },
  {
    id: "mc-23",
    documentId: "doc-35",
    authorId: "user-2",
    content: "Switching to B268 series. Updated submittal with 2\" travel will be uploaded by EOD.",
    createdAt: "2026-02-13T12:00:00Z",
  },
];

/** Get all comments for a specific material (document), sorted chronologically */
export function getMaterialComments(documentId: string): MaterialComment[] {
  return mockMaterialComments
    .filter((c) => c.documentId === documentId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

/** Get comment count for a material */
export function getMaterialCommentCount(documentId: string): number {
  return mockMaterialComments.filter((c) => c.documentId === documentId).length;
}
