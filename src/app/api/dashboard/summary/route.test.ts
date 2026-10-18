import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/exchangeRate", () => ({
  fetchExchangeRates: vi.fn(),
  convertCurrency: vi.fn(),
}));

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  fetchExchangeRates,
  convertCurrency,
} from "@/lib/exchangeRate";

describe("GET /api/dashboard/summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=USD"),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
  });

  it("returns 400 when the currency is invalid", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=EUR"),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid currency" });
    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
  });

  it("returns income and expense totals converted to the selected currency", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([
      { type: "INCOME", amount: 100, currency: "USD" },
      { type: "INCOME", amount: 200, currency: "THB" },
      { type: "EXPENSE", amount: 50, currency: "USD" },
    ] as never);

    const rates = { USD: 1, THB: 35, MMK: 2100, JPY: 150 };
    vi.mocked(fetchExchangeRates).mockResolvedValue(rates as never);

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(50);

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=USD"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([
      { type: "INCOME", _sum: { amount: 110 } },
      { type: "EXPENSE", _sum: { amount: 50 } },
    ]);

    expect(convertCurrency).toHaveBeenCalledTimes(3);
    expect(fetchExchangeRates).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when there are no transactions", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([] as never);
    vi.mocked(fetchExchangeRates).mockResolvedValue(
      { USD: 1, THB: 35, MMK: 2100, JPY: 150 } as never,
    );

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=USD"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
    expect(convertCurrency).not.toHaveBeenCalled();
  });

  it("returns 500 when fetching exchange rates fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([] as never);
    vi.mocked(fetchExchangeRates).mockRejectedValue(
      new Error("Exchange rate service unavailable"),
    );

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=USD"),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Internal server error",
    });
  });

  it("returns 500 when the database query fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await GET(
      new Request("http://localhost/api/dashboard/summary?currency=USD"),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Internal server error",
    });
  });
});