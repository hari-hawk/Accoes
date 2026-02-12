"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  User,
  Calendar,
  Zap,
  Plus,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ConformanceItem {
  id: string;
  documentName: string;
  specSection: string;
  status: "conforming" | "non_conforming" | "partial";
  score: number;
  project: string;
  lastChecked: string;
  reviewer: string;
}

interface ConformanceVersion {
  id: string;
  label: string;
  date: string;
  score: number;
  status: "conforming" | "non_conforming" | "partial";
}

/* -------------------------------------------------------------------------- */
/*  Mock version history per conformance item                                  */
/* -------------------------------------------------------------------------- */

const mockVersionHistory: Record<string, ConformanceVersion[]> = {
  c1: [
    { id: "cv1a", label: "Rev A", date: "Jan 10, 2026", score: 82, status: "partial" },
    { id: "cv1b", label: "Rev B", date: "Jan 28, 2026", score: 96, status: "conforming" },
  ],
  c2: [
    { id: "cv2a", label: "Rev A", date: "Jan 25, 2026", score: 92, status: "conforming" },
  ],
  c3: [
    { id: "cv3a", label: "Rev A", date: "Jan 5, 2026", score: 61, status: "non_conforming" },
    { id: "cv3b", label: "Rev B", date: "Jan 22, 2026", score: 74, status: "partial" },
  ],
  c4: [
    { id: "cv4a", label: "Rev A", date: "Jan 20, 2026", score: 45, status: "non_conforming" },
  ],
  c5: [
    { id: "cv5a", label: "Rev A", date: "Jan 18, 2026", score: 98, status: "conforming" },
  ],
  c6: [
    { id: "cv6a", label: "Rev A", date: "Dec 28, 2025", score: 52, status: "non_conforming" },
    { id: "cv6b", label: "Rev B", date: "Jan 15, 2026", score: 68, status: "partial" },
  ],
  c7: [
    { id: "cv7a", label: "Rev A", date: "Jan 12, 2026", score: 89, status: "conforming" },
  ],
  c8: [
    { id: "cv8a", label: "Rev A", date: "Jan 10, 2026", score: 38, status: "non_conforming" },
  ],
};

const statusConfig = {
  conforming: {
    label: "Conforming",
    icon: CheckCircle2,
    color: "text-status-pre-approved",
    bg: "bg-status-pre-approved-bg",
  },
  partial: {
    label: "Partial",
    icon: AlertTriangle,
    color: "text-status-review-required",
    bg: "bg-status-review-required-bg",
  },
  non_conforming: {
    label: "Non-conforming",
    icon: XCircle,
    color: "text-status-action-mandatory",
    bg: "bg-status-action-mandatory-bg",
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ConformanceDetailSheet({
  item,
  open,
  onOpenChange,
  mode,
}: {
  item: ConformanceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "create";
}) {
  const [project, setProject] = useState("");
  const [specSection, setSpecSection] = useState("");
  const [versionLabel, setVersionLabel] = useState("");

  const isCreate = mode === "create";
  const versions = item ? (mockVersionHistory[item.id] ?? []) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl w-full flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          {isCreate ? (
            <>
              <SheetTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                New Conformance
              </SheetTitle>
              <SheetDescription>
                Create a new conformance check against project specifications
              </SheetDescription>
            </>
          ) : item ? (
            <>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg truncate">
                  {item.documentName}
                </SheetTitle>
                {(() => {
                  const sc = statusConfig[item.status];
                  const StatusIcon = sc.icon;
                  return (
                    <Badge
                      variant="secondary"
                      className={cn("gap-1 shrink-0", sc.bg, sc.color)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {sc.label}
                    </Badge>
                  );
                })()}
              </div>
              <SheetDescription>{item.project}</SheetDescription>
            </>
          ) : null}
        </SheetHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* ============================================================ */}
            {/*  Create mode: Project & Spec selector                        */}
            {/* ============================================================ */}
            {isCreate && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Project
                  </label>
                  <Select value={project} onValueChange={setProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proj-1">
                        Riverside Commercial Tower
                      </SelectItem>
                      <SelectItem value="proj-2">
                        Harbor District Mixed Use
                      </SelectItem>
                      <SelectItem value="proj-3">
                        Metro Line Extension Phase 3
                      </SelectItem>
                      <SelectItem value="proj-5">
                        Downtown Office Renovation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Spec Section
                  </label>
                  <Select value={specSection} onValueChange={setSpecSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="03-31">
                        03 31 00 — Structural Concrete
                      </SelectItem>
                      <SelectItem value="05-12">
                        05 12 00 — Structural Steel
                      </SelectItem>
                      <SelectItem value="23-34">
                        23 34 00 — HVAC Equipment
                      </SelectItem>
                      <SelectItem value="09-29">
                        09 29 00 — Gypsum Board
                      </SelectItem>
                      <SelectItem value="08-44">
                        08 44 00 — Curtain Wall
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Version Label
                  </label>
                  <Input
                    placeholder="e.g. Rev A, Initial Submittal..."
                    value={versionLabel}
                    onChange={(e) => setVersionLabel(e.target.value)}
                  />
                </div>
                <Separator />
              </div>
            )}

            {/* ============================================================ */}
            {/*  View mode: Item details                                      */}
            {/* ============================================================ */}
            {!isCreate && item && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="font-mono font-semibold">
                      {item.specSection}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{item.reviewer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.lastChecked}</span>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "font-bold text-sm",
                        item.score >= 80
                          ? "text-status-pre-approved"
                          : item.score >= 60
                            ? "text-status-review-required"
                            : "text-status-action-mandatory"
                      )}
                    >
                      {item.score}% conformance
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/*  Conformance Versions                                         */}
            {/* ============================================================ */}
            {!isCreate && versions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Version History ({versions.length})
                  </h4>
                  <div className="space-y-2">
                    {versions.map((ver) => {
                      const vc = statusConfig[ver.status];
                      const VIcon = vc.icon;
                      const barColor =
                        ver.score >= 80
                          ? "bg-status-pre-approved"
                          : ver.score >= 60
                            ? "bg-status-review-required"
                            : "bg-status-action-mandatory";
                      return (
                        <div
                          key={ver.id}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs shrink-0 gap-1",
                              vc.bg,
                              vc.color
                            )}
                          >
                            <VIcon className="h-3 w-3" />
                            {ver.label}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                {ver.date}
                              </span>
                              <span
                                className={cn(
                                  "font-bold",
                                  ver.score >= 80
                                    ? "text-status-pre-approved"
                                    : ver.score >= 60
                                      ? "text-status-review-required"
                                      : "text-status-action-mandatory"
                                )}
                              >
                                {ver.score}%
                              </span>
                            </div>
                            <div className="h-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  barColor
                                )}
                                style={{ width: `${ver.score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* ============================================================ */}
            {/*  Upload Documents                                             */}
            {/* ============================================================ */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                {isCreate ? "Upload Documents" : "Upload New Version"}
              </h4>

              <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 text-center hover:border-nav-accent/40 transition-colors cursor-pointer">
                <div className="mx-auto w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  Drop submittal documents here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, XLSX, DOCX up to 50MB each
                </p>
              </div>

              {/* Mock uploaded file */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="rounded-lg bg-muted p-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {isCreate
                      ? "Submittal_Document.pdf"
                      : `${item?.documentName ?? "Document"}_Rev_New.pdf`}
                  </p>
                  <p className="text-xs text-muted-foreground">2.4 MB</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-status-pre-approved shrink-0" />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t">
          {isCreate ? (
            <Button
              className="w-full gradient-accent text-white border-0 shadow-glow hover:opacity-90"
              disabled={!project || !specSection}
            >
              <Zap className="mr-1.5 h-4 w-4" />
              Run Conformance Check
            </Button>
          ) : (
            <Button className="w-full gradient-gold text-white border-0 shadow-gold hover:opacity-90">
              <Upload className="mr-1.5 h-4 w-4" />
              Upload New Version
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
