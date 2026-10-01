export type MediaType = "filme" | "serie";

export interface TitleSummary {
  id: number;
  tipo: MediaType;
  titulo: string;
  ano: number | null;
  posterPath: string | null;
  backdropPath: string | null;
  sinopse: string;
  nota: number;
}

export interface CastMember {
  id: number;
  nome: string;
  personagem: string;
  fotoPath: string | null;
}

export interface Trailer {
  youtubeKey: string;
  nome: string;
}

export interface WatchProvider {
  id: number;
  nome: string;
  logoPath: string | null;
}

export interface WatchProviders {
  /** Página do TMDB/JustWatch com todas as opções; null quando não há dados para o Brasil. */
  link: string | null;
  assinatura: WatchProvider[];
  gratis: WatchProvider[];
  aluguel: WatchProvider[];
  compra: WatchProvider[];
}

export interface TitleDetails extends TitleSummary {
  generos: string[];
  duracaoMin: number | null;
  elenco: CastMember[];
  trailer: Trailer | null;
  ondeAssistir: WatchProviders;
  parecidos: TitleSummary[];
}

export interface SeasonSummary {
  numero: number;
  nome: string;
  episodios: number;
  posterPath: string | null;
  ano: number | null;
}

export interface SeriesDetails extends TitleDetails {
  temporadas: SeasonSummary[];
}

export interface Episode {
  numero: number;
  nome: string;
  sinopse: string;
  stillPath: string | null;
  dataExibicao: string | null;
  duracaoMin: number | null;
}

export interface SeasonDetails {
  serieId: number;
  numero: number;
  nome: string;
  sinopse: string;
  posterPath: string | null;
  episodios: Episode[];
}

export interface Paged<T> {
  pagina: number;
  totalPaginas: number;
  resultados: T[];
}
