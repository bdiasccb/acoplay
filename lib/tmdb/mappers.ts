import type {
  RawCredits,
  RawMovieDetails,
  RawMovieListItem,
  RawPaged,
  RawProvider,
  RawSeasonDetails,
  RawTvDetails,
  RawTvListItem,
  RawVideo,
  RawWatchProvidersResponse,
} from "./raw";
import type {
  CastMember,
  Paged,
  SeasonDetails,
  SeriesDetails,
  TitleDetails,
  TitleSummary,
  Trailer,
  WatchProvider,
  WatchProviders,
} from "./types";

const MAX_PARECIDOS = 12;

export function yearOf(date: string | null | undefined): number | null {
  if (!date) return null;
  const match = /^(\d{4})/.exec(date);
  return match ? Number(match[1]) : null;
}

function roundNota(value: number | null | undefined): number {
  return Math.round((value ?? 0) * 10) / 10;
}

export function mapMovieSummary(raw: RawMovieListItem): TitleSummary {
  return {
    id: raw.id,
    tipo: "filme",
    titulo: raw.title,
    ano: yearOf(raw.release_date),
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    sinopse: raw.overview?.trim() ?? "",
    nota: roundNota(raw.vote_average),
  };
}

export function mapSeriesSummary(raw: RawTvListItem): TitleSummary {
  return {
    id: raw.id,
    tipo: "serie",
    titulo: raw.name,
    ano: yearOf(raw.first_air_date),
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    sinopse: raw.overview?.trim() ?? "",
    nota: roundNota(raw.vote_average),
  };
}

export function mapPaged<R, T>(raw: RawPaged<R>, map: (item: R) => T): Paged<T> {
  return { pagina: raw.page, totalPaginas: raw.total_pages, resultados: raw.results.map(map) };
}

// Menor número = preferido. Object.hasOwn evita casar chaves do protótipo ("constructor").
const LANGUAGE_RANK: Record<string, number> = { pt: 0, en: 1 };
const VIDEO_TYPE_RANK: Record<string, number> = { Trailer: 0, Teaser: 1 };

function rankOf(table: Record<string, number>, key: string | null | undefined, fallback: number): number {
  return key != null && Object.hasOwn(table, key) ? table[key] : fallback;
}

export function pickTrailer(videos: RawVideo[] | undefined): Trailer | null {
  const candidates = (videos ?? []).filter(
    (video) => video.site === "YouTube" && Object.hasOwn(VIDEO_TYPE_RANK, video.type),
  );
  candidates.sort(
    (a, b) =>
      rankOf(LANGUAGE_RANK, a.iso_639_1, 2) - rankOf(LANGUAGE_RANK, b.iso_639_1, 2) ||
      rankOf(VIDEO_TYPE_RANK, a.type, 2) - rankOf(VIDEO_TYPE_RANK, b.type, 2) ||
      Number(Boolean(b.official)) - Number(Boolean(a.official)),
  );
  const best = candidates[0];
  return best ? { youtubeKey: best.key, nome: best.name } : null;
}

function mapProviders(list: RawProvider[] | undefined): WatchProvider[] {
  return [...(list ?? [])]
    .sort((a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999))
    .map((provider) => ({ id: provider.provider_id, nome: provider.provider_name, logoPath: provider.logo_path ?? null }));
}

function uniqueById(list: WatchProvider[]): WatchProvider[] {
  const seen = new Set<number>();
  return list.filter((provider) => {
    if (seen.has(provider.id)) return false;
    seen.add(provider.id);
    return true;
  });
}

export function mapWatchProviders(raw: RawWatchProvidersResponse | undefined, region = "BR"): WatchProviders {
  const regional = raw?.results?.[region];
  return {
    link: regional?.link ?? null,
    assinatura: mapProviders(regional?.flatrate),
    gratis: uniqueById([...mapProviders(regional?.free), ...mapProviders(regional?.ads)]),
    aluguel: mapProviders(regional?.rent),
    compra: mapProviders(regional?.buy),
  };
}

export function hasAnyProvider(providers: WatchProviders): boolean {
  return (
    providers.assinatura.length + providers.gratis.length + providers.aluguel.length + providers.compra.length > 0
  );
}

export function mapCast(raw: RawCredits | undefined, limit = 12): CastMember[] {
  return [...(raw?.cast ?? [])]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, limit)
    .map((member) => ({
      id: member.id,
      nome: member.name,
      personagem: member.character?.trim() ?? "",
      fotoPath: member.profile_path ?? null,
    }));
}

export function mapMovieDetails(raw: RawMovieDetails): TitleDetails {
  return {
    ...mapMovieSummary(raw),
    generos: (raw.genres ?? []).map((genre) => genre.name),
    duracaoMin: raw.runtime ? raw.runtime : null,
    elenco: mapCast(raw.credits),
    trailer: pickTrailer(raw.videos?.results),
    ondeAssistir: mapWatchProviders(raw["watch/providers"]),
    parecidos: (raw.similar?.results ?? []).slice(0, MAX_PARECIDOS).map(mapMovieSummary),
  };
}

export function mapSeriesDetails(raw: RawTvDetails): SeriesDetails {
  return {
    ...mapSeriesSummary(raw),
    generos: (raw.genres ?? []).map((genre) => genre.name),
    duracaoMin: raw.episode_run_time?.[0] ?? null,
    elenco: mapCast(raw.credits),
    trailer: pickTrailer(raw.videos?.results),
    ondeAssistir: mapWatchProviders(raw["watch/providers"]),
    parecidos: (raw.similar?.results ?? []).slice(0, MAX_PARECIDOS).map(mapSeriesSummary),
    // A temporada 0 ("Especiais") fica de fora da lista principal.
    temporadas: (raw.seasons ?? [])
      .filter((season) => season.season_number > 0)
      .map((season) => ({
        numero: season.season_number,
        nome: season.name,
        episodios: season.episode_count ?? 0,
        posterPath: season.poster_path ?? null,
        ano: yearOf(season.air_date),
      })),
  };
}

export function mapSeason(serieId: number, raw: RawSeasonDetails): SeasonDetails {
  return {
    serieId,
    numero: raw.season_number,
    nome: raw.name,
    sinopse: raw.overview?.trim() ?? "",
    posterPath: raw.poster_path ?? null,
    episodios: (raw.episodes ?? []).map((episode) => ({
      numero: episode.episode_number,
      nome: episode.name,
      sinopse: episode.overview?.trim() ?? "",
      stillPath: episode.still_path ?? null,
      dataExibicao: episode.air_date ?? null,
      duracaoMin: episode.runtime ?? null,
    })),
  };
}
