export type Rng = () => number;

export function randomInt(min: number, max: number, rng: Rng = Math.random): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pickRandom<T>(items: readonly T[], rng: Rng = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[randomInt(0, items.length - 1, rng)];
}
