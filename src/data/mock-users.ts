import type { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@accoes.com",
    avatarUrl: "https://i.pravatar.cc/150?u=user-1",
    role: "admin",
  },
  {
    id: "user-2",
    name: "James Chen",
    email: "james.chen@accoes.com",
    avatarUrl: "https://i.pravatar.cc/150?u=user-2",
    role: "submitter",
  },
  {
    id: "user-3",
    name: "Maria Garcia",
    email: "maria.garcia@contractor.com",
    avatarUrl: "https://i.pravatar.cc/150?u=user-3",
    role: "reviewer",
  },
  {
    id: "user-4",
    name: "David Park",
    email: "david.park@accoes.com",
    avatarUrl: "https://i.pravatar.cc/150?u=user-4",
    role: "global_viewer",
  },
];

export const currentUser = mockUsers[0];
