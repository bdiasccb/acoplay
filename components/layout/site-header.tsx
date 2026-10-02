import Link from "next/link";
import { MenuSheet } from "@/components/layout/menu-sheet";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/populares", label: "Mais procurados" },
  { href: "/recentes", label: "Recentes" },
  { href: "/favoritos", label: "Favoritos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="inline-flex min-h-10 items-center text-lg font-bold">
          🎬 AcoPlay
        </Link>
        <nav aria-label="Principal" className="hidden flex-1 gap-2 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center px-2 text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-xl hover:bg-accent"
          >
            🔎
          </Link>
          <MenuSheet>
            <button
              type="button"
              aria-label="Abrir menu"
              className="hidden min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-xl hover:bg-accent md:inline-flex"
            >
              ☰
            </button>
          </MenuSheet>
        </div>
      </div>
    </header>
  );
}
