import { NextResponse, type NextRequest } from "next/server";
import { pickRandom, randomInt } from "@/lib/random";
import { discoverTopMovies } from "@/lib/tmdb/api";

// Sorteio novo a cada visita; as chamadas ao TMDB (revalidate positivo) continuam em cache.
export const revalidate = 0;

const MAX_PAGE = 20;

export async function GET(request: NextRequest) {
  try {
    let page = await discoverTopMovies(randomInt(1, MAX_PAGE));
    if (page.resultados.length === 0) page = await discoverTopMovies(1);

    const escolhido = pickRandom(page.resultados);
    if (!escolhido) return NextResponse.redirect(new URL("/populares?erro=sorteio", request.url));

    return NextResponse.redirect(new URL(`/filme/${escolhido.id}?sorteado=1`, request.url));
  } catch {
    return NextResponse.redirect(new URL("/populares?erro=sorteio", request.url));
  }
}
