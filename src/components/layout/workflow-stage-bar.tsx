"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStage } from "@/data/types";

/** Inline tab bar for version workspace: Overview / Conformance / Upload */
const TABS = [
  { key: "overview", label: "Overview", icon: FolderKanban, path: "" },
  { key: "review", label: "Conformance", icon: CheckCircle2, path: "/review" },
  { key: "upload", label: "Upload", icon: ShieldCheck, path: "/upload" },
] as const;

export function WorkflowStageBar({
  projectId,
  versionId,
}: {
  currentStage: WorkflowStage;
  projectId: string;
  versionId: string;
}) {
  const pathname = usePathname();
  const base = `/projects/${projectId}/versions/${versionId}`;

  function getActiveTab() {
    if (pathname.includes("/review")) return "review";
    if (pathname.includes("/upload")) return "upload";
    if (pathname.includes("/processing")) return "review";
    if (pathname.includes("/export")) return "review";
    return "overview";
  }

  const activeTab = getActiveTab();

  return (
    <nav
      className="flex items-center gap-1 px-4 py-2 border-b bg-background"
      aria-label="Version tabs"
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        const Icon = tab.icon;
        const href = `${base}${tab.path}`;

        return (
          <Link
            key={tab.key}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
