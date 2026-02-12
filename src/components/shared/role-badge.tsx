import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLE_CONFIG } from "@/lib/constants";
import type { UserRole } from "@/data/types";

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const config = ROLE_CONFIG[role];

  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md text-xs font-medium border-0", config.color, className)}
    >
      {config.label}
    </Badge>
  );
}
