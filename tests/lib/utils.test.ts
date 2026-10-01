import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("junta classes e ignora valores falsos", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("resolve conflitos do Tailwind mantendo a última classe", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
