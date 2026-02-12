"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PROCESSING_STEPS } from "@/lib/constants";

interface ProcessingState {
  isRunning: boolean;
  currentStepIndex: number;
  currentStep: string;
  percentComplete: number;
  stepsCompleted: number;
  totalSteps: number;
  log: { timestamp: string; message: string; level: "info" | "success" | "warning" }[];
  isComplete: boolean;
}

const LOG_MESSAGES: Record<string, string[]> = {
  "Document Parsing": [
    "Scanning uploaded documents...",
    "Identified document structure and formatting.",
    "Parsed all documents successfully.",
  ],
  "Content Extraction": [
    "Extracting text content from documents...",
    "Identifying tables, schedules, and specifications...",
    "Content extraction complete. Multiple content blocks identified.",
  ],
  "Specification Matching": [
    "Loading project specification baseline...",
    "Matching submitted items against spec requirements...",
    "Specification matching complete.",
  ],
  "Compliance Analysis": [
    "Running AI compliance analysis...",
    "Evaluating conformance evidence for each item...",
    "Generating confidence scores...",
    "Compliance analysis complete.",
  ],
  "Report Generation": [
    "Compiling validation results...",
    "Generating evidence summaries...",
    "Report generation complete. Ready for review.",
  ],
};

export function useMockProcessing() {
  const [state, setState] = useState<ProcessingState>({
    isRunning: false,
    currentStepIndex: 0,
    currentStep: PROCESSING_STEPS[0],
    percentComplete: 0,
    stepsCompleted: 0,
    totalSteps: PROCESSING_STEPS.length,
    log: [],
    isComplete: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setState({
      isRunning: true,
      currentStepIndex: 0,
      currentStep: PROCESSING_STEPS[0],
      percentComplete: 0,
      stepsCompleted: 0,
      totalSteps: PROCESSING_STEPS.length,
      log: [
        {
          timestamp: new Date().toISOString(),
          message: "Starting AI validation pipeline...",
          level: "info",
        },
      ],
      isComplete: false,
    });
  }, []);

  useEffect(() => {
    if (!state.isRunning || state.isComplete) return;

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const newPercent = Math.min(prev.percentComplete + 2 + Math.random() * 3, 100);
        const newStepIndex = Math.min(
          Math.floor(newPercent / (100 / PROCESSING_STEPS.length)),
          PROCESSING_STEPS.length - 1
        );

        const newLog = [...prev.log];

        if (newStepIndex > prev.currentStepIndex) {
          const completedStep = PROCESSING_STEPS[prev.currentStepIndex];
          const msgs = LOG_MESSAGES[completedStep];
          if (msgs) {
            const lastMsg = msgs[msgs.length - 1];
            if (!newLog.some((l) => l.message === lastMsg)) {
              newLog.push({
                timestamp: new Date().toISOString(),
                message: lastMsg,
                level: "success",
              });
            }
          }

          const nextStep = PROCESSING_STEPS[newStepIndex];
          const nextMsgs = LOG_MESSAGES[nextStep];
          if (nextMsgs && nextMsgs[0]) {
            newLog.push({
              timestamp: new Date().toISOString(),
              message: nextMsgs[0],
              level: "info",
            });
          }
        } else if (Math.random() > 0.6) {
          const stepMsgs = LOG_MESSAGES[PROCESSING_STEPS[newStepIndex]];
          if (stepMsgs) {
            const unusedMsg = stepMsgs.find(
              (m) => !newLog.some((l) => l.message === m)
            );
            if (unusedMsg) {
              newLog.push({
                timestamp: new Date().toISOString(),
                message: unusedMsg,
                level: "info",
              });
            }
          }
        }

        const isComplete = newPercent >= 100;

        if (isComplete) {
          newLog.push({
            timestamp: new Date().toISOString(),
            message: "AI validation pipeline complete. All items processed.",
            level: "success",
          });
        }

        return {
          ...prev,
          percentComplete: Math.round(newPercent),
          currentStepIndex: newStepIndex,
          currentStep: PROCESSING_STEPS[newStepIndex],
          stepsCompleted: isComplete ? PROCESSING_STEPS.length : newStepIndex,
          log: newLog,
          isComplete,
          isRunning: !isComplete,
        };
      });
    }, 400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.isComplete]);

  return { ...state, start };
}
