import { describe, expect, it } from "vitest";
import { tmdbImage } from "@/lib/tmdb/images";

describe("tmdbImage", () => {
  it("monta a URL com o tamanho pedido", () => {
    expect(tmdbImage("/abc.jpg", "w342")).toBe("https://image.tmdb.org/t/p/w342/abc.jpg");
  });

  it("devolve null quando não há imagem", () => {
    expect(tmdbImage(null, "w342")).toBeNull();
    expect(tmdbImage(undefined, "w92")).toBeNull();
    expect(tmdbImage("", "w92")).toBeNull();
  });
});
