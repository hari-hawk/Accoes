"use client";

import { cn } from "@/lib/utils";
import type { ConfidenceSummary as ConfidenceSummaryType } from "@/data/types";

export function ConfidenceSummary({
  data,
  size = "md",
  showLabel = true,
  className,
}: {
  data: ConfidenceSummaryType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const sizeMap = {
    sm: { ring: 36, stroke: 4, fontSize: "text-xs" },
    md: { ring: 48, stroke: 5, fontSize: "text-sm" },
    lg: { ring: 72, stroke: 6, fontSize: "text-lg" },
  };

  const { ring: diameter, stroke, fontSize } = sizeMap[size];
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const { preApproved, reviewRequired, actionMandatory, total } = data;

  if (total === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <svg width={diameter} height={diameter} className="rotate-[-90deg]">
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
        </svg>
        {showLabel && (
          <span className={cn("text-muted-foreground", fontSize)}>--</span>
        )}
      </div>
    );
  }

  const segments = [
    { value: preApproved / total, color: "var(--status-pre-approved)" },
    { value: reviewRequired / total, color: "var(--status-review-required)" },
    { value: actionMandatory / total, color: "var(--status-action-mandatory)" },
  ];

  let offset = 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width={diameter} height={diameter} className="rotate-[-90deg]">
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        {segments.map((segment, i) => {
          const dashLength = segment.value * circumference;
          const currentOffset = offset;
          offset += dashLength;
          if (segment.value === 0) return null;
          return (
            <circle
              key={i}
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {showLabel && (
        <span className={cn("font-medium", fontSize)}>
          {data.overallConfidence}%
        </span>
      )}
    </div>
  );
}
