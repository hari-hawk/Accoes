"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_CONFIG,
  VERSION_STATUS_CONFIG,
  VALIDATION_STATUS_CONFIG,
} from "@/lib/constants";
import type { ProjectStatus, VersionStatus, ValidationStatus } from "@/data/types";

type StatusType = ProjectStatus | VersionStatus | ValidationStatus;

function getConfig(status: StatusType) {
  if (status in PROJECT_STATUS_CONFIG) {
    return PROJECT_STATUS_CONFIG[status as ProjectStatus];
  }
  if (status in VERSION_STATUS_CONFIG) {
    return VERSION_STATUS_CONFIG[status as VersionStatus];
  }
  if (status in VALIDATION_STATUS_CONFIG) {
    const config = VALIDATION_STATUS_CONFIG[status as ValidationStatus];
    return { label: config.label, color: `${config.bgColor} ${config.color}` };
  }
  return { label: status, color: "" };
}

export function StatusIndicator({
  status,
  className,
}: {
  status: StatusType;
  className?: string;
}) {
  const config = getConfig(status);

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md text-xs font-medium border-0",
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
