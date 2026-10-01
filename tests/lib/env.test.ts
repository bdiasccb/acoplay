import { describe, expect, it } from "vitest";
import { getTelegramEnv, getTmdbEnv } from "@/lib/env";

describe("getTmdbEnv", () => {
  it("usa a URL padrão do TMDB quando só o token é informado", () => {
    expect(getTmdbEnv({ TMDB_READ_TOKEN: "abc" })).toEqual({
      TMDB_READ_TOKEN: "abc",
      TMDB_API_BASE: "https://api.themoviedb.org/3",
    });
  });

  it("aceita uma URL base alternativa (usada nos testes E2E)", () => {
    const env = getTmdbEnv({ TMDB_READ_TOKEN: "abc", TMDB_API_BASE: "http://127.0.0.1:4010/3" });
    expect(env.TMDB_API_BASE).toBe("http://127.0.0.1:4010/3");
  });

  it("falha com mensagem clara quando o token não existe", () => {
    expect(() => getTmdbEnv({})).toThrow(/TMDB_READ_TOKEN/);
  });
});

describe("getTelegramEnv", () => {
  it("usa a URL padrão da API do Telegram", () => {
    const env = getTelegramEnv({ TELEGRAM_BOT_TOKEN: "t", TELEGRAM_CHAT_ID: "123" });
    expect(env.TELEGRAM_API_BASE).toBe("https://api.telegram.org");
  });

  it("falha quando falta o chat de destino", () => {
    expect(() => getTelegramEnv({ TELEGRAM_BOT_TOKEN: "t" })).toThrow(/TELEGRAM_CHAT_ID/);
  });
});
