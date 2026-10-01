import "server-only";
import { REVALIDATE_DETAILS, REVALIDATE_LIST, tmdbFetch } from "./client";
import {
  mapMovieDetails,
  mapMovieSummary,
  mapPaged,
  mapSeason,
  mapSeriesDetails,
  mapSeriesSummary,
} from "./mappers";
import type {
  RawMovieDetails,
  RawMovieListItem,
  RawPaged,
  RawSeasonDetails,
  RawTvDetails,
  RawTvListItem,
} from "./raw";
import type { MediaType, Paged, SeasonDetails, SeriesDetails, TitleDetails, TitleSummary } from "./types";

export type ListCategory = "populares" | "recentes";

const LANGUAGE = "pt-BR";
const REGION = "BR";
const DETAILS_APPEND = "credits,videos,watch/providers,similar";
const VIDEO_LANGUAGES = "pt,en,null";

const LIST_PATHS: Record<ListCategory, Record<MediaType, string>> = {
  populares: { filme: "/trending/movie/week", serie: "/trending/tv/week" },
  recentes: { filme: "/movie/now_playing", serie: "/tv/on_the_air" },
};

const SEARCH_PATHS: Record<MediaType, string> = { filme: "/search/movie", serie: "/search/tv" };

function mapList(tipo: MediaType, raw: RawPaged<RawMovieListItem | RawTvListItem>): Paged<TitleSummary> {
  return tipo === "filme"
    ? mapPaged(raw as RawPaged<RawMovieListItem>, mapMovieSummary)
    : mapPaged(raw as RawPaged<RawTvListItem>, mapSeriesSummary);
}

export async function getList(categoria: ListCategory, tipo: MediaType, pagina = 1): Promise<Paged<TitleSummary>> {
  const raw = await tmdbFetch<RawPaged<RawMovieListItem | RawTvListItem>>(
    LIST_PATHS[categoria][tipo],
    { language: LANGUAGE, region: categoria === "recentes" ? REGION : undefined, page: pagina },
    REVALIDATE_LIST,
  );
  return mapList(tipo, raw);
}

export async function searchTitles(query: string, tipo: MediaType, pagina = 1): Promise<Paged<TitleSummary>> {
  const raw = await tmdbFetch<RawPaged<RawMovieListItem | RawTvListItem>>(
    SEARCH_PATHS[tipo],
    { query, language: LANGUAGE, include_adult: false, page: pagina },
    REVALIDATE_LIST,
  );
  return mapList(tipo, raw);
}

export async function getMovieDetails(id: number): Promise<TitleDetails> {
  const raw = await tmdbFetch<RawMovieDetails>(
    `/movie/${id}`,
    { language: LANGUAGE, append_to_response: DETAILS_APPEND, include_video_language: VIDEO_LANGUAGES },
    REVALIDATE_DETAILS,
  );
  return mapMovieDetails(raw);
}

export async function getSeriesDetails(id: number): Promise<SeriesDetails> {
  const raw = await tmdbFetch<RawTvDetails>(
    `/tv/${id}`,
    { language: LANGUAGE, append_to_response: DETAILS_APPEND, include_video_language: VIDEO_LANGUAGES },
    REVALIDATE_DETAILS,
  );
  return mapSeriesDetails(raw);
}

export async function getSeasonDetails(serieId: number, numero: number): Promise<SeasonDetails> {
  const raw = await tmdbFetch<RawSeasonDetails>(
    `/tv/${serieId}/season/${numero}`,
    { language: LANGUAGE },
    REVALIDATE_DETAILS,
  );
  return mapSeason(serieId, raw);
}

export async function discoverTopMovies(pagina: number): Promise<Paged<TitleSummary>> {
  const raw = await tmdbFetch<RawPaged<RawMovieListItem>>(
    "/discover/movie",
    {
      language: LANGUAGE,
      sort_by: "popularity.desc",
      "vote_average.gte": 7,
      "vote_count.gte": 500,
      include_adult: false,
      page: pagina,
    },
    REVALIDATE_LIST,
  );
  return mapPaged(raw, mapMovieSummary);
}
