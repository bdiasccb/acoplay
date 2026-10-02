import type { MediaType } from "@/lib/tmdb/types";
import type { FavoriteItem, FavoritesStore, NewFavorite } from "./types";

export const FAVORITES_KEY = "acoplay:favorites:v1";

export class LocalStorageFavoritesStore implements FavoritesStore {
  private items: FavoriteItem[];
  private persistent: boolean;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly storage: Storage | null,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.persistent = storage !== null && isUsable(storage);
    this.items = this.persistent ? readItems(storage!) : [];
  }

  list(): FavoriteItem[] {
    return this.items;
  }

  has(id: number, tipo: MediaType): boolean {
    return this.items.some((item) => item.id === id && item.tipo === tipo);
  }

  add(item: NewFavorite): void {
    if (this.has(item.id, item.tipo)) return;
    const novo: FavoriteItem = {
      id: item.id,
      tipo: item.tipo,
      titulo: item.titulo,
      posterPath: item.posterPath,
      ano: item.ano,
      adicionadoEm: this.now().toISOString(),
    };
    this.commit([novo, ...this.items]);
  }

  remove(id: number, tipo: MediaType): void {
    if (!this.has(id, tipo)) return;
    this.commit(this.items.filter((item) => !(item.id === id && item.tipo === tipo)));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  isPersistent(): boolean {
    return this.persistent;
  }

  /** Relê o storage — usado quando outra aba altera os favoritos. */
  reload(): void {
    if (!this.persistent) return;
    this.items = readItems(this.storage!);
    this.emit();
  }

  private commit(next: FavoriteItem[]): void {
    this.items = next;
    if (this.persistent) {
      try {
        this.storage!.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Cota cheia ou bloqueio do navegador: segue só em memória.
        this.persistent = false;
      }
    }
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

function isUsable(storage: Storage): boolean {
  try {
    const probe = "__acoplay_probe__";
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function readItems(storage: Storage): FavoriteItem[] {
  try {
    const raw = storage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isFavoriteItem) : [];
  } catch {
    return [];
  }
}

function isFavoriteItem(value: unknown): value is FavoriteItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    (item.tipo === "filme" || item.tipo === "serie") &&
    typeof item.titulo === "string" &&
    (item.posterPath === null || typeof item.posterPath === "string") &&
    (item.ano === null || typeof item.ano === "number") &&
    typeof item.adicionadoEm === "string"
  );
}
