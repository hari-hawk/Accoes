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
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

  // Export state
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

  const resetExport = () => {
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
            <Button size="sm" variant="outline" onClick={batchRevisit}>
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
              onClick={startExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export
                </>
              )}
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

      {/* Export complete notification */}
      {exportComplete && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3 shadow-lg">
            <div className="rounded-full bg-status-pre-approved/10 p-1.5">
              <Check className="h-4 w-4 text-status-pre-approved" />
            </div>
            <div>
              <p className="text-sm font-medium">Export complete</p>
              <p className="text-xs text-muted-foreground">{checkedIds.size} items exported as Excel</p>
            </div>
            <Button size="sm" variant="ghost" className="ml-2 h-7 text-xs" onClick={resetExport}>
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
