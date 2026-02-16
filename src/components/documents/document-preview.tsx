"use client";

import { ZoomIn, ZoomOut, Download, FileSpreadsheet, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Document as DocType } from "@/data/types";
import { FullScreenPdfViewer } from "./full-screen-pdf-viewer";

function SpreadsheetViewer({ document }: { document: DocType }) {
  const mockData = [
    ["Equipment Tag", "Description", "Capacity", "Manufacturer", "Model", "Status"],
    ["AHU-1", "Air Handling Unit", "15,000 CFM", "Carrier", "39M-090", "Compliant"],
    ["CH-1", "Chiller", "200 Tons", "Trane", "CGAM-200", "Non-Compliant"],
    ["CT-1", "Cooling Tower", "250 Tons", "BAC", "CT-100", "Under Review"],
    ["FCU-1", "Fan Coil Unit", "1,200 CFM", "Daikin", "FWD-12", "Compliant"],
    ["EF-1", "Exhaust Fan", "5,000 CFM", "Greenheck", "CUBE-180", "Compliant"],
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-medium">{document.fileName}</h3>
      </div>
      <div className="rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {mockData[0].map((header, i) => (
                <TableHead key={i} className="text-xs whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.slice(1).map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j} className="text-xs whitespace-nowrap">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DocxViewer({ document }: { document: DocType }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <File className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-medium">{document.fileName}</h3>
      </div>
      <div className="rounded-lg border bg-white dark:bg-card p-8 shadow-sm space-y-4 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold">
          {document.specSectionTitle}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This document provides manufacturer certification and product data for
          the submitted material. The following sections detail compliance with
          project specification section {document.specSection}.
        </p>
        <div className="border-t pt-4 space-y-2">
          <h3 className="text-sm font-medium">Product Specifications</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Material properties, test results, and manufacturer certifications
            are included in the following pages. All testing was performed in
            accordance with applicable ASTM standards.
          </p>
        </div>
        <p className="text-xs text-muted-foreground italic mt-4">
          (Simulated document preview)
        </p>
      </div>
    </div>
  );
}

export function DocumentPreview({
  document,
  open,
  onOpenChange,
}: {
  document: DocType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!document) return null;

  // PDF files use the full-screen dialog viewer
  if (document.fileType === "pdf") {
    return (
      <FullScreenPdfViewer
        open={open}
        onOpenChange={onOpenChange}
        title={document.fileName}
        subtitle={document.specSectionTitle}
      />
    );
  }

  // XLSX and DOCX use the wider Sheet-based viewer
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[85vw] p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-3 space-y-0">
          <SheetTitle className="text-sm font-medium truncate pr-4">
            {document.fileName}
          </SheetTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Zoom in">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Zoom out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Download">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)]">
          {document.fileType === "xlsx" && (
            <SpreadsheetViewer document={document} />
          )}
          {document.fileType === "docx" && <DocxViewer document={document} />}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
