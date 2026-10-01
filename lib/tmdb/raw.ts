// Formato das respostas da API do TMDB (v3). Só `lib/tmdb` conhece estes tipos.

export interface RawPaged<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export interface RawMovieListItem {
  id: number;
  title: string;
  release_date?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string | null;
  vote_average?: number | null;
}

export interface RawTvListItem {
  id: number;
  name: string;
  first_air_date?: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string | null;
  vote_average?: number | null;
}

export interface RawGenre {
  id: number;
  name: string;
}

export interface RawCastMember {
  id: number;
  name: string;
  character?: string | null;
  profile_path: string | null;
  order?: number;
}

export interface RawCredits {
  cast: RawCastMember[];
}

export interface RawVideo {
  key: string;
  site: string;
  type: string;
  iso_639_1?: string | null;
  official?: boolean;
  name: string;
}

export interface RawProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

export interface RawRegionProviders {
  link?: string;
  flatrate?: RawProvider[];
  free?: RawProvider[];
  ads?: RawProvider[];
  rent?: RawProvider[];
  buy?: RawProvider[];
}

export interface RawWatchProvidersResponse {
  results: Record<string, RawRegionProviders | undefined>;
}

interface RawDetailsExtras {
  genres?: RawGenre[];
  credits?: RawCredits;
  videos?: { results: RawVideo[] };
  "watch/providers"?: RawWatchProvidersResponse;
}

export interface RawMovieDetails extends RawMovieListItem, RawDetailsExtras {
  runtime?: number | null;
  similar?: RawPaged<RawMovieListItem>;
}

export interface RawSeasonSummary {
  season_number: number;
  name: string;
  episode_count?: number;
  poster_path: string | null;
  air_date?: string | null;
}

export interface RawTvDetails extends RawTvListItem, RawDetailsExtras {
  episode_run_time?: number[];
  seasons?: RawSeasonSummary[];
  similar?: RawPaged<RawTvListItem>;
}

export interface RawEpisode {
  episode_number: number;
  name: string;
  overview?: string | null;
  still_path: string | null;
  air_date?: string | null;
  runtime?: number | null;
}

export interface RawSeasonDetails {
  season_number: number;
  name: string;
  overview?: string | null;
  poster_path: string | null;
  episodes?: RawEpisode[];
}
