"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Download,
  ArrowLeft,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/providers/workspace-provider";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                    */
/* -------------------------------------------------------------------------- */

const TOTAL_PAGES = 13;
const LOADING_DURATION_MS = 2500;

/* -------------------------------------------------------------------------- */
/*  Reusable page wrapper — renders each "paper" page                          */
/* -------------------------------------------------------------------------- */

function PaperPage({
  pageNumber,
  children,
  id,
}: {
  pageNumber: number;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div
      id={id}
      data-page={pageNumber}
      className="bg-white dark:bg-card rounded-lg shadow-md border mx-auto"
      style={{
        width: "100%",
        maxWidth: "816px",
        minHeight: "1056px",
        padding: "48px",
        breakInside: "avoid",
      }}
    >
      {children}
      {/* Page footer */}
      <div className="mt-auto pt-6 flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-200">
        <span>ACCO Engineered Systems — Confidential</span>
        <span>Page {pageNumber} of {TOTAL_PAGES}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table helper                                                                */
/* -------------------------------------------------------------------------- */

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-card" : "bg-gray-50 dark:bg-muted/20"}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-600 dark:text-gray-400 border-b border-gray-100 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Individual page content components                                         */
/* -------------------------------------------------------------------------- */

function Page1BinderCover({ projectName, client, jobId, location }: { projectName: string; client: string; jobId: string; location: string }) {
  return (
    <div className="flex flex-col h-full min-h-[900px]">
      {/* Navy header bar */}
      <div className="rounded-t-lg px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "#003366" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">ACCO ENGINEERED SYSTEMS</p>
            <p className="text-white/60 text-[10px]">Excellence in Mechanical Contracting</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-[10px]">Job No.</p>
          <p className="text-white font-bold text-sm">{jobId}</p>
        </div>
      </div>

      {/* Yellow accent bar */}
      <div className="h-1.5" style={{ backgroundColor: "#FFD100" }} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Submittal Package</p>
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: "#003366" }}>
            Process Piping<br />Submittal Binder
          </h1>
          <div className="h-0.5 w-24 mx-auto" style={{ backgroundColor: "#FFD100" }} />
        </div>

        {/* Hero image placeholder */}
        <div className="w-full max-w-md h-40 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-xs text-gray-400">Project Image / Blueprint</p>
        </div>

        {/* Project metadata grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-left text-sm max-w-lg">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Project</p>
            <p className="text-gray-800 font-medium">{projectName}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Client</p>
            <p className="text-gray-800 font-medium">{client}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Location</p>
            <p className="text-gray-800 font-medium">{location}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</p>
            <p className="text-gray-800 font-medium">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-b-lg px-6 py-3 text-center" style={{ backgroundColor: "#003366" }}>
        <p className="text-white/60 text-[10px]">ACCO Engineered Systems &bull; Mechanical Contractors &bull; Plumbing &bull; HVAC</p>
      </div>
    </div>
  );
}

function Page2Transmittal({ projectName, jobId }: { projectName: string; jobId: string }) {
  return (
    <div className="space-y-5">
      <div className="text-center border-b border-gray-200 pb-4">
        <p className="text-xs font-semibold text-gray-500 tracking-[0.15em] uppercase">ACCO Engineered Systems</p>
        <h2 className="text-xl font-bold mt-1" style={{ color: "#003366" }}>Transmittal</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">To:</span><span className="text-gray-800">General Contractor</span></div>
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">Attention:</span><span className="text-gray-800">Project Engineer</span></div>
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">Project:</span><span className="text-gray-800">{projectName}</span></div>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">Date:</span><span className="text-gray-800">{new Date().toLocaleDateString("en-US")}</span></div>
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">Job No:</span><span className="text-gray-800">{jobId}</span></div>
          <div className="flex gap-2"><span className="font-semibold text-gray-500 w-20">Transmittal #:</span><span className="text-gray-800">TR-{jobId}-001</span></div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase">Description</p>
        <p className="text-sm text-gray-700">
          Submittal for Section 220553 — Identification for Plumbing Piping. This package includes material conformance data,
          specification cross-references, product data sheets, and supporting documentation for all plumbing identification materials.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="font-semibold text-gray-500 uppercase text-[10px]">Submitted For</p>
          <div className="space-y-1">
            {["Approval", "Approval as Noted", "Information Only", "Review & Comment"].map((opt, i) => (
              <label key={opt} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full border-2 ${i === 0 ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                  {i === 0 && <div className="h-1 w-1 bg-white rounded-full mx-auto mt-[3px]" />}
                </div>
                <span className={i === 0 ? "text-gray-800 font-medium" : "text-gray-500"}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="font-semibold text-gray-500 uppercase text-[10px]">Review Status</p>
          <div className="space-y-1">
            {["No Exception Taken", "Make Corrections Noted", "Revise & Resubmit", "Rejected"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-gray-300" />
                <span className="text-gray-500">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">Review Stamps</p>
        <div className="grid grid-cols-3 gap-3">
          {["Contractor", "Architect", "Engineer"].map((role) => (
            <div key={role} className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-[10px] text-gray-400 mb-4">{role} Stamp</p>
              <div className="border-t border-gray-200 pt-2">
                <p className="text-[10px] text-gray-400">Date: _______________</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Page3TableOfContents() {
  const items = [
    { section: "1", title: "Binder Cover", page: "1" },
    { section: "2", title: "Transmittal", page: "2" },
    { section: "3", title: "Table of Contents", page: "3" },
    { section: "4", title: "Material Conformance Matrix", page: "4-5" },
    { section: "5", title: "Material Conformance Matrix (continued)", page: "6" },
    { section: "6", title: "Specification Cross-Reference", page: "7" },
    { section: "7", title: "Specification Cross-Reference (continued)", page: "8" },
    { section: "8", title: "Product Data — Pipe Markers & Labels", page: "9" },
    { section: "9", title: "Product Data — Valve Tags & Identification", page: "10" },
    { section: "10", title: "Product Data — Underground Piping Markers", page: "11" },
    { section: "11", title: "Supporting Documentation", page: "12" },
    { section: "12", title: "Appendix — AI Reasoning Log", page: "13" },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold" style={{ color: "#003366" }}>Table of Contents</h2>
        <p className="text-xs text-gray-500 mt-1">Section 220553 — Identification for Plumbing Piping</p>
      </div>

      <div className="space-y-0.5">
        {items.map((item) => (
          <div key={item.section} className="flex items-baseline gap-2 py-1.5 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 w-8 shrink-0">{item.section}.</span>
            <span className="text-sm text-gray-800 flex-1">{item.title}</span>
            <span className="text-xs text-gray-400 border-b border-dotted border-gray-300 flex-1 mx-2" />
            <span className="text-xs font-medium text-gray-600">{item.page}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialConformancePage({ pageLabel, rows }: { pageLabel: string; rows: string[][] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#003366" }}>Material Conformance Matrix</h2>
        <p className="text-xs text-gray-500">{pageLabel}</p>
      </div>
      <DataTable
        headers={["Item #", "Description", "Spec Section", "Specified Material", "Submitted Material", "Status", "Conf. %"]}
        rows={rows}
      />
    </div>
  );
}

function SpecCrossRefPage({ pageLabel, rows }: { pageLabel: string; rows: string[][] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#003366" }}>Specification Cross-Reference</h2>
        <p className="text-xs text-gray-500">{pageLabel}</p>
      </div>
      <DataTable
        headers={["Spec Section", "Section Title", "Requirement", "Submittal Item", "Sheet Ref.", "Status"]}
        rows={rows}
      />
    </div>
  );
}

function ProductDataPage({ title, subtitle, items }: { title: string; subtitle: string; items: { name: string; mfr: string; partNo: string; desc: string }[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#003366" }}>{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Conforming</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-500">Manufacturer:</span> <span className="text-gray-800">{item.mfr}</span></div>
            <div><span className="text-gray-500">Part No:</span> <span className="text-gray-800">{item.partNo}</span></div>
          </div>
          <p className="text-xs text-gray-600">{item.desc}</p>
          {/* Simulated cut sheet thumbnail */}
          <div className="h-20 rounded bg-gray-50 border border-gray-200 flex items-center justify-center">
            <p className="text-[10px] text-gray-400">Cut Sheet Preview — {item.partNo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportingDocsPage() {
  const docs = [
    { name: "ASTM A53 Type E Grade B Certification", ref: "CERT-2026-0142", date: "Jan 15, 2026", status: "Valid" },
    { name: "UL Listed Pipe Marker Compliance Report", ref: "UL-RPT-3847", date: "Dec 8, 2025", status: "Valid" },
    { name: "ASME B31.9 Compliance Statement", ref: "ASME-CS-0093", date: "Feb 1, 2026", status: "Valid" },
    { name: "Material Safety Data Sheet — Brady B-946", ref: "MSDS-B946-2026", date: "Jan 20, 2026", status: "Current" },
    { name: "Valve Tag Durability Test Report", ref: "TST-VT-2025-88", date: "Nov 15, 2025", status: "Valid" },
    { name: "Underground Marker Tape Spec Sheet", ref: "SS-UMT-4501", date: "Oct 3, 2025", status: "Valid" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#003366" }}>Supporting Documentation</h2>
        <p className="text-xs text-gray-500">Certifications, compliance reports, and test documentation</p>
      </div>
      <DataTable
        headers={["Document", "Reference", "Date", "Status"]}
        rows={docs.map((d) => [d.name, d.ref, d.date, d.status])}
      />
      <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase">Notes</p>
        <p className="text-xs text-gray-600">
          All certifications and compliance documents have been verified against specification requirements.
          Material test reports are on file and available upon request. MSDS sheets are current as of the submittal date.
        </p>
      </div>
    </div>
  );
}

function AppendixAILog() {
  const logEntries = [
    { time: "14:23:01", level: "info" as const, msg: "Starting conformance analysis for Section 220553" },
    { time: "14:23:03", level: "info" as const, msg: "Loaded 3 specification documents (620 pages total)" },
    { time: "14:23:08", level: "info" as const, msg: "Extracted 18 material line items from Matrix Index Grid" },
    { time: "14:23:15", level: "success" as const, msg: "Item 1: Pipe Labels (Brady B-946) — MATCH (98% confidence)" },
    { time: "14:23:18", level: "success" as const, msg: "Item 2: Valve Tags (Brady 23210) — MATCH (96% confidence)" },
    { time: "14:23:22", level: "success" as const, msg: "Item 3: Underground Markers (Proline XT) — MATCH (94% confidence)" },
    { time: "14:23:25", level: "warning" as const, msg: "Item 4: Stencils — spec requires 3\" min height, submitted 2.5\" — REVIEW" },
    { time: "14:23:29", level: "success" as const, msg: "Items 5-12: Pipe identification accessories — ALL MATCH (91-97%)" },
    { time: "14:23:34", level: "success" as const, msg: "Items 13-16: Color coding per ASME A13.1 — MATCH (99% confidence)" },
    { time: "14:23:38", level: "warning" as const, msg: "Item 17: Equipment labels — material grade not explicitly stated in submittal" },
    { time: "14:23:41", level: "success" as const, msg: "Item 18: Directional flow arrows — MATCH (95% confidence)" },
    { time: "14:23:45", level: "info" as const, msg: "Cross-referencing against 6 specification sections" },
    { time: "14:23:52", level: "info" as const, msg: "Generating conformance summary: 16 of 18 items pre-approved" },
    { time: "14:23:55", level: "success" as const, msg: "Analysis complete. Overall confidence: 94%. Time: 54 seconds." },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#003366" }}>Appendix — AI Reasoning Log</h2>
        <p className="text-xs text-gray-500">Automated conformance analysis trace</p>
      </div>
      <div className="rounded-lg bg-gray-900 p-4 font-mono text-xs space-y-1 overflow-x-auto">
        {logEntries.map((entry, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-gray-500 shrink-0">[{entry.time}]</span>
            <span className={
              entry.level === "success" ? "text-green-400" :
              entry.level === "warning" ? "text-yellow-400" :
              "text-gray-400"
            }>
              {entry.msg}
            </span>
          </div>
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">Summary</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">16</p>
            <p className="text-[10px] text-gray-500">Pre-Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">2</p>
            <p className="text-[10px] text-gray-500">Review Required</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: "#003366" }}>94%</p>
            <p className="text-[10px] text-gray-500">Overall Confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mock data for material tables                                              */
/* -------------------------------------------------------------------------- */

const conformanceRows1: string[][] = [
  ["1", "Pipe Labels — Hot Water Supply", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "98%"],
  ["2", "Pipe Labels — Hot Water Return", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "98%"],
  ["3", "Pipe Labels — Cold Water", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "98%"],
  ["4", "Pipe Labels — Sanitary Waste", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "97%"],
  ["5", "Pipe Labels — Vent", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "97%"],
  ["6", "Pipe Labels — Storm Drain", "220553.2.1", "Brady B-946 Vinyl", "Brady B-946 Vinyl", "Pre-Approved", "96%"],
  ["7", "Valve Tags — Brass", "220553.2.2", "Brady 23210 Brass", "Brady 23210 Brass", "Pre-Approved", "96%"],
];

const conformanceRows2: string[][] = [
  ["8", "Valve Tags — Stainless Steel", "220553.2.2", "Brady 23223 SS", "Brady 23223 SS", "Pre-Approved", "95%"],
  ["9", "Valve Schedule Chart", "220553.2.3", "Laminated poster", "Brady Valve Chart", "Pre-Approved", "93%"],
  ["10", "Equipment Labels", "220553.2.4", "Engraved lamicoid", "Brady THT-17-449", "Review Required", "78%"],
  ["11", "Directional Flow Arrows", "220553.2.5", "Self-adhesive vinyl", "Brady 91400 Arrows", "Pre-Approved", "95%"],
  ["12", "Pipe Stencils", "220553.2.6", "3\" min height", "Brady 5000 Series (2.5\")", "Review Required", "62%"],
  ["13", "Color Coding — HWS", "220553.2.7", "Yellow per ASME A13.1", "Yellow per ASME A13.1", "Pre-Approved", "99%"],
];

const conformanceRows3: string[][] = [
  ["14", "Color Coding — HWR", "220553.2.7", "Yellow per ASME A13.1", "Yellow per ASME A13.1", "Pre-Approved", "99%"],
  ["15", "Color Coding — CW", "220553.2.7", "Green per ASME A13.1", "Green per ASME A13.1", "Pre-Approved", "99%"],
  ["16", "Color Coding — Sanitary", "220553.2.7", "Green per ASME A13.1", "Green per ASME A13.1", "Pre-Approved", "99%"],
  ["17", "Underground Pipe Markers", "220553.2.8", "Detectable tape", "Proline XT Det. Tape", "Pre-Approved", "94%"],
  ["18", "Access Panel Labels", "220553.2.9", "Engraved plastic", "Brady THT-17-449", "Pre-Approved", "91%"],
];

const specRows1: string[][] = [
  ["220553.1.1", "General Requirements", "Comply with ASME A13.1 for pipe marking", "Items 1-6, 13-16", "Sheet 3-5", "Compliant"],
  ["220553.1.2", "Submittals", "Product data for each type of identification", "All items", "Sheet 9-11", "Compliant"],
  ["220553.1.3", "Quality Assurance", "UL listed labels, ASTM compliance", "Items 1-6", "Sheet 12", "Compliant"],
  ["220553.2.1", "Pipe Labels", "Self-adhesive vinyl, Brady B-946 or equal", "Items 1-6", "Sheet 9", "Compliant"],
  ["220553.2.2", "Valve Tags", "Brass or SS, stamped identification", "Items 7-8", "Sheet 10", "Compliant"],
  ["220553.2.3", "Valve Schedule", "Laminated wall chart at mechanical room", "Item 9", "Sheet 10", "Compliant"],
];

const specRows2: string[][] = [
  ["220553.2.4", "Equipment Labels", "Engraved lamicoid, 1\" min height", "Item 10", "Sheet 10", "Under Review"],
  ["220553.2.5", "Flow Arrows", "Self-adhesive, at each valve and tee", "Item 11", "Sheet 9", "Compliant"],
  ["220553.2.6", "Pipe Stencils", "3\" minimum letter height", "Item 12", "Sheet 9", "Non-Compliant"],
  ["220553.2.7", "Color Coding", "Per ASME A13.1 — latest edition", "Items 13-16", "Sheet 9", "Compliant"],
  ["220553.2.8", "Underground Markers", "Detectable warning tape, 12\" above pipe", "Item 17", "Sheet 11", "Compliant"],
  ["220553.2.9", "Access Panels", "Identify contents on label", "Item 18", "Sheet 11", "Compliant"],
  ["220553.3.1", "Installation", "Install per manufacturer instructions", "All items", "N/A", "Compliant"],
];

/* -------------------------------------------------------------------------- */
/*  Main Page Component                                                        */
/* -------------------------------------------------------------------------- */

export default function SubmittalBinderPage() {
  const { project, version } = useWorkspace();

  /* Loading state */
  const [loading, setLoading] = useState(true);
  const [currentVisiblePage, setCurrentVisiblePage] = useState(1);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  /* Scroll observer to track which page is visible */
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const page = Number(entry.target.getAttribute("data-page"));
        if (page) setCurrentVisiblePage(page);
      }
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    });

    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, observerCallback]);

  const setPageRef = useCallback((pageNum: number, el: HTMLDivElement | null) => {
    if (el) {
      pageRefs.current.set(pageNum, el);
    } else {
      pageRefs.current.delete(pageNum);
    }
  }, []);

  return (
    <div className="h-full overflow-auto">
      {/* Fixed header — always visible */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${project.id}/versions/${version.id}/preview-cover`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h1 className="text-sm font-semibold">Submittal Binder</h1>
              <span className="text-xs text-muted-foreground">— {project.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5 h-8 gradient-action text-white border-0">
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-5 animate-fade-up">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl gradient-accent flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
              <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-bold tracking-tight">Compiling Binder...</h2>
            <p className="text-sm text-muted-foreground">Assembling {TOTAL_PAGES} pages from project data</p>
          </div>
          <div className="w-56 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-accent"
              style={{
                animation: `loadingBar ${LOADING_DURATION_MS}ms ease-out forwards`,
              }}
            />
          </div>
        </div>
      )}

      {/* Stacked PDF pages */}
      {!loading && (
        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 animate-fade-up">
          {/* Page 1: Binder Cover */}
          <div ref={(el) => setPageRef(1, el)}>
            <PaperPage pageNumber={1} id="page-1">
              <Page1BinderCover
                projectName={project.name}
                client={project.client}
                jobId={project.jobId}
                location={project.location}
              />
            </PaperPage>
          </div>

          {/* Page 2: Transmittal */}
          <div ref={(el) => setPageRef(2, el)}>
            <PaperPage pageNumber={2} id="page-2">
              <Page2Transmittal projectName={project.name} jobId={project.jobId} />
            </PaperPage>
          </div>

          {/* Page 3: Table of Contents */}
          <div ref={(el) => setPageRef(3, el)}>
            <PaperPage pageNumber={3} id="page-3">
              <Page3TableOfContents />
            </PaperPage>
          </div>

          {/* Pages 4-6: Material Conformance Matrix */}
          <div ref={(el) => setPageRef(4, el)}>
            <PaperPage pageNumber={4} id="page-4">
              <MaterialConformancePage pageLabel="Items 1-7 of 18" rows={conformanceRows1} />
            </PaperPage>
          </div>
          <div ref={(el) => setPageRef(5, el)}>
            <PaperPage pageNumber={5} id="page-5">
              <MaterialConformancePage pageLabel="Items 8-13 of 18" rows={conformanceRows2} />
            </PaperPage>
          </div>
          <div ref={(el) => setPageRef(6, el)}>
            <PaperPage pageNumber={6} id="page-6">
              <MaterialConformancePage pageLabel="Items 14-18 of 18" rows={conformanceRows3} />
            </PaperPage>
          </div>

          {/* Pages 7-8: Specification Cross-Reference */}
          <div ref={(el) => setPageRef(7, el)}>
            <PaperPage pageNumber={7} id="page-7">
              <SpecCrossRefPage pageLabel="Sections 220553.1.1 — 220553.2.3" rows={specRows1} />
            </PaperPage>
          </div>
          <div ref={(el) => setPageRef(8, el)}>
            <PaperPage pageNumber={8} id="page-8">
              <SpecCrossRefPage pageLabel="Sections 220553.2.4 — 220553.3.1" rows={specRows2} />
            </PaperPage>
          </div>

          {/* Pages 9-11: Product Data Sheets */}
          <div ref={(el) => setPageRef(9, el)}>
            <PaperPage pageNumber={9} id="page-9">
              <ProductDataPage
                title="Product Data — Pipe Markers & Labels"
                subtitle="Self-adhesive vinyl pipe identification"
                items={[
                  { name: "Brady B-946 Self-Adhesive Pipe Markers", mfr: "Brady Corporation", partNo: "B-946-HWS-YL", desc: "Self-adhesive vinyl pipe markers with pre-printed legend. Rated for -40°F to 180°F. UV and moisture resistant. Meets ASME A13.1 color coding standard." },
                  { name: "Brady Snap-On Pipe Markers", mfr: "Brady Corporation", partNo: "B-915-CW-GN", desc: "Snap-on plastic pipe markers for 1/2\" to 8\" OD pipes. Color-coded per ASME A13.1. Durable polypropylene construction." },
                ]}
              />
            </PaperPage>
          </div>
          <div ref={(el) => setPageRef(10, el)}>
            <PaperPage pageNumber={10} id="page-10">
              <ProductDataPage
                title="Product Data — Valve Tags & Identification"
                subtitle="Brass and stainless steel valve identification"
                items={[
                  { name: "Brady 23210 Brass Valve Tags", mfr: "Brady Corporation", partNo: "23210-1.5-BR", desc: "1-1/2\" round brass valve tags with stamped numbering. Chain attachment included. Corrosion resistant for indoor/outdoor use." },
                  { name: "Brady 23223 Stainless Steel Valve Tags", mfr: "Brady Corporation", partNo: "23223-2.0-SS", desc: "2\" round stainless steel valve tags for corrosive environments. Laser-engraved numbering. 316L grade stainless." },
                  { name: "Brady Valve Schedule Chart", mfr: "Brady Corporation", partNo: "VSC-LAM-24x36", desc: "Laminated 24\"x36\" wall-mount valve schedule chart. Custom printed with project valve data. UV-resistant lamination." },
                ]}
              />
            </PaperPage>
          </div>
          <div ref={(el) => setPageRef(11, el)}>
            <PaperPage pageNumber={11} id="page-11">
              <ProductDataPage
                title="Product Data — Underground Piping Markers"
                subtitle="Detectable underground warning tape and markers"
                items={[
                  { name: "Proline XT Detectable Warning Tape", mfr: "Proline Safety Products", partNo: "XT-DT-W-6-1000", desc: "6\" wide detectable underground warning tape. Aluminum foil core for metal detection. Printed legend: 'CAUTION: WATER LINE BURIED BELOW'. 1000 ft. roll." },
                  { name: "Proline XT Detectable Warning Tape — Sewer", mfr: "Proline Safety Products", partNo: "XT-DT-S-6-1000", desc: "6\" wide detectable underground warning tape for sewer lines. Green color per APWA standard. Aluminum foil core. 1000 ft. roll." },
                ]}
              />
            </PaperPage>
          </div>

          {/* Page 12: Supporting Documentation */}
          <div ref={(el) => setPageRef(12, el)}>
            <PaperPage pageNumber={12} id="page-12">
              <SupportingDocsPage />
            </PaperPage>
          </div>

          {/* Page 13: Appendix — AI Reasoning Log */}
          <div ref={(el) => setPageRef(13, el)}>
            <PaperPage pageNumber={13} id="page-13">
              <AppendixAILog />
            </PaperPage>
          </div>

          {/* End spacer */}
          <div className="h-8" />
        </div>
      )}

      {/* Floating page indicator */}
      {!loading && (
        <div className="fixed bottom-6 right-6 z-40 bg-background/90 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium tabular-nums">
            Page {currentVisiblePage} of {TOTAL_PAGES}
          </span>
        </div>
      )}

      {/* Loading bar animation */}
      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          40% { width: 55%; }
          70% { width: 80%; }
          100% { width: 98%; }
        }
      `}</style>
    </div>
  );
}
