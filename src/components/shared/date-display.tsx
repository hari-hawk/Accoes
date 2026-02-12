"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DateDisplay({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time
          dateTime={date}
          className={cn("text-sm text-muted-foreground", className)}
        >
          {formatDate(date)}
        </time>
      </TooltipTrigger>
      <TooltipContent>
        <p>{formatRelativeTime(date)}</p>
      </TooltipContent>
    </Tooltip>
  );
}
