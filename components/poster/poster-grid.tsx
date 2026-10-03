import { PosterCard, type PosterItem } from "@/components/poster/poster-card";

export function PosterGrid({ itens }: { itens: PosterItem[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {itens.map((item, index) => (
        <li key={`${item.tipo}-${item.id}`}>
          <PosterCard item={item} priority={index < 6} />
        </li>
      ))}
    </ul>
  );
}
