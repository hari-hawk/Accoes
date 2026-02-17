"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MousePointerClick,
  MessageSquare,
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
    clearChecks,
    decisions,
    updateDecision,
    batchApprove,
    activeCategory,
    setActiveCategory,
  } = useMaterials(version.id);

  // Batch action dialog state
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [approvePS, setApprovePS] = useState(true);
  const [approvePI, setApprovePI] = useState(true);
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

  const handleBatchApprove = () => {
    batchApprove();
    setApproveDialogOpen(false);
    setApprovePS(true);
    setApprovePI(true);
  };

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
        <div className="flex items-center justify-between gap-3 border-b bg-primary/5 px-4 py-2">
          <span className="text-sm font-medium">
            {checkedIds.size} item{checkedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setApproveDialogOpen(true)}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCommentDialogOpen(true)}
            >
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Add Comment
            </Button>
            <Button size="sm" variant="ghost" onClick={clearChecks}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Split Layout */}
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
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

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Approve {checkedIds.size} Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Select which validations to approve for the selected items:
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={approvePS}
                  onCheckedChange={(v) => setApprovePS(!!v)}
                />
                <span className="text-sm font-medium">
                  Project Specifications (PS)
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={approvePI}
                  onCheckedChange={(v) => setApprovePI(!!v)}
                />
                <span className="text-sm font-medium">
                  Project Index (PI)
                </span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBatchApprove}
              disabled={!approvePS && !approvePI}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
