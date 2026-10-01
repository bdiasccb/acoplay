import { beforeEach, describe, expect, it, vi } from "vitest";
import { TmdbError, tmdbFetch } from "@/lib/tmdb/client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("tmdbFetch", () => {
  beforeEach(() => {
    vi.stubEnv("TMDB_READ_TOKEN", "token-de-teste");
    vi.stubEnv("TMDB_API_BASE", "https://tmdb.test/3");
  });

  it("monta a URL com parâmetros, envia o token e configura o cache", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ ok: 1 }));

    const data = await tmdbFetch<{ ok: number }>("/movie/1", { language: "pt-BR", page: 2, vazio: undefined }, 3600);

    expect(data).toEqual({ ok: 1 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://tmdb.test/3/movie/1?language=pt-BR&page=2");
    expect(init?.headers).toMatchObject({ Authorization: "Bearer token-de-teste" });
    expect((init as { next?: unknown }).next).toEqual({ revalidate: 3600 });
  });

  it("lança TmdbError com o status quando o TMDB responde erro", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ status_message: "not found" }, 404));

    await expect(tmdbFetch("/movie/999", {}, 60)).rejects.toMatchObject({ name: "TmdbError", status: 404 });
  });

  it("converte falha de rede em TmdbError 503", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("fetch failed"));

    const error = await tmdbFetch("/movie/1", {}, 60).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TmdbError);
    expect((error as TmdbError).status).toBe(503);
  });

  it("nunca coloca o token na mensagem de erro", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({}, 401));

    const error = (await tmdbFetch("/movie/1", {}, 60).catch((e: unknown) => e)) as Error;
    expect(error.message).not.toContain("token-de-teste");
  });

  it("converte resposta 200 com conteúdo inválido em TmdbError 503", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>erro</html>", { status: 200, headers: { "content-type": "text/html" } })
    );

    const error = await tmdbFetch("/movie/1", {}, 60).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TmdbError);
    expect((error as TmdbError).status).toBe(503);
  });
});
