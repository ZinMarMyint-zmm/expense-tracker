import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: {
      groupBy: vi.fn(),
    },
  },
}));

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

describe("GET /api/dashboard/monthly", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
  });

  it("returns six months with income, expense, and balance", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-12T12:00:00.000Z"));

    try {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: "user-1",
      } as Awaited<ReturnType<typeof getCurrentUser>>);

      vi.mocked(prisma.transaction.groupBy).mockResolvedValue([
        {
          date: new Date("2026-06-05T00:00:00.000Z"),
          type: "INCOME",
          _sum: { amount: 1000 },
        },
        {
          date: new Date("2026-06-10T00:00:00.000Z"),
          type: "EXPENSE",
          _sum: { amount: 300 },
        },
        {
          date: new Date("2026-10-03T00:00:00.000Z"),
          type: "EXPENSE",
          _sum: { amount: 200 },
        },
      ] as never);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(6);

      expect(body).toContainEqual({
        month: "Jun 2026",
        INCOME: 1000,
        EXPENSE: 300,
        BALANCE: 700,
      });

      expect(body).toContainEqual({
        month: "Oct 2026",
        INCOME: 0,
        EXPENSE: 200,
        BALANCE: -200,
      });

      expect(body).toContainEqual({
        month: "Jul 2026",
        INCOME: 0,
        EXPENSE: 0,
        BALANCE: 0,
      });

      expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          by: ["date", "type"],
          where: expect.objectContaining({
            userId: "user-1",
            date: expect.objectContaining({
              gte: new Date("2026-05-01T00:00:00.000Z"),
              lt: new Date("2026-11-01T00:00:00.000Z"),
            }),
          }),
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns 500 when the database query fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.groupBy).mockRejectedValue(
      new Error("Database error"),
    );

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Internal Server Error" });
  });
});