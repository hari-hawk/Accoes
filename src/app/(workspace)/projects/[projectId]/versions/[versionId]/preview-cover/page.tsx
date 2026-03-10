"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Pencil,
  Save,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWorkspace } from "@/providers/workspace-provider";
import { mockUsers } from "@/data/mock-users";
import { productIndexSections } from "@/data/mock-product-index";
import { getDocumentsByVersion } from "@/data/mock-documents";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Derive the binder title from project type */
function getBinderTitle(projectType: string): string {
  const titles: Record<string, string> = {
    dr: "PROCESS PIPING SUBMITTAL BINDER",
    design_job: "DESIGN BUILD SUBMITTAL BINDER",
  };
  return titles[projectType] ?? "SUBMITTAL BINDER";
}

/** Auto-generate a transmittal number from project jobId */
function generateTransmittalNumber(jobId: string): string {
  return `AT-${jobId}-001`;
}

/* -------------------------------------------------------------------------- */
/*  Read-only field — used in PDF view mode                                    */
/* -------------------------------------------------------------------------- */

function FieldDisplay({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function PreviewCoverPage() {
  const { project, version } = useWorkspace();
  const router = useRouter();

  // Read alternative item IDs from localStorage (set on conformance page)
  const [alternativeSpecTitles, setAlternativeSpecTitles] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`alternative-items-${version.id}`);
      if (stored) {
        const altIds = new Set(JSON.parse(stored) as string[]);
        // Map document IDs → specSectionTitles to match TOC itemDetail fields
        const docs = getDocumentsByVersion(version.id);
        const titles = new Set<string>();
        docs.forEach((doc) => {
          if (altIds.has(doc.id)) {
            titles.add(doc.specSectionTitle.toLowerCase());
          }
        });
        setAlternativeSpecTitles(titles);
      }
    } catch {
      // Ignore parse errors
    }
  }, [version.id]);

  // Build enhanced product index sections with dynamic isAlternate from conformance page
  const enhancedProductIndexSections = useMemo(() => {
    if (alternativeSpecTitles.size === 0) return productIndexSections;
    return productIndexSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        isAlternate:
          item.isAlternate ||
          alternativeSpecTitles.has(item.itemDetail.toLowerCase()),
      })),
    }));
  }, [alternativeSpecTitles]);

  // Sheet overlay for editing
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  // Project info edit state (auto-populated from project)
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editJobId, setEditJobId] = useState("");
  const [editProjectManager, setEditProjectManager] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editArchitect, setEditArchitect] = useState("");
  const [editEngineer, setEditEngineer] = useState("");
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editRevisedDate, setEditRevisedDate] = useState("");
  const [editRevisionNumber, setEditRevisionNumber] = useState("");

  // Transmittal-specific state (document-level, not project-level)
  const [description, setDescription] = useState("");
  const [submittedFor, setSubmittedFor] = useState<string>("review_approval");
  const [knownSubstitutions, setKnownSubstitutions] = useState<string>("no");
  const [notes, setNotes] = useState("");
  const [accoTransmittalNumber] = useState(() =>
    generateTransmittalNumber(project.jobId)
  );
  const [transmittalDate, setTransmittalDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [submittedBy, setSubmittedBy] = useState("");
  const [reviewStatus, setReviewStatus] = useState<string>("");
  const [reviewedBy, setReviewedBy] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  // Resolve PM name
  const pmName =
    project.projectManager === "__custom__"
      ? project.projectManagerCustom ?? ""
      : mockUsers.find((u) => u.id === project.projectManager)?.name ?? "";

  const startEdit = () => {
    setEditName(project.name);
    setEditLocation(project.location);
    setEditJobId(project.jobId);
    setEditProjectManager(
      project.projectManager === "__custom__"
        ? project.projectManagerCustom ?? ""
        : mockUsers.find((u) => u.id === project.projectManager)?.name ?? ""
    );
    setEditOwner(project.owner ?? "");
    setEditArchitect(project.architect ?? "");
    setEditEngineer(project.engineer ?? "");
    setEditCustomerId(project.customerId ?? "");
    setEditRevisedDate(project.revisedDate ?? "");
    setEditRevisionNumber(project.revisionNumber ?? "");
    setEditSheetOpen(true);
  };

  const saveEdit = () => {
    // Mock save — in production this would call an API
    setEditSheetOpen(false);
  };

  const cancelEdit = () => {
    setEditSheetOpen(false);
  };

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6 animate-fade-up">
        {/* ================================================================ */}
        {/*  Page Header                                                     */}
        {/* ================================================================ */}
        <div className="flex items-start justify-between">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2 py-1.5 transition-all cursor-pointer group"
              aria-label="Edit project details"
            >
              <Pencil className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Edit</span>
            </button>
            <Button
              size="sm"
              className="gap-1.5 gradient-action text-white border-0"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  PAGE 1: Binder Cover (always view mode)                         */}
        {/* ================================================================ */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 text-center">
            Page 1 — Binder Cover
          </p>
          <div
            className="mx-auto bg-white shadow-lg overflow-hidden"
            style={{ maxWidth: 680, aspectRatio: "8.5 / 11" }}
          >
            {/* Top section — blue accent bar */}
            <div className="bg-[#003366] h-2" />

            {/* Header with logo + project metadata */}
            <div className="px-8 pt-6 pb-4 flex justify-between items-start gap-6">
              {/* Left: project metadata */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div>
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                    Project Name
                  </p>
                  <p className="text-lg font-bold text-gray-900">{project.name}</p>
                </div>
                <p className="text-xs text-gray-600">
                  {project.location}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs pt-1">
                  <FieldDisplay label="ACCO Project Number" value={project.jobId} />
                  <FieldDisplay label="Customer" value={project.customerId ?? ""} />
                  <FieldDisplay label="Project Manager" value={pmName} />
                  <FieldDisplay label="Owner" value={project.owner ?? ""} />
                  <FieldDisplay label="Date" value={new Date(project.createdAt).toLocaleDateString()} />
                  <FieldDisplay label="Architect" value={project.architect ?? ""} />
                  <FieldDisplay
                    label="Revised Date"
                    value={project.revisedDate ? new Date(project.revisedDate).toLocaleDateString() : ""}
                  />
                  <FieldDisplay label="Engineer" value={project.engineer ?? ""} />
                  <FieldDisplay label="Revision #" value={project.revisionNumber ?? ""} />
                </div>
              </div>

              {/* Right: ACCO logo placeholder */}
              <div className="shrink-0 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <div className="h-8 w-8 rounded bg-[#003366] flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">A</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-[#003366] leading-none tracking-tight">
                      acco
                    </p>
                    <p className="text-[7px] text-gray-500 leading-tight">
                      engineered<br />systems
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Bold title */}
            <div className="px-8 py-6">
              <h2 className="text-2xl font-black text-[#003366] tracking-tight text-center">
                {getBinderTitle(project.projectType)}
              </h2>
            </div>

            {/* Hero image area */}
            <div
              className="mx-6 rounded-lg overflow-hidden relative"
              style={{ height: 200 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] via-[#2d5a87] to-[#1a3a5c] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3 opacity-30">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 w-3 bg-blue-300 rounded-full"
                        style={{ transform: `rotate(${i * 15 - 30}deg)` }}
                      />
                    ))}
                  </div>
                  <p className="text-white/40 text-xs">
                    Industrial Project Image
                  </p>
                </div>
              </div>
              {/* Decorative diagonal accent */}
              <div className="absolute top-0 left-0 w-24 h-full bg-[#FFD100]/20 -skew-x-12 -translate-x-6" />
            </div>

            {/* Footer */}
            <div className="bg-[#003366] mt-6 px-8 py-4 text-white">
              <p className="text-xs font-semibold">ACCO Engineered Systems</p>
              <p className="text-[10px] text-white/70 mt-0.5">
                5600 Owens Drive &bull; Pleasanton, CA 94588 &bull; (510) 316-4300
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  PAGE 2: Transmittal Form (always view mode)                     */}
        {/* ================================================================ */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 text-center">
            Page 2 — Transmittal
          </p>
          <div
            className="mx-auto bg-white shadow-lg overflow-hidden"
            style={{ maxWidth: 680 }}
          >
            {/* Top accent */}
            <div className="bg-[#003366] h-2" />

            {/* Header */}
            <div className="px-8 pt-6 pb-4 flex justify-between items-start border-b-2 border-[#003366]">
              <div>
                <h2 className="text-2xl font-bold italic text-[#003366]">
                  Transmittal
                </h2>
              </div>
              <div className="shrink-0">
                <div className="inline-flex items-center gap-1.5">
                  <div className="h-7 w-7 rounded bg-[#003366] flex items-center justify-center">
                    <span className="text-white text-[9px] font-black">A</span>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-[#003366] leading-none">acco</p>
                    <p className="text-[6px] text-gray-500 leading-tight">engineered<br />systems</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-column info grid */}
            <div className="px-8 py-4 grid grid-cols-2 gap-x-8 gap-y-2 border-b">
              {/* Left column */}
              <div className="space-y-2">
                <FieldDisplay label="Project Name" value={project.name} />
                <FieldDisplay label="Job Number" value={project.jobId} />
                <FieldDisplay label="Owner" value={project.owner ?? ""} />
                <FieldDisplay label="Customer" value={project.customerId ?? ""} />
              </div>

              {/* Right column */}
              <div className="space-y-2">
                <FieldDisplay label="ACCO Transmittal #" value={accoTransmittalNumber} />
                <FieldDisplay label="Transmittal Date" value={new Date(transmittalDate).toLocaleDateString()} />
                <FieldDisplay label="Revision #" value={project.revisionNumber ?? ""} />
                <FieldDisplay
                  label="Revision Date"
                  value={project.revisedDate ? new Date(project.revisedDate).toLocaleDateString() : ""}
                />
                <FieldDisplay label="Submitted By" value={submittedBy || pmName} />
              </div>
            </div>

            {/* Description */}
            <div className="px-8 py-4 border-b">
              <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider mb-2">
                Description
              </p>
              <div className="min-h-[60px] border rounded-md p-3 text-sm text-gray-700 bg-gray-50">
                {description || <span className="text-gray-400 italic">No description provided</span>}
              </div>
            </div>

            {/* Submitted For + Known Substitutions */}
            <div className="px-8 py-4 border-b">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider mb-2">
                    Submitted For
                  </p>
                  <RadioGroup
                    value={submittedFor}
                    onValueChange={setSubmittedFor}
                    disabled
                    className="space-y-1.5"
                  >
                    {[
                      { value: "review_approval", label: "Review & Approval" },
                      { value: "information", label: "Information" },
                      { value: "review_comment", label: "Review & Comment" },
                      { value: "record_only", label: "Record Only" },
                    ].map((opt) => (
                      <div key={opt.value} className="flex items-center gap-2">
                        <RadioGroupItem value={opt.value} id={`sf-${opt.value}`} />
                        <Label htmlFor={`sf-${opt.value}`} className="text-xs text-gray-700">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider mb-2">
                    Known Substitutions from Contract Documents/Specs
                  </p>
                  <RadioGroup
                    value={knownSubstitutions}
                    onValueChange={setKnownSubstitutions}
                    disabled
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="ks-no" />
                      <Label htmlFor="ks-no" className="text-xs text-gray-700">No</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="ks-yes" />
                      <Label htmlFor="ks-yes" className="text-xs text-gray-700">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="px-8 py-4 border-b">
              <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider mb-2">
                Notes
              </p>
              <div className="min-h-[60px] border rounded-md p-3 text-sm text-gray-700 bg-gray-50">
                {notes || <span className="text-gray-400 italic">No notes</span>}
              </div>
            </div>

            {/* Review Status */}
            <div className="px-8 py-4 border-b">
              <div className="flex items-start gap-8">
                <div className="flex-1">
                  <RadioGroup
                    value={reviewStatus}
                    onValueChange={setReviewStatus}
                    disabled
                    className="flex items-center gap-4"
                  >
                    {[
                      { value: "approved", label: "Approved" },
                      { value: "approved_as_noted", label: "Approved as Noted" },
                      { value: "not_approved", label: "Not Approved" },
                    ].map((opt) => (
                      <div key={opt.value} className="flex items-center gap-1.5">
                        <RadioGroupItem value={opt.value} id={`rs-${opt.value}`} />
                        <Label htmlFor={`rs-${opt.value}`} className="text-[11px] text-gray-700">
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <FieldDisplay label="Reviewed By" value={reviewedBy} />
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                    Signature
                  </p>
                  <div className="h-8 border border-dashed border-gray-300 rounded bg-gray-50" />
                </div>
                <FieldDisplay
                  label="Date"
                  value={reviewDate ? new Date(reviewDate).toLocaleDateString() : ""}
                />
              </div>
            </div>

            {/* Review Stamps */}
            <div className="px-8 py-4">
              <p className="text-xs font-bold text-center text-[#003366] uppercase tracking-wider mb-3">
                Review Stamps
              </p>
              <div className="grid grid-cols-3 gap-4">
                {["Architect", "Engineer", "General Contractor"].map((role) => (
                  <div key={role} className="text-center">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      {role}
                    </p>
                    <div className="h-20 border-2 border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
                      <span className="text-[10px] text-gray-300">&mdash;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="flex">
              <div className="flex-1 bg-[#003366] h-2" />
              <div className="w-1/4 bg-[#FFD100] h-2" />
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  PAGE 3: Product Index (read-only table)                        */}
        {/* ================================================================ */}
        <div className="bg-gray-100 rounded-2xl p-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 text-center">
            Page 3 — Product Index
          </p>
          <div
            className="mx-auto bg-white shadow-lg overflow-hidden"
            style={{ maxWidth: 680 }}
          >
            {/* Top accent */}
            <div className="bg-[#003366] h-2" />

            {/* Header */}
            <div className="px-8 pt-6 pb-4 border-b-2 border-[#003366]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#003366]">{project.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Plan & Specification Project</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#003366]">ACCO Job# {project.jobId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-medium text-gray-500">Material Index</span>
                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300">
                  Yellow = Alternate/Equal
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="border-b">
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366] w-[60px]">CATEGORY</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366] w-[36px]">ITEM</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366]">DESCRIPTION</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366]">ITEM DESCRIPTION</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366] w-[80px]">SIZE</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366] w-[120px]">SPECIFICATION</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#003366] w-[60px]">SPEC LOC</th>
                  </tr>
                </thead>
                <tbody>
                  {enhancedProductIndexSections.map((section) => (
                    <Fragment key={section.code}>
                      {/* Section header row */}
                      <tr className="bg-gray-100">
                        <td className="px-2 py-1.5 font-bold text-[#003366]">{section.code}</td>
                        <td className="px-2 py-1.5 font-bold text-[#003366]" colSpan={6}>{section.title}</td>
                      </tr>
                      {/* Section items */}
                      {section.items.map((item) => (
                        <tr
                          key={`${section.code}-${item.itemNumber}`}
                          className={cn(
                            "border-b border-gray-100 hover:bg-gray-50/50",
                            item.isAlternate && "bg-yellow-50"
                          )}
                        >
                          <td className="px-2 py-1 text-gray-600">{item.category}</td>
                          <td className="px-2 py-1 text-gray-600">{item.itemNumber}</td>
                          <td className="px-2 py-1 text-gray-700">{item.description}</td>
                          <td className="px-2 py-1 text-gray-700">{item.itemDetail}</td>
                          <td className="px-2 py-1 text-gray-600">{item.size}</td>
                          <td className="px-2 py-1 font-mono text-gray-500">{item.specification}</td>
                          <td className="px-2 py-1 text-gray-500">{item.specLocation}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex">
              <div className="flex-1 bg-[#003366] h-2" />
              <div className="w-1/4 bg-[#FFD100] h-2" />
            </div>
          </div>
        </div>

      </div>
      </div>

      {/* Sticky CTA bar at the bottom */}
      <div className="shrink-0 border-t bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-end">
          <Button
            size="lg"
            className="gradient-accent text-white border-0 gap-2 font-semibold px-8"
            onClick={() =>
              router.push(
                `/projects/${project.id}/versions/${version.id}/submittal-binder`
              )
            }
          >
            <BookOpen className="h-4 w-4" />
            Proceed to Submittal Binder
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Edit Project Details — Right-side Sheet                            */}
      {/* ------------------------------------------------------------------ */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[460px] flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b shrink-0">
            <SheetTitle className="text-base">Edit Project Details</SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-5">
            <div className="space-y-6">
              {/* Section: Project Information */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Project Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Job ID</label>
                    <Input value={editJobId} onChange={(e) => setEditJobId(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Manager</label>
                    <Input
                      value={editProjectManager}
                      onChange={(e) => setEditProjectManager(e.target.value)}
                      placeholder="Enter project manager name"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Owner</label>
                    <Input value={editOwner} onChange={(e) => setEditOwner(e.target.value)} placeholder="Owner name" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Architect</label>
                    <Input value={editArchitect} onChange={(e) => setEditArchitect(e.target.value)} placeholder="Architect name" className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Engineer</label>
                    <Input value={editEngineer} onChange={(e) => setEditEngineer(e.target.value)} placeholder="Engineer name" className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Customer ID</label>
                    <Input value={editCustomerId} onChange={(e) => setEditCustomerId(e.target.value)} placeholder="Manual entry" className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Revised Date</label>
                    <Input type="date" value={editRevisedDate} onChange={(e) => setEditRevisedDate(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Revision #</label>
                    <Input value={editRevisionNumber} onChange={(e) => setEditRevisionNumber(e.target.value)} placeholder="e.g. 3" className="h-9" />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Section: Transmittal Details */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Transmittal Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Transmittal Date</label>
                    <Input type="date" value={transmittalDate} onChange={(e) => setTransmittalDate(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Submitted By</label>
                    <Input value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} placeholder="Name" className="h-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter submittal description..."
                    className="min-h-[80px] text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes..."
                    className="min-h-[80px] text-sm"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Section: Review */}
              <div className="space-y-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Review</p>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Submitted For</label>
                  <Select value={submittedFor} onValueChange={setSubmittedFor}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review_approval">Review & Approval</SelectItem>
                      <SelectItem value="information">Information</SelectItem>
                      <SelectItem value="review_comment">Review & Comment</SelectItem>
                      <SelectItem value="record_only">Record Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Known Substitutions</label>
                  <Select value={knownSubstitutions} onValueChange={setKnownSubstitutions}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Review Status</label>
                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="approved_as_noted">Approved as Noted</SelectItem>
                        <SelectItem value="not_approved">Not Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Reviewed By</label>
                    <Input value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)} placeholder="Reviewer name" className="h-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Review Date</label>
                    <Input type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} className="h-9" />
                  </div>
                  <div />
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sticky footer */}
          <div className="border-t px-6 py-4 flex items-center gap-2 shrink-0 bg-background">
            <Button size="sm" onClick={saveEdit} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
            <Button variant="ghost" size="sm" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
