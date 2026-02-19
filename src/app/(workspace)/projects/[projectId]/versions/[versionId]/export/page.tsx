"use client";

import { useState } from "react";
import {
  FileText,
  Table2,
  FileSpreadsheet,
  Download,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/providers/workspace-provider";
import { cn } from "@/lib/utils";
import type { ExportFormat } from "@/data/types";

const formats: {
  key: ExportFormat;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    key: "pdf",
    label: "PDF Report",
    description: "Comprehensive validation report with AI evidence and decisions",
    icon: FileText,
  },
  {
    key: "csv",
    label: "CSV Data Export",
    description: "Raw validation data for external analysis",
    icon: Table2,
  },
  {
    key: "xlsx",
    label: "Excel Report",
    description: "Detailed spreadsheet with item-by-item analysis",
    icon: FileSpreadsheet,
  },
];

export default function ExportPage() {
  const { project, version } = useWorkspace();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("pdf");
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeComments, setIncludeComments] = useState(true);
  const [includeAiReasoning, setIncludeAiReasoning] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const startExport = () => {
    setExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const next = prev + 8 + Math.random() * 12;
        if (next >= 100) {
          clearInterval(interval);
          setExportComplete(true);
          setExporting(false);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  return (
    <div className="absolute inset-0 overflow-auto">
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Export Report</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and download validation reports for {version.name}
        </p>
      </div>

      {/* Format Selection */}
      <div className="grid gap-3 sm:grid-cols-3">
        {formats.map((format) => (
          <Card
            key={format.key}
            className={cn(
              "cursor-pointer transition-all py-0",
              selectedFormat === format.key
                ? "border-primary ring-1 ring-primary"
                : "hover:border-muted-foreground/30"
            )}
            onClick={() => setSelectedFormat(format.key)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "rounded-lg p-2.5 mb-3",
                    selectedFormat === format.key
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  <format.icon
                    className={cn(
                      "h-6 w-6",
                      selectedFormat === format.key
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <p className="text-sm font-medium">{format.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Options */}
      <div className="rounded-lg border p-5 space-y-4">
        <h3 className="text-sm font-medium">Report Options</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="evidence"
              checked={includeEvidence}
              onCheckedChange={(v) => setIncludeEvidence(v === true)}
            />
            <Label htmlFor="evidence" className="text-sm">
              Include evidence snippets
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="comments"
              checked={includeComments}
              onCheckedChange={(v) => setIncludeComments(v === true)}
            />
            <Label htmlFor="comments" className="text-sm">
              Include review comments
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reasoning"
              checked={includeAiReasoning}
              onCheckedChange={(v) => setIncludeAiReasoning(v === true)}
            />
            <Label htmlFor="reasoning" className="text-sm">
              Include AI reasoning
            </Label>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {selectedFormat === "pdf" && (
        <div className="rounded-lg border">
          <div className="px-5 py-3 border-b">
            <h3 className="text-sm font-medium">Report Preview</h3>
          </div>
          <ScrollArea className="h-64">
            <div className="p-5 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-base">
                  Conformance Validation Report
                </h4>
                <p className="text-muted-foreground">
                  {project.name} - {version.name}
                </p>
              </div>
              <Separator />
              <div>
                <h5 className="font-medium mb-1">Executive Summary</h5>
                <p className="text-muted-foreground">
                  This report summarizes the AI-assisted validation of{" "}
                  {version.confidenceSummary.total} submittal documents against
                  the project specification ({version.specificationRef}).
                  Overall confidence score:{" "}
                  {version.confidenceSummary.overallConfidence}%.
                </p>
              </div>
              <div>
                <h5 className="font-medium mb-1">Compliance Overview</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    Pre-approved: {version.confidenceSummary.preApproved} items
                  </li>
                  <li>
                    Review required: {version.confidenceSummary.reviewRequired}{" "}
                    items
                  </li>
                  <li>
                    Action mandatory:{" "}
                    {version.confidenceSummary.actionMandatory} items
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-1">Item Details</h5>
                <p className="text-muted-foreground">
                  Detailed item-by-item analysis with evidence and AI reasoning
                  would appear here...
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Export Action */}
      {!exportComplete ? (
        <div className="space-y-3">
          {exporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Generating report...</span>
                <span className="font-medium">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
          <Button
            className="w-full"
            onClick={startExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate {formats.find((f) => f.key === selectedFormat)?.label}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-status-pre-approved/30 bg-status-pre-approved-bg/30 p-5 text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-status-pre-approved/10 p-3">
              <Check className="h-6 w-6 text-status-pre-approved" />
            </div>
          </div>
          <p className="text-sm font-medium">Report generated successfully</p>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download{" "}
            {selectedFormat === "pdf"
              ? "PDF"
              : selectedFormat === "csv"
                ? "CSV"
                : "XLSX"}
          </Button>
        </div>
      )}
    </div>
    </div>
  );
}
