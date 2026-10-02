import type { MediaType } from "@/lib/tmdb/types";

export function titleHref(tipo: MediaType, id: number): string {
  return tipo === "filme" ? `/filme/${id}` : `/serie/${id}`;
}
