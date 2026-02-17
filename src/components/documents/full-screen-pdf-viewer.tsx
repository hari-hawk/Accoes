"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCw,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Citation {
  id: string;
  label: string;
  page: number;
  excerpt: string;
}

interface FullScreenPdfViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  highlightText?: string;
  highlightPage?: number;
  citations?: Citation[];
  totalPages?: number;
}

export function FullScreenPdfViewer({
  open,
  onOpenChange,
  title,
  subtitle,
  highlightText,
  highlightPage,
  citations = [],
  totalPages = 1200,
}: FullScreenPdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(highlightPage ?? 234);
  const [zoom, setZoom] = useState(100);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[96vw] sm:max-w-[96vw] w-[96vw] h-[96vh] p-0 gap-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-sm font-semibold truncate">{title}</DialogTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body: PDF area + Citations sidebar */}
        <div className="flex flex-1 min-h-0">
          {/* Main PDF area */}
          <div className="flex-1 flex flex-col min-w-0">
            <ScrollArea className="flex-1">
              <div className="p-6 flex justify-center">
                <div className="w-full max-w-5xl bg-white dark:bg-card rounded-lg shadow-sm border p-8 space-y-6">
                  {/* Document header */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{subtitle || "Project Document"}</span>
                    <span>Page {currentPage}</span>
                  </div>

                  <h2 className="text-lg font-bold uppercase tracking-wide">
                    {title}
                  </h2>

                  {/* Highlight box */}
                  {highlightText && (
                    <div className="border-2 border-green-500 rounded-lg overflow-hidden">
                      <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 inline-block">
                        SPECIFICATION
                      </div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-3">
                        <p className="text-sm text-foreground">{highlightText}</p>
                      </div>
                    </div>
                  )}

                  {/* Simulated spec document content */}
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">PART 1 - GENERAL</h3>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">1.1 SUMMARY</h4>
                      <p className="mt-1">A. Section includes water-cooled, centrifugal liquid chillers with variable-speed drives.</p>
                      <p className="mt-1">B. Related Requirements:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-0.5">
                        <li>Section 23 05 00 - Common Work Results for HVAC</li>
                        <li>Section 23 05 93 - Testing, Adjusting, and Balancing for HVAC</li>
                        <li>Section 23 21 13 - Hydronic Piping</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">1.2 PERFORMANCE REQUIREMENTS</h4>
                      <p className="mt-1">A. Minimum cooling capacity: 500 tons at ARI 550/590 conditions.</p>
                      <p className="mt-1">B. Variable speed drives required for capacity modulation and energy efficiency.</p>
                      <p className="mt-1">C. Energy Efficiency:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-0.5">
                        <li>Full Load: Maximum 0.560 kW/ton</li>
                        <li>IPLV: Maximum 0.340 kW/ton</li>
                        <li>NPLV: Maximum 0.380 kW/ton</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">1.3 SUBMITTALS</h4>
                      <p className="mt-1">A. Product Data: Include rated capacities and operating characteristics.</p>
                      <p className="mt-1">B. Shop Drawings: Include plans, elevations, sections, and details.</p>
                      <p className="mt-1">C. Certificates: Energy efficiency certifications per ASHRAE 90.1.</p>
                    </div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pt-4">PART 2 - PRODUCTS</h3>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">2.1 MANUFACTURERS</h4>
                      <p className="mt-1">A. Basis-of-Design: Trane CenTraVac, or equal by:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-0.5">
                        <li>Carrier Corporation</li>
                        <li>Johnson Controls (York)</li>
                        <li>Daikin Applied</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">2.2 CHILLER ASSEMBLY</h4>
                      <p className="mt-1">A. Factory-assembled, single-piece water chiller.</p>
                      <p className="mt-1">B. Compressor: Hermetic centrifugal, direct-drive with VFD.</p>
                      <p className="mt-1">C. Refrigerant: R-134a or R-1233zd(E) low-GWP option.</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t text-center text-[10px] text-muted-foreground/60 italic">
                    Downtown Medical Center HVAC Renovation - Specification Document Rev 2.1
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-t bg-muted/30 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(25, z - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(200, z + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevPage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium min-w-[80px] text-center">
                {currentPage}/{totalPages}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextPage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Citations sidebar */}
          {citations.length > 0 && (
            <div className="w-[280px] border-l shrink-0 flex flex-col">
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-semibold">Citations ({citations.length})</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-3">
                  {citations.map((citation) => (
                    <button
                      key={citation.id}
                      type="button"
                      className="w-full text-left rounded-lg border p-3 hover:bg-muted/30 transition-colors space-y-2 cursor-pointer"
                      onClick={() => setCurrentPage(citation.page)}
                    >
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-[10px]">
                          {citation.label}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          Page {citation.page}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {citation.excerpt}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
