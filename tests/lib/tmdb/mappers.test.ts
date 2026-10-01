import { describe, expect, it } from "vitest";
import {
  hasAnyProvider,
  mapCast,
  mapMovieDetails,
  mapMovieSummary,
  mapPaged,
  mapSeason,
  mapSeriesDetails,
  mapSeriesSummary,
  mapWatchProviders,
  pickTrailer,
  yearOf,
} from "@/lib/tmdb/mappers";
import { fixtures } from "../../fixtures/tmdb";

describe("yearOf", () => {
  it("extrai o ano de uma data ISO", () => {
    expect(yearOf("2001-11-16")).toBe(2001);
  });

  it("devolve null para vazio, null ou formato inválido", () => {
    expect(yearOf("")).toBeNull();
    expect(yearOf(null)).toBeNull();
    expect(yearOf(undefined)).toBeNull();
    expect(yearOf("sem data")).toBeNull();
  });
});

describe("resumos", () => {
  it("converte filme da lista para o formato do site", () => {
    const [primeiro] = fixtures.movieList.results;
    expect(mapMovieSummary(primeiro)).toEqual({
      id: 671,
      tipo: "filme",
      titulo: "Harry Potter e a Pedra Filosofal",
      ano: 2001,
      posterPath: "/poster-671.jpg",
      backdropPath: "/backdrop-671.jpg",
      sinopse: "Harry Potter é um garoto órfão que descobre ser um bruxo.",
      nota: 7.9,
    });
  });

  it("converte série usando name e first_air_date", () => {
    const [serie] = fixtures.tvList.results;
    expect(mapSeriesSummary(serie)).toMatchObject({ id: 1396, tipo: "serie", titulo: "Breaking Bad", ano: 2008 });
  });

  it("converte paginação", () => {
    const paged = mapPaged(fixtures.movieList, mapMovieSummary);
    expect(paged.pagina).toBe(1);
    expect(paged.totalPaginas).toBe(3);
    expect(paged.resultados).toHaveLength(2);
    expect(paged.resultados[1]).toMatchObject({ posterPath: null, sinopse: "" });
  });
});

describe("pickTrailer", () => {
  it("prefere trailer em português, depois teaser em português, depois inglês", () => {
    expect(pickTrailer(fixtures.movieDetails.videos?.results)).toEqual({ youtubeKey: "pt-trailer", nome: "Trailer Dublado" });
  });

  it("usa o trailer em inglês quando não há em português", () => {
    const videos = fixtures.movieDetails.videos!.results.filter((v) => v.iso_639_1 !== "pt");
    expect(pickTrailer(videos)?.youtubeKey).toBe("en-trailer");
  });

  it("ignora vídeos fora do YouTube e devolve null sem candidatos", () => {
    expect(pickTrailer([{ key: "x", site: "Vimeo", type: "Trailer", iso_639_1: "pt", name: "x" }])).toBeNull();
    expect(pickTrailer(undefined)).toBeNull();
  });
});

describe("mapWatchProviders", () => {
  it("usa só a região BR e ordena por prioridade", () => {
    const providers = mapWatchProviders(fixtures.movieDetails["watch/providers"]);
    expect(providers.link).toBe("https://www.themoviedb.org/movie/671/watch?locale=BR");
    expect(providers.assinatura.map((p) => p.nome)).toEqual(["Max"]);
    expect(providers.aluguel.map((p) => p.nome)).toEqual(["Google Play Filmes", "Apple TV"]);
    expect(providers.compra.map((p) => p.nome)).toEqual(["Apple TV"]);
    expect(providers.gratis).toEqual([]);
    expect(hasAnyProvider(providers)).toBe(true);
  });

  it("junta free e ads em gratis sem repetir", () => {
    const providers = mapWatchProviders({
      results: {
        BR: {
          free: [{ provider_id: 7, provider_name: "Pluto TV", logo_path: null, display_priority: 1 }],
          ads: [{ provider_id: 7, provider_name: "Pluto TV", logo_path: null, display_priority: 1 }],
        },
      },
    });
    expect(providers.gratis).toEqual([{ id: 7, nome: "Pluto TV", logoPath: null }]);
  });

  it("devolve listas vazias quando não há dados do Brasil", () => {
    const providers = mapWatchProviders({ results: {} });
    expect(providers).toEqual({ link: null, assinatura: [], gratis: [], aluguel: [], compra: [] });
    expect(hasAnyProvider(providers)).toBe(false);
  });
});

describe("mapCast", () => {
  it("ordena pelo campo order e respeita o limite", () => {
    const elenco = mapCast(fixtures.movieDetails.credits, 1);
    expect(elenco).toEqual([{ id: 10980, nome: "Daniel Radcliffe", personagem: "Harry Potter", fotoPath: "/profile-10980.jpg" }]);
  });
});

describe("detalhes", () => {
  it("monta os detalhes do filme", () => {
    const filme = mapMovieDetails(fixtures.movieDetails);
    expect(filme).toMatchObject({ id: 671, tipo: "filme", generos: ["Aventura", "Fantasia"], duracaoMin: 152 });
    expect(filme.trailer?.youtubeKey).toBe("pt-trailer");
    expect(filme.elenco.map((c) => c.nome)).toEqual(["Daniel Radcliffe", "Rupert Grint"]);
    expect(filme.parecidos.map((p) => p.id)).toEqual([672]);
  });

  it("monta os detalhes da série sem a temporada de especiais", () => {
    const serie = mapSeriesDetails(fixtures.tvDetails);
    expect(serie).toMatchObject({ tipo: "serie", duracaoMin: 45, trailer: null });
    expect(serie.temporadas).toEqual([
      { numero: 1, nome: "Temporada 1", episodios: 7, posterPath: "/season-1.jpg", ano: 2008 },
      { numero: 2, nome: "Temporada 2", episodios: 13, posterPath: null, ano: 2009 },
    ]);
    expect(hasAnyProvider(serie.ondeAssistir)).toBe(false);
  });

  it("monta a temporada com episódios", () => {
    const temporada = mapSeason(1396, fixtures.seasonDetails);
    expect(temporada).toMatchObject({ serieId: 1396, numero: 1, nome: "Temporada 1" });
    expect(temporada.episodios[0]).toEqual({
      numero: 1,
      nome: "Piloto",
      sinopse: "Walter recebe uma notícia que muda tudo.",
      stillPath: "/still-1.jpg",
      dataExibicao: "2008-01-20",
      duracaoMin: 58,
    });
    expect(temporada.episodios[1]).toMatchObject({ sinopse: "", stillPath: null, dataExibicao: null, duracaoMin: null });
  });
});
