"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Printer,
  Pencil,
  Save,
  X,
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
import { useWorkspace } from "@/providers/workspace-provider";
import { mockUsers } from "@/data/mock-users";
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
/*  Read-only field — used in view mode                                        */
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
/*  Editable field — used in edit mode                                         */
/* -------------------------------------------------------------------------- */

function FieldEdit({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm bg-yellow-50/60 border-yellow-300 focus:border-yellow-500"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function PreviewCoverPage() {
  const { project, version } = useWorkspace();
  const router = useRouter();

  // Edit mode toggle
  const [editing, setEditing] = useState(false);

  // Project info edit state (auto-populated from project)
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editJobId, setEditJobId] = useState("");
  const [editProjectManager, setEditProjectManager] = useState("");
  const [editProjectManagerCustom, setEditProjectManagerCustom] = useState("");
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
    setEditProjectManager(project.projectManager);
    setEditProjectManagerCustom(project.projectManagerCustom ?? "");
    setEditOwner(project.owner ?? "");
    setEditArchitect(project.architect ?? "");
    setEditEngineer(project.engineer ?? "");
    setEditCustomerId(project.customerId ?? "");
    setEditRevisedDate(project.revisedDate ?? "");
    setEditRevisionNumber(project.revisionNumber ?? "");
    setEditing(true);
  };

  const saveEdit = () => {
    // Mock save — in production this would call an API
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const editPmName =
    editProjectManager === "__custom__"
      ? editProjectManagerCustom
      : mockUsers.find((u) => u.id === editProjectManager)?.name ?? "";

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-fade-up">
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
            {editing ? (
              <>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={saveEdit}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={cancelEdit}
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={startEdit}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 gradient-action text-white border-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/*  PAGE 1: Binder Cover                                            */}
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
              <div className="space-y-2 flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <FieldEdit label="Project Name" value={editName} onChange={setEditName} />
                    <FieldEdit label="Project Address" value={editLocation} onChange={setEditLocation} />
                    <div className="grid grid-cols-2 gap-2">
                      <FieldEdit label="ACCO Project Number" value={editJobId} onChange={setEditJobId} />
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Project Manager
                        </p>
                        <Select
                          value={editProjectManager}
                          onValueChange={(v) => {
                            setEditProjectManager(v);
                            if (v !== "__custom__") setEditProjectManagerCustom("");
                          }}
                        >
                          <SelectTrigger className="h-8 text-sm bg-yellow-50/60 border-yellow-300">
                            <SelectValue placeholder="Select PM" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockUsers.map((u) => (
                              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                            ))}
                            <SelectItem value="__custom__">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        {editProjectManager === "__custom__" && (
                          <Input
                            placeholder="PM name"
                            value={editProjectManagerCustom}
                            onChange={(e) => setEditProjectManagerCustom(e.target.value)}
                            className="h-8 text-sm mt-1 bg-yellow-50/60 border-yellow-300"
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <FieldEdit
                        label="Date"
                        value={project.createdAt.split("T")[0]}
                        onChange={() => {}}
                        type="date"
                      />
                      <FieldEdit
                        label="Revised Date"
                        value={editRevisedDate}
                        onChange={setEditRevisedDate}
                        type="date"
                      />
                      <FieldEdit
                        label="Revision #"
                        value={editRevisionNumber}
                        onChange={setEditRevisionNumber}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FieldEdit label="Customer" value={editCustomerId} onChange={setEditCustomerId} />
                      <FieldEdit label="Owner" value={editOwner} onChange={setEditOwner} />
                      <FieldEdit label="Architect" value={editArchitect} onChange={setEditArchitect} />
                      <FieldEdit label="Engineer" value={editEngineer} onChange={setEditEngineer} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
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
                )}
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
        {/*  PAGE 2: Transmittal Form                                        */}
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
                {editing ? (
                  <>
                    <FieldEdit label="Project Name" value={editName} onChange={setEditName} />
                    <FieldEdit label="Job Number" value={editJobId} onChange={setEditJobId} />
                    <FieldEdit label="Owner" value={editOwner} onChange={setEditOwner} />
                    <FieldEdit label="Customer" value={editCustomerId} onChange={setEditCustomerId} />
                  </>
                ) : (
                  <>
                    <FieldDisplay label="Project Name" value={project.name} />
                    <FieldDisplay label="Job Number" value={project.jobId} />
                    <FieldDisplay label="Owner" value={project.owner ?? ""} />
                    <FieldDisplay label="Customer" value={project.customerId ?? ""} />
                  </>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-2">
                <FieldDisplay label="ACCO Transmittal #" value={accoTransmittalNumber} />
                {editing ? (
                  <>
                    <FieldEdit
                      label="Transmittal Date"
                      value={transmittalDate}
                      onChange={setTransmittalDate}
                      type="date"
                    />
                    <FieldEdit
                      label="Revision #"
                      value={editRevisionNumber}
                      onChange={setEditRevisionNumber}
                    />
                    <FieldEdit
                      label="Revision Date"
                      value={editRevisedDate}
                      onChange={setEditRevisedDate}
                      type="date"
                    />
                    <FieldEdit
                      label="Submitted By"
                      value={submittedBy}
                      onChange={setSubmittedBy}
                    />
                  </>
                ) : (
                  <>
                    <FieldDisplay label="Transmittal Date" value={new Date(transmittalDate).toLocaleDateString()} />
                    <FieldDisplay label="Revision #" value={project.revisionNumber ?? ""} />
                    <FieldDisplay
                      label="Revision Date"
                      value={project.revisedDate ? new Date(project.revisedDate).toLocaleDateString() : ""}
                    />
                    <FieldDisplay label="Submitted By" value={submittedBy || pmName} />
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="px-8 py-4 border-b">
              <p className="text-[10px] font-bold text-[#003366] uppercase tracking-wider mb-2">
                Description
              </p>
              {editing ? (
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter submittal description..."
                  className="min-h-[80px] text-sm bg-yellow-50/60 border-yellow-300"
                />
              ) : (
                <div className="min-h-[60px] border rounded-md p-3 text-sm text-gray-700 bg-gray-50">
                  {description || <span className="text-gray-400 italic">No description provided</span>}
                </div>
              )}
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
                    disabled={!editing}
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
                    disabled={!editing}
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
              {editing ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes..."
                  className="min-h-[80px] text-sm bg-yellow-50/60 border-yellow-300"
                />
              ) : (
                <div className="min-h-[60px] border rounded-md p-3 text-sm text-gray-700 bg-gray-50">
                  {notes || <span className="text-gray-400 italic">No notes</span>}
                </div>
              )}
            </div>

            {/* Review Status */}
            <div className="px-8 py-4 border-b">
              <div className="flex items-start gap-8">
                <div className="flex-1">
                  <RadioGroup
                    value={reviewStatus}
                    onValueChange={setReviewStatus}
                    disabled={!editing}
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
                {editing ? (
                  <>
                    <FieldEdit label="Reviewed By" value={reviewedBy} onChange={setReviewedBy} />
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Signature
                      </p>
                      <div className="h-8 border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                        <span className="text-[10px] text-gray-400">Digital signature</span>
                      </div>
                    </div>
                    <FieldEdit label="Date" value={reviewDate} onChange={setReviewDate} type="date" />
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                      {editing ? (
                        <span className="text-[10px] text-gray-400">Click to add stamp</span>
                      ) : (
                        <span className="text-[10px] text-gray-300">—</span>
                      )}
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
        {/*  Proceed to Submittal Binder                                     */}
        {/* ================================================================ */}
        <div className="flex justify-end pt-2 pb-6">
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
    </div>
  );
}
