"use client";

import { useEffect } from "react";
import { CheckCircle2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { version } = useWorkspace();
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

  // Auto-select first material
  useEffect(() => {
    if (!selectedId && materials.length > 0) {
      setSelectedId(materials[0].document.id);
    }
  }, [materials, selectedId, setSelectedId]);

  return (
    <div className="flex h-full flex-col">
      {/* Batch Actions Bar */}
      {checkedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3 border-b bg-primary/5 px-4 py-2">
          <span className="text-sm font-medium">
            {checkedIds.size} item{checkedIds.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={batchApprove}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Approve All Selected
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
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MousePointerClick className="h-8 w-8 mb-3" />
              <p className="text-sm">Select a material to view details</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
