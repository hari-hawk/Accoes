import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), "dd/MM/yyyy");
}

export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), "dd/MM/yyyy 'at' h:mm a");
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "High";
  if (confidence >= 70) return "Medium";
  return "Low";
}
