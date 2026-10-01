import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  discoverTopMovies,
  getList,
  getMovieDetails,
  getSeasonDetails,
  getSeriesDetails,
  searchTitles,
} from "@/lib/tmdb/api";
import { fixtures } from "../../fixtures/tmdb";

function mockFetchJson(body: unknown) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } }));
}

function calledUrl(fetchMock: ReturnType<typeof mockFetchJson>): URL {
  return new URL(String(fetchMock.mock.calls[0][0]));
}

describe("api do TMDB", () => {
  beforeEach(() => {
    vi.stubEnv("TMDB_READ_TOKEN", "t");
    vi.stubEnv("TMDB_API_BASE", "https://tmdb.test/3");
  });

  it("populares de filmes usam as tendências da semana", async () => {
    const fetchMock = mockFetchJson(fixtures.movieList);
    const lista = await getList("populares", "filme");
    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe("/3/trending/movie/week");
    expect(url.searchParams.get("language")).toBe("pt-BR");
    expect(url.searchParams.get("page")).toBe("1");
    expect(lista.resultados[0]).toMatchObject({ id: 671, tipo: "filme" });
  });

  it("populares de séries usam trending/tv", async () => {
    const fetchMock = mockFetchJson(fixtures.tvList);
    const lista = await getList("populares", "serie", 2);
    expect(calledUrl(fetchMock).pathname).toBe("/3/trending/tv/week");
    expect(calledUrl(fetchMock).searchParams.get("page")).toBe("2");
    expect(lista.resultados[0]).toMatchObject({ id: 1396, tipo: "serie" });
  });

  it("recentes de filmes usam em cartaz no Brasil", async () => {
    const fetchMock = mockFetchJson(fixtures.movieList);
    await getList("recentes", "filme");
    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe("/3/movie/now_playing");
    expect(url.searchParams.get("region")).toBe("BR");
  });

  it("recentes de séries usam séries no ar", async () => {
    const fetchMock = mockFetchJson(fixtures.tvList);
    await getList("recentes", "serie");
    expect(calledUrl(fetchMock).pathname).toBe("/3/tv/on_the_air");
  });

  it("busca filmes sem conteúdo adulto", async () => {
    const fetchMock = mockFetchJson(fixtures.movieList);
    const resultado = await searchTitles("harry potter", "filme");
    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe("/3/search/movie");
    expect(url.searchParams.get("query")).toBe("harry potter");
    expect(url.searchParams.get("include_adult")).toBe("false");
    expect(resultado.resultados).toHaveLength(2);
  });

  it("busca séries em search/tv", async () => {
    const fetchMock = mockFetchJson(fixtures.tvList);
    await searchTitles("breaking", "serie");
    expect(calledUrl(fetchMock).pathname).toBe("/3/search/tv");
  });

  it("detalhes do filme pedem elenco, vídeos, onde assistir e parecidos de uma vez", async () => {
    const fetchMock = mockFetchJson(fixtures.movieDetails);
    const filme = await getMovieDetails(671);
    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe("/3/movie/671");
    expect(url.searchParams.get("append_to_response")).toBe("credits,videos,watch/providers,similar");
    expect(url.searchParams.get("include_video_language")).toBe("pt,en,null");
    expect(filme.ondeAssistir.assinatura[0].nome).toBe("Max");
  });

  it("detalhes da série usam /tv/{id}", async () => {
    const fetchMock = mockFetchJson(fixtures.tvDetails);
    const serie = await getSeriesDetails(1396);
    expect(calledUrl(fetchMock).pathname).toBe("/3/tv/1396");
    expect(serie.temporadas).toHaveLength(2);
  });

  it("temporada usa /tv/{id}/season/{n}", async () => {
    const fetchMock = mockFetchJson(fixtures.seasonDetails);
    const temporada = await getSeasonDetails(1396, 1);
    expect(calledUrl(fetchMock).pathname).toBe("/3/tv/1396/season/1");
    expect(temporada.serieId).toBe(1396);
  });

  it("descoberta filtra filmes bem avaliados", async () => {
    const fetchMock = mockFetchJson(fixtures.movieList);
    await discoverTopMovies(5);
    const url = calledUrl(fetchMock);
    expect(url.pathname).toBe("/3/discover/movie");
    expect(url.searchParams.get("vote_average.gte")).toBe("7");
    expect(url.searchParams.get("vote_count.gte")).toBe("500");
    expect(url.searchParams.get("page")).toBe("5");
  });
});
