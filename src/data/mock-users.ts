import type { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@accoes.com",
    role: "owner",
  },
  {
    id: "user-2",
    name: "James Chen",
    email: "james.chen@accoes.com",
    role: "collaborator",
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
    role: "collaborator",
  },
];

export const currentUser = mockUsers[0];
