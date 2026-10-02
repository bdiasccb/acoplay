import { describe, expect, it } from "vitest";
import { getBotMenuItems } from "@/lib/bot-menu";

describe("getBotMenuItems", () => {
  it("segue a ordem dos botões do bot", () => {
    expect(getBotMenuItems(null).map((item) => item.label)).toEqual([
      "Buscar filme",
      "Buscar série",
      "Escolha um filme pra mim",
      "Mais procurados",
      "Recentes",
      "Meus favoritos",
      "Solicitar conteúdo",
      "Assista na sua Smart TV",
    ]);
  });

  it("só mostra o grupo quando existe link, abrindo em nova aba", () => {
    const grupo = getBotMenuItems("https://t.me/exemplo").at(-1);
    expect(grupo).toMatchObject({ label: "Entre no nosso grupo", href: "https://t.me/exemplo", kind: "external" });
  });

  it("usa link comum para o sorteio, que é uma rota de servidor", () => {
    const sorteio = getBotMenuItems(null).find((item) => item.href === "/aleatorio");
    expect(sorteio?.kind).toBe("native");
  });

  it("coloca Mais procurados e Recentes lado a lado, como no bot", () => {
    const estreitos = getBotMenuItems(null).filter((item) => !item.wide).map((item) => item.label);
    expect(estreitos).toEqual(["Mais procurados", "Recentes"]);
  });
});
