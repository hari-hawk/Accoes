"use client";

import { ProjectList } from "@/components/projects/project-list";

export default function ProjectV4ListingPage() {
  return (
    <ProjectList
      overviewBasePath="/project-v4"
      createHref="/project-v4/create"
      showPriority
    />
  );
}
