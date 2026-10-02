"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuSheet } from "@/components/layout/menu-sheet";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", emoji: "🏠", label: "Início" },
  { href: "/buscar", emoji: "🔎", label: "Buscar" },
  { href: "/favoritos", emoji: "❤️", label: "Favoritos" },
];

const itemClass = "flex min-h-14 flex-1 flex-col items-center gap-0.5 py-2 text-xs";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(itemClass, active ? "text-primary" : "text-muted-foreground")}
          >
            <span aria-hidden className="text-lg">
              {item.emoji}
            </span>
            {item.label}
          </Link>
        );
      })}
      <MenuSheet>
        <button type="button" className={cn(itemClass, "text-muted-foreground")}>
          <span aria-hidden className="text-lg">
            ☰
          </span>
          Menu
        </button>
      </MenuSheet>
    </nav>
  );
}
