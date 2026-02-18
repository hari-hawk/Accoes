import type { ValidationResult, ValidationCategory } from "./types";

export const mockValidations: ValidationResult[] = [
  {
    id: "val-1",
    documentId: "doc-28",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 96,
    decision: "approved",
    decisionBy: "user-1",
    decisionAt: "2026-01-10T14:00:00Z",
    evidenceItems: [
      {
        id: "ev-1",
        sourceDocumentId: "doc-28",
        sourceFileName: "Finishes",
        pageNumber: 3,
        excerpt: "Electro-galvanized finish for all interior hangers and supports. Stainless steel or hot-dip galvanized for exterior applications.",
        relevance: "supports",
        confidence: 97,
      },
      {
        id: "ev-2",
        sourceDocumentId: "doc-28",
        sourceFileName: "Finishes",
        pageNumber: 5,
        excerpt: "All finishes meet ASTM A153 for hot-dip galvanizing and ASTM B633 for electro-galvanizing requirements.",
        relevance: "supports",
        confidence: 95,
      },
    ],
    aiReasoning: {
      summary: "Finish specifications fully comply with section 05 29 00 requirements for interior and exterior applications.",
      keyFindings: [
        "Electro-galvanized finish confirmed for interior use",
        "Stainless steel and HDG options provided for exterior",
        "ASTM A153 and B633 compliance documented",
        "Manufacturer is listed in approved manufacturers list",
      ],
      complianceAssessment: "All critical requirements are met. The finish specifications provide complete documentation for both interior and exterior applications as required.",
      recommendation: "Approve. No further action required.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "Electro-galvanized finish for interior applications",
        "Stainless steel or HDG for exterior applications",
        "ASTM A153 compliance for hot-dip galvanizing",
        "ASTM B633 compliance for electro-galvanizing",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-2",
    documentId: "doc-29",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 92,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-3",
        sourceDocumentId: "doc-29",
        sourceFileName: "Clevis Hanger (Type 1)",
        pageNumber: 1,
        excerpt: "B-Line B3100 and B3100F clevis hangers. Carbon steel construction with electro-galvanized finish. Load ratings per MSS SP-69.",
        relevance: "supports",
        confidence: 94,
      },
      {
        id: "ev-4",
        sourceDocumentId: "doc-29",
        sourceFileName: "Clevis Hanger (Type 1)",
        pageNumber: 2,
        excerpt: "Available in sizes 1/2\" through 30\". UL listed for fire-rated assemblies.",
        relevance: "supports",
        confidence: 90,
      },
    ],
    aiReasoning: {
      summary: "Clevis hanger product data fully complies with specification requirements for Type 1 pipe hangers.",
      keyFindings: [
        "B-Line B3100 & B3100F models match specification",
        "Load ratings meet MSS SP-69 standards",
        "Finish type matches interior requirements",
        "UL listing for fire-rated assemblies confirmed",
      ],
      complianceAssessment: "The clevis hanger submittal meets all specification requirements. Product data sheets are complete with load ratings and material certifications.",
      recommendation: "Approve. Product matches specification exactly.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B3100 or B3100F clevis hangers",
        "MSS SP-69 load ratings",
        "Electro-galvanized finish for interior",
        "UL listing for fire-rated applications",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-3",
    documentId: "doc-30",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 74,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-5",
        sourceDocumentId: "doc-30",
        sourceFileName: "Riser Clamps (Type 8)",
        pageNumber: 1,
        excerpt: "B-Line B3373 riser clamps. Carbon steel with electro-galvanized finish. Sizes 1/2\" through 12\".",
        relevance: "supports",
        confidence: 88,
      },
      {
        id: "ev-6",
        sourceDocumentId: "doc-30",
        sourceFileName: "Riser Clamps (Type 8)",
        pageNumber: 2,
        excerpt: "Load ratings provided for vertical pipe support. Seismic bracing compatibility not addressed in submittal.",
        relevance: "neutral",
        confidence: 65,
      },
    ],
    aiReasoning: {
      summary: "Riser clamp product data is compliant but missing seismic bracing compatibility documentation.",
      keyFindings: [
        "B-Line B3373, F & CT models identified",
        "Basic load ratings are adequate",
        "Seismic bracing compatibility not documented",
        "Finish type matches specification",
      ],
      complianceAssessment: "The riser clamps meet basic specification requirements. However, seismic bracing compatibility documentation is missing and should be provided.",
      recommendation: "Review required. Request seismic bracing compatibility documentation.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B3373, F & CT riser clamps",
        "Vertical pipe support load ratings",
        "Seismic bracing compatibility required",
        "Electro-galvanized finish for interior",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-4",
    documentId: "doc-31",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 93,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-7",
        sourceDocumentId: "doc-31",
        sourceFileName: "Standard Pipe Strap (Type 26)",
        pageNumber: 1,
        excerpt: "B-Line B2400 standard pipe strap. Steel construction, electro-galvanized. Pipe sizes 1/2\" through 8\".",
        relevance: "supports",
        confidence: 96,
      },
    ],
    aiReasoning: {
      summary: "Standard pipe strap meets all specification requirements.",
      keyFindings: [
        "B-Line B2400 model matches specification",
        "Size range covers project requirements",
        "Finish type is compliant",
        "Load data provided and adequate",
      ],
      complianceAssessment: "The pipe strap submittal fully complies with section 05 29 00 requirements.",
      recommendation: "Approve. Product is compliant.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B2400 pipe straps",
        "Steel construction",
        "Electro-galvanized finish",
        "Appropriate size range for project",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-5",
    documentId: "doc-32",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 71,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-8",
        sourceDocumentId: "doc-32",
        sourceFileName: "All Thread Rod",
        pageNumber: 1,
        excerpt: "All thread rod supplied in carbon steel, zinc-plated. ASTM A307 Grade A. Available in 3/8\" through 1\" diameters.",
        relevance: "supports",
        confidence: 85,
      },
      {
        id: "ev-9",
        sourceDocumentId: "doc-32",
        sourceFileName: "All Thread Rod",
        pageNumber: 2,
        excerpt: "Stainless steel option available but pricing and lead time not confirmed for exterior applications.",
        relevance: "contradicts",
        confidence: 70,
      },
    ],
    aiReasoning: {
      summary: "All thread rod meets interior requirements but exterior stainless steel availability not confirmed.",
      keyFindings: [
        "ASTM A307 Grade A compliance confirmed",
        "Interior zinc-plated option is compliant",
        "Exterior stainless steel availability uncertain",
        "Lead time for SS variant not provided",
      ],
      complianceAssessment: "The all thread rod for interior applications is compliant. Exterior application requires stainless steel confirmation.",
      recommendation: "Review required. Confirm stainless steel availability and lead time for exterior applications.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "ASTM A307 Grade A all thread rod",
        "Zinc-plated for interior use",
        "Stainless steel for exterior use",
        "Available diameters per project schedule",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-6",
    documentId: "doc-33",
    versionId: "ver-5",
    status: "action_mandatory",
    confidenceScore: 52,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-10",
        sourceDocumentId: "doc-33",
        sourceFileName: "Rod Couplings",
        pageNumber: 1,
        excerpt: "B-Line B655 and B656 rod couplings. Submitted data sheet references older catalog revision (2019).",
        relevance: "contradicts",
        confidence: 78,
      },
      {
        id: "ev-11",
        sourceDocumentId: "doc-33",
        sourceFileName: "Rod Couplings",
        pageNumber: 2,
        excerpt: "Load ratings listed may not reflect current manufacturer specifications. Updated data sheet required.",
        relevance: "contradicts",
        confidence: 88,
      },
    ],
    aiReasoning: {
      summary: "Rod coupling submittal uses outdated manufacturer catalog data that must be updated.",
      keyFindings: [
        "B-Line B655 & B656 models are correct",
        "Catalog data is from 2019 — outdated",
        "Load ratings may differ from current specs",
        "Updated data sheets are required",
      ],
      complianceAssessment: "The rod coupling models match specification requirements, but the submitted documentation is outdated. Current manufacturer data is required for approval.",
      recommendation: "Action mandatory. Resubmit with current manufacturer data sheets.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B655 & B656 rod couplings",
        "Current manufacturer data sheets required",
        "Load ratings per current catalog",
        "Material certifications included",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-7",
    documentId: "doc-34",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 91,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-12",
        sourceDocumentId: "doc-34",
        sourceFileName: "Standard Nuts",
        pageNumber: 1,
        excerpt: "B-Line HN hex nuts. ASTM A563 Grade A carbon steel, zinc-plated. Sizes match all thread rod diameters.",
        relevance: "supports",
        confidence: 93,
      },
    ],
    aiReasoning: {
      summary: "Standard nuts meet all specification requirements.",
      keyFindings: [
        "B-Line HN hex nut model confirmed",
        "ASTM A563 Grade A compliance",
        "Zinc-plated finish matches specification",
        "Size range matches project all thread rod",
      ],
      complianceAssessment: "Full compliance with specification section 05 29 00. All hardware specifications are met.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line HN hex nuts",
        "ASTM A563 Grade A",
        "Zinc-plated finish",
        "Compatible sizing with all thread rod",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-8",
    documentId: "doc-35",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 94,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-13",
        sourceDocumentId: "doc-35",
        sourceFileName: "Flat & Fender Washers",
        pageNumber: 1,
        excerpt: "B-Line FW flat washers and FFW fender washers. Carbon steel, zinc-plated. Compliant with ASTM F844.",
        relevance: "supports",
        confidence: 96,
      },
    ],
    aiReasoning: {
      summary: "Flat and fender washers meet all specification requirements.",
      keyFindings: [
        "B-Line FW & FFW models confirmed",
        "ASTM F844 compliance documented",
        "Zinc-plated finish matches specification",
        "Size range is adequate for project needs",
      ],
      complianceAssessment: "Full compliance with section 05 29 00 requirements for washers.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line FW & FFW washers",
        "ASTM F844 compliance",
        "Zinc-plated finish",
        "Appropriate sizing",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-9",
    documentId: "doc-36",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 76,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-14",
        sourceDocumentId: "doc-36",
        sourceFileName: "Square & Bevel Washers",
        pageNumber: 1,
        excerpt: "B-Line B200 square washers and B3234 SW bevel washers. Steel construction, zinc-plated. Beam clamp application details incomplete.",
        relevance: "neutral",
        confidence: 75,
      },
    ],
    aiReasoning: {
      summary: "Square and bevel washers meet basic requirements but beam clamp application details are incomplete.",
      keyFindings: [
        "B-Line B200 & B3234 SW models confirmed",
        "Material and finish are compliant",
        "Beam clamp application details missing",
        "Load distribution data not provided",
      ],
      complianceAssessment: "The washers meet basic material requirements but application-specific details for beam clamp installations need clarification.",
      recommendation: "Review required. Request beam clamp application details and load distribution data.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B200 & B3234 SW washers",
        "Beam clamp application data required",
        "Load distribution documentation",
        "Zinc-plated finish",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-10",
    documentId: "doc-37",
    versionId: "ver-5",
    status: "action_mandatory",
    confidenceScore: 48,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-15",
        sourceDocumentId: "doc-37",
        sourceFileName: "Hex Head Lag Bolt",
        pageNumber: 1,
        excerpt: "B-Line B3228 hex head lag bolt. Submitted data shows Grade 2 material. Specification requires Grade 5 for structural applications.",
        relevance: "contradicts",
        confidence: 94,
      },
    ],
    aiReasoning: {
      summary: "Hex head lag bolt material grade does not meet specification requirements for structural applications.",
      keyFindings: [
        "B-Line B3228 model is correct",
        "Grade 2 submitted vs Grade 5 required",
        "Structural load capacity is insufficient",
        "Material certification does not match spec",
      ],
      complianceAssessment: "The submitted lag bolt grade fails to meet the structural application requirements. Grade 5 material is required per specification.",
      recommendation: "Action mandatory. Resubmit with Grade 5 lag bolts for structural applications.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B3228 lag bolts",
        "Grade 5 material for structural use",
        "Zinc-plated or HDG finish",
        "Load capacity per engineering requirements",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-11",
    documentId: "doc-38",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 89,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-16",
        sourceDocumentId: "doc-38",
        sourceFileName: "Channel Strut",
        pageNumber: 1,
        excerpt: "B-Line channel strut, all 12 gauge construction. Pre-galvanized steel per ASTM A653. Standard 1-5/8\" x 1-5/8\" profile.",
        relevance: "supports",
        confidence: 91,
      },
      {
        id: "ev-17",
        sourceDocumentId: "doc-38",
        sourceFileName: "Channel Strut",
        pageNumber: 3,
        excerpt: "Load tables provided for all standard configurations. Seismic bracing details included per IBC requirements.",
        relevance: "supports",
        confidence: 88,
      },
    ],
    aiReasoning: {
      summary: "Channel strut submittal meets all specification requirements including seismic bracing.",
      keyFindings: [
        "All 12 gauge construction confirmed",
        "Pre-galvanized steel per ASTM A653",
        "Load tables are complete",
        "Seismic bracing details included",
      ],
      complianceAssessment: "Full compliance with channel strut requirements in section 05 29 00.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "12 gauge minimum construction",
        "ASTM A653 pre-galvanized steel",
        "Complete load tables required",
        "Seismic bracing per IBC",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-12",
    documentId: "doc-39",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 72,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-18",
        sourceDocumentId: "doc-39",
        sourceFileName: "Channel Nuts, With / Without Springs",
        pageNumber: 1,
        excerpt: "B-Line channel nuts with and without spring options. Zinc-plated steel. Torque specifications provided for standard installations.",
        relevance: "supports",
        confidence: 85,
      },
      {
        id: "ev-19",
        sourceDocumentId: "doc-39",
        sourceFileName: "Channel Nuts, With / Without Springs",
        pageNumber: 2,
        excerpt: "Spring nut retention force data not provided for overhead applications.",
        relevance: "contradicts",
        confidence: 72,
      },
    ],
    aiReasoning: {
      summary: "Channel nuts meet basic requirements but spring nut retention data for overhead use is missing.",
      keyFindings: [
        "B-Line channel nut models confirmed",
        "Standard torque specifications provided",
        "Spring nut retention force data missing for overhead",
        "Material and finish are compliant",
      ],
      complianceAssessment: "Channel nuts are partially compliant. Overhead application retention force data is required for spring nut variants.",
      recommendation: "Review required. Request spring nut retention force data for overhead applications.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line channel nuts",
        "Spring and non-spring variants",
        "Retention force data for overhead use",
        "Torque specifications",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-13",
    documentId: "doc-40",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 90,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-20",
        sourceDocumentId: "doc-40",
        sourceFileName: "Hex Head Cap Screws",
        pageNumber: 1,
        excerpt: "B-Line HHCS hex head cap screws. ASTM A449 Grade 5 steel, zinc-plated. Full threading and load ratings provided.",
        relevance: "supports",
        confidence: 92,
      },
    ],
    aiReasoning: {
      summary: "Hex head cap screws meet all specification requirements.",
      keyFindings: [
        "B-Line HHCS model confirmed",
        "ASTM A449 Grade 5 material compliance",
        "Zinc-plated finish is correct",
        "Load ratings provided and adequate",
      ],
      complianceAssessment: "Full compliance with cap screw requirements in section 05 29 00.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line HHCS cap screws",
        "ASTM A449 Grade 5 material",
        "Zinc-plated finish",
        "Load rating documentation",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-14",
    documentId: "doc-41",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 68,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-21",
        sourceDocumentId: "doc-41",
        sourceFileName: "Misc. Channel Fittings",
        pageNumber: 1,
        excerpt: "B-Line miscellaneous channel fittings including angles, flat plates, and post bases. Some fittings listed without individual load ratings.",
        relevance: "neutral",
        confidence: 70,
      },
      {
        id: "ev-22",
        sourceDocumentId: "doc-41",
        sourceFileName: "Misc. Channel Fittings",
        pageNumber: 3,
        excerpt: "Custom fitting fabrication details not included. Specification requires shop drawing submittal for non-standard fittings.",
        relevance: "contradicts",
        confidence: 75,
      },
    ],
    aiReasoning: {
      summary: "Miscellaneous channel fittings are partially compliant but missing individual load ratings and custom fitting details.",
      keyFindings: [
        "B-Line standard fittings catalog provided",
        "Individual load ratings missing for some items",
        "Custom fitting shop drawings not included",
        "Material certifications are adequate",
      ],
      complianceAssessment: "The standard channel fittings meet basic requirements. However, individual load ratings for all fittings and shop drawings for non-standard fittings must be provided.",
      recommendation: "Review required. Provide individual load ratings and custom fitting shop drawings.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line channel fittings catalog",
        "Individual load ratings for all items",
        "Shop drawings for custom fittings",
        "Material certifications",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-15",
    documentId: "doc-42",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 88,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-23",
        sourceDocumentId: "doc-42",
        sourceFileName: "Channel Bracket Single / Double",
        pageNumber: 1,
        excerpt: "B-Line channel brackets in single and double configurations. 12 gauge steel construction, zinc-plated. Load ratings per manufacturer testing.",
        relevance: "supports",
        confidence: 90,
      },
    ],
    aiReasoning: {
      summary: "Channel brackets meet specification requirements for both single and double configurations.",
      keyFindings: [
        "B-Line channel bracket models confirmed",
        "12 gauge steel construction verified",
        "Both single and double configs available",
        "Load ratings per manufacturer testing provided",
      ],
      complianceAssessment: "Full compliance with channel bracket requirements in section 05 29 00.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line channel brackets",
        "Single and double configurations",
        "12 gauge steel minimum",
        "Manufacturer load test data",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
  {
    id: "val-16",
    documentId: "doc-43",
    versionId: "ver-5",
    status: "action_mandatory",
    confidenceScore: 45,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-24",
        sourceDocumentId: "doc-43",
        sourceFileName: "Channel Pipe Clamp",
        pageNumber: 1,
        excerpt: "B-Line B2000 channel pipe clamp. Submitted data shows carbon steel without finish specification for exterior installations.",
        relevance: "contradicts",
        confidence: 90,
      },
      {
        id: "ev-25",
        sourceDocumentId: "doc-43",
        sourceFileName: "Channel Pipe Clamp",
        pageNumber: 2,
        excerpt: "Clamp sizing for pipes 1/2\" through 4\" only. Project requires up to 6\" pipe support capability.",
        relevance: "contradicts",
        confidence: 85,
      },
    ],
    aiReasoning: {
      summary: "Channel pipe clamp has two deficiencies: missing exterior finish specification and insufficient size range.",
      keyFindings: [
        "B-Line B2000 model is correct",
        "Exterior finish specification missing",
        "Size range only to 4\" — project needs 6\"",
        "Interior application data is adequate",
      ],
      complianceAssessment: "The channel pipe clamp fails to meet specification requirements for exterior finish and maximum pipe size. Both issues must be resolved.",
      recommendation: "Action mandatory. Provide exterior finish data and confirm 6\" pipe clamp availability.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware",
      requirements: [
        "B-Line B2000 pipe clamps",
        "HDG or SS finish for exterior",
        "Size range to cover all project pipe sizes",
        "Load ratings per manufacturer data",
      ],
      sourceDocument: "UCD Hobbs Vet Spec Rev B",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  PA (Project Assets) Validations                                           */
/* -------------------------------------------------------------------------- */

export const paValidations: ValidationResult[] = [
  {
    id: "pa-val-1",
    documentId: "doc-28",
    versionId: "ver-5",
    category: "project_assets",
    status: "pre_approved",
    confidenceScore: 92,
    decision: "pending",
    evidenceItems: [
      {
        id: "pa-ev-1",
        sourceDocumentId: "doc-28",
        sourceFileName: "Finishes",
        pageNumber: 2,
        excerpt: "Product data sheet revision date matches current project specification version. Document control reference PA-FIN-001.",
        relevance: "supports",
        confidence: 94,
      },
    ],
    aiReasoning: {
      summary: "Project asset documentation for finishes is complete and properly referenced.",
      keyFindings: [
        "Document control number PA-FIN-001 properly assigned",
        "Revision date aligns with current spec version",
        "All required data sheets included in asset package",
        "Cross-references to related submittals are valid",
      ],
      complianceAssessment: "Project asset requirements are fully met. Document is properly cataloged and cross-referenced within the project asset management system.",
      recommendation: "Approve for project asset inclusion.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Project Asset Review",
      requirements: [
        "Document control number assigned",
        "Revision tracking up to date",
        "Cross-references validated",
        "Filed in project asset system",
      ],
      sourceDocument: "UCD Hobbs Vet PA Standards",
    },
  },
  {
    id: "pa-val-2",
    documentId: "doc-29",
    versionId: "ver-5",
    category: "project_assets",
    status: "review_required",
    confidenceScore: 68,
    decision: "pending",
    evidenceItems: [
      {
        id: "pa-ev-2",
        sourceDocumentId: "doc-29",
        sourceFileName: "Clevis Hanger (Type 1)",
        pageNumber: 1,
        excerpt: "Data sheet revision log shows gap between Rev B and Rev D. Rev C not accounted for in project asset records.",
        relevance: "contradicts",
        confidence: 82,
      },
    ],
    aiReasoning: {
      summary: "Clevis hanger documentation has a revision gap in the project asset tracking system.",
      keyFindings: [
        "Revision C is missing from asset records",
        "Document numbering sequence appears incomplete",
        "Manufacturer revision dates need verification against asset log",
        "Transmittal records show partial coverage",
      ],
      complianceAssessment: "The project asset tracking for this data sheet is incomplete. The missing revision creates a documentation gap that should be resolved.",
      recommendation: "Review required. Locate Rev C or document the revision skip with justification.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Project Asset Review",
      requirements: [
        "Complete revision history required",
        "All revisions cataloged in asset system",
        "Manufacturer data verification",
        "Transmittal documentation complete",
      ],
      sourceDocument: "UCD Hobbs Vet PA Standards",
    },
  },
  {
    id: "pa-val-3",
    documentId: "doc-30",
    versionId: "ver-5",
    category: "project_assets",
    status: "action_mandatory",
    confidenceScore: 41,
    decision: "pending",
    evidenceItems: [
      {
        id: "pa-ev-3",
        sourceDocumentId: "doc-30",
        sourceFileName: "Riser Clamps (Type 8)",
        excerpt: "Riser clamp data sheet file format is .xlsx but project asset system requires .pdf conversion for archival. No PDF version found.",
        relevance: "contradicts",
        confidence: 90,
      },
    ],
    aiReasoning: {
      summary: "Riser clamp documentation is missing the required PDF archival version in the project asset system.",
      keyFindings: [
        "Only Excel format exists in asset system",
        "PDF archival copy not generated",
        "File naming convention not followed",
        "Asset metadata fields incomplete",
      ],
      complianceAssessment: "The project asset requirements are not met. The document must be converted to PDF for archival and properly cataloged.",
      recommendation: "Action mandatory. Generate PDF archival copy and complete asset metadata fields.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Project Asset Review",
      requirements: [
        "PDF archival copy required for all documents",
        "File naming convention per PA-NOM-001",
        "Complete metadata fields",
        "Cross-reference to specification section",
      ],
      sourceDocument: "UCD Hobbs Vet PA Standards",
    },
  },
  {
    id: "pa-val-4",
    documentId: "doc-31",
    versionId: "ver-5",
    category: "project_assets",
    status: "pre_approved",
    confidenceScore: 95,
    decision: "pending",
    evidenceItems: [
      {
        id: "pa-ev-4",
        sourceDocumentId: "doc-31",
        sourceFileName: "Standard Pipe Strap (Type 26)",
        pageNumber: 1,
        excerpt: "Document properly stamped, dated, and filed with project asset reference PA-HSH-003.",
        relevance: "supports",
        confidence: 97,
      },
    ],
    aiReasoning: {
      summary: "Standard pipe strap documentation is properly managed within the project asset system.",
      keyFindings: [
        "Document control reference PA-HSH-003 assigned",
        "All required stamps and dates present",
        "Manufacturer documentation linked",
        "Version history complete",
      ],
      complianceAssessment: "Full compliance with project asset management requirements.",
      recommendation: "Approve for project asset inclusion.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Project Asset Review",
      requirements: [
        "Document control reference assigned",
        "Stamps and dates verified",
        "Manufacturer documentation linked",
        "Version history maintained",
      ],
      sourceDocument: "UCD Hobbs Vet PA Standards",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  PI (Performance Index) Validations                                        */
/* -------------------------------------------------------------------------- */

export const piValidations: ValidationResult[] = [
  {
    id: "pi-val-1",
    documentId: "doc-28",
    versionId: "ver-5",
    category: "performance_index",
    status: "pre_approved",
    confidenceScore: 98,
    decision: "pending",
    evidenceItems: [
      {
        id: "pi-ev-1",
        sourceDocumentId: "doc-28",
        sourceFileName: "Finishes",
        pageNumber: 3,
        excerpt: "Performance index score 98/100. Corrosion resistance rating exceeds baseline. Electro-galv thickness 0.3 mil exceeds 0.2 mil minimum.",
        relevance: "supports",
        confidence: 98,
      },
    ],
    aiReasoning: {
      summary: "Finish specifications exceed all performance index baselines with excellent margins.",
      keyFindings: [
        "Corrosion resistance: exceeds baseline by 25%",
        "Coating thickness: 0.3 mil vs 0.2 mil baseline (+50%)",
        "Salt spray test: passes 96-hour requirement",
        "Durability index: A rating",
      ],
      complianceAssessment: "All performance metrics exceed baseline requirements. This finish specification scores in the top tier of the performance index.",
      recommendation: "Approve. Exceeds performance index baselines.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Performance Index",
      requirements: [
        "Corrosion resistance per ASTM B117",
        "Minimum coating thickness: 0.2 mil",
        "Salt spray test: 96 hours minimum",
        "Durability: minimum B rating",
      ],
      sourceDocument: "UCD Hobbs Vet PI Baselines",
    },
  },
  {
    id: "pi-val-2",
    documentId: "doc-29",
    versionId: "ver-5",
    category: "performance_index",
    status: "review_required",
    confidenceScore: 72,
    decision: "pending",
    evidenceItems: [
      {
        id: "pi-ev-2",
        sourceDocumentId: "doc-29",
        sourceFileName: "Clevis Hanger (Type 1)",
        pageNumber: 2,
        excerpt: "Load performance index shows safety factor 3.5 vs baseline 4.0. Marginally below performance target for seismic zones.",
        relevance: "contradicts",
        confidence: 78,
      },
    ],
    aiReasoning: {
      summary: "Clevis hanger meets code minimums but safety factor is marginally below the project's enhanced performance index target.",
      keyFindings: [
        "Safety factor 3.5 vs target 4.0",
        "Static load capacity: adequate",
        "Dynamic load performance: meets baseline",
        "Seismic performance: marginally below enhanced target",
      ],
      complianceAssessment: "The load safety factor is marginally below the enhanced project performance index. While code-compliant, it does not meet the project's elevated performance targets.",
      recommendation: "Review required. Evaluate if safety factor variance is acceptable for project seismic zone.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Performance Index",
      requirements: [
        "Safety factor: minimum 4.0 for seismic zones",
        "Static load capacity per MSS SP-69",
        "Dynamic load performance testing",
        "Seismic performance per IBC requirements",
      ],
      sourceDocument: "UCD Hobbs Vet PI Baselines",
    },
  },
  {
    id: "pi-val-3",
    documentId: "doc-30",
    versionId: "ver-5",
    category: "performance_index",
    status: "action_mandatory",
    confidenceScore: 48,
    decision: "pending",
    evidenceItems: [
      {
        id: "pi-ev-3",
        sourceDocumentId: "doc-30",
        sourceFileName: "Riser Clamps (Type 8)",
        excerpt: "Riser clamp vertical load capacity: 800 lbs vs baseline requirement of 1,200 lbs. Performance index fails minimum threshold.",
        relevance: "contradicts",
        confidence: 92,
      },
    ],
    aiReasoning: {
      summary: "Riser clamp vertical load capacity is significantly below the performance index baseline.",
      keyFindings: [
        "Vertical load capacity 800 lbs vs 1,200 lbs baseline (-33%)",
        "Lateral load performance is adequate",
        "Clamp engagement depth meets minimum",
        "Overall system performance does not meet enhanced requirements",
      ],
      complianceAssessment: "The riser clamps fail the performance index load capacity baseline. The shortfall is significant and impacts system reliability.",
      recommendation: "Action mandatory. Specify higher-capacity riser clamps or provide engineering justification.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Performance Index",
      requirements: [
        "Vertical load capacity: minimum 1,200 lbs",
        "Lateral load per engineering requirements",
        "Clamp engagement depth per manufacturer specs",
        "System performance per enhanced baseline",
      ],
      sourceDocument: "UCD Hobbs Vet PI Baselines",
    },
  },
  {
    id: "pi-val-4",
    documentId: "doc-31",
    versionId: "ver-5",
    category: "performance_index",
    status: "pre_approved",
    confidenceScore: 90,
    decision: "pending",
    evidenceItems: [
      {
        id: "pi-ev-4",
        sourceDocumentId: "doc-31",
        sourceFileName: "Standard Pipe Strap (Type 26)",
        pageNumber: 1,
        excerpt: "Pipe strap load capacity 500 lbs exceeds PI baseline of 400 lbs. Corrosion resistance meets baseline requirements.",
        relevance: "supports",
        confidence: 93,
      },
    ],
    aiReasoning: {
      summary: "Standard pipe strap meets all performance index baselines with good margins.",
      keyFindings: [
        "Load capacity: 25% above baseline",
        "Corrosion resistance: within baseline limits",
        "Installation torque: meets performance criteria",
        "Material durability: meets performance target",
      ],
      complianceAssessment: "All pipe strap performance index metrics are met or exceeded.",
      recommendation: "Approve. Performance index baselines are satisfied.",
    },
    specReference: {
      sectionNumber: "05 29 00",
      sectionTitle: "Hangers, Supports & Hardware — Performance Index",
      requirements: [
        "Load capacity: minimum 400 lbs",
        "Corrosion resistance per baseline",
        "Installation torque specifications",
        "Material durability testing",
      ],
      sourceDocument: "UCD Hobbs Vet PI Baselines",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Helper functions                                                          */
/* -------------------------------------------------------------------------- */

export function getValidationsByVersion(versionId: string): ValidationResult[] {
  return mockValidations.filter((v) => v.versionId === versionId);
}

export function getValidationByDocument(documentId: string): ValidationResult | undefined {
  return mockValidations.find((v) => v.documentId === documentId);
}

export function getValidationByDocumentAndCategory(
  documentId: string,
  category: ValidationCategory
): ValidationResult | undefined {
  if (category === "overall") {
    return mockValidations.find((v) => v.documentId === documentId);
  }
  if (category === "project_assets") {
    return paValidations.find((v) => v.documentId === documentId);
  }
  if (category === "performance_index") {
    return piValidations.find((v) => v.documentId === documentId);
  }
  return undefined;
}

export function getPAValidationByDocument(documentId: string): ValidationResult | undefined {
  return paValidations.find((v) => v.documentId === documentId);
}

export function getPIValidationByDocument(documentId: string): ValidationResult | undefined {
  return piValidations.find((v) => v.documentId === documentId);
}
