/**
 * V4-specific conformance data derived from ACCO Standard Material Template.
 * This file is ONLY used by the Project V4 overview/conformance page.
 */

import type { ValidationStatus } from "./types";

export interface V4ConformanceItem {
  id: string;
  trade: string;
  indexCategory: string;
  systemCategory: string;
  indexSubcategory: string;
  description: string;
  sizes: string;
  accoMaterialId: string;
  aiStatus: ValidationStatus;
  materialType: string;
  allSystem: boolean;
  pickSection: string;
}

/** Evidence data for the right-side detail panel */
export interface V4SpecEvidence {
  specSection: string;
  specTitle: string;
  matchStatus: "matches" | "partial" | "no_match";
  confidence: number;
  summary: string;
  requirements: string[];
  references: { source: string; excerpt: string }[];
}

export interface V4IndexMatch {
  category: string;
  subcategory: string;
  itemDescription: string;
  size: string;
  matchType: "EXACT" | "PARTIAL" | "ALTERNATE";
  matchScore: number;
  reason: string;
}

export interface V4ItemEvidence {
  spec: V4SpecEvidence;
  indexMatches: V4IndexMatch[];
}

/** Material type classifications */
export const V4_MATERIAL_TYPES = ["Pipe", "Fitting", "Valve", "Specialty", "Insulation", "Support", "Anchor", "Testing", "Joining", "Identification"] as const;

/** All conformance data — grouped by Trade, then Index Category */
export const v4ConformanceData: V4ConformanceItem[] = [
  // ── Mechanical > Pressure Testing ──────────────────────────────────────
  { id: "v4-001", trade: "Mechanical", indexCategory: "Pressure Testing", systemCategory: "Chilled Water", indexSubcategory: "Testing", description: "Greater of 2 Hour Hydrostatic @ 150 psi. & 1.5 times operating pressure", sizes: "ALL", accoMaterialId: "01_01_01_00_005_XX", aiStatus: "pre_approved", materialType: "Testing", allSystem: true, pickSection: "23 05 00" },

  // ── Mechanical > Pipe ──────────────────────────────────────────────────
  { id: "v4-002", trade: "Mechanical", indexCategory: "Pipe", systemCategory: "Chilled Water", indexSubcategory: "Pipe (Nipples)", description: "CS Sch 40 ERW (Nipples) - ASTM A-53 Grade-B", sizes: "Thru 2\"", accoMaterialId: "01_02_01_00_071_XX", aiStatus: "pre_approved", materialType: "Pipe", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-003", trade: "Mechanical", indexCategory: "Pipe", systemCategory: "Chilled Water", indexSubcategory: "Pipe (Nipples)", description: "CS Sch 80 Seamless (Nipples) - ASTM A-106 Grade-B", sizes: "Thru 2\"", accoMaterialId: "01_02_01_00_072_XX", aiStatus: "review_required", materialType: "Pipe", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-004", trade: "Mechanical", indexCategory: "Pipe", systemCategory: "Chilled Water", indexSubcategory: "Pipe (Nipples)", description: "Red Brass Sch 40 (Nipples) - ASTM B-43", sizes: "Thru 2\"", accoMaterialId: "01_02_01_00_074_XX", aiStatus: "pre_approved", materialType: "Pipe", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-005", trade: "Mechanical", indexCategory: "Pipe", systemCategory: "Chilled Water", indexSubcategory: "Pipe/Tube", description: "Copper Pipe Type L - ASTM B-88", sizes: "0.5|0.75|1", accoMaterialId: "01_02_01_03_030_XX", aiStatus: "pre_approved", materialType: "Pipe", allSystem: false, pickSection: "23 21 13" },

  // ── Mechanical > Fittings ──────────────────────────────────────────────
  { id: "v4-006", trade: "Mechanical", indexCategory: "Fittings", systemCategory: "Chilled Water", indexSubcategory: "Fittings", description: "Black Malleable Iron 150# - ASTM A-197 - ASME B16.3", sizes: "Thru 2\"", accoMaterialId: "01_03_01_00_035_00", aiStatus: "pre_approved", materialType: "Fitting", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-007", trade: "Mechanical", indexCategory: "Fittings", systemCategory: "Chilled Water", indexSubcategory: "Fittings", description: "Bronze 125# - ASTM B-62", sizes: "Thru 2\"", accoMaterialId: "01_03_01_00_037_00", aiStatus: "review_required", materialType: "Fitting", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-008", trade: "Mechanical", indexCategory: "Fittings", systemCategory: "Chilled Water", indexSubcategory: "Fittings", description: "Butt Weld Sch Std Wt. Seamless - ASME B16.9 & A234 Grade-B", sizes: "2-1/2\" & Over", accoMaterialId: "01_03_01_00_038_00", aiStatus: "pre_approved", materialType: "Fitting", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-009", trade: "Mechanical", indexCategory: "Fittings", systemCategory: "Chilled Water", indexSubcategory: "Dielectric Nipples", description: "Clear Flow Dielectric Waterway - ASTM F1545", sizes: "Thru 2\"", accoMaterialId: "01_03_01_00_039_00", aiStatus: "action_mandatory", materialType: "Fitting", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-010", trade: "Mechanical", indexCategory: "Fittings", systemCategory: "Chilled Water", indexSubcategory: "Flanges", description: "Weld Neck - Slip On Flanges 150# - ASME B16.5", sizes: "2-1/2\" & Over", accoMaterialId: "01_03_01_00_050_00", aiStatus: "pre_approved", materialType: "Fitting", allSystem: false, pickSection: "23 21 13" },

  // ── Mechanical > Joining/Branch Methods ────────────────────────────────
  { id: "v4-011", trade: "Mechanical", indexCategory: "Joining/Branch Methods", systemCategory: "Chilled Water", indexSubcategory: "Thread Sealant", description: "#5 Rectorseal Thread Sealant", sizes: "Varies", accoMaterialId: "01_04_01_00_035_XX", aiStatus: "pre_approved", materialType: "Joining", allSystem: true, pickSection: "23 05 00" },
  { id: "v4-012", trade: "Mechanical", indexCategory: "Joining/Branch Methods", systemCategory: "Chilled Water", indexSubcategory: "Flange Bolts", description: "Bolts - ASTM A-307 GRD. A", sizes: "Varies", accoMaterialId: "01_04_01_00_040_XX", aiStatus: "review_required", materialType: "Joining", allSystem: true, pickSection: "23 05 00" },
  { id: "v4-013", trade: "Mechanical", indexCategory: "Joining/Branch Methods", systemCategory: "Chilled Water", indexSubcategory: "Solder", description: "Harris Stay Brite #8 Solder", sizes: "Varies", accoMaterialId: "01_04_01_00_045_XX", aiStatus: "pre_approved", materialType: "Joining", allSystem: true, pickSection: "23 05 00" },
  { id: "v4-014", trade: "Mechanical", indexCategory: "Joining/Branch Methods", systemCategory: "Chilled Water", indexSubcategory: "Flux", description: "Harris Stay Clean Liquid Flux", sizes: "Varies", accoMaterialId: "01_04_01_00_046_XX", aiStatus: "pre_approved", materialType: "Joining", allSystem: true, pickSection: "23 05 00" },

  // ── Mechanical > Valves ────────────────────────────────────────────────
  { id: "v4-015", trade: "Mechanical", indexCategory: "Valves", systemCategory: "Chilled Water", indexSubcategory: "Manual Balancing Valve", description: "B&G MBV Circuit Setter Plus CB (Flanged) & (Grooved)", sizes: "2-1/2\" thru 12\"", accoMaterialId: "01_05_01_00_090_XX", aiStatus: "review_required", materialType: "Valve", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-016", trade: "Mechanical", indexCategory: "Valves", systemCategory: "Chilled Water", indexSubcategory: "Triple Duty Valve", description: "B&G TDV 3DS Straight Pattern S (Flanged) & G (Grooved)", sizes: "2\" & Over", accoMaterialId: "01_05_01_00_092_XX", aiStatus: "pre_approved", materialType: "Valve", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-017", trade: "Mechanical", indexCategory: "Valves", systemCategory: "Chilled Water", indexSubcategory: "Coil Pak/Kit (Automatic)", description: "Nexus A2Y (Ultra U, UltraMatic & Ultra Y)", sizes: "Thru 2\"", accoMaterialId: "01_05_01_00_097_XX", aiStatus: "action_mandatory", materialType: "Valve", allSystem: false, pickSection: "23 21 16" },

  // ── Mechanical > Specialties ───────────────────────────────────────────
  { id: "v4-018", trade: "Mechanical", indexCategory: "Specialties", systemCategory: "Chilled Water", indexSubcategory: "Roof Penetrations", description: "ACCO Roof Penetration Detail", sizes: "Varies", accoMaterialId: "01_06_01_00_001_XX", aiStatus: "pre_approved", materialType: "Specialty", allSystem: false, pickSection: "23 05 00" },
  { id: "v4-019", trade: "Mechanical", indexCategory: "Specialties", systemCategory: "Chilled Water", indexSubcategory: "Automatic Air Vents", description: "B&G Hoffman AAV #78", sizes: "3/4\" MIP", accoMaterialId: "01_06_01_00_003_XX", aiStatus: "review_required", materialType: "Specialty", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-020", trade: "Mechanical", indexCategory: "Specialties", systemCategory: "Chilled Water", indexSubcategory: "Flex Connections", description: "DME 512 304SS Braided with CS (M-NPT)", sizes: "Thru 2\"", accoMaterialId: "01_06_01_00_011_XX", aiStatus: "pre_approved", materialType: "Specialty", allSystem: false, pickSection: "23 21 13" },
  { id: "v4-021", trade: "Mechanical", indexCategory: "Specialties", systemCategory: "Chilled Water", indexSubcategory: "Test Plugs", description: "Peterson Petes Plugs", sizes: "1/4\" or 1/2\"", accoMaterialId: "01_06_01_00_031_XX", aiStatus: "pre_approved", materialType: "Specialty", allSystem: true, pickSection: "23 05 00" },

  // ── Mechanical > Insulation ────────────────────────────────────────────
  { id: "v4-022", trade: "Mechanical", indexCategory: "Insulation", systemCategory: "Generic", indexSubcategory: "2022 Title 24- Glycol Chilled Water (< 39F)", description: "1\" Insulation Thickness", sizes: "Thru 3/4\"", accoMaterialId: "01_07_XX_00_001_XX", aiStatus: "pre_approved", materialType: "Insulation", allSystem: true, pickSection: "23 07 13" },
  { id: "v4-023", trade: "Mechanical", indexCategory: "Insulation", systemCategory: "Generic", indexSubcategory: "2022 Title 24- Refrigeration (DX)", description: "1/2\" Insulation Thickness or per Manufacturers Recommendations", sizes: "ALL", accoMaterialId: "01_07_XX_00_002_XX", aiStatus: "review_required", materialType: "Insulation", allSystem: true, pickSection: "23 07 13" },

  // ── Mechanical > Identification ────────────────────────────────────────
  { id: "v4-024", trade: "Mechanical", indexCategory: "Identification", systemCategory: "Generic", indexSubcategory: "Valve Tag", description: "Chart", sizes: "8.5\" x 11\"", accoMaterialId: "01_08_XX_00_001_XX", aiStatus: "pre_approved", materialType: "Identification", allSystem: true, pickSection: "23 05 53" },
  { id: "v4-025", trade: "Mechanical", indexCategory: "Identification", systemCategory: "Generic", indexSubcategory: "Pipe Markers", description: "MSI Pipe Markers Vinyl Adhesive - Arrow Tape", sizes: "Varies", accoMaterialId: "01_08_XX_00_006_XX", aiStatus: "pre_approved", materialType: "Identification", allSystem: true, pickSection: "23 05 53" },

  // ── Mechanical > Hangers/Supports ──────────────────────────────────────
  { id: "v4-026", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "All Thread Rod", description: "ATR", sizes: "Varies", accoMaterialId: "01_09_XX_00_026_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-027", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Clevis Hangers (Type 1)", description: "B-Line - Clevis B3100 & B3100F", sizes: "Varies", accoMaterialId: "01_09_XX_00_039_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-028", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Channel Strut", description: "B-Line - Channel Strut (All 12 Gauge)", sizes: "Varies", accoMaterialId: "01_09_XX_00_036_XX", aiStatus: "action_mandatory", materialType: "Support", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-029", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Hex Head Lag Bolt", description: "B-Line - Lag Bolt B3228", sizes: "Varies", accoMaterialId: "01_09_XX_00_046_XX", aiStatus: "review_required", materialType: "Support", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-030", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Flat & Fender Washers", description: "B-Line - Washers FW & FFW", sizes: "Varies", accoMaterialId: "01_09_XX_00_063_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-031", trade: "Mechanical", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Finishes", description: "Electro-Galv Interior & SS or HDG Exterior", sizes: "—", accoMaterialId: "01_09_XX_00_072_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: true, pickSection: "23 05 29" },

  // ── Mechanical > Anchors ───────────────────────────────────────────────
  { id: "v4-032", trade: "Mechanical", indexCategory: "Anchors", systemCategory: "Generic", indexSubcategory: "Drilled Expansion Anchors (Concrete)", description: "DeWalt Powers SD1 Anchors", sizes: "Varies", accoMaterialId: "01_10_XX_00_001_XX", aiStatus: "pre_approved", materialType: "Anchor", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-033", trade: "Mechanical", indexCategory: "Anchors", systemCategory: "Generic", indexSubcategory: "Drilled Expansion Anchors (Concrete)", description: "Hilti Kwik Bolt TZ2 Anchors", sizes: "Varies", accoMaterialId: "01_10_XX_00_005_XX", aiStatus: "review_required", materialType: "Anchor", allSystem: true, pickSection: "23 05 29" },
  { id: "v4-034", trade: "Mechanical", indexCategory: "Anchors", systemCategory: "Generic", indexSubcategory: "Threaded Fasteners (Metal)", description: "Sammys X-Press Metal", sizes: "Varies", accoMaterialId: "01_10_XX_00_009_XX", aiStatus: "pre_approved", materialType: "Anchor", allSystem: true, pickSection: "23 05 29" },

  // ── Plumbing > Pressure Testing ────────────────────────────────────────
  { id: "v4-035", trade: "Plumbing", indexCategory: "Pressure Testing", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Testing", description: "Greater of 2 Hour Hydrostatic @ 150 psi. & 1.5 times operating pressure", sizes: "ALL", accoMaterialId: "02_01_17_00_005_XX", aiStatus: "pre_approved", materialType: "Testing", allSystem: true, pickSection: "22 05 00" },
  { id: "v4-036", trade: "Plumbing", indexCategory: "Pressure Testing", systemCategory: "Above Grade - Natural Gas", indexSubcategory: "Testing - Threaded", description: "2 Hour - Pneumatic - Air @ 15 psi.", sizes: "ALL", accoMaterialId: "02_01_24_00_002_XX", aiStatus: "review_required", materialType: "Testing", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-037", trade: "Plumbing", indexCategory: "Pressure Testing", systemCategory: "Below Grade - Cold Waters", indexSubcategory: "Testing", description: "Greater of 2 Hour Hydrostatic @ 150 psi. & 1.5 times operating pressure", sizes: "ALL", accoMaterialId: "02_01_27_00_005_XX", aiStatus: "pre_approved", materialType: "Testing", allSystem: true, pickSection: "22 05 00" },

  // ── Plumbing > Pipe ────────────────────────────────────────────────────
  { id: "v4-038", trade: "Plumbing", indexCategory: "Pipe", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Pipe/Tube", description: "Copper Type L Hard", sizes: "1|1.25|1.5|2|2.5|3", accoMaterialId: "02_02_17_03_040_XX", aiStatus: "pre_approved", materialType: "Pipe", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-039", trade: "Plumbing", indexCategory: "Pipe", systemCategory: "Above Grade - Drainage", indexSubcategory: "Pipe/Tube", description: "AB&I No Hub Cast Iron", sizes: "2|3|4|5|6|8|10|12|15", accoMaterialId: "02_02_19_04_015_XX", aiStatus: "action_mandatory", materialType: "Pipe", allSystem: false, pickSection: "22 13 16" },
  { id: "v4-040", trade: "Plumbing", indexCategory: "Pipe", systemCategory: "Above Grade - Natural Gas", indexSubcategory: "Pipe/Tube", description: "Black Steel Sch 40", sizes: "1|1.25|1.5|2|2.5|3|4|6|8", accoMaterialId: "02_02_24_01_018_XX", aiStatus: "pre_approved", materialType: "Pipe", allSystem: false, pickSection: "22 11 19" },
  { id: "v4-041", trade: "Plumbing", indexCategory: "Pipe", systemCategory: "Above Grade - Medical Gas", indexSubcategory: "Pipe/Tube", description: "Copper Type L Hard Cleaned", sizes: "1.5|2|2.5|3|4", accoMaterialId: "02_02_22_03_041_XX", aiStatus: "review_required", materialType: "Pipe", allSystem: false, pickSection: "22 61 19" },

  // ── Plumbing > Fittings ────────────────────────────────────────────────
  { id: "v4-042", trade: "Plumbing", indexCategory: "Fittings", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Flanges", description: "Stainless Steel Flanges", sizes: "ALL", accoMaterialId: "02_03_17_00_044_00", aiStatus: "pre_approved", materialType: "Fitting", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-043", trade: "Plumbing", indexCategory: "Fittings", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Pipe/Tube", description: "Viega - \"Pressed\"", sizes: "1|1.25|1.5|2", accoMaterialId: "02_03_17_03_026_14", aiStatus: "pre_approved", materialType: "Fitting", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-044", trade: "Plumbing", indexCategory: "Fittings", systemCategory: "Above Grade - Natural Gas", indexSubcategory: "Flanges", description: "Weld Neck - Slip On Flanges 150# - ASME B16.5", sizes: "2-1/2\" & Over", accoMaterialId: "02_03_24_00_050_00", aiStatus: "review_required", materialType: "Fitting", allSystem: false, pickSection: "22 11 19" },

  // ── Plumbing > Joining/Branch Methods ──────────────────────────────────
  { id: "v4-045", trade: "Plumbing", indexCategory: "Joining/Branch Methods", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Thread Sealant", description: "Blue Monster Ind. Thread Sealant", sizes: "Varies", accoMaterialId: "02_04_17_00_038_XX", aiStatus: "pre_approved", materialType: "Joining", allSystem: true, pickSection: "22 05 00" },
  { id: "v4-046", trade: "Plumbing", indexCategory: "Joining/Branch Methods", systemCategory: "Above Grade - Natural Gas", indexSubcategory: "Pipe/Tube", description: "Megapress", sizes: "1|1.25|1.5|2|2.5|3|4", accoMaterialId: "02_04_24_01_008_XX", aiStatus: "action_mandatory", materialType: "Joining", allSystem: false, pickSection: "22 11 19" },
  { id: "v4-047", trade: "Plumbing", indexCategory: "Joining/Branch Methods", systemCategory: "Above Grade - Hot Waters L.P. <150 PSI", indexSubcategory: "Pipe/Tube", description: "Propress", sizes: "1|1.25|1.5|2", accoMaterialId: "02_04_20_03_011_XX", aiStatus: "pre_approved", materialType: "Joining", allSystem: false, pickSection: "22 11 16" },

  // ── Plumbing > Valves ──────────────────────────────────────────────────
  { id: "v4-048", trade: "Plumbing", indexCategory: "Valves", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Valves", description: "Milwaukee UP509P2", sizes: "1|1.25|1.5|2", accoMaterialId: "02_05_17_00_043_XX", aiStatus: "pre_approved", materialType: "Valve", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-049", trade: "Plumbing", indexCategory: "Valves", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Balancing Valve", description: "ThremOmegaTech - CircuitSolver - CSUAS-X-XXX-CV1 (NPT)", sizes: "1/2\" - 1\"", accoMaterialId: "02_05_17_00_102_XX", aiStatus: "review_required", materialType: "Valve", allSystem: false, pickSection: "22 11 16" },
  { id: "v4-050", trade: "Plumbing", indexCategory: "Valves", systemCategory: "Above Grade - Natural Gas", indexSubcategory: "Valves", description: "Homestead Fig 612", sizes: "2.5|3|4|6|8", accoMaterialId: "02_05_24_00_025_XX", aiStatus: "pre_approved", materialType: "Valve", allSystem: false, pickSection: "22 11 19" },

  // ── Plumbing > Specialties ─────────────────────────────────────────────
  { id: "v4-051", trade: "Plumbing", indexCategory: "Specialties", systemCategory: "Generic", indexSubcategory: "Trap Primer", description: "PPP - P1-500 & P2-500", sizes: "1/2\"", accoMaterialId: "02_06_XX_00_033_XX", aiStatus: "pre_approved", materialType: "Specialty", allSystem: false, pickSection: "22 13 16" },
  { id: "v4-052", trade: "Plumbing", indexCategory: "Specialties", systemCategory: "Generic", indexSubcategory: "Water Hammer Arrestor", description: "PPP - SC-500A thru SC-2000F", sizes: "Varies", accoMaterialId: "02_06_XX_00_035_XX", aiStatus: "review_required", materialType: "Specialty", allSystem: true, pickSection: "22 05 00" },
  { id: "v4-053", trade: "Plumbing", indexCategory: "Specialties", systemCategory: "Generic", indexSubcategory: "Air Admittance Valve", description: "Studor - Mini Vent", sizes: "1-1/2\" - 2\"", accoMaterialId: "02_06_XX_00_051_XX", aiStatus: "pre_approved", materialType: "Specialty", allSystem: false, pickSection: "22 13 16" },

  // ── Plumbing > Identification ──────────────────────────────────────────
  { id: "v4-054", trade: "Plumbing", indexCategory: "Identification", systemCategory: "Generic", indexSubcategory: "Valve Tag", description: "Chart", sizes: "8.5\" x 11\"", accoMaterialId: "02_08_XX_00_001_XX", aiStatus: "pre_approved", materialType: "Identification", allSystem: true, pickSection: "22 05 53" },
  { id: "v4-055", trade: "Plumbing", indexCategory: "Identification", systemCategory: "Generic", indexSubcategory: "Pipe Markers", description: "MSI Pipe Markers Vinyl Adhesive - Arrow Tape", sizes: "Varies", accoMaterialId: "02_08_XX_00_006_XX", aiStatus: "pre_approved", materialType: "Identification", allSystem: true, pickSection: "22 05 53" },

  // ── Plumbing > Hangers/Supports ────────────────────────────────────────
  { id: "v4-056", trade: "Plumbing", indexCategory: "Hangers/Supports", systemCategory: "Above Grade - Cold Waters L.P. <150 PSI", indexSubcategory: "Hangers", description: "Felt Lined Clevis", sizes: "2.5|3|4|6|8|10", accoMaterialId: "02_09_17_00_012_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: false, pickSection: "22 05 29" },
  { id: "v4-057", trade: "Plumbing", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "All Thread Rod", description: "ATR", sizes: "Varies", accoMaterialId: "02_09_XX_00_026_XX", aiStatus: "pre_approved", materialType: "Support", allSystem: true, pickSection: "22 05 29" },
  { id: "v4-058", trade: "Plumbing", indexCategory: "Hangers/Supports", systemCategory: "Generic", indexSubcategory: "Channel Strut", description: "B-Line - Channel Strut (All 12 Gauge)", sizes: "Varies", accoMaterialId: "02_09_XX_00_036_XX", aiStatus: "action_mandatory", materialType: "Support", allSystem: true, pickSection: "22 05 29" },

  // ── Plumbing > Anchors ─────────────────────────────────────────────────
  { id: "v4-059", trade: "Plumbing", indexCategory: "Anchors", systemCategory: "Generic", indexSubcategory: "Drilled Expansion Anchors (Concrete)", description: "DeWalt Powers SD1 Anchors", sizes: "Varies", accoMaterialId: "02_10_XX_00_001_XX", aiStatus: "pre_approved", materialType: "Anchor", allSystem: true, pickSection: "22 05 29" },
  { id: "v4-060", trade: "Plumbing", indexCategory: "Anchors", systemCategory: "Generic", indexSubcategory: "Drilled Expansion Anchors (Concrete)", description: "Hilti Kwik Bolt TZ2 Anchors", sizes: "Varies", accoMaterialId: "02_10_XX_00_005_XX", aiStatus: "review_required", materialType: "Anchor", allSystem: true, pickSection: "22 05 29" },
];

/** Trade display order */
export const V4_TRADE_ORDER = ["Mechanical", "Plumbing"];

/** Get items grouped by trade then index category */
export function getV4GroupedData() {
  const tradeMap = new Map<string, Map<string, V4ConformanceItem[]>>();

  for (const trade of V4_TRADE_ORDER) {
    const tradeItems = v4ConformanceData.filter((item) => item.trade === trade);
    const categoryMap = new Map<string, V4ConformanceItem[]>();

    for (const item of tradeItems) {
      if (!categoryMap.has(item.indexCategory)) {
        categoryMap.set(item.indexCategory, []);
      }
      categoryMap.get(item.indexCategory)!.push(item);
    }

    if (categoryMap.size > 0) {
      tradeMap.set(trade, categoryMap);
    }
  }

  return tradeMap;
}

/** Generate mock evidence for a conformance item based on its status */
export function getV4ItemEvidence(item: V4ConformanceItem): V4ItemEvidence {
  const isMatch = item.aiStatus === "pre_approved";
  const isPartial = item.aiStatus === "review_required";

  return {
    spec: {
      specSection: item.pickSection,
      specTitle: `${item.indexCategory} — ${item.indexSubcategory}`,
      matchStatus: isMatch ? "matches" : isPartial ? "partial" : "no_match",
      confidence: isMatch ? 92 : isPartial ? 65 : 28,
      summary: isMatch
        ? `Material "${item.description}" conforms to project specification requirements for ${item.indexCategory.toLowerCase()} in ${item.systemCategory} systems.`
        : isPartial
          ? `Material "${item.description}" partially matches specification. Some parameters require manual review for ${item.systemCategory} system compliance.`
          : `Material "${item.description}" does not match project specification. Alternative or substitution required for ${item.systemCategory} system.`,
      requirements: [
        `Material shall comply with ${item.description.match(/ASTM\s[\w-]+|ASME\s[\w.]+/)?.[0] ?? "applicable standards"}`,
        `Applicable for ${item.systemCategory} system — sizes: ${item.sizes}`,
        `Trade: ${item.trade} — Category: ${item.indexCategory}`,
      ],
      references: [
        { source: "Project Specification.pdf", excerpt: `Section ${item.pickSection}: ${item.indexCategory} materials shall be as scheduled and conform to applicable ASTM/ASME standards.` },
        { source: "ACCO Material Template.xlsx", excerpt: `${item.accoMaterialId} — ${item.description} — Status: ${item.aiStatus.replace(/_/g, " ")}` },
      ],
    },
    indexMatches: [
      {
        category: item.indexCategory,
        subcategory: item.indexSubcategory,
        itemDescription: item.description,
        size: item.sizes,
        matchType: isMatch ? "EXACT" : isPartial ? "PARTIAL" : "ALTERNATE",
        matchScore: isMatch ? 0.92 : isPartial ? 0.65 : 0.28,
        reason: isMatch
          ? `Exact match found in ACCO material index for ${item.systemCategory} — ${item.indexSubcategory}.`
          : isPartial
            ? `Partial match: material exists in index but size or specification variant differs for ${item.systemCategory}.`
            : `No direct match found. Closest alternate material in index does not meet all ${item.systemCategory} requirements.`,
      },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Per-project conformance data generator                                      */
/* -------------------------------------------------------------------------- */

/** Simple deterministic hash from string → number */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Status rotation patterns per project — makes each project feel unique */
const STATUS_PATTERNS: ValidationStatus[][] = [
  ["pre_approved", "pre_approved", "review_required", "pre_approved", "action_mandatory", "pre_approved"],
  ["review_required", "pre_approved", "pre_approved", "action_mandatory", "pre_approved", "review_required"],
  ["pre_approved", "action_mandatory", "pre_approved", "pre_approved", "review_required", "pre_approved"],
  ["pre_approved", "review_required", "review_required", "pre_approved", "pre_approved", "action_mandatory"],
  ["action_mandatory", "pre_approved", "pre_approved", "review_required", "pre_approved", "pre_approved"],
  ["pre_approved", "pre_approved", "pre_approved", "review_required", "action_mandatory", "review_required"],
  ["review_required", "review_required", "pre_approved", "pre_approved", "pre_approved", "action_mandatory"],
  ["pre_approved", "pre_approved", "action_mandatory", "review_required", "pre_approved", "pre_approved"],
];

/** Project-specific description suffixes for variety */
const PROJECT_SUFFIXES: Record<string, string> = {
  "proj-1": "Mayo Clinic Rochester",
  "proj-2": "UC Davis Veterinary",
  "proj-3": "NET Portland Campus",
  "proj-4": "KPMG NYC Office",
  "proj-5": "PSL Seattle Structural",
  "proj-6": "DCJC Government Building",
  "proj-7": "IEUA Water Reclamation",
  "proj-8": "PF San Francisco",
  "proj-9": "Test Facility",
};

/**
 * Returns a unique set of conformance items for each project.
 * Uses the base v4ConformanceData but varies:
 * - AI statuses (different distribution per project)
 * - Number of items (some projects skip certain items)
 * - Item IDs (prefixed with project ID hash)
 */
export function getV4ConformanceDataForProject(projectId: string): V4ConformanceItem[] {
  const hash = hashCode(projectId);
  const patternIdx = hash % STATUS_PATTERNS.length;
  const statusPattern = STATUS_PATTERNS[patternIdx];
  const skipOffset = (hash % 7) + 2; // skip every Nth item (unique per project)
  const suffix = PROJECT_SUFFIXES[projectId] ?? projectId;

  return v4ConformanceData
    .filter((_, idx) => {
      // Each project shows a different subset (skip some items for variety)
      // proj-1 (base) keeps all items
      if (projectId === "proj-1") return true;
      return (idx + hash) % skipOffset !== 0;
    })
    .map((item, idx) => ({
      ...item,
      id: `${projectId}-${item.id}`,
      aiStatus: statusPattern[idx % statusPattern.length],
      accoMaterialId: item.accoMaterialId.replace(/_XX$/, `_${String(hash % 100).padStart(2, "0")}`),
    }));
}

/** Cache for per-project data to avoid recomputation */
const projectDataCache = new Map<string, V4ConformanceItem[]>();

export function getCachedProjectConformanceData(projectId: string): V4ConformanceItem[] {
  if (!projectDataCache.has(projectId)) {
    projectDataCache.set(projectId, getV4ConformanceDataForProject(projectId));
  }
  return projectDataCache.get(projectId)!;
}

/** Status counts — accepts optional filtered data array */
export function getV4StatusCounts(data: V4ConformanceItem[] = v4ConformanceData) {
  let preApproved = 0;
  let reviewRequired = 0;
  let actionMandatory = 0;

  for (const item of data) {
    if (item.aiStatus === "pre_approved") preApproved++;
    else if (item.aiStatus === "review_required") reviewRequired++;
    else if (item.aiStatus === "action_mandatory") actionMandatory++;
  }

  return {
    total: data.length,
    preApproved,
    reviewRequired,
    actionMandatory,
    completed: preApproved,
    open: reviewRequired + actionMandatory,
  };
}
