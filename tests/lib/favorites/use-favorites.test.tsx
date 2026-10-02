// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FAVORITES_KEY } from "@/lib/favorites/local-storage-store";
import type { NewFavorite } from "@/lib/favorites/types";
import { resetFavoritesStore, useFavorites } from "@/lib/favorites/use-favorites";

const filme: NewFavorite = { id: 671, tipo: "filme", titulo: "Harry Potter", posterPath: null, ano: 2001 };

describe("useFavorites", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetFavoritesStore();
  });

  it("alterna um título entre favorito e não favorito", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.items).toEqual([]);
    expect(result.current.persistent).toBe(true);

    act(() => result.current.toggle(filme));
    expect(result.current.has(671, "filme")).toBe(true);
    expect(result.current.items[0].titulo).toBe("Harry Potter");

    act(() => result.current.toggle(filme));
    expect(result.current.items).toEqual([]);
  });

  it("atualiza quando outra aba muda o localStorage", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([{ ...filme, adicionadoEm: "2026-10-01T00:00:00.000Z" }]));
      window.dispatchEvent(new StorageEvent("storage", { key: FAVORITES_KEY }));
    });

    expect(result.current.items).toHaveLength(1);
  });
});
