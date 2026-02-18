"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, Loader2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMockProcessing } from "@/hooks/use-mock-processing";
import { PROCESSING_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ProcessingPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string; versionId: string }>();
  const processing = useMockProcessing();

  // Auto-start processing on mount
  useEffect(() => {
    if (!processing.isRunning && !processing.isComplete) {
      processing.start();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0 overflow-auto">
    <div className="mx-auto max-w-2xl p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold">AI Processing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing documents against project specifications
        </p>
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width={160} height={160} className="rotate-[-90deg]">
            <circle
              cx={80}
              cy={80}
              r={70}
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              className="text-muted"
            />
            <circle
              cx={80}
              cy={80}
              r={70}
              fill="none"
              stroke="currentColor"
              strokeWidth={8}
              className="text-primary transition-all duration-300"
              strokeDasharray={`${(processing.percentComplete / 100) * 2 * Math.PI * 70} ${2 * Math.PI * 70}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{processing.percentComplete}%</span>
            <span className="text-xs text-muted-foreground">
              {processing.isComplete ? "Complete" : "Processing"}
            </span>
          </div>
        </div>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-3">
        {PROCESSING_STEPS.map((step, index) => {
          const isComplete = index < processing.stepsCompleted;
          const isCurrent =
            index === processing.currentStepIndex && processing.isRunning;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                  isComplete
                    ? "border-primary bg-primary"
                    : isCurrent
                      ? "border-primary"
                      : "border-muted"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                ) : isCurrent ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  isComplete
                    ? "text-foreground"
                    : isCurrent
                      ? "text-foreground"
                      : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Processing Log */}
      <div className="rounded-lg border">
        <div className="px-4 py-2 border-b">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Processing Log
          </p>
        </div>
        <ScrollArea className="h-40">
          <div className="p-3 space-y-1 font-mono text-xs">
            {processing.log.map((entry, i) => (
              <p
                key={i}
                className={cn(
                  entry.level === "success"
                    ? "text-status-pre-approved"
                    : entry.level === "warning"
                      ? "text-status-review-required"
                      : "text-muted-foreground"
                )}
              >
                {entry.message}
              </p>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Auto-navigate to review when complete */}
      {processing.isComplete && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Processing complete. Ready for review.
          </p>
          <Button
            onClick={() =>
              router.push(
                `/projects/${params.projectId}/versions/${params.versionId}/review`
              )
            }
          >
            Continue to Review
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}
