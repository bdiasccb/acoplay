import { describe, expect, it } from "vitest";
import { titleHref } from "@/lib/routes";

describe("titleHref", () => {
  it("monta o link de filme e de série", () => {
    expect(titleHref("filme", 671)).toBe("/filme/671");
    expect(titleHref("serie", 1396)).toBe("/serie/1396");
  });
});
