export interface BotMenuItem {
  href: string;
  emoji: string;
  label: string;
  /** Ocupa a linha inteira (como no bot); false = divide a linha com o vizinho. */
  wide: boolean;
  /** link = navegação do Next; native = <a> comum (rota de servidor); external = nova aba. */
  kind: "link" | "native" | "external";
}

export function getBotMenuItems(groupUrl: string | null): BotMenuItem[] {
  const items: BotMenuItem[] = [
    { href: "/buscar?tipo=filme", emoji: "🔎", label: "Buscar filme", wide: true, kind: "link" },
    { href: "/buscar?tipo=serie", emoji: "📺", label: "Buscar série", wide: true, kind: "link" },
    { href: "/aleatorio", emoji: "🎲", label: "Escolha um filme pra mim", wide: true, kind: "native" },
    { href: "/populares", emoji: "🔥", label: "Mais procurados", wide: false, kind: "link" },
    { href: "/recentes", emoji: "🆕", label: "Recentes", wide: false, kind: "link" },
    { href: "/favoritos", emoji: "❤️", label: "Meus favoritos", wide: true, kind: "link" },
    { href: "/solicitar", emoji: "📬", label: "Solicitar conteúdo", wide: true, kind: "link" },
    { href: "/smart-tv", emoji: "📺", label: "Assista na sua Smart TV", wide: true, kind: "link" },
  ];
  if (groupUrl) {
    items.push({ href: groupUrl, emoji: "👥", label: "Entre no nosso grupo", wide: true, kind: "external" });
  }
  return items;
}
