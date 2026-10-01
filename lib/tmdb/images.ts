export type ImageSize = "w92" | "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbImage(path: string | null | undefined, size: ImageSize): string | null {
  return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null;
}
