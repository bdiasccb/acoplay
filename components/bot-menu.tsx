import Link from "next/link";
import type { BotMenuItem } from "@/lib/bot-menu";
import { cn } from "@/lib/utils";

interface BotMenuProps {
  items: BotMenuItem[];
  /** Chamado ao clicar em um item (ex.: fechar o painel do menu). */
  onNavigate?: () => void;
}

const buttonClass =
  "flex min-h-12 items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-center text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent";

export function BotMenu({ items, onNavigate }: BotMenuProps) {
  return (
    <nav aria-label="Menu do AcoPlay" className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const content = (
          <>
            <span aria-hidden>{item.emoji}</span>
            {item.label}
          </>
        );
        const className = cn(buttonClass, item.wide && "col-span-2");
        if (item.kind === "link") {
          return (
            <Link key={item.href} href={item.href} className={className} onClick={onNavigate}>
              {content}
            </Link>
          );
        }
        return (
          <a
            key={item.href}
            href={item.href}
            className={className}
            onClick={onNavigate}
            {...(item.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {content}
          </a>
        );
      })}
    </nav>
  );
}
