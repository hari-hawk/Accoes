"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  Check,
  UserPlus,
  X,
  MapPin,
  Briefcase,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/data/mock-users";
import type { ProjectStatus, UserRole } from "@/data/types";

/* -------------------------------------------------------------------------- */
/*  Steps                                                                      */
/* -------------------------------------------------------------------------- */

const steps = [
  { label: "Upload", description: "Material Matrix" },
  { label: "Details", description: "Project Info" },
  { label: "Access", description: "Share Access" },
  { label: "Confirm", description: "Review & Create" },
];

interface MemberEntry {
  userId: string;
  role: UserRole;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);

  // Step 1: Upload
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Step 2: Auto-extracted fields (mock)
  const [projectName, setProjectName] = useState("");
  const [jobId, setJobId] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planning");

  // Step 3: Share access
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("submitter");

  const handleUpload = () => {
    // Simulate upload + extraction
    setUploadedFile("Material_Matrix_2026.xlsx");
    setProjectName("New Commercial Tower");
    setJobId("NCT-2026-001");
    setLocation("Chicago, IL");
    setClient("Apex Development Corp");
  };

  const handleAddMember = () => {
    if (!addEmail.trim()) return;
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === addEmail.toLowerCase() || u.name.toLowerCase().includes(addEmail.toLowerCase())
    );
    if (found) {
      setMembers((prev) => {
        if (prev.some((m) => m.userId === found.id)) return prev;
        return [...prev, { userId: found.id, role: addRole }];
      });
    }
    setAddEmail("");
  };

  const handleRemoveMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  const handleCreate = () => {
    // Mock create — in production this would call an API
    onOpenChange(false);
    // Reset
    setStep(0);
    setUploadedFile(null);
    setProjectName("");
    setJobId("");
    setLocation("");
    setClient("");
    setStatus("planning");
    setMembers([]);
  };

  const canNext =
    (step === 0 && uploadedFile) ||
    (step === 1 && projectName.trim() && jobId.trim()) ||
    step === 2 ||
    step === 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Upload a Material Matrix to get started
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i < step
                      ? "bg-status-pre-approved text-white"
                      : i === step
                        ? "gradient-accent text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs font-medium truncate">{s.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5 min-h-[280px]">
          {/* Step 1: Upload Material Matrix */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload a Material Matrix file. Project details will be
                auto-extracted.
              </p>
              {!uploadedFile ? (
                <div
                  className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center hover:border-nav-accent/40 transition-colors cursor-pointer"
                  onClick={handleUpload}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleUpload();
                  }}
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">
                    Click to upload Material Matrix
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF or Excel (.xlsx) up to 50MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/20">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile}
                    </p>
                    <p className="text-xs text-status-pre-approved mt-0.5">
                      Uploaded successfully — fields extracted
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Project Details (auto-extracted, editable) */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and edit the auto-extracted project details.
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Project Name
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project name..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Client
                  </label>
                  <Input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client name..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Job ID
                    </label>
                    <Input
                      value={jobId}
                      onChange={(e) => setJobId(e.target.value)}
                      placeholder="JOB-2026-001"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Location
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as ProjectStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Share Access */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add team members and assign roles for this project.
              </p>

              {/* Add member input */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="pl-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddMember();
                    }}
                  />
                </div>
                <Select
                  value={addRole}
                  onValueChange={(v) => setAddRole(v as UserRole)}
                >
                  <SelectTrigger className="w-[120px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitter">Submitter</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="global_viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddMember}>
                  Add
                </Button>
              </div>

              {/* Members list */}
              {members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((m) => {
                    const user = mockUsers.find((u) => u.id === m.userId);
                    if (!user) return null;
                    return (
                      <div
                        key={m.userId}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-[11px] font-bold gradient-accent text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {m.role === "global_viewer" ? "Viewer" : m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMember(m.userId)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No members added yet. You can skip this step.
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and confirm the project details.
              </p>

              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{projectName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {jobId}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{client}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {status === "planning" ? "Planning" : "Active"}
                  </Badge>
                  {uploadedFile && (
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      {uploadedFile}
                    </Badge>
                  )}
                </div>
                {members.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">
                      {members.length} member{members.length !== 1 ? "s" : ""} added
                    </p>
                    <div className="flex -space-x-2">
                      {members.map((m) => {
                        const user = mockUsers.find((u) => u.id === m.userId);
                        if (!user) return null;
                        return (
                          <Avatar key={m.userId} className="h-7 w-7 border-2 border-card">
                            <AvatarFallback className="text-[10px] font-bold gradient-accent text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep(step - 1))}
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>
          {step < 3 ? (
            <Button
              size="sm"
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCreate}
              className="gradient-gold text-white border-0 gap-1"
            >
              <Check className="h-4 w-4" />
              Create Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
