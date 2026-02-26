"use client";

import { FileText, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";

export default function PreviewCoverPage() {
  const { project, version } = useWorkspace();

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-fade-up">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Preview Cover Page
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Submittal cover sheet preview for {project.name} — {version.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button size="sm" className="gap-1.5 gradient-action text-white border-0">
              <Download className="h-3.5 w-3.5" />
              Export Cover
            </Button>
          </div>
        </div>

        {/* Cover page preview card */}
        <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/30">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Cover Page Preview</h2>
          </div>

          {/* Simulated cover page */}
          <div className="p-8">
            <div className="mx-auto max-w-2xl border rounded-lg bg-white shadow-sm p-10 space-y-8">
              {/* Header */}
              <div className="text-center border-b pb-6 space-y-2">
                <p className="text-xs tracking-widest text-muted-foreground uppercase">
                  Submittal Cover Sheet
                </p>
                <h2 className="text-2xl font-bold text-foreground">
                  {project.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {project.client}
                </p>
              </div>

              {/* Project details grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">
                    Project Number
                  </p>
                  <p className="font-medium">{project.jobId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">
                    Location
                  </p>
                  <p className="font-medium">{project.location}</p>
                </div>
                {project.owner && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Owner
                    </p>
                    <p className="font-medium">
                      {project.owner}
                      {project.ownerCompany && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {project.ownerCompany}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {project.architect && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Architect
                    </p>
                    <p className="font-medium">
                      {project.architect}
                      {project.architectCompany && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {project.architectCompany}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {project.engineer && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Engineer
                    </p>
                    <p className="font-medium">
                      {project.engineer}
                      {project.engineerCompany && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {project.engineerCompany}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {project.customerId && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">
                      Customer ID
                    </p>
                    <p className="font-medium">{project.customerId}</p>
                  </div>
                )}
              </div>

              {/* Revision info */}
              {(project.revisedDate || project.revisionNumber) && (
                <div className="border-t pt-4 flex gap-8 text-sm">
                  {project.revisedDate && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">
                        Revised Date
                      </p>
                      <p className="font-medium">
                        {new Date(project.revisedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {project.revisionNumber && (
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">
                        Revision #
                      </p>
                      <p className="font-medium">{project.revisionNumber}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Date stamp */}
              <div className="border-t pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Generated {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
