import { describe, expect, it } from "vitest";
import { pickRandom, randomInt } from "@/lib/random";

describe("randomInt", () => {
  it("cobre os dois extremos do intervalo", () => {
    expect(randomInt(1, 20, () => 0)).toBe(1);
    expect(randomInt(1, 20, () => 0.999999)).toBe(20);
  });

  it("devolve o próprio valor quando min = max", () => {
    expect(randomInt(5, 5, () => 0.7)).toBe(5);
  });
});

describe("pickRandom", () => {
  it("escolhe um item conforme o gerador", () => {
    expect(pickRandom(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickRandom(["a", "b", "c"], () => 0.5)).toBe("b");
    expect(pickRandom(["a", "b", "c"], () => 0.99)).toBe("c");
  });

  it("devolve undefined para lista vazia", () => {
    expect(pickRandom([], () => 0.5)).toBeUndefined();
  });
});
