import type {
  RawMovieDetails,
  RawMovieListItem,
  RawPaged,
  RawSeasonDetails,
  RawTvDetails,
  RawTvListItem,
} from "@/lib/tmdb/raw";
import emptyList from "./empty-list.json";
import movieDetails from "./movie-details.json";
import movieList from "./movie-list.json";
import seasonDetails from "./season-details.json";
import tvDetails from "./tv-details.json";
import tvList from "./tv-list.json";

// Clona a cada acesso para um teste nunca alterar a fixture de outro.
const clone = <T>(value: unknown): T => structuredClone(value) as T;

export const fixtures = {
  get movieList() { return clone<RawPaged<RawMovieListItem>>(movieList); },
  get tvList() { return clone<RawPaged<RawTvListItem>>(tvList); },
  get emptyList() { return clone<RawPaged<never>>(emptyList); },
  get movieDetails() { return clone<RawMovieDetails>(movieDetails); },
  get tvDetails() { return clone<RawTvDetails>(tvDetails); },
  get seasonDetails() { return clone<RawSeasonDetails>(seasonDetails); },
};
