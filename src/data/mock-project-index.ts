/* -------------------------------------------------------------------------- */
/*  Hydro Matrix Index Grid — Types & Mock Data                               */
/* -------------------------------------------------------------------------- */

export type HydroTrade = "Mechanical";

export type HydroIndexCategory =
  | "Pipe"
  | "Fittings"
  | "Valves"
  | "Insulation"
  | "Hangers/Supports"
  | "Specialties"
  | "Joining/Branch Methods"
  | "Identification"
  | "Pressure Testing"
  | "Anchors";

export type HydroSystemCategory =
  | "Chilled Water"
  | "Condenser Water"
  | "Generic";

export type HydroMaterialCategory =
  | "Carbon Steel"
  | "Copper"
  | "n/a";

export interface HydroMatrixEntry {
  id: string;
  indexIdFull: string;
  trade: HydroTrade;
  indexCategory: HydroIndexCategory;
  systemCategory: HydroSystemCategory;
  materialCategory: HydroMaterialCategory;
  description: string;
  fittingMfr: string;
  sizes: string;
  indexDescription: string;
  indexSubcategory: string;
}

/* -------------------------------------------------------------------------- */
/*  Canonical category order                                                   */
/* -------------------------------------------------------------------------- */

export const HYDRO_CATEGORY_ORDER: HydroIndexCategory[] = [
  "Pressure Testing",
  "Pipe",
  "Fittings",
  "Joining/Branch Methods",
  "Valves",
  "Specialties",
  "Insulation",
  "Identification",
  "Hangers/Supports",
  "Anchors",
];

/* -------------------------------------------------------------------------- */
/*  Mock data — 35 representative rows across all 10 categories                */
/* -------------------------------------------------------------------------- */

const mockHydroMatrixEntries: HydroMatrixEntry[] = [
  // ── Pressure Testing (3) ──────────────────────────────────────────────────
  {
    id: "hm-001",
    indexIdFull: "01_01_01_00_005_XX",
    trade: "Mechanical",
    indexCategory: "Pressure Testing",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Greater of 2 Hour Hydrostatic @ 150 psi. & 1.5 times operating pressure",
    fittingMfr: "n/a",
    sizes: "ALL",
    indexDescription: "Hydrostatic pressure test at 150 psi or 1.5 times the system operating pressure, whichever is greater. Test duration minimum 2 hours. All joints and connections shall be visually inspected during test. System shall show no pressure drop.",
    indexSubcategory: "Testing",
  },
  {
    id: "hm-002",
    indexIdFull: "01_01_02_00_005_XX",
    trade: "Mechanical",
    indexCategory: "Pressure Testing",
    systemCategory: "Condenser Water",
    materialCategory: "n/a",
    description: "Greater of 2 Hour Hydrostatic @ 150 psi. & 1.5 times operating pressure",
    fittingMfr: "n/a",
    sizes: "ALL",
    indexDescription: "Condenser water system pressure test per the same requirements as chilled water. All piping and fittings shall be tested before insulation is applied. Document test results with certified gauge readings.",
    indexSubcategory: "Testing",
  },
  {
    id: "hm-003",
    indexIdFull: "01_01_XX_00_006_XX",
    trade: "Mechanical",
    indexCategory: "Pressure Testing",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "Air Test @ 50 psi for 24 hours (Gas Systems)",
    fittingMfr: "n/a",
    sizes: "ALL",
    indexDescription: "Pneumatic pressure test at 50 psi for 24 hours minimum for gas piping systems. Apply soapy water solution to all joints during test. No leaks permitted. Follow all safety protocols for compressed air testing.",
    indexSubcategory: "Testing",
  },

  // ── Pipe (6) ──────────────────────────────────────────────────────────────
  {
    id: "hm-004",
    indexIdFull: "01_02_01_00_071_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "CS Sch 40 ERW (Nipples) - ASTM A-53 Grade-B",
    fittingMfr: "n/a",
    sizes: "Thru 2\"",
    indexDescription: "Carbon steel Schedule 40 Electric Resistance Welded nipples conforming to ASTM A-53 Grade B for chilled water branch connections and equipment hookups. Used for threaded connections on terminal units and accessories.",
    indexSubcategory: "Pipe (Nipples)",
  },
  {
    id: "hm-005",
    indexIdFull: "01_02_01_01_001_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Chilled Water",
    materialCategory: "Carbon Steel",
    description: "CS Sch 40 ERW - ASTM A-53 Grade B",
    fittingMfr: "n/a",
    sizes: "2.5|3|4|6|8|10",
    indexDescription: "Carbon steel Schedule 40 Electric Resistance Welded pipe conforming to ASTM A-53 Grade B for chilled water mains and risers. Suitable for welded and grooved connections. Mill test reports required.",
    indexSubcategory: "Pipe",
  },
  {
    id: "hm-006",
    indexIdFull: "01_02_01_01_002_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Chilled Water",
    materialCategory: "Carbon Steel",
    description: "CS Sch STD ERW - ASTM A-53 Grade B",
    fittingMfr: "n/a",
    sizes: "12|14|16|18",
    indexDescription: "Carbon steel Standard Weight Electric Resistance Welded pipe for large diameter chilled water mains. ASTM A-53 Grade B. Ends beveled for butt welding. Hydrostatic test required before insulation.",
    indexSubcategory: "Pipe",
  },
  {
    id: "hm-007",
    indexIdFull: "01_02_01_02_003_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Chilled Water",
    materialCategory: "Copper",
    description: "Copper Pipe Type L - ASTM B-88",
    fittingMfr: "n/a",
    sizes: "0.5|0.75|1|1.25|1.5|2|2.5|3",
    indexDescription: "Type L hard-drawn copper tube per ASTM B-88 for chilled water distribution piping where copper is specified. Joined with wrought copper solder-joint fittings per ASME B16.22. Lead-free solder required.",
    indexSubcategory: "Copper Pipe",
  },
  {
    id: "hm-008",
    indexIdFull: "01_02_02_01_001_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Condenser Water",
    materialCategory: "Carbon Steel",
    description: "CS Sch 40 ERW - ASTM A-53 Grade B",
    fittingMfr: "n/a",
    sizes: "2.5|3|4|6|8|10",
    indexDescription: "Carbon steel Schedule 40 ERW pipe for condenser water supply and return mains. Same specification as chilled water piping. Verify chemical treatment compatibility with water treatment specialist.",
    indexSubcategory: "Pipe",
  },
  {
    id: "hm-009",
    indexIdFull: "01_02_02_01_002_XX",
    trade: "Mechanical",
    indexCategory: "Pipe",
    systemCategory: "Condenser Water",
    materialCategory: "Carbon Steel",
    description: "CS Sch STD ERW - ASTM A-53 Grade B",
    fittingMfr: "n/a",
    sizes: "12|14|16|18",
    indexDescription: "Standard Weight carbon steel pipe for large diameter condenser water mains. Ends beveled for butt welding per ASME B16.25. Coordinate pipe routing with structural for adequate support spacing.",
    indexSubcategory: "Pipe",
  },

  // ── Fittings (5) ──────────────────────────────────────────────────────────
  {
    id: "hm-010",
    indexIdFull: "01_03_01_00_035_00",
    trade: "Mechanical",
    indexCategory: "Fittings",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Black Malleable Iron 150# - ASTM A-197 - ASME B16.3",
    fittingMfr: "n/a",
    sizes: "Thru 2\"",
    indexDescription: "Black malleable iron threaded fittings rated at 150 psi per ASTM A-197 and ASME B16.3. For use with threaded carbon steel pipe on chilled water branch connections. Includes elbows, tees, couplings, and unions.",
    indexSubcategory: "Fittings",
  },
  {
    id: "hm-011",
    indexIdFull: "01_03_01_00_038_00",
    trade: "Mechanical",
    indexCategory: "Fittings",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Butt Weld Sch Std Wt. Seamless - ASME B16.9 & A234 Grade-B",
    fittingMfr: "n/a",
    sizes: "2.5\" & Over",
    indexDescription: "Butt weld seamless carbon steel fittings per ASME B16.9 and ASTM A234 Grade WPB. Standard weight wall thickness. For welded connections on chilled water mains 2-1/2 inch and larger. Includes long-radius elbows, tees, and reducers.",
    indexSubcategory: "Fittings",
  },
  {
    id: "hm-012",
    indexIdFull: "01_03_01_00_037_00",
    trade: "Mechanical",
    indexCategory: "Fittings",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Bronze 125# - ASTM B-62",
    fittingMfr: "n/a",
    sizes: "Thru 2\"",
    indexDescription: "Bronze 125# threaded fittings per ASTM B-62 for copper-to-threaded transitions and equipment connections. Used where dielectric separation is required between copper and steel piping systems.",
    indexSubcategory: "Fittings",
  },
  {
    id: "hm-013",
    indexIdFull: "01_03_02_00_035_00",
    trade: "Mechanical",
    indexCategory: "Fittings",
    systemCategory: "Condenser Water",
    materialCategory: "n/a",
    description: "Black Malleable Iron 150# - ASTM A-197 - ASME B16.3",
    fittingMfr: "n/a",
    sizes: "Thru 2\"",
    indexDescription: "Same specification as chilled water malleable iron fittings. Applied to condenser water threaded branch connections. Verify compatibility with condenser water chemical treatment program.",
    indexSubcategory: "Fittings",
  },
  {
    id: "hm-014",
    indexIdFull: "01_03_01_00_040_00",
    trade: "Mechanical",
    indexCategory: "Fittings",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Grooved Coupling & Fittings - Victaulic Style 77 / 07",
    fittingMfr: "Victaulic",
    sizes: "2.5|3|4|6|8|10|12",
    indexDescription: "Victaulic Style 77 rigid and Style 07 flexible grooved couplings and fittings for chilled water piping. EPDM gaskets standard. Provide grooved adapters for transition to flanged equipment connections.",
    indexSubcategory: "Grooved Fittings",
  },

  // ── Joining/Branch Methods (3) ────────────────────────────────────────────
  {
    id: "hm-015",
    indexIdFull: "01_04_01_00_031_XX",
    trade: "Mechanical",
    indexCategory: "Joining/Branch Methods",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Standard Tee & Tee-Pull",
    fittingMfr: "n/a",
    sizes: "0.5|0.75|1|1.25|1.5|2|2.5|3",
    indexDescription: "Standard tee and tee-pull branch connections for chilled water distribution. Use reducing tees where branch size differs from main. Tee-pulls acceptable for equal-size branches up to 3 inches.",
    indexSubcategory: "Branch Line",
  },
  {
    id: "hm-016",
    indexIdFull: "01_04_01_00_035_XX",
    trade: "Mechanical",
    indexCategory: "Joining/Branch Methods",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "#5 Rectorseal Thread Sealant",
    fittingMfr: "Rectorseal",
    sizes: "Varies",
    indexDescription: "Rectorseal #5 pipe thread sealant for all threaded piping connections on chilled water systems. Apply to male threads only. PTFE tape not acceptable as sole thread sealant. Compliant with NSF/ANSI 61.",
    indexSubcategory: "Thread Sealant",
  },
  {
    id: "hm-017",
    indexIdFull: "01_04_01_00_042_XX",
    trade: "Mechanical",
    indexCategory: "Joining/Branch Methods",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Bolted Branch Connection",
    fittingMfr: "n/a",
    sizes: "4|6|8|10|12|14|16|18",
    indexDescription: "Bolted mechanical branch connection for large diameter chilled water mains. Self-reinforcing design eliminates need for saddle reinforcement. Rated for full system pressure. O-ring seal standard.",
    indexSubcategory: "Bolted Branch Connection",
  },

  // ── Valves (4) ────────────────────────────────────────────────────────────
  {
    id: "hm-018",
    indexIdFull: "01_05_01_00_050_XX",
    trade: "Mechanical",
    indexCategory: "Valves",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Nibco BFV LD-1000-1100 (Lugged) (Gear-Op)",
    fittingMfr: "Nibco",
    sizes: "14|16|18",
    indexDescription: "Nibco lug-style butterfly valve model LD-1000/LD-1100 with gear operator for chilled water isolation. EPDM disc seat. Ductile iron body and disc. For dead-end service. 250 psi cold working pressure rating.",
    indexSubcategory: "Valves",
  },
  {
    id: "hm-019",
    indexIdFull: "01_05_01_00_054_XX",
    trade: "Mechanical",
    indexCategory: "Valves",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Nibco BV T&S 585-70 (NPT) & (Solder)",
    fittingMfr: "Nibco",
    sizes: "0.5|0.75|1|1.25|1.5|2",
    indexDescription: "Nibco two-piece ball valve model T&S 585-70 with NPT or solder ends for chilled water shutoff. Full-port design. Chrome-plated brass ball and stem. PTFE seats and seals. 600 WOG rating.",
    indexSubcategory: "Valves",
  },
  {
    id: "hm-020",
    indexIdFull: "01_05_02_00_050_XX",
    trade: "Mechanical",
    indexCategory: "Valves",
    systemCategory: "Condenser Water",
    materialCategory: "n/a",
    description: "Nibco BFV LD-2000 (Lugged) (Gear-Op)",
    fittingMfr: "Nibco",
    sizes: "2.5|3|4|6|8|10|12",
    indexDescription: "Nibco lug-style butterfly valve model LD-2000 with gear operator (8 inch and above) for condenser water isolation. EPDM liner. Suitable for bi-directional dead-end service.",
    indexSubcategory: "Valves",
  },
  {
    id: "hm-021",
    indexIdFull: "01_05_01_00_060_XX",
    trade: "Mechanical",
    indexCategory: "Valves",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Circuit Setter - Bell & Gossett",
    fittingMfr: "Bell & Gossett",
    sizes: "0.5|0.75|1|1.25|1.5|2|2.5|3",
    indexDescription: "Bell & Gossett circuit balancing valve for chilled water flow regulation. Memory stop feature for field balancing. Includes test ports for differential pressure measurement. Calibrated nameplate included.",
    indexSubcategory: "Balancing Valves",
  },

  // ── Specialties (3) ──────────────────────────────────────────────────────
  {
    id: "hm-022",
    indexIdFull: "01_06_01_00_003_XX",
    trade: "Mechanical",
    indexCategory: "Specialties",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "B&G Hoffman AAV #78",
    fittingMfr: "Bell & Gossett",
    sizes: "3/4\" MIP",
    indexDescription: "Bell & Gossett Hoffman Model #78 automatic air vent for chilled water system high points. Brass body with stainless steel float mechanism. Install at all system high points and equipment connections. Include manual isolation valve below each AAV.",
    indexSubcategory: "Automatic Air Vents",
  },
  {
    id: "hm-023",
    indexIdFull: "01_06_01_00_004_XX",
    trade: "Mechanical",
    indexCategory: "Specialties",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "B&G PRV B7-12 @ 10 to 25 psi",
    fittingMfr: "Bell & Gossett",
    sizes: "3/4\"",
    indexDescription: "Bell & Gossett pressure reducing valve model B7-12 for chilled water makeup water connection. Factory set at 12 psi, adjustable 10-25 psi range. Bronze body. Install with bypass and strainer.",
    indexSubcategory: "Pressure Reducing",
  },
  {
    id: "hm-024",
    indexIdFull: "01_06_01_00_001_XX",
    trade: "Mechanical",
    indexCategory: "Specialties",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "ACCO Roof Penetration Detail",
    fittingMfr: "ACCO",
    sizes: "Varies",
    indexDescription: "ACCO engineered roof penetration assembly for chilled water piping through roof membrane. Includes flashing, counter-flashing, and pitch pocket. Coordinate with roofing contractor for warranty compliance.",
    indexSubcategory: "Roof Penetrations",
  },

  // ── Insulation (3) ───────────────────────────────────────────────────────
  {
    id: "hm-025",
    indexIdFull: "01_07_XX_00_001_XX",
    trade: "Mechanical",
    indexCategory: "Insulation",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "1\" Insulation Thickness",
    fittingMfr: "n/a",
    sizes: "Thru 3/4\"",
    indexDescription: "1-inch thick closed-cell elastomeric pipe insulation per 2022 Title 24 requirements for glycol chilled water systems below 39°F. Joints sealed with manufacturer-approved adhesive. Vapor barrier integrity maintained at all seams.",
    indexSubcategory: "2022 Title 24- Glycol Chilled Water (< 39F)",
  },
  {
    id: "hm-026",
    indexIdFull: "01_07_XX_00_003_XX",
    trade: "Mechanical",
    indexCategory: "Insulation",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "1-1/2\" Insulation Thickness",
    fittingMfr: "n/a",
    sizes: "Thru 1-1/4\"",
    indexDescription: "1-1/2 inch thick fiberglass pipe insulation with ASJ jacket per 2022 Title 24 for heating hot water systems above 141°F. All-service jacket with self-sealing lap. Additional vapor retarder not required on HHW systems.",
    indexSubcategory: "2022 Title 24- Heating Hot Water (> 141- 200F)",
  },
  {
    id: "hm-027",
    indexIdFull: "01_07_XX_00_002_XX",
    trade: "Mechanical",
    indexCategory: "Insulation",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "1/2\" Insulation Thickness or per Manufacturers Recommendations",
    fittingMfr: "n/a",
    sizes: "ALL",
    indexDescription: "Minimum 1/2 inch insulation thickness or per equipment manufacturer recommendations for DX refrigeration lines. Use closed-cell elastomeric insulation with vapor barrier. Protect from UV exposure where installed outdoors.",
    indexSubcategory: "2022 Title 24- Refrigeration (DX)",
  },

  // ── Identification (2) ───────────────────────────────────────────────────
  {
    id: "hm-028",
    indexIdFull: "01_08_XX_00_001_XX",
    trade: "Mechanical",
    indexCategory: "Identification",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "Chart",
    fittingMfr: "n/a",
    sizes: "8.5\" x 11\"",
    indexDescription: "Valve identification chart — laminated 8.5x11 chart posted in each mechanical room. Lists all valve tag numbers, locations, system served, normally open/closed position, and service description. Update chart with each system modification.",
    indexSubcategory: "Valve Tag",
  },
  {
    id: "hm-029",
    indexIdFull: "01_08_XX_00_003_XX",
    trade: "Mechanical",
    indexCategory: "Identification",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "MSI ANSI-ASME A13.1 - 2020 Pipe Marking Guide",
    fittingMfr: "MSI",
    sizes: "Varies",
    indexDescription: "Pipe identification labels per ANSI/ASME A13.1-2020 standard. Color-coded by hazard classification. Include flow direction arrows. Label all piping at maximum 25-foot intervals, at each valve, at wall/floor penetrations, and at branch connections.",
    indexSubcategory: "Guide",
  },

  // ── Hangers/Supports (3) ─────────────────────────────────────────────────
  {
    id: "hm-030",
    indexIdFull: "01_09_01_00_006_XX",
    trade: "Mechanical",
    indexCategory: "Hangers/Supports",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "Clevis",
    fittingMfr: "n/a",
    sizes: "2.5|3|4|6|8|10|12|14|16|18",
    indexDescription: "Clevis pipe hangers (Type 1) per MSS SP-58 for horizontal chilled water piping support. Carbon steel with galvanized or epoxy finish. Size hanger rod per MSS SP-69 guidelines. Maximum hanger spacing per B31.9.",
    indexSubcategory: "Hangers",
  },
  {
    id: "hm-031",
    indexIdFull: "01_09_01_00_017_XX",
    trade: "Mechanical",
    indexCategory: "Hangers/Supports",
    systemCategory: "Chilled Water",
    materialCategory: "n/a",
    description: "J Hanger",
    fittingMfr: "n/a",
    sizes: "2.5|3",
    indexDescription: "J-type pipe hangers for horizontal chilled water piping in accessible ceiling spaces. For pipes 2-1/2 to 3 inch diameter. Include insulation protection shield at hanger location to prevent insulation compression.",
    indexSubcategory: "Hangers",
  },
  {
    id: "hm-032",
    indexIdFull: "01_09_XX_00_030_XX",
    trade: "Mechanical",
    indexCategory: "Hangers/Supports",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "Channel Strut",
    fittingMfr: "n/a",
    sizes: "Varies",
    indexDescription: "Steel channel strut (Unistrut P1000 or equivalent) for pipe support assemblies, trapeze hangers, and equipment mounting. Hot-dip galvanized finish. Include spring nuts, beam clamps, and all required hardware per MSS SP-58.",
    indexSubcategory: "Channel Strut",
  },

  // ── Anchors (3) ──────────────────────────────────────────────────────────
  {
    id: "hm-033",
    indexIdFull: "01_10_XX_00_001_XX",
    trade: "Mechanical",
    indexCategory: "Anchors",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "DeWalt Powers SD1 Anchors",
    fittingMfr: "DeWalt",
    sizes: "Varies",
    indexDescription: "DeWalt Powers SD1 screw-in concrete anchors for pipe hanger and support attachment to concrete structure. Carbon steel zinc-plated. Size per load requirements with minimum 2x safety factor. ICC-ES evaluation report required.",
    indexSubcategory: "Drilled Expansion Anchors (Concrete)",
  },
  {
    id: "hm-034",
    indexIdFull: "01_10_XX_00_003_XX",
    trade: "Mechanical",
    indexCategory: "Anchors",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "Hilti HDI-P TZ Drop In Anchors",
    fittingMfr: "Hilti",
    sizes: "Varies",
    indexDescription: "Hilti HDI-P torque-controlled drop-in anchors for overhead and vertical concrete applications. For use in post-tension concrete slabs with minimum embedment depth per Hilti technical data. Pre-drill to specified diameter.",
    indexSubcategory: "Drilled Expansion Anchors (Post Tension Concrete)",
  },
  {
    id: "hm-035",
    indexIdFull: "01_10_XX_00_007_XX",
    trade: "Mechanical",
    indexCategory: "Anchors",
    systemCategory: "Generic",
    materialCategory: "n/a",
    description: "Sammys Fasteners",
    fittingMfr: "Sammys",
    sizes: "Varies",
    indexDescription: "Sammys threaded rod anchor points for attachment to steel deck and structural members. Self-drilling design eliminates need for pre-drilled holes. Minimum pullout and shear values per manufacturer load tables. Use for non-seismic support attachment.",
    indexSubcategory: "Fasteners (Steel Deck)",
  },
];

/* -------------------------------------------------------------------------- */
/*  Grid Versions — versioned snapshots of the specification library           */
/* -------------------------------------------------------------------------- */

export interface HydroGridVersion {
  id: string;
  label: string;
  date: string;
  entryIds: string[];
}

/** v1.0 — initial 20 core specs (Pressure Testing, Pipe, Fittings, Valves, Insulation) */
const V1_ENTRY_IDS = [
  "hm-001", "hm-002", "hm-003",           // Pressure Testing (3)
  "hm-004", "hm-005", "hm-006", "hm-007", // Pipe (4)
  "hm-008", "hm-009",                      // Pipe — Condenser (2)
  "hm-010", "hm-011", "hm-012", "hm-013", // Fittings (4)
  "hm-018", "hm-019", "hm-020", "hm-021", // Valves (4)
  "hm-025", "hm-026", "hm-027",           // Insulation (3)
];

/** v2.0 — added Joining, Specialties, Identification (28 entries) */
const V2_ENTRY_IDS = [
  ...V1_ENTRY_IDS,
  "hm-014",                                // Fittings — Grooved (1)
  "hm-015", "hm-016", "hm-017",           // Joining/Branch Methods (3)
  "hm-022", "hm-023", "hm-024",           // Specialties (3)
  "hm-028", "hm-029",                      // Identification (2)
];

/** v2.1 — full library: added Hangers/Supports + Anchors (35 entries) */
const V2_1_ENTRY_IDS = mockHydroMatrixEntries.map((e) => e.id);

export const HYDRO_GRID_VERSIONS: HydroGridVersion[] = [
  { id: "grid-v2.1", label: "v2.1 — Jan 2026", date: "2026-01-15", entryIds: V2_1_ENTRY_IDS },
  { id: "grid-v2.0", label: "v2.0 — Nov 2025", date: "2025-11-01", entryIds: V2_ENTRY_IDS },
  { id: "grid-v1.0", label: "v1.0 — Aug 2025", date: "2025-08-01", entryIds: V1_ENTRY_IDS },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function getAllHydroEntries(): HydroMatrixEntry[] {
  return mockHydroMatrixEntries;
}

export function getHydroGridVersions(): HydroGridVersion[] {
  return HYDRO_GRID_VERSIONS;
}

export function getEntriesForVersion(versionId: string): HydroMatrixEntry[] {
  const version = HYDRO_GRID_VERSIONS.find((v) => v.id === versionId);
  if (!version) return mockHydroMatrixEntries;
  const idSet = new Set(version.entryIds);
  return mockHydroMatrixEntries.filter((e) => idSet.has(e.id));
}
