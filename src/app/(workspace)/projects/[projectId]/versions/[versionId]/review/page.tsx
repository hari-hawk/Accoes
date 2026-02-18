"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MousePointerClick,
  MessageSquare,
  RotateCcw,
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

  const {
    materials,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
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
    <div className="flex h-full flex-col">
      {/* Batch Actions Bar */}
      {checkedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 border-b bg-primary/5 px-4 py-2 shrink-0">
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
            onStatusFilterChange={setStatusFilter}
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
              className="w-full"
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
