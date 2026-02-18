let counter = 0;

/**
 * Generate a short abbreviation from a client/project name.
 * Takes first letters of each word, up to 4 chars, uppercased.
 * Falls back to "JOB" if no name provided.
 */
function abbreviate(name: string): string {
  if (!name.trim()) return "JOB";
  const letters = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  return letters || "JOB";
}

/**
 * Generate a unique Job ID. Format: ABR-YYYY-NNN
 * Example: "ACX-2026-001"
 */
export function generateJobId(clientOrProjectName?: string): string {
  counter += 1;
  const abbr = abbreviate(clientOrProjectName ?? "");
  const year = new Date().getFullYear();
  const seq = String(counter).padStart(3, "0");
  return `${abbr}-${year}-${seq}`;
}

/** Reset counter (useful for tests) */
export function resetJobIdCounter(): void {
  counter = 0;
}
