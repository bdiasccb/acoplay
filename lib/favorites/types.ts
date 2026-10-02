import type { MediaType } from "@/lib/tmdb/types";

export interface FavoriteItem {
  id: number;
  tipo: MediaType;
  titulo: string;
  posterPath: string | null;
  ano: number | null;
  adicionadoEm: string;
}

export type NewFavorite = Omit<FavoriteItem, "adicionadoEm">;

export interface FavoritesStore {
  list(): FavoriteItem[];
  has(id: number, tipo: MediaType): boolean;
  add(item: NewFavorite): void;
  remove(id: number, tipo: MediaType): void;
  subscribe(listener: () => void): () => void;
  isPersistent(): boolean;
}
