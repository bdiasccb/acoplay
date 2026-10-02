"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { MediaType } from "@/lib/tmdb/types";
import { FAVORITES_KEY, LocalStorageFavoritesStore } from "./local-storage-store";
import type { FavoriteItem, NewFavorite } from "./types";

let store: LocalStorageFavoritesStore | null = null;
let detachStorageListener: (() => void) | null = null;

function safeLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getFavoritesStore(): LocalStorageFavoritesStore {
  if (!store) {
    const created = new LocalStorageFavoritesStore(safeLocalStorage());
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY) created.reload();
    };
    window.addEventListener("storage", onStorage);
    detachStorageListener = () => window.removeEventListener("storage", onStorage);
    store = created;
  }
  return store;
}

/** Só para testes: descarta o store para o próximo uso reler o localStorage. */
export function resetFavoritesStore(): void {
  detachStorageListener?.();
  detachStorageListener = null;
  store = null;
}

const EMPTY: FavoriteItem[] = [];
const subscribeNothing = () => () => {};

export function useFavorites() {
  // false no servidor e na hidratação; true depois — evita diferença de HTML.
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const current = ready ? getFavoritesStore() : null;

  const subscribe = useCallback(
    (onChange: () => void) => (current ? current.subscribe(onChange) : () => {}),
    [current],
  );
  const items = useSyncExternalStore(subscribe, () => (current ? current.list() : EMPTY), () => EMPTY);

  const has = useCallback(
    (id: number, tipo: MediaType) => items.some((item) => item.id === id && item.tipo === tipo),
    [items],
  );
  const add = useCallback((item: NewFavorite) => current?.add(item), [current]);
  const remove = useCallback((id: number, tipo: MediaType) => current?.remove(id, tipo), [current]);
  const toggle = useCallback(
    (item: NewFavorite) => (current?.has(item.id, item.tipo) ? current.remove(item.id, item.tipo) : current?.add(item)),
    [current],
  );

  return { items, has, add, remove, toggle, persistent: current ? current.isPersistent() : true, ready };
}
