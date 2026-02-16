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
        sourceFileName: "Fire-Rated Gypsum Board - Product Data.pdf",
        pageNumber: 3,
        excerpt: "Type X gypsum board, 5/8\" thick, meeting ASTM C1396 with 1-hour fire rating as tested per ASTM E119.",
        relevance: "supports",
        confidence: 97,
      },
      {
        id: "ev-2",
        sourceDocumentId: "doc-28",
        sourceFileName: "Fire-Rated Gypsum Board - Product Data.pdf",
        pageNumber: 5,
        excerpt: "Surface burning characteristics: Flame spread index 15, Smoke developed index 0, per ASTM E84.",
        relevance: "supports",
        confidence: 95,
      },
    ],
    aiReasoning: {
      summary: "The submitted gypsum board product data fully complies with specification section 09 29 00.",
      keyFindings: [
        "Product meets Type X classification per ASTM C1396",
        "Fire rating of 1 hour matches or exceeds specification requirement",
        "Surface burning characteristics within acceptable range",
        "Manufacturer is listed in approved manufacturers list",
      ],
      complianceAssessment: "All critical requirements are met. The product data sheet provides complete documentation of fire rating, dimensions, and performance characteristics as required by the specification.",
      recommendation: "Approve. No further action required.",
    },
    specReference: {
      sectionNumber: "09 29 00",
      sectionTitle: "Gypsum Board",
      requirements: [
        "Type X gypsum board, 5/8\" minimum thickness",
        "ASTM C1396 compliance required",
        "Minimum 1-hour fire rating per ASTM E119",
        "Surface burning characteristics per ASTM E84",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-2",
    documentId: "doc-29",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 74,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-3",
        sourceDocumentId: "doc-29",
        sourceFileName: "Structural Steel Shop Drawings - Set A.pdf",
        pageNumber: 12,
        excerpt: "W14x30 columns at grid lines A-D, Level 1 through Level 5. ASTM A992 Grade 50 steel.",
        relevance: "supports",
        confidence: 88,
      },
      {
        id: "ev-4",
        sourceDocumentId: "doc-29",
        sourceFileName: "Structural Steel Shop Drawings - Set A.pdf",
        pageNumber: 18,
        excerpt: "Connection detail C-4: Bolted moment connection with 3/4\" A325 bolts. Slip-critical connection.",
        relevance: "neutral",
        confidence: 65,
      },
      {
        id: "ev-5",
        sourceDocumentId: "doc-29",
        sourceFileName: "Structural Steel Shop Drawings - Set A.pdf",
        pageNumber: 24,
        excerpt: "Fireproofing details not included in this submission package.",
        relevance: "contradicts",
        confidence: 42,
      },
    ],
    aiReasoning: {
      summary: "Shop drawings are substantially compliant but missing fireproofing details required by specification.",
      keyFindings: [
        "Steel grades and member sizes match structural design documents",
        "Connection details appear adequate but require engineer review",
        "Fireproofing details are missing from the submission",
        "Fabrication tolerances referenced but not fully detailed",
      ],
      complianceAssessment: "The structural steel shop drawings demonstrate compliance with most requirements. However, the absence of fireproofing details is a notable gap that must be addressed before approval.",
      recommendation: "Review required. Request supplemental fireproofing details and engineer-stamped connection calculations.",
    },
    specReference: {
      sectionNumber: "05 12 00",
      sectionTitle: "Structural Steel Framing",
      requirements: [
        "ASTM A992 Grade 50 for wide-flange shapes",
        "Shop drawings to include connection details",
        "Fireproofing requirements per section 07 81 00",
        "AWS D1.1 welding standards",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-3",
    documentId: "doc-30",
    versionId: "ver-5",
    status: "action_mandatory",
    confidenceScore: 45,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-6",
        sourceDocumentId: "doc-30",
        sourceFileName: "HVAC Equipment Schedule.xlsx",
        excerpt: "AHU-1: Capacity 15,000 CFM, Total SP 4.5\" WG, Motor 25 HP.",
        relevance: "supports",
        confidence: 72,
      },
      {
        id: "ev-7",
        sourceDocumentId: "doc-30",
        sourceFileName: "HVAC Equipment Schedule.xlsx",
        excerpt: "Chiller CH-1: Listed capacity 200 tons. Specification requires minimum 250 tons.",
        relevance: "contradicts",
        confidence: 95,
      },
      {
        id: "ev-8",
        sourceDocumentId: "doc-30",
        sourceFileName: "HVAC Equipment Schedule.xlsx",
        excerpt: "Cooling tower model CT-100 not found in approved equipment list.",
        relevance: "contradicts",
        confidence: 88,
      },
    ],
    aiReasoning: {
      summary: "HVAC equipment schedule has critical discrepancies that require immediate resolution.",
      keyFindings: [
        "Air handling unit specifications are compliant",
        "Chiller capacity is 50 tons below specification minimum",
        "Cooling tower model is not on the approved equipment list",
        "Energy efficiency ratings not provided for all equipment",
      ],
      complianceAssessment: "The HVAC equipment schedule fails to meet specification requirements in two critical areas: undersized chiller capacity and unapproved cooling tower model. These must be corrected before the submittal can proceed.",
      recommendation: "Action mandatory. Resubmit with correctly sized chiller (minimum 250 tons) and approved cooling tower model.",
    },
    specReference: {
      sectionNumber: "23 05 00",
      sectionTitle: "Common Work Results for HVAC",
      requirements: [
        "Chiller minimum capacity: 250 tons",
        "Equipment must be from approved manufacturers list",
        "Energy efficiency ratings per ASHRAE 90.1",
        "Complete equipment schedules with all performance data",
      ],
      sourceDocument: "Harbor District Spec Rev B",
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
        id: "ev-9",
        sourceDocumentId: "doc-31",
        sourceFileName: "Concrete Mix Design Report.pdf",
        pageNumber: 2,
        excerpt: "28-day compressive strength: 5,500 psi. Specification requires minimum 5,000 psi.",
        relevance: "supports",
        confidence: 96,
      },
      {
        id: "ev-10",
        sourceDocumentId: "doc-31",
        sourceFileName: "Concrete Mix Design Report.pdf",
        pageNumber: 4,
        excerpt: "Water/cement ratio: 0.42. Maximum allowable: 0.45 per specification.",
        relevance: "supports",
        confidence: 94,
      },
    ],
    aiReasoning: {
      summary: "Concrete mix design meets all specification requirements with adequate margins.",
      keyFindings: [
        "Compressive strength exceeds minimum by 500 psi",
        "Water/cement ratio is within limits",
        "Admixtures listed are approved types",
        "Test reports from accredited laboratory included",
      ],
      complianceAssessment: "The concrete mix design fully complies with specification section 03 30 00. All tested parameters meet or exceed requirements.",
      recommendation: "Approve. Mix design is compliant.",
    },
    specReference: {
      sectionNumber: "03 30 00",
      sectionTitle: "Cast-in-Place Concrete",
      requirements: [
        "Minimum 28-day compressive strength: 5,000 psi",
        "Maximum water/cement ratio: 0.45",
        "ACI 318 compliance",
        "Test reports from accredited laboratory",
      ],
      sourceDocument: "Harbor District Spec Rev B",
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
        id: "ev-11",
        sourceDocumentId: "doc-32",
        sourceFileName: "Waterproofing Membrane - Manufacturer Letter.docx",
        excerpt: "Product warranty covers membrane performance for 15 years. Specification requires 20-year warranty.",
        relevance: "contradicts",
        confidence: 90,
      },
      {
        id: "ev-12",
        sourceDocumentId: "doc-32",
        sourceFileName: "Waterproofing Membrane - Manufacturer Letter.docx",
        excerpt: "Membrane meets ASTM D6878 Type II requirements for below-grade waterproofing.",
        relevance: "supports",
        confidence: 85,
      },
    ],
    aiReasoning: {
      summary: "Waterproofing membrane meets technical requirements but warranty duration falls short.",
      keyFindings: [
        "Product meets ASTM D6878 Type II classification",
        "Warranty period is 5 years less than specified",
        "Application details reference appropriate substrate preparation",
        "No extended warranty option mentioned in submittal",
      ],
      complianceAssessment: "The waterproofing membrane product itself appears compliant with technical specifications. However, the warranty duration of 15 years does not meet the 20-year minimum required by the specification.",
      recommendation: "Review required. Request manufacturer confirmation of extended warranty availability or submit alternative product.",
    },
    specReference: {
      sectionNumber: "07 10 00",
      sectionTitle: "Dampproofing and Waterproofing",
      requirements: [
        "ASTM D6878 Type II compliance",
        "Minimum 20-year manufacturer warranty",
        "Below-grade application capability",
        "Compatible with concrete substrates",
      ],
      sourceDocument: "Harbor District Spec Rev B",
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
        id: "ev-13",
        sourceDocumentId: "doc-33",
        sourceFileName: "Curtain Wall System - Shop Drawings.pdf",
        pageNumber: 8,
        excerpt: "Thermal performance: U-value 0.35. Specification requires maximum U-value 0.28.",
        relevance: "contradicts",
        confidence: 94,
      },
      {
        id: "ev-14",
        sourceDocumentId: "doc-33",
        sourceFileName: "Curtain Wall System - Shop Drawings.pdf",
        pageNumber: 15,
        excerpt: "Structural silicone sealant joints at 1\" width. Wind load calculations not included.",
        relevance: "contradicts",
        confidence: 78,
      },
    ],
    aiReasoning: {
      summary: "Curtain wall system fails thermal performance requirements and is missing critical wind load calculations.",
      keyFindings: [
        "U-value exceeds maximum allowed by 0.07",
        "Wind load calculations are absent",
        "Glass specifications meet impact resistance requirements",
        "Framing system appears structurally adequate based on manufacturer data",
      ],
      complianceAssessment: "The curtain wall system has two critical deficiencies: thermal performance does not meet energy code requirements, and structural wind load calculations are missing. Both must be resolved.",
      recommendation: "Action mandatory. Upgrade glazing to meet thermal requirements and provide complete wind load analysis.",
    },
    specReference: {
      sectionNumber: "08 44 00",
      sectionTitle: "Curtain Wall and Glazed Assemblies",
      requirements: [
        "Maximum U-value: 0.28",
        "Wind load calculations per ASCE 7",
        "Impact resistance per ASTM E1996",
        "Structural silicone per ASTM C1184",
      ],
      sourceDocument: "Harbor District Spec Rev B",
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
        id: "ev-15",
        sourceDocumentId: "doc-34",
        sourceFileName: "Elevator Specifications.pdf",
        pageNumber: 6,
        excerpt: "Capacity: 4,000 lbs, Speed: 500 FPM, meets ADA accessibility requirements.",
        relevance: "supports",
        confidence: 93,
      },
    ],
    aiReasoning: {
      summary: "Elevator specifications are fully compliant with project requirements.",
      keyFindings: [
        "Capacity and speed meet specification minimums",
        "ADA compliance confirmed",
        "Manufacturer is on approved list",
        "Cab finishes match architectural intent",
      ],
      complianceAssessment: "All elevator specifications meet or exceed the project requirements outlined in section 14 20 00.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "14 20 00",
      sectionTitle: "Elevators",
      requirements: [
        "Minimum capacity: 3,500 lbs",
        "Minimum speed: 350 FPM",
        "ADA compliance required",
        "Approved manufacturers only",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-8",
    documentId: "doc-35",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 76,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-16",
        sourceDocumentId: "doc-35",
        sourceFileName: "Electrical Panel Schedule.xlsx",
        excerpt: "Main distribution panel: 2000A, 480/277V, 3-phase. Panel schedule shows 87% load factor.",
        relevance: "neutral",
        confidence: 70,
      },
    ],
    aiReasoning: {
      summary: "Electrical panel schedule is mostly compliant but load factor is near maximum threshold.",
      keyFindings: [
        "Main panel amperage and voltage match specifications",
        "Load factor at 87% is close to the 80% recommended maximum",
        "Spare circuit provision appears adequate",
        "Coordination study reference is missing",
      ],
      complianceAssessment: "The panel schedule meets basic requirements but the high load factor and missing coordination study reference warrant review.",
      recommendation: "Review required. Verify load calculations and provide coordination study reference.",
    },
    specReference: {
      sectionNumber: "26 24 00",
      sectionTitle: "Switchboards and Panelboards",
      requirements: [
        "Load factor not to exceed 80% without justification",
        "Coordination study required",
        "Minimum 20% spare circuit capacity",
        "UL listed equipment required",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-9",
    documentId: "doc-36",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 94,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-17",
        sourceDocumentId: "doc-36",
        sourceFileName: "Plumbing Fixture Submittal.pdf",
        pageNumber: 4,
        excerpt: "WaterSense certified fixtures with flow rate of 1.28 GPF for water closets and 0.5 GPM for lavatory faucets.",
        relevance: "supports",
        confidence: 96,
      },
    ],
    aiReasoning: {
      summary: "Plumbing fixtures meet all water efficiency and code requirements.",
      keyFindings: [
        "WaterSense certification confirmed",
        "Flow rates comply with specification",
        "ADA-compliant fixtures included",
        "Manufacturer on approved list",
      ],
      complianceAssessment: "Full compliance with section 22 40 00 requirements.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "22 40 00",
      sectionTitle: "Plumbing Fixtures",
      requirements: [
        "WaterSense certification required",
        "Maximum 1.28 GPF for water closets",
        "Maximum 0.5 GPM for lavatory faucets",
        "ADA compliance where indicated",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-10",
    documentId: "doc-37",
    versionId: "ver-5",
    status: "pre_approved",
    confidenceScore: 89,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-18",
        sourceDocumentId: "doc-37",
        sourceFileName: "Fire Alarm System - Product Data.pdf",
        pageNumber: 7,
        excerpt: "Addressable fire alarm system with smoke detectors, pull stations, and notification appliances per NFPA 72.",
        relevance: "supports",
        confidence: 91,
      },
    ],
    aiReasoning: {
      summary: "Fire alarm system meets NFPA 72 and local code requirements.",
      keyFindings: [
        "Addressable system as specified",
        "NFPA 72 compliance documented",
        "Device coverage appears adequate",
        "Battery backup specifications included",
      ],
      complianceAssessment: "Compliant with specification section 28 31 00. All critical life safety requirements are met.",
      recommendation: "Approve.",
    },
    specReference: {
      sectionNumber: "28 31 00",
      sectionTitle: "Fire Detection and Alarm",
      requirements: [
        "Addressable fire alarm system",
        "NFPA 72 compliance",
        "24-hour battery backup minimum",
        "UL listed components",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-11",
    documentId: "doc-38",
    versionId: "ver-5",
    status: "review_required",
    confidenceScore: 79,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-19",
        sourceDocumentId: "doc-38",
        sourceFileName: "Acoustic Ceiling Tiles - Sample Submission.docx",
        excerpt: "NRC rating 0.70. Specification requires minimum NRC 0.75 for open office areas.",
        relevance: "contradicts",
        confidence: 85,
      },
      {
        id: "ev-20",
        sourceDocumentId: "doc-38",
        sourceFileName: "Acoustic Ceiling Tiles - Sample Submission.docx",
        excerpt: "CAC rating 35. Meets specification minimum of 33.",
        relevance: "supports",
        confidence: 90,
      },
    ],
    aiReasoning: {
      summary: "Acoustic ceiling tiles meet most requirements but NRC rating is slightly below specification.",
      keyFindings: [
        "NRC rating 0.70 vs required 0.75",
        "CAC rating meets specification",
        "Fire rating compliant",
        "Manufacturer offers similar product with higher NRC",
      ],
      complianceAssessment: "The submitted acoustic ceiling tiles are marginally non-compliant on the NRC rating. The difference is small (0.05) and may be acceptable depending on acoustic analysis.",
      recommendation: "Review required. Consider accepting with acoustic analysis justification or request higher-NRC alternative.",
    },
    specReference: {
      sectionNumber: "09 51 00",
      sectionTitle: "Acoustical Ceilings",
      requirements: [
        "Minimum NRC: 0.75 for open office areas",
        "Minimum CAC: 33",
        "Class A fire rating",
        "Humidity resistance for applicable areas",
      ],
      sourceDocument: "Harbor District Spec Rev B",
    },
  },
  {
    id: "val-12",
    documentId: "doc-39",
    versionId: "ver-5",
    status: "action_mandatory",
    confidenceScore: 38,
    decision: "pending",
    evidenceItems: [
      {
        id: "ev-21",
        sourceDocumentId: "doc-39",
        sourceFileName: "Roofing Assembly - Warranty Documentation.pdf",
        pageNumber: 3,
        excerpt: "Warranty covers material defects only. Does not include workmanship coverage.",
        relevance: "contradicts",
        confidence: 92,
      },
      {
        id: "ev-22",
        sourceDocumentId: "doc-39",
        sourceFileName: "Roofing Assembly - Warranty Documentation.pdf",
        pageNumber: 1,
        excerpt: "Warranty duration: 10 years. Specification requires 20-year NDL warranty.",
        relevance: "contradicts",
        confidence: 96,
      },
    ],
    aiReasoning: {
      summary: "Roofing warranty documentation is critically deficient in both scope and duration.",
      keyFindings: [
        "Warranty period is half the required duration",
        "No workmanship coverage included",
        "NDL (No Dollar Limit) warranty not provided",
        "Warranty excludes consequential damages",
      ],
      complianceAssessment: "The roofing warranty fails specification requirements on multiple fronts: insufficient duration (10 vs 20 years), no workmanship coverage, and no NDL provision.",
      recommendation: "Action mandatory. Obtain 20-year NDL warranty including material and workmanship coverage from the manufacturer.",
    },
    specReference: {
      sectionNumber: "07 50 00",
      sectionTitle: "Membrane Roofing",
      requirements: [
        "20-year NDL warranty required",
        "Must include material and workmanship coverage",
        "Wind speed coverage per local requirements",
        "Manufacturer inspection during installation",
      ],
      sourceDocument: "Harbor District Spec Rev B",
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
        sourceFileName: "Fire-Rated Gypsum Board - Product Data.pdf",
        pageNumber: 2,
        excerpt: "Product data sheet revision date matches current project specification version. Document control reference PA-GYP-001.",
        relevance: "supports",
        confidence: 94,
      },
    ],
    aiReasoning: {
      summary: "Project asset documentation for gypsum board is complete and properly referenced.",
      keyFindings: [
        "Document control number properly assigned",
        "Revision date aligns with current spec version",
        "All required data sheets included in asset package",
        "Cross-references to related submittals are valid",
      ],
      complianceAssessment: "Project asset requirements are fully met. Document is properly cataloged and cross-referenced within the project asset management system.",
      recommendation: "Approve for project asset inclusion.",
    },
    specReference: {
      sectionNumber: "09 29 00",
      sectionTitle: "Gypsum Board — Project Asset Review",
      requirements: [
        "Document control number assigned",
        "Revision tracking up to date",
        "Cross-references validated",
        "Filed in project asset system",
      ],
      sourceDocument: "Harbor District PA Standards",
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
        sourceFileName: "Structural Steel Shop Drawings - Set A.pdf",
        pageNumber: 1,
        excerpt: "Drawing set revision log shows gap between Rev C and Rev E. Rev D not accounted for in project asset records.",
        relevance: "contradicts",
        confidence: 82,
      },
    ],
    aiReasoning: {
      summary: "Structural steel drawing set has a revision gap in the project asset tracking system.",
      keyFindings: [
        "Revision D is missing from asset records",
        "Drawing numbering sequence appears incomplete",
        "Engineer stamp dates need verification against asset log",
        "Transmittal records show partial coverage",
      ],
      complianceAssessment: "The project asset tracking for this drawing set is incomplete. The missing revision creates a documentation gap that should be resolved.",
      recommendation: "Review required. Locate Rev D or document the revision skip with engineer justification.",
    },
    specReference: {
      sectionNumber: "05 12 00",
      sectionTitle: "Structural Steel — Project Asset Review",
      requirements: [
        "Complete revision history required",
        "All revisions cataloged in asset system",
        "Engineer stamp verification",
        "Transmittal documentation complete",
      ],
      sourceDocument: "Harbor District PA Standards",
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
        sourceFileName: "HVAC Equipment Schedule.xlsx",
        excerpt: "Equipment schedule file format is .xlsx but project asset system requires .pdf conversion for archival. No PDF version found.",
        relevance: "contradicts",
        confidence: 90,
      },
    ],
    aiReasoning: {
      summary: "HVAC equipment schedule is missing the required PDF archival version in the project asset system.",
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
      sectionNumber: "23 05 00",
      sectionTitle: "HVAC — Project Asset Review",
      requirements: [
        "PDF archival copy required for all documents",
        "File naming convention per PA-NOM-001",
        "Complete metadata fields",
        "Cross-reference to specification section",
      ],
      sourceDocument: "Harbor District PA Standards",
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
        sourceFileName: "Concrete Mix Design Report.pdf",
        pageNumber: 1,
        excerpt: "Document properly stamped, dated, and filed with project asset reference PA-CON-003.",
        relevance: "supports",
        confidence: 97,
      },
    ],
    aiReasoning: {
      summary: "Concrete mix design report is properly managed within the project asset system.",
      keyFindings: [
        "Document control reference PA-CON-003 assigned",
        "All required stamps and dates present",
        "Laboratory accreditation documentation linked",
        "Version history complete",
      ],
      complianceAssessment: "Full compliance with project asset management requirements.",
      recommendation: "Approve for project asset inclusion.",
    },
    specReference: {
      sectionNumber: "03 30 00",
      sectionTitle: "Concrete — Project Asset Review",
      requirements: [
        "Document control reference assigned",
        "Stamps and dates verified",
        "Lab accreditation linked",
        "Version history maintained",
      ],
      sourceDocument: "Harbor District PA Standards",
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
        sourceFileName: "Fire-Rated Gypsum Board - Product Data.pdf",
        pageNumber: 3,
        excerpt: "Performance index score 98/100. Fire resistance rating 60 min exceeds baseline 45 min. Acoustic STC 52 exceeds baseline 45.",
        relevance: "supports",
        confidence: 98,
      },
    ],
    aiReasoning: {
      summary: "Gypsum board exceeds all performance index baselines with excellent margins.",
      keyFindings: [
        "Fire resistance: 60 min vs 45 min baseline (+33%)",
        "Acoustic STC: 52 vs 45 baseline (+16%)",
        "Thermal R-value meets requirements",
        "Durability index: A rating",
      ],
      complianceAssessment: "All performance metrics exceed baseline requirements. This product scores in the top tier of the performance index.",
      recommendation: "Approve. Exceeds performance index baselines.",
    },
    specReference: {
      sectionNumber: "09 29 00",
      sectionTitle: "Gypsum Board — Performance Index",
      requirements: [
        "Fire resistance: minimum 45 min",
        "Acoustic STC: minimum 45",
        "Thermal resistance per energy code",
        "Durability: minimum B rating",
      ],
      sourceDocument: "Harbor District PI Baselines",
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
        sourceFileName: "Structural Steel Shop Drawings - Set A.pdf",
        pageNumber: 12,
        excerpt: "Structural performance index shows deflection ratio L/320 vs baseline L/360. Marginally below performance target.",
        relevance: "contradicts",
        confidence: 78,
      },
    ],
    aiReasoning: {
      summary: "Structural steel meets code minimums but deflection ratio is marginally below the project's enhanced performance index target.",
      keyFindings: [
        "Deflection ratio L/320 vs target L/360",
        "Strength capacity: adequate with 15% reserve",
        "Connection performance: meets baseline",
        "Seismic performance: meets or exceeds",
      ],
      complianceAssessment: "The deflection performance is marginally below the enhanced project performance index. While code-compliant, it does not meet the project's elevated performance targets.",
      recommendation: "Review required. Evaluate if deflection can be improved or if variance is acceptable.",
    },
    specReference: {
      sectionNumber: "05 12 00",
      sectionTitle: "Structural Steel — Performance Index",
      requirements: [
        "Deflection ratio: maximum L/360",
        "Strength reserve: minimum 10%",
        "Connection performance per AISC criteria",
        "Seismic performance per IBC requirements",
      ],
      sourceDocument: "Harbor District PI Baselines",
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
        sourceFileName: "HVAC Equipment Schedule.xlsx",
        excerpt: "COP (Coefficient of Performance) for chiller: 5.2 vs baseline requirement of 6.0. Energy performance index fails minimum threshold.",
        relevance: "contradicts",
        confidence: 92,
      },
    ],
    aiReasoning: {
      summary: "HVAC equipment energy performance is significantly below the performance index baseline.",
      keyFindings: [
        "Chiller COP 5.2 vs 6.0 baseline (-13%)",
        "AHU energy efficiency below baseline by 8%",
        "Cooling tower approach temperature within range",
        "Overall system EER does not meet ASHRAE 90.1 enhanced path",
      ],
      complianceAssessment: "The HVAC system fails the performance index energy efficiency baselines. The chiller COP shortfall alone represents significant energy cost impact over the building lifecycle.",
      recommendation: "Action mandatory. Specify higher-efficiency equipment or provide lifecycle cost justification.",
    },
    specReference: {
      sectionNumber: "23 05 00",
      sectionTitle: "HVAC — Performance Index",
      requirements: [
        "Chiller COP: minimum 6.0",
        "AHU energy efficiency per ASHRAE baseline",
        "Cooling tower approach: within 3\u00b0F",
        "System EER: ASHRAE 90.1 enhanced path",
      ],
      sourceDocument: "Harbor District PI Baselines",
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
        sourceFileName: "Concrete Mix Design Report.pdf",
        pageNumber: 2,
        excerpt: "28-day strength 5,500 psi exceeds PI baseline of 5,000 psi. Durability index: permeability < 2000 coulombs meets baseline.",
        relevance: "supports",
        confidence: 93,
      },
    ],
    aiReasoning: {
      summary: "Concrete mix design meets all performance index baselines with good margins.",
      keyFindings: [
        "Compressive strength: 10% above baseline",
        "Permeability: within baseline limits",
        "Shrinkage: meets performance criteria",
        "Sustainability: 25% SCM content meets green performance target",
      ],
      complianceAssessment: "All concrete performance index metrics are met or exceeded.",
      recommendation: "Approve. Performance index baselines are satisfied.",
    },
    specReference: {
      sectionNumber: "03 30 00",
      sectionTitle: "Concrete — Performance Index",
      requirements: [
        "28-day strength: minimum 5,000 psi",
        "Permeability: < 2000 coulombs",
        "Shrinkage: < 0.04%",
        "SCM content: minimum 20%",
      ],
      sourceDocument: "Harbor District PI Baselines",
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
