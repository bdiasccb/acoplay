import "server-only";
import { getTmdbEnv } from "@/lib/env";

export const REVALIDATE_LIST = 3600;
export const REVALIDATE_DETAILS = 86400;
const TIMEOUT_MS = 8000;

export class TmdbError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

type Params = Record<string, string | number | boolean | undefined>;

export async function tmdbFetch<T>(path: string, params: Params, revalidate: number): Promise<T> {
  const { TMDB_READ_TOKEN, TMDB_API_BASE } = getTmdbEnv();
  const url = new URL(`${TMDB_API_BASE.replace(/\/$/, "")}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${TMDB_READ_TOKEN}`, accept: "application/json" },
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new TmdbError(503, `Falha de rede ao consultar o TMDB (${path}): ${(error as Error).message}`);
  }

  if (!response.ok) {
    throw new TmdbError(response.status, `TMDB respondeu ${response.status} para ${path}`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new TmdbError(503, `Resposta inválida do TMDB (${path})`);
  }
}
