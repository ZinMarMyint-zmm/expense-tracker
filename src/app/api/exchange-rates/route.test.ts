
import { describe, it, expect, vi, afterEach } from "vitest";
import { GET } from "./route";

describe("GET /api/exchange-rates", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return exchange rates successfully", async () => {
    const mockRates = [
      { base: "USD", quote: "THB", rate: 33.5, date: "2026-10-07" },
      { base: "USD", quote: "JPY", rate: 150, date: "2026-10-07" },
    ];

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockRates,
    } as Response);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockRates);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.frankfurter.dev/v2/rates?base=USD&quotes=USD,MMK,THB,JPY",
    );
  });

  it("should return 500 when the external API fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "Failed to fetch exchange rates",
    });
  });

  it("should return 500 when fetch throws an error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Network error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: "Failed to fetch exchange rates",
    });
  });
});
