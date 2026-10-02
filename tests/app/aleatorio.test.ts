import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/tmdb/api", () => ({ discoverTopMovies: vi.fn() }));

import { GET } from "@/app/aleatorio/route";
import { discoverTopMovies } from "@/lib/tmdb/api";
import type { TitleSummary } from "@/lib/tmdb/types";

const filme = (id: number): TitleSummary => ({
  id,
  tipo: "filme",
  titulo: `Filme ${id}`,
  ano: 2000,
  posterPath: null,
  backdropPath: null,
  sinopse: "",
  nota: 8,
});

const request = () => new NextRequest("http://localhost/aleatorio");

describe("GET /aleatorio", () => {
  beforeEach(() => {
    vi.mocked(discoverTopMovies).mockReset();
  });

  it("redireciona para um filme sorteado", async () => {
    vi.mocked(discoverTopMovies).mockResolvedValue({ pagina: 3, totalPaginas: 20, resultados: [filme(42)] });

    const response = await GET(request());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/filme/42?sorteado=1");
  });

  it("tenta a página 1 quando a página sorteada vem vazia", async () => {
    vi.mocked(discoverTopMovies)
      .mockResolvedValueOnce({ pagina: 19, totalPaginas: 5, resultados: [] })
      .mockResolvedValueOnce({ pagina: 1, totalPaginas: 5, resultados: [filme(7)] });

    const response = await GET(request());

    expect(vi.mocked(discoverTopMovies).mock.calls[1][0]).toBe(1);
    expect(response.headers.get("location")).toBe("http://localhost/filme/7?sorteado=1");
  });

  it("leva para os populares com aviso quando o TMDB falha", async () => {
    vi.mocked(discoverTopMovies).mockRejectedValue(new Error("fora do ar"));

    const response = await GET(request());

    expect(response.headers.get("location")).toBe("http://localhost/populares?erro=sorteio");
  });
});
