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
    category: {
      findMany: vi.fn(),
    },
  },
}));

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

describe("GET /api/dashboard/categories", () => {
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
    expect(prisma.category.findMany).not.toHaveBeenCalled();
  });

  it("returns expense totals grouped by category in descending order", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.groupBy).mockResolvedValue([
      {
        categoryId: "cat-food",
        _sum: { amount: 500 },
      },
      {
        categoryId: "cat-transport",
        _sum: { amount: 200 },
      },
      {
        categoryId: "cat-other",
        _sum: { amount: 800 },
      },
    ] as never);

    vi.mocked(prisma.category.findMany).mockResolvedValue([
      { id: "cat-food", name: "Food" },
      { id: "cat-transport", name: "Transport" },
      { id: "cat-other", name: "Other" },
    ] as never);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([
      { category: "Other", amount: 800 },
      { category: "Food", amount: 500 },
      { category: "Transport", amount: 200 },
    ]);

    expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        by: ["categoryId"],
        where: expect.objectContaining({
          type: "EXPENSE",
          userId: "user-1",
        }),
        _sum: { amount: true },
      }),
    );
  });

  it("uses Uncategorized when a category is not found", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.groupBy).mockResolvedValue([
      {
        categoryId: "deleted-category",
        _sum: { amount: 150 },
      },
    ] as never);

    vi.mocked(prisma.category.findMany).mockResolvedValue([] as never);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([
      { category: "Uncategorized", amount: 150 },
    ]);
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