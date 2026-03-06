export function exportMaterialsCsv(
  materials: Array<{
    projectName: string;
    specSection: string;
    catalogTitle: string;
    description: string;
    sizes: string;
    subcategory: string;
    trade: string;
    aiStatus: string;
    decision: string;
    system: string;
    confidenceScore: number;
  }>
): void {
  const headers = [
    "Project Name",
    "Spec Section",
    "Catalog Title",
    "Description",
    "Sizes",
    "Subcategory",
    "Trade",
    "AI Status",
    "Decision",
    "System",
    "Confidence",
  ];

  const escapeField = (field: string) => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const rows = materials.map((m) =>
    [
      m.projectName,
      m.specSection,
      m.catalogTitle,
      m.description,
      m.sizes,
      m.subcategory,
      m.trade,
      m.aiStatus,
      m.decision,
      m.system,
      String(m.confidenceScore),
    ]
      .map(escapeField)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `accoes-materials-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
