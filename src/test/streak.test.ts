import { describe, it, expect } from "vitest";
import { deriveStreak } from "@/store/koreStore";
import type { CheckIn } from "@/store/koreStore";

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};
const ci = (daysAgo: number): CheckIn => ({ date: iso(daysAgo), type: "morning", mood: 4, notes: "" });

describe("deriveStreak", () => {
  it("returns 0 for no check-ins", () => {
    expect(deriveStreak([]).streak).toBe(0);
  });
  it("counts consecutive days ending today", () => {
    expect(deriveStreak([ci(2), ci(1), ci(0)]).streak).toBe(3);
  });
  it("keeps streak alive if last check-in was yesterday", () => {
    expect(deriveStreak([ci(2), ci(1)]).streak).toBe(2);
  });
  it("breaks streak after a two-day gap", () => {
    expect(deriveStreak([ci(5), ci(4), ci(3)]).streak).toBe(0);
  });
  it("ignores duplicate same-day check-ins", () => {
    expect(deriveStreak([ci(1), ci(0), ci(0)]).streak).toBe(2);
  });
  it("streak broken by a missed middle day", () => {
    expect(deriveStreak([ci(3), ci(1), ci(0)]).streak).toBe(2);
  });
  it("reports the most recent check-in date", () => {
    expect(deriveStreak([ci(3), ci(0)]).lastCheckInDate).toBe(iso(0));
  });
});
