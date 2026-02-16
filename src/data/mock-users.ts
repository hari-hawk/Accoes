import type { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@accoes.com",
    role: "admin",
  },
  {
    id: "user-2",
    name: "James Chen",
    email: "james.chen@accoes.com",
    role: "submitter",
  },
  {
    id: "user-3",
    name: "Maria Garcia",
    email: "maria.garcia@contractor.com",
    role: "reviewer",
  },
  {
    id: "user-4",
    name: "David Park",
    email: "david.park@accoes.com",
    role: "global_viewer",
  },
];

export const currentUser = mockUsers[0];
