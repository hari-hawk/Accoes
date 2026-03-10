"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  MousePointerClick,
  MessageSquare,
  RotateCcw,
  Lock,
  Download,
  Loader2,
  ArrowRight,
  BookOpen,
  Replace,
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
  const router = useRouter();
  const { project, version } = useWorkspace();
  const searchParams = useSearchParams();
  const initialItemId = searchParams.get("item");
  const isReadOnly = searchParams.get("mode") === "readonly";

  const {
    materials,
    allMaterials,
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
    indexCategoryFilter,
    toggleIndexCategoryFilter,
    clearIndexCategoryFilter,
    systemCategoryFilter,
    toggleSystemCategoryFilter,
    clearSystemCategoryFilter,
    indexCategories,
    systemCategories,
    sortBy,
    setSortBy,
    alternativeIds,
    toggleAlternative,
    batchToggleAlternative,
  } = useMaterials(version.id);

  // ── Review progress tracking ──
  const totalMaterials = allMaterials.length;
  const decidedCount = useMemo(() => {
    return allMaterials.filter((m) => {
      const d = decisions[m.document.id];
      return d && d !== "pending";
    }).length;
  }, [allMaterials, decisions]);
  const allDecided = totalMaterials > 0 && decidedCount === totalMaterials;
  const progressPercent = totalMaterials > 0 ? Math.round((decidedCount / totalMaterials) * 100) : 0;

  // Comment dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentPS, setCommentPS] = useState(true);
  const [commentPI, setCommentPI] = useState(true);
  const [commentText, setCommentText] = useState("");

  // Export state
  const [exporting, setExporting] = useState(false);

  const startExport = () => {
    setExporting(true);
    const count = checkedIds.size;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 8 + Math.random() * 12;
      if (progress >= 100) {
        clearInterval(interval);
        setExporting(false);
        toast.success("Export complete", {
          description: `${count} item${count !== 1 ? "s" : ""} exported as Excel`,
        });
      }
    }, 200);
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
              size="sm"
              variant="outline"
              onClick={batchToggleAlternative}
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <Replace className="mr-1.5 h-3.5 w-3.5" />
              Alternative
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
            indexCategoryFilter={indexCategoryFilter}
            systemCategoryFilter={systemCategoryFilter}
            indexCategories={indexCategories}
            systemCategories={systemCategories}
            sortBy={sortBy}
            alternativeIds={alternativeIds}
            onSelect={setSelectedId}
            onToggleCheck={toggleCheck}
            onSearchChange={setSearch}
            onToggleStatusFilter={toggleStatusFilter}
            onClearStatusFilter={clearStatusFilter}
            onIndexCategoryToggle={toggleIndexCategoryFilter}
            onIndexCategoryClear={clearIndexCategoryFilter}
            onSystemCategoryToggle={toggleSystemCategoryFilter}
            onSystemCategoryClear={clearSystemCategoryFilter}
            onSortChange={setSortBy}
            onToggleAlternative={toggleAlternative}
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

      {/* ── Review Progress Bar ── */}
      {!isReadOnly && (
        <div className="shrink-0 border-t bg-card px-4 py-2.5">
          <div className="flex items-center gap-4">
            {/* Progress segment */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative h-2 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                    allDecided
                      ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                      : "bg-primary/70"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {decidedCount}/{totalMaterials} reviewed
              </span>
            </div>

            {/* Proceed button */}
            <Button
              size="sm"
              className={`shrink-0 transition-all duration-300 ${
                allDecided
                  ? "gradient-accent text-white border-0 shadow-glow hover:opacity-90"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!allDecided}
              onClick={() =>
                router.push(
                  `/projects/${project.id}/versions/${version.id}/preview-cover`
                )
              }
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Proceed to Preview Cover Page
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

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

    </div>
  );
}
