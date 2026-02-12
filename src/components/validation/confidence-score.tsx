"use client";

import { cn } from "@/lib/utils";

export function ConfidenceScore({
  score,
  size = "lg",
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: { diameter: 36, stroke: 3, fontSize: "text-xs" },
    md: { diameter: 56, stroke: 4, fontSize: "text-sm" },
    lg: { diameter: 80, stroke: 6, fontSize: "text-xl" },
  };

  const { diameter, stroke, fontSize } = sizeMap[size];
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90
      ? "text-confidence-high"
      : score >= 70
        ? "text-confidence-medium"
        : "text-confidence-low";

  return (
    <div className={cn("relative inline-flex", className)}>
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
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={cn(color, "transition-all duration-500")}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-semibold", fontSize)}>{score}%</span>
      </div>
    </div>
  );
}
