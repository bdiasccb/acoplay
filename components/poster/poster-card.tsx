import Image from "next/image";
import Link from "next/link";
import { titleHref } from "@/lib/routes";
import { tmdbImage } from "@/lib/tmdb/images";
import type { TitleSummary } from "@/lib/tmdb/types";
import { cn } from "@/lib/utils";

export type PosterItem = Pick<TitleSummary, "id" | "tipo" | "titulo" | "ano" | "posterPath">;

interface PosterCardProps {
  item: PosterItem;
  priority?: boolean;
  className?: string;
}

export function PosterCard({ item, priority = false, className }: PosterCardProps) {
  const src = tmdbImage(item.posterPath, "w342");
  return (
    <Link href={titleHref(item.tipo, item.id)} className={cn("group block rounded-lg", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        {src ? (
          // alt vazio: o título já aparece em texto logo abaixo.
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 180px, (min-width: 640px) 25vw, 45vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center text-xs text-muted-foreground">
            <span aria-hidden className="text-3xl">
              🎬
            </span>
            Sem pôster
          </div>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium">{item.titulo}</p>
      <p className="text-xs text-muted-foreground">{item.ano ?? "—"}</p>
    </Link>
  );
}
