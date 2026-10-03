import { Skeleton } from "@/components/ui/skeleton";

export function PosterCardSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/3" />
    </div>
  );
}

export function PosterRowSkeleton({ titulo }: { titulo?: string }) {
  return (
    <section className="space-y-3" aria-busy="true" aria-label={titulo ? `Carregando ${titulo}` : "Carregando"}>
      {titulo ? <h2 className="text-lg font-bold">{titulo}</h2> : <Skeleton className="h-6 w-40" />}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="w-32 shrink-0 sm:w-40">
            <PosterCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export function PosterGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {Array.from({ length: count }, (_, index) => (
        <PosterCardSkeleton key={index} />
      ))}
    </div>
  );
}
