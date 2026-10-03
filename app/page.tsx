import { Suspense } from "react";
import { BotMenu } from "@/components/bot-menu";
import { PosterRow } from "@/components/poster/poster-row";
import { PosterRowSkeleton } from "@/components/poster/poster-skeletons";
import { RowError } from "@/components/row-error";
import { getBotMenuItems } from "@/lib/bot-menu";
import { telegramGroupUrl } from "@/lib/public-config";
import { settle } from "@/lib/settle";
import { getList, type ListCategory } from "@/lib/tmdb/api";

export const revalidate = 0;

interface HomeRowProps {
  titulo: string;
  categoria: ListCategory;
  verTodosHref: string;
}

async function HomeRow({ titulo, categoria, verTodosHref }: HomeRowProps) {
  const lista = await settle(getList(categoria, "filme"));
  if (!lista) return <RowError titulo={titulo} />;
  return <PosterRow titulo={titulo} itens={lista.resultados} verTodosHref={verTodosHref} />;
}

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl bg-card p-4 shadow">
          <p className="font-semibold">🎬 AcoPlay</p>
          <p className="mt-2 text-sm text-muted-foreground">🍿 Encontre filmes e séries e prepare a pipoca!</p>
          <h1 className="mt-3 text-xl font-bold">O que vamos assistir hoje?</h1>
        </div>
        <BotMenu items={getBotMenuItems(telegramGroupUrl)} />
      </section>

      <div className="mt-10 space-y-10">
        <Suspense fallback={<PosterRowSkeleton titulo="🔥 Mais procurados" />}>
          <HomeRow titulo="🔥 Mais procurados" categoria="populares" verTodosHref="/populares" />
        </Suspense>
        <Suspense fallback={<PosterRowSkeleton titulo="🆕 Recentes" />}>
          <HomeRow titulo="🆕 Recentes" categoria="recentes" verTodosHref="/recentes" />
        </Suspense>
      </div>
    </>
  );
}
