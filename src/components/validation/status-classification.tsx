import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { VALIDATION_STATUS_CONFIG } from "@/lib/constants";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { ValidationStatus } from "@/data/types";

const statusIcons = {
  pre_approved: CheckCircle2,
  review_required: AlertTriangle,
  action_mandatory: XCircle,
};

export function StatusClassification({
  status,
  size = "md",
  className,
}: {
  status: ValidationStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const config = VALIDATION_STATUS_CONFIG[status];
  const Icon = statusIcons[status];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md font-medium border-0 gap-1.5",
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {config.label}
    </Badge>
  );
}
