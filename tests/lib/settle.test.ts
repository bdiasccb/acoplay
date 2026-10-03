import { describe, expect, it, vi } from "vitest";
import { settle } from "@/lib/settle";

describe("settle", () => {
  it("devolve o valor quando a promessa resolve", async () => {
    await expect(settle(Promise.resolve(42))).resolves.toBe(42);
  });

  it("devolve null e registra o erro quando a promessa falha", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(settle(Promise.reject(new Error("falhou")))).resolves.toBeNull();
    expect(log).toHaveBeenCalledOnce();
  });
});
