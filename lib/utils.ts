import type { MediaItem } from "./types";

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type ImageSize = "w92" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function imageUrl(path: string | null | undefined, size: ImageSize = "w500"): string | null {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export function mediaHref(item: Pick<MediaItem, "id" | "mediaType">): string {
  return `/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`;
}

export function formatYear(date: string | null | undefined): string {
  return date ? date.slice(0, 4) : "";
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "TBA";
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "TBA";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : "NR";
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** TMDB only serves up to page 500. */
export function parsePage(value: string | undefined): number {
  const n = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 500);
}

export function languageName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
