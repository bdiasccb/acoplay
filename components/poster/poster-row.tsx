import Link from "next/link";
import { PosterCard, type PosterItem } from "@/components/poster/poster-card";

interface PosterRowProps {
  titulo: string;
  itens: PosterItem[];
  verTodosHref?: string;
}

export function PosterRow({ titulo, itens, verTodosHref }: PosterRowProps) {
  return (
    <section aria-label={titulo} className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-bold">{titulo}</h2>
        {verTodosHref ? (
          <Link href={verTodosHref} className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        ) : null}
      </div>
      <ul className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-2">
        {itens.map((item) => (
          <li key={`${item.tipo}-${item.id}`} className="w-32 shrink-0 snap-start sm:w-40">
            <PosterCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
