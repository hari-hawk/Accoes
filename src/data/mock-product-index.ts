export interface ProductIndexSection {
  code: string;
  title: string;
  items: ProductIndexItem[];
}

export interface ProductIndexItem {
  category: string;
  itemNumber: number;
  description: string;
  itemDetail: string;
  size: string;
  specification: string;
  specLocation: string;
  isAlternate?: boolean;
}

export const productIndexSections: ProductIndexSection[] = [
  {
    code: "0-0",
    title: "Material Matrix",
    items: [
      { category: "0-0", itemNumber: 1, description: "Material Matrix", itemDetail: "", size: "", specification: "", specLocation: "" },
    ],
  },
  {
    code: "1-1",
    title: "Pressure Testing; Chilled Water",
    items: [
      { category: "1-1.01", itemNumber: 3, description: "Testing", itemDetail: "2 Hour Hydrostatic @ 150 psi. or 1.5 times operating pressure, whichever is greater.", size: "ALL", specification: "01_01_01_00_005_00", specLocation: "221005" },
    ],
  },
  {
    code: "2-1",
    title: "Piping; Chilled Water",
    items: [
      { category: "2-1.01", itemNumber: 9, description: "Nipples", itemDetail: "CS Sch 40 ERW (Nipples) - ASTM A-53 Grade-B", size: "Thru 2\"", specification: "01_02_01_00_071_00", specLocation: "221005" },
      { category: "2-1.02", itemNumber: 10, description: "Nipples", itemDetail: "CS Sch 80 Seamless (Nipples) - ASTM A-106 Grade-B", size: "Thru 2\"", specification: "01_02_01_00_072_00", specLocation: "221005" },
      { category: "2-1.03", itemNumber: 11, description: "Nipples", itemDetail: "Red Brass Sch 40 (Nipples) - ASTM B-43", size: "Thru 2\"", specification: "01_02_01_00_074_00", specLocation: "221005" },
      { category: "2-1.06", itemNumber: 14, description: "Pipe", itemDetail: "Copper Pipe Type L - ASTM B-88", size: "Thru 3\"", specification: "01_02_01_03_030_00", specLocation: "221005" },
    ],
  },
  {
    code: "3-1",
    title: "Fittings; Chilled Water",
    items: [
      { category: "3-1.01", itemNumber: 30, description: "Fittings", itemDetail: "Black Malleable Iron 150# - ASTM A-197 - ASME B16.3", size: "Thru 2\"", specification: "01_03_01_00_035_00", specLocation: "221005" },
      { category: "3-1.02", itemNumber: 31, description: "Fittings", itemDetail: "Bronze 125# - ASTM B-62", size: "Thru 2\"", specification: "01_03_01_00_037_00", specLocation: "221005" },
      { category: "3-1.03", itemNumber: 32, description: "Fittings", itemDetail: "Butt Weld Sch Std Wt. Seamless - ASME B16.9 & A234 Grade-B", size: "2-1/2\" & Over", specification: "01_03_01_00_038_00", specLocation: "221005" },
      { category: "3-1.04", itemNumber: 33, description: "Dielectric Nipples", itemDetail: "Clear Flow Dielectric Waterway - ASTM F1545", size: "Thru 2\"", specification: "01_03_01_00_039_00", specLocation: "221005" },
      { category: "3-1.05", itemNumber: 34, description: "Dielectric Nipples", itemDetail: "CTS Copper x Steel 150# (Flanged) - ASME B16.5", size: "1-1/2\" & Over", specification: "01_03_01_00_040_00", specLocation: "221005" },
      { category: "3-1.06", itemNumber: 35, description: "Fittings", itemDetail: "Parker - Brass Hose Fitting-Cap", size: "1/2\" & 3/4\"", specification: "01_03_01_00_042_11", specLocation: "221005" },
      { category: "3-1.07", itemNumber: 36, description: "Dielectric Nipples", itemDetail: "Sch 40 Brass Nipples (6 Inches Long Min.) - ASTM B-43", size: "Thru 2\"", specification: "01_03_01_00_043_00", specLocation: "221005" },
      { category: "3-1.08", itemNumber: 37, description: "Dielectric Nipples", itemDetail: "Watts Dielectric LF3001A", size: "Thru 2\"", specification: "01_03_01_00_047_15", specLocation: "221005" },
      { category: "3-1.09", itemNumber: 38, description: "Flanges", itemDetail: "Weld Neck - Slip On Flanges 150# - ASME B16.5", size: "2-1/2\" & Over", specification: "01_03_01_00_050_00", specLocation: "221005" },
      { category: "3-1.10", itemNumber: 39, description: "Flanges", itemDetail: "Weld Neck - Slip On Flanges 300# - ASME B16.5", size: "2-1/2\" & Over", specification: "01_03_01_00_051_00", specLocation: "221005" },
    ],
  },
  {
    code: "3-2",
    title: "Fittings; Condenser Water",
    items: [
      { category: "3-2.01", itemNumber: 45, description: "Fittings", itemDetail: "Black Malleable Iron 150# - ASTM A-197 - ASME B16.3", size: "Thru 2\"", specification: "01_03_02_00_035_00", specLocation: "221005" },
      { category: "3-2.02", itemNumber: 46, description: "Fittings", itemDetail: "Bronze 125# - ASTM B-62", size: "Thru 2\"", specification: "01_03_02_00_037_00", specLocation: "221005" },
      { category: "3-2.03", itemNumber: 47, description: "Fittings", itemDetail: "Butt Weld Sch Std Wt. Seamless - ASME B16.9 & A234 Grade-B", size: "2-1/2\" & Over", specification: "01_03_02_00_038_00", specLocation: "221005" },
      { category: "3-2.04", itemNumber: 48, description: "Dielectric Nipples", itemDetail: "Clear Flow Dielectric Waterway - ASTM F1545", size: "Thru 2\"", specification: "01_03_02_00_039_00", specLocation: "221005" },
      { category: "3-2.05", itemNumber: 49, description: "Dielectric Nipples", itemDetail: "CTS Copper x Steel 150# (Flanged) - ASME B16.5", size: "1-1/2\" & Over", specification: "01_03_02_00_040_00", specLocation: "221005" },
      { category: "3-2.06", itemNumber: 50, description: "Fittings", itemDetail: "Parker - Brass Hose Fitting-Cap", size: "1/2\" & 3/4\"", specification: "01_03_02_00_042_11", specLocation: "221005" },
      { category: "3-2.07", itemNumber: 51, description: "Dielectric Nipples", itemDetail: "Sch 40 Brass Nipples (6 Inches Long Min.) - ASTM B-43", size: "Thru 2\"", specification: "01_03_02_00_043_00", specLocation: "221005" },
      { category: "3-2.08", itemNumber: 52, description: "Dielectric Nipples", itemDetail: "Watts Dielectric LF3001A", size: "Thru 2\"", specification: "01_03_02_00_047_15", specLocation: "221005" },
      { category: "3-2.09", itemNumber: 53, description: "Flanges", itemDetail: "Weld Neck - Slip On Flanges 150# - ASME B16.5", size: "2-1/2\" & Over", specification: "01_03_02_00_050_00", specLocation: "221005" },
      { category: "3-2.10", itemNumber: 54, description: "Flanges", itemDetail: "Weld Neck - Slip On Flanges 300# - ASME B16.5", size: "2-1/2\" & Over", specification: "01_03_02_00_051_00", specLocation: "221005" },
      { category: "3-2.11", itemNumber: 55, description: "Fittings", itemDetail: "ASC - Groove Assist", size: "2-1/2\" -12\"", specification: "01_03_02_01_020_02", specLocation: "221005" },
      { category: "3-2.12", itemNumber: 56, description: "Fittings", itemDetail: "Victaulic - Groove Assist", size: "14\" & Over", specification: "01_03_02_01_020_n/a", specLocation: "221005" },
      { category: "3-2.13", itemNumber: 57, description: "Fittings", itemDetail: "Elkhart - Brazed/Solder", size: "2-1/2\" & Over", specification: "01_03_02_03_006_06", specLocation: "221005" },
      { category: "3-2.14", itemNumber: 58, description: "Fittings", itemDetail: "Elkhart/Viega - Brazed/Solder/Pressed", size: "2-1/2\" & Over", specification: "01_03_02_03_007_07", specLocation: "221005" },
    ],
  },
  {
    code: "4-1",
    title: "Joining-Branch Methods; Chilled Water",
    items: [
      { category: "4-1.01", itemNumber: 75, description: "Copper Branch Connection", itemDetail: "Standard Tee & Tee-Pull", size: "Thru 3\"", specification: "01_04_01_00_031_00", specLocation: "221005" },
      { category: "4-1.02", itemNumber: 76, description: "Carbon Steel Connection", itemDetail: "Standard Tee / O-Let / Saddle", size: "2-1/2\" & Over", specification: "01_04_01_00_032_00", specLocation: "221005" },
      { category: "4-1.03", itemNumber: 77, description: "Thread Sealant", itemDetail: "#5 Rectorseal Thread Sealant", size: "Varies", specification: "01_04_01_00_035_00", specLocation: "221005" },
      { category: "4-1.04", itemNumber: 78, description: "Thread Sealant Tape", itemDetail: "Blue Monster Ind. Grade Thread Sealant", size: "Varies", specification: "01_04_01_00_037_00", specLocation: "221005" },
      { category: "4-1.05", itemNumber: 79, description: "Flange Bolts", itemDetail: "Bolts - ASTM A-307 GRD. A", size: "Varies", specification: "01_04_01_00_040_00", specLocation: "221005" },
      { category: "4-1.06", itemNumber: 80, description: "Gaskets", itemDetail: "Full Face & Ring Garlock 3000 1/16\"", size: "1/16\"", specification: "01_04_01_00_043_00", specLocation: "221005" },
      { category: "4-1.07", itemNumber: 81, description: "Solder", itemDetail: "Harris Stay Brite #8 Solder", size: "Varies", specification: "01_04_01_00_045_00", specLocation: "221005" },
      { category: "4-1.08", itemNumber: 82, description: "Flux", itemDetail: "Harris Stay Clean Liquid Flux", size: "Varies", specification: "01_04_01_00_046_00", specLocation: "221005" },
      { category: "4-1.09", itemNumber: 83, description: "Bolt Lubricant", itemDetail: "LA-CO Anti-Seize Compound", size: "Varies", specification: "01_04_01_00_048_00", specLocation: "221005" },
      { category: "4-1.10", itemNumber: 84, description: "Thread Sealant", itemDetail: "LOCTITE 567 Thread Sealant", size: "Varies", specification: "01_04_01_00_049_00", specLocation: "221005" },
      { category: "4-1.11", itemNumber: 85, description: "Flange Nuts", itemDetail: "Nuts - ASTM A-563 GRD. A", size: "Varies", specification: "01_04_01_00_052_00", specLocation: "221005" },
      { category: "4-1.12", itemNumber: 86, description: "Thread Sealant Tape", itemDetail: "Rectorseal & Blue Monster Teflon (PTFE) Tape", size: "Varies", specification: "01_04_01_00_053_00", specLocation: "221005" },
      { category: "4-1.13", itemNumber: 87, description: "Thread Sealant", itemDetail: "Refrigeration Technologies Nylog", size: "Varies", specification: "01_04_01_00_054_00", specLocation: "221005" },
      { category: "4-1.14", itemNumber: 88, description: "Swedging Copper", itemDetail: "Swedging Copper - (Methods per ANSI B16.18)", size: "Thru 3\"", specification: "01_04_01_00_059_00", specLocation: "221005" },
      { category: "4-1.15", itemNumber: 89, description: "Thread Sealant", itemDetail: "T+2 Rectorseal Thread Sealant", size: "Varies", specification: "01_04_01_00_060_00", specLocation: "221005" },
      { category: "4-1.16", itemNumber: 90, description: "Bolted Branch Connection", itemDetail: "Victaulic 920 Branch Tee - ASTM A536", size: "2\" & Over (Main)", specification: "01_04_01_00_061_00", specLocation: "221005" },
      { category: "4-1.17", itemNumber: 91, description: "Flux", itemDetail: "WISEMAN EVERFLUX", size: "Thru 2\"", specification: "01_04_01_00_064_00", specLocation: "221005" },
      { category: "4-1.18", itemNumber: 92, description: "Carbon Steel Connection", itemDetail: "Gruvlok", size: "2-1/2\" -12\"", specification: "01_04_01_01_005_00", specLocation: "221005" },
      { category: "4-1.19", itemNumber: 93, description: "Carbon Steel Connection", itemDetail: "Victaulic/Welded B31.9", size: "14\" & Over", specification: "01_04_01_01_022_00", specLocation: "221005" },
      { category: "4-1.20", itemNumber: 94, description: "Brazing Rod", itemDetail: "Sil-Fos 15 & Stay-Silv 15 / Silvabrite 100 Solder", size: "Thru 2-1/2\"", specification: "01_04_01_03_013_00", specLocation: "221005" },
    ],
  },
  {
    code: "5-1",
    title: "Valves; Chilled Water",
    items: [
      { category: "5-1.01", itemNumber: 138, description: "Butterfly Valve", itemDetail: "Nibco BFV LD-1000-1100 (Lugged) (Gear-Op)", size: "14\" & Up", specification: "01_05_01_00_050_00", specLocation: "221005" },
      { category: "5-1.02", itemNumber: 139, description: "Butterfly Valve", itemDetail: "Nibco BFV LD-2000 (Lugged) (8in. & up have Gear-Op)", size: "2-1/2\" - 12\"", specification: "01_05_01_00_051_00", specLocation: "221005" },
      { category: "5-1.03", itemNumber: 140, description: "Ball Valve", itemDetail: "Nibco BV T&S 585-70 (NPT) & (Solder)", size: "Thru 2\"", specification: "01_05_01_00_054_00", specLocation: "221005" },
      { category: "5-1.04", itemNumber: 141, description: "Check Valve", itemDetail: "Nibco CV F-910-B & F960-B (125# & 250#)", size: "2-1/2\" - 12\"", specification: "01_05_01_00_056_00", specLocation: "221005" },
      { category: "5-1.05", itemNumber: 142, description: "Check Valve", itemDetail: "Nibco CV T&S 433-B Swing (NPT) & Solder)", size: "Thru 2\"", specification: "01_05_01_00_060_00", specLocation: "221005" },
      { category: "5-1.06", itemNumber: 143, description: "Manual Balancing Valve", itemDetail: "B&G MBV Circuit Setter Plus CB (Flanged) & (Grooved)", size: "2-1/2\" thru 12\"", specification: "01_05_01_00_090_00", specLocation: "221005" },
      { category: "5-1.07", itemNumber: 144, description: "Manual Balancing Valve", itemDetail: "B&G MBV Circuit Setter Plus CB (NPT) & (Solder)", size: "Thru 3\"", specification: "01_05_01_00_091_00", specLocation: "221005" },
      { category: "5-1.08", itemNumber: 145, description: "Triple Duty Valve", itemDetail: "B&G TDV 3DS Straight Pattern S (Flanged) & G (Grooved)", size: "2\" & Over", specification: "01_05_01_00_092_00", specLocation: "221005" },
      { category: "5-1.09", itemNumber: 146, description: "Triple Duty Valve", itemDetail: "B&G TDV 3DV Straight Pattern (NPT)", size: "Thru 2\"", specification: "01_05_01_00_093_00", specLocation: "221005" },
      { category: "5-1.10", itemNumber: 147, description: "Triple Duty Valve", itemDetail: "B&G TDV 3D-XS Angle Pattern S (Flanged)", size: "2\" & Over", specification: "01_05_01_00_094_00", specLocation: "221005" },
      { category: "5-1.11", itemNumber: 148, description: "Coil Pak/Kit (Automatic)", itemDetail: "Nexus A2Y (Ultra U, UltraMatic & Ultra Y)", size: "Thru 2\"", specification: "01_05_01_00_097_00", specLocation: "221005" },
      { category: "5-1.12", itemNumber: 149, description: "Coil Pak/Kit (Automatic with By-pass 3-way)", itemDetail: "Nexus A3Y (Ultra U, UltraMatic & Ultra Y)", size: "Thru 2\"", specification: "01_05_01_00_098_00", specLocation: "221005" },
      { category: "5-1.13", itemNumber: 150, description: "Coil Pak/Kit (Manual)", itemDetail: "Nexus O2Y (Ultra U, XB & Ultra Y)", size: "Thru 2\"", specification: "01_05_01_00_099_00", specLocation: "221005" },
      { category: "5-1.14", itemNumber: 151, description: "Coil Pak/Kit (Manual with By-pass 3-way)", itemDetail: "Nexus O3Y (Ultra U, XB, & Ultra Y)", size: "Thru 2\"", specification: "01_05_01_00_100_00", specLocation: "221005" },
      { category: "5-1.15", itemNumber: 152, description: "Coil Pak/Kit Flex Connections", itemDetail: "Nexus UltraFlex UFHM", size: "Thru 2\"", specification: "01_05_01_00_101_00", specLocation: "221005" },
      { category: "5-1.16", itemNumber: 153, description: "Manual Balancing Valve", itemDetail: "Victaulic Tour and Andersson MBV #786 (Solder) & #787 (NPT)", size: "Thru 2\"", specification: "01_05_01_00_103_00", specLocation: "221005" },
      { category: "5-1.17", itemNumber: 154, description: "Manual Balancing Valve", itemDetail: "Victaulic Tour and Andersson MBV #788 (Flanged) & #789 (Grooved)", size: "2-1/2\" - 16\"", specification: "01_05_01_00_104_00", specLocation: "221005" },
    ],
  },
  {
    code: "6-1",
    title: "Specialties; Hydronics",
    items: [
      { category: "6-1.01", itemNumber: 192, description: "Roof Penetrations", itemDetail: "ACCO Roof Penetration Detail", size: "Varies", specification: "01_06_01_00_001_00", specLocation: "221005" },
      { category: "6-1.02", itemNumber: 193, description: "Automatic Air Vents", itemDetail: "B&G Hoffman AAV #78", size: "3/4\" MIP", specification: "01_06_01_00_003_00", specLocation: "221005" },
      { category: "6-1.03", itemNumber: 194, description: "Pressure Reducing", itemDetail: "B&G PRV B7-12 @ 10 to 25 psi", size: "3/4\"", specification: "01_06_01_00_004_00", specLocation: "221005" },
      { category: "6-1.04", itemNumber: 195, description: "Suction Diffuser", itemDetail: "B&G SD Fig. 3X B-826 (NPT) & (Flanged)", size: "2\" thru 10\"", specification: "01_06_01_00_005_00", specLocation: "221005" },
      { category: "6-1.05", itemNumber: 196, description: "Suction Diffuser", itemDetail: "B&G SD Fig. SDG B-808E (Flange x Groove)", size: "2\" thru 10\"", specification: "01_06_01_00_006_00", specLocation: "221005" },
      { category: "6-1.06", itemNumber: 197, description: "Safety Relief", itemDetail: "B&G S-Relief-V 790 & 1170", size: "Thru 2\"", specification: "01_06_01_00_007_00", specLocation: "221005" },
      { category: "6-1.07", itemNumber: 198, description: "Block Out \"Riser Sleeves\"", itemDetail: "Cast-in-Place Strut Block Out", size: "Varies", specification: "01_06_01_00_008_00", specLocation: "221005" },
      { category: "6-1.08", itemNumber: 199, description: "Flex Connections", itemDetail: "DME 512 304SS Braided with CS (M-NPT)", size: "Thru 2\"", specification: "01_06_01_00_011_00", specLocation: "221005" },
      { category: "6-1.09", itemNumber: 200, description: "Flex Connections", itemDetail: "DME 7404 304SS Braided with CS (Flanged)", size: "2\" & Over", specification: "01_06_01_00_012_00", specLocation: "221005" },
      { category: "6-1.10", itemNumber: 201, description: "Flex Connections", itemDetail: "DME 7404H 304SS Braided with 304SS (Flanged)", size: "2\" & Over", specification: "01_06_01_00_013_00", specLocation: "221005" },
    ],
  },
  {
    code: "7-1",
    title: "Insulation",
    items: [
      { category: "7-1.01", itemNumber: 261, description: "2022 Title 24- Chilled Water (40-60F)", itemDetail: "1/2\" Insulation Thickness", size: "Thru 1-1/4\"", specification: "01_07_00_00_001_00", specLocation: "221005" },
      { category: "7-1.02", itemNumber: 262, description: "2022 Title 24- Chilled Water (40-60F)", itemDetail: "1\" Insulation Thickness", size: "1-1/2\" & Larger", specification: "01_07_00_00_002_00", specLocation: "221005" },
    ],
  },
  {
    code: "8-1",
    title: "Identification",
    items: [
      { category: "8-1.01", itemNumber: 268, description: "Valve Tag", itemDetail: "Chart", size: "8.5\" x 11\"", specification: "01_08_00_00_001_00", specLocation: "220553" },
      { category: "8-1.02", itemNumber: 269, description: "Guide", itemDetail: "MSI ANSI-ASME A13.1 - 2020 Pipe Marking Guide", size: "Varies", specification: "01_08_00_00_003_00", specLocation: "220553" },
      { category: "8-1.03", itemNumber: 270, description: "Valve Tag Fasteners", itemDetail: "MSI Meter Seals & Brass Beaded Chain", size: "Varies", specification: "01_08_00_00_005_00", specLocation: "220553" },
      { category: "8-1.04", itemNumber: 271, description: "Pipe Markers", itemDetail: "MSI Pipe Markers Vinyl Adhesive - Arrow Tape", size: "Varies", specification: "01_08_00_00_006_00", specLocation: "220553" },
      { category: "8-1.05", itemNumber: 272, description: "Valve Tags", itemDetail: "MSI Valve Tags 19 Gauge Brass", size: "1-1/2\"", specification: "01_08_00_00_007_00", specLocation: "220553" },
    ],
  },
  {
    code: "9-1",
    title: "Hangers, Supports & Hardware; All Systems",
    items: [
      { category: "9-1.01", itemNumber: 288, description: "All Thread Rod", itemDetail: "ATR", size: "Varies", specification: "01_09_00_00_026_00", specLocation: "220529" },
      { category: "9-1.02", itemNumber: 289, description: "Band-Hangers (Type 10)", itemDetail: "B-Line - Band Fig. 200 & 200F", size: "Varies", specification: "01_09_00_00_029_00", specLocation: "220529" },
      { category: "9-1.03", itemNumber: 290, description: "Beam Clamps & Retaining Straps (Type 19&23)", itemDetail: "B-Line - Beam Clamps B3033 & B3034 - Fig. 65s, 66, 69 & 69R", size: "Varies", specification: "01_09_00_00_030_00", specLocation: "220529" },
      { category: "9-1.04", itemNumber: 291, description: "Beam Clamps (Type 21&27)", itemDetail: "B-Line - Beam Clamps B3040 & B3050 - Strut B44s & B314", size: "Varies", specification: "01_09_00_00_031_00", specLocation: "220529" },
      { category: "9-1.05", itemNumber: 292, description: "Hex Head Cap Screws", itemDetail: "B-Line - Cap Screws HHCS", size: "Varies", specification: "01_09_00_00_032_00", specLocation: "220529" },
      { category: "9-1.11", itemNumber: 298, description: "Clevis Hangers (Type 1)", itemDetail: "B-Line - Clevis B3100 & B3100F", size: "Varies", specification: "01_09_00_00_039_00", specLocation: "220529" },
      { category: "9-1.20", itemNumber: 307, description: "Riser Clamps (Type 8)", itemDetail: "B-Line - Riser B3373, F & CT", size: "Varies", specification: "01_09_00_00_051_00", specLocation: "220529" },
      { category: "9-1.27", itemNumber: 314, description: "Standard Pipe Strap (Type 26)", itemDetail: "B-Line - Strap B2400", size: "Varies", specification: "01_09_00_00_058_00", specLocation: "220529" },
      { category: "9-1.46", itemNumber: 333, description: "Hanger (Refrigeration)", itemDetail: "Kwik-Clip Channel Mounts Clips BPSC, BPIC & BPRC", size: "Varies", specification: "01_09_00_00_080_00", specLocation: "220529" },
      { category: "9-1.55", itemNumber: 342, description: "Clevis Hangers (Type 1)", itemDetail: "PHD - Clevis Fig 451", size: "Varies", specification: "01_09_00_00_090_00", specLocation: "220529" },
      { category: "9-1.64", itemNumber: 351, description: "Riser Clamps (Type 8)", itemDetail: "PHD - Riser Fig 550, 551, 552, 553 & 554", size: "Varies", specification: "01_09_00_00_101_00", specLocation: "220529" },
      { category: "9-1.70", itemNumber: 357, description: "Standard Pipe Strap (Type 26)", itemDetail: "PHD - Strap Fig 825 & 826", size: "Varies", specification: "01_09_00_00_107_00", specLocation: "220529" },
    ],
  },
  {
    code: "10-1",
    title: "Anchors; Concrete, Metal, & Wood; All Systems",
    items: [
      { category: "10-1.01", itemNumber: 369, description: "Drilled Expansion Anchors (Concrete)", itemDetail: "DeWalt Powers SD1 Anchors", size: "Varies", specification: "01_10_00_00_001_00", specLocation: "221005" },
      { category: "10-1.02", itemNumber: 370, description: "Threaded Fasteners (Concrete, Metal & Wood)", itemDetail: "DeWalt Powers Fasteners", size: "Varies", specification: "01_10_00_00_002_00", specLocation: "221005" },
      { category: "10-1.03", itemNumber: 371, description: "Drilled Expansion Anchors (Post Tension Concrete)", itemDetail: "Hilti HDI-P TZ Drop In Anchors", size: "Varies", specification: "01_10_00_00_003_00", specLocation: "221005" },
      { category: "10-1.04", itemNumber: 372, description: "Screw Anchor (Concrete)", itemDetail: "Hilti KH-EZ I & EZ E", size: "Varies", specification: "01_10_00_00_004_00", specLocation: "221005" },
      { category: "10-1.05", itemNumber: 373, description: "Drilled Expansion Anchors (Concrete)", itemDetail: "Hilti Kwik Bolt TZ2 Anchors", size: "Varies", specification: "01_10_00_00_005_00", specLocation: "221005" },
      { category: "10-1.06", itemNumber: 374, description: "Powder Actuated Fasteners (Concrete)", itemDetail: "Hilti X-HS System", size: "Varies", specification: "01_10_00_00_006_00", specLocation: "221005" },
      { category: "10-1.07", itemNumber: 375, description: "Threaded Fasteners (Concrete, Metal & Wood)", itemDetail: "Sammys Fasteners", size: "Varies", specification: "01_10_00_00_007_00", specLocation: "221005" },
      { category: "10-1.08", itemNumber: 376, description: "Threaded Fasteners (Wood)", itemDetail: "Sammys Fasteners Wood", size: "Varies", specification: "01_10_00_00_008_00", specLocation: "221005" },
      { category: "10-1.09", itemNumber: 377, description: "Threaded Fasteners (Metal)", itemDetail: "Sammys X-Press Metal", size: "Varies", specification: "01_10_00_00_009_00", specLocation: "221005" },
    ],
  },
];
