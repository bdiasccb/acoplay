import "server-only";
import { z } from "zod";

type EnvSource = Record<string, string | undefined>;

const tmdbSchema = z.object({
  TMDB_READ_TOKEN: z.string({ error: "TMDB_READ_TOKEN não configurado" }).min(1, "TMDB_READ_TOKEN não configurado"),
  TMDB_API_BASE: z.url().default("https://api.themoviedb.org/3"),
});

const telegramSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string({ error: "TELEGRAM_BOT_TOKEN não configurado" }).min(1, "TELEGRAM_BOT_TOKEN não configurado"),
  TELEGRAM_CHAT_ID: z.string({ error: "TELEGRAM_CHAT_ID não configurado" }).min(1, "TELEGRAM_CHAT_ID não configurado"),
  TELEGRAM_API_BASE: z.url().default("https://api.telegram.org"),
});

export type TmdbEnv = z.infer<typeof tmdbSchema>;
export type TelegramEnv = z.infer<typeof telegramSchema>;

export function getTmdbEnv(source: EnvSource = process.env): TmdbEnv {
  return tmdbSchema.parse(source);
}

export function getTelegramEnv(source: EnvSource = process.env): TelegramEnv {
  return telegramSchema.parse(source);
}
