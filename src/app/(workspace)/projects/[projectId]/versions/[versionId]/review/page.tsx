"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MousePointerClick,
  MessageSquare,
  RotateCcw,
  Lock,
  Download,
  FileText,
  Table2,
  FileSpreadsheet,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MaterialList } from "@/components/workspace/material-list";
import { EvidencePanel } from "@/components/workspace/evidence-panel";
import { useWorkspace } from "@/providers/workspace-provider";
import { useMaterials } from "@/hooks/use-materials";
import { cn } from "@/lib/utils";
import type { ExportFormat } from "@/data/types";

const EXPORT_FORMATS: {
  key: ExportFormat;
  label: string;
  icon: typeof FileText;
}[] = [
  { key: "pdf", label: "PDF Report", icon: FileText },
  { key: "csv", label: "CSV Data", icon: Table2 },
  { key: "xlsx", label: "Excel Report", icon: FileSpreadsheet },
];


export default function ReviewPage() {
  const { project, version } = useWorkspace();
  const searchParams = useSearchParams();
  const initialItemId = searchParams.get("item");
  const isReadOnly = searchParams.get("mode") === "readonly";

  const {
    materials,
    search,
    setSearch,
    statusFilter,
    toggleStatusFilter,
    clearStatusFilter,
    selectedId,
    setSelectedId,
    selectedMaterial,
    checkedIds,
    toggleCheck,
    decisions,
    updateDecision,
    batchApprove,
    batchRevisit,
    activeCategory,
    setActiveCategory,
  } = useMaterials(version.id);

  // Comment dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentPS, setCommentPS] = useState(true);
  const [commentPI, setCommentPI] = useState(true);
  const [commentText, setCommentText] = useState("");

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const exportItemCount = checkedIds.size > 0 ? checkedIds.size : materials.length;

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

  const resetExport = () => {
    setExportDialogOpen(false);
    setExporting(false);
    setExportProgress(0);
    setExportComplete(false);
  };

  // Auto-select: prioritize query param, otherwise first material
  useEffect(() => {
    if (initialItemId && materials.some((m) => m.document.id === initialItemId)) {
      setSelectedId(initialItemId);
    } else if (!selectedId && materials.length > 0) {
      setSelectedId(materials[0].document.id);
    }
  }, [materials, selectedId, setSelectedId, initialItemId]);

  // Default to PS tab
  useEffect(() => {
    if (activeCategory === "overall") {
      setActiveCategory("project_assets");
    }
  }, [activeCategory, setActiveCategory]);

  const handleBatchComment = () => {
    // Mock — in production this would send the comment
    setCommentDialogOpen(false);
    setCommentText("");
    setCommentPS(true);
    setCommentPI(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Read-only banner for historical files */}
      {isReadOnly && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 shrink-0">
          <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Historical record — view only. Comments and decisions from this version are preserved but cannot be edited.
          </span>
        </div>
      )}

      {/* Batch Actions Bar */}
      {!isReadOnly && checkedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 border-b bg-primary/5 border-b-primary/10 px-4 py-1.5 shrink-0" role="toolbar" aria-label="Batch actions for selected items">
          <span className="text-sm font-medium">
            {checkedIds.size} item{checkedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={batchApprove}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={batchRevisit}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Revisit
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={() => setCommentDialogOpen(true)}
              aria-label="Add comment"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExportDialogOpen(true)}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Split Layout */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={40} minSize={25}>
          <MaterialList
            materials={materials}
            selectedId={selectedId}
            checkedIds={checkedIds}
            decisions={decisions}
            search={search}
            statusFilter={statusFilter}
            onSelect={setSelectedId}
            onToggleCheck={toggleCheck}
            onSearchChange={setSearch}
            onToggleStatusFilter={toggleStatusFilter}
            onClearStatusFilter={clearStatusFilter}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={30}>
          {selectedMaterial ? (
            <EvidencePanel
              material={selectedMaterial}
              decision={decisions[selectedMaterial.document.id]}
              onDecide={(decision) =>
                updateDecision(selectedMaterial.document.id, decision)
              }
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              projectId={project.id}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MousePointerClick className="h-8 w-8 mb-3" />
              <p className="text-sm">Select a material to view details</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Add Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment to {checkedIds.size} Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Select which validations to comment on:
            </p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={commentPS}
                  onCheckedChange={(v) => setCommentPS(!!v)}
                />
                <span className="text-sm font-medium">PS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={commentPI}
                  onCheckedChange={(v) => setCommentPI(!!v)}
                />
                <span className="text-sm font-medium">PI</span>
              </label>
            </div>
            <Input
              placeholder="Type your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim() && (commentPS || commentPI)) {
                  handleBatchComment();
                }
              }}
              className="w-full"
              aria-label="Comment text"
            />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBatchComment}
              disabled={(!commentPS && !commentPI) || !commentText.trim()}
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Send Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={(open) => { if (!open) resetExport(); else setExportDialogOpen(true); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              Export {exportItemCount} {exportItemCount === 1 ? "Item" : "Items"}
            </DialogTitle>
          </DialogHeader>
          {!exportComplete ? (
            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">
                {checkedIds.size > 0
                  ? `Exporting ${checkedIds.size} selected items`
                  : "Exporting all materials in current view"}
              </p>
              {/* Format selection */}
              <div className="grid grid-cols-3 gap-2">
                {EXPORT_FORMATS.map((fmt) => {
                  const Icon = fmt.icon;
                  const isActive = exportFormat === fmt.key;
                  return (
                    <button
                      key={fmt.key}
                      type="button"
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all cursor-pointer",
                        isActive
                          ? "border-primary ring-1 ring-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      )}
                      onClick={() => setExportFormat(fmt.key)}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[11px] font-medium">{fmt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress */}
              {exporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Generating report...</span>
                    <span className="font-medium">{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-1.5" />
                </div>
              )}

              <Button
                className="w-full"
                size="sm"
                onClick={startExport}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Generate {EXPORT_FORMATS.find((f) => f.key === exportFormat)?.label}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-status-pre-approved/10 p-2.5">
                  <Check className="h-5 w-5 text-status-pre-approved" />
                </div>
              </div>
              <p className="text-sm font-medium">Report generated</p>
              <div className="flex items-center gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={resetExport}>
                  Close
                </Button>
                <Button size="sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download {exportFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
