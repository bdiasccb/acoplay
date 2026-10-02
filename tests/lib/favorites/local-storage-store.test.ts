import { describe, expect, it, vi } from "vitest";
import { FAVORITES_KEY, LocalStorageFavoritesStore } from "@/lib/favorites/local-storage-store";
import type { NewFavorite } from "@/lib/favorites/types";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => [...data.keys()][index] ?? null,
    removeItem: (key: string) => void data.delete(key),
    setItem: (key: string, value: string) => void data.set(key, value),
  } as Storage;
}

function brokenStorage(): Storage {
  const fail = () => {
    throw new Error("SecurityError");
  };
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail } as unknown as Storage;
}

const filme: NewFavorite = { id: 671, tipo: "filme", titulo: "Harry Potter", posterPath: "/p.jpg", ano: 2001 };
const serie: NewFavorite = { id: 1396, tipo: "serie", titulo: "Breaking Bad", posterPath: null, ano: 2008 };
const agora = () => new Date("2026-10-01T12:00:00.000Z");

describe("LocalStorageFavoritesStore", () => {
  it("começa vazio e adiciona no topo com a data", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    store.add(filme);
    store.add(serie);
    expect(store.list().map((item) => item.id)).toEqual([1396, 671]);
    expect(store.list()[1].adicionadoEm).toBe("2026-10-01T12:00:00.000Z");
  });

  it("guarda só os campos permitidos", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    store.add({ ...filme, sinopse: "não deve ser salva" } as NewFavorite);
    expect(Object.keys(store.list()[0]).sort()).toEqual(["adicionadoEm", "ano", "id", "posterPath", "tipo", "titulo"]);
  });

  it("não duplica e diferencia filme de série com o mesmo id", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    store.add(filme);
    store.add(filme);
    store.add({ ...serie, id: 671 });
    expect(store.list()).toHaveLength(2);
    expect(store.has(671, "filme")).toBe(true);
    expect(store.has(671, "serie")).toBe(true);
  });

  it("remove pelo id e tipo", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    store.add(filme);
    store.add(serie);
    store.remove(671, "filme");
    expect(store.list().map((item) => item.id)).toEqual([1396]);
  });

  it("persiste no storage e outra instância lê os mesmos dados", () => {
    const storage = memoryStorage();
    new LocalStorageFavoritesStore(storage, agora).add(filme);
    const outra = new LocalStorageFavoritesStore(storage, agora);
    expect(outra.has(671, "filme")).toBe(true);
    expect(JSON.parse(storage.getItem(FAVORITES_KEY)!)).toHaveLength(1);
  });

  it("ignora JSON corrompido e itens inválidos", () => {
    const corrompido = new LocalStorageFavoritesStore(memoryStorage({ [FAVORITES_KEY]: "{não é json" }));
    expect(corrompido.list()).toEqual([]);

    const misturado = new LocalStorageFavoritesStore(
      memoryStorage({
        [FAVORITES_KEY]: JSON.stringify([{ ...filme, adicionadoEm: "x" }, { id: "abc" }, null, { ...serie, tipo: "anime" }]),
      }),
    );
    expect(misturado.list().map((item) => item.id)).toEqual([671]);
  });

  it("funciona só em memória quando o storage não pode ser usado", () => {
    for (const storage of [null, brokenStorage()]) {
      const store = new LocalStorageFavoritesStore(storage, agora);
      expect(store.isPersistent()).toBe(false);
      store.add(filme);
      expect(store.has(671, "filme")).toBe(true);
    }
  });

  it("mantém a mesma referência da lista até haver mudança", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    const antes = store.list();
    expect(store.list()).toBe(antes);
    store.add(filme);
    expect(store.list()).not.toBe(antes);
  });

  it("avisa os assinantes e para de avisar depois de cancelar", () => {
    const store = new LocalStorageFavoritesStore(memoryStorage(), agora);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.add(filme);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.remove(671, "filme");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("reload lê alterações feitas por outra aba", () => {
    const storage = memoryStorage();
    const store = new LocalStorageFavoritesStore(storage, agora);
    const listener = vi.fn();
    store.subscribe(listener);
    storage.setItem(FAVORITES_KEY, JSON.stringify([{ ...serie, adicionadoEm: "2026-10-01T00:00:00.000Z" }]));
    store.reload();
    expect(store.has(1396, "serie")).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
