import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PUT, DELETE, GET } from "./route";

describe("PUT /api/transactions/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Lunch",
          type: "EXPENSE",
          amount: 1200,
          date: "2026-10-08",
          categoryId: "category-123",
        }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });

    expect(prisma.transaction.findFirst).not.toHaveBeenCalled();
    expect(prisma.transaction.update).not.toHaveBeenCalled();
  });

  it("should update a transaction for an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue({
      id: "transaction-123",
      userId: "user-123",
    } as never);

    const updatedTransaction = {
      id: "transaction-123",
      title: "Dinner",
      type: "EXPENSE",
      amount: 1200,
      date: new Date("2026-10-08"),
      note: "Team dinner",
      userId: "user-123",
      categoryId: "category-123",
      currency: "THB",
    };

    vi.mocked(prisma.transaction.update).mockResolvedValue(
      updatedTransaction as never,
    );

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Dinner",
          type: "EXPENSE",
          amount: 1200,
          date: "2026-10-08",
          note: "Team dinner",
          categoryId: "category-123",
        }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toEqual({
      ...updatedTransaction,
      date: "2026-10-08T00:00:00.000Z",
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-123",
        userId: "user-123",
      },
    });

    expect(prisma.transaction.update).toHaveBeenCalledWith({
      where: {
        id: "transaction-123",
      },
      data: {
        title: "Dinner",
        type: "EXPENSE",
        amount: 1200,
        date: new Date("2026-10-08"),
        note: "Team dinner",
        categoryId: "category-123",
      },
    });
  });

  it("should return 404 when the transaction is not found", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-999",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Dinner",
          type: "EXPENSE",
          amount: 1200,
          date: "2026-10-08",
          categoryId: "category-123",
        }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "transaction-999" }),
    });

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "Transaction not found",
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-999",
        userId: "user-123",
      },
    });

    expect(prisma.transaction.update).not.toHaveBeenCalled();
  });

  it("should return 400 when the amount is invalid", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Dinner",
          type: "EXPENSE",
          amount: 0,
          date: "2026-10-08",
          categoryId: "category-123",
        }),
      },
    );

    const response = await PUT(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(400);

    expect(await response.json()).toEqual({
      error:
        "PUT requires all mandatory fields: title, type, amount, date, categoryId",
    });

    expect(prisma.transaction.findFirst).not.toHaveBeenCalled();
    expect(prisma.transaction.update).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/transactions/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });

    expect(prisma.transaction.findFirst).not.toHaveBeenCalled();
    expect(prisma.transaction.delete).not.toHaveBeenCalled();
  });

  it("should delete a transaction for an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue({
      id: "transaction-123",
      userId: "user-123",
    } as never);

    vi.mocked(prisma.transaction.delete).mockResolvedValue({
      id: "transaction-123",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(200);

    expect(await response.json()).toEqual({
      message: "Transaction deleted successfully",
      id: "transaction-123",
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-123",
        userId: "user-123",
      },
    });

    expect(prisma.transaction.delete).toHaveBeenCalledWith({
      where: {
        id: "transaction-123",
      },
    });
  });

  it("should return 404 when the transaction is not found", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-999",
      {
        method: "DELETE",
      },
    );

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "transaction-999" }),
    });

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "Transaction not found",
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-999",
        userId: "user-123",
      },
    });

    expect(prisma.transaction.delete).not.toHaveBeenCalled();
  });
});

describe("GET /api/transactions/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
    );

    const response = await GET(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });

    expect(prisma.transaction.findFirst).not.toHaveBeenCalled();
  });

  it("should return 404 when the transaction is not found", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-999",
    );

    const response = await GET(request, {
      params: Promise.resolve({ id: "transaction-999" }),
    });

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "Transaction not found",
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-999",
        userId: "user-123",
      },
    });
  });

  it("should return a transaction for an authenticated user", async () => {
    const transaction = {
      id: "transaction-123",
      title: "Lunch",
      type: "EXPENSE",
      amount: 250,
      date: new Date("2026-10-10T00:00:00.000Z"),
      note: "Lunch with a friend",
      categoryId: "category-123",
      userId: "user-123",
    };

    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findFirst).mockResolvedValue(
      transaction as never,
    );

    const request = new Request(
      "http://localhost:3000/api/transactions/transaction-123",
    );

    const response = await GET(request, {
      params: Promise.resolve({ id: "transaction-123" }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ...transaction,
      date: transaction.date.toISOString(),
    });

    expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
      where: {
        id: "transaction-123",
        userId: "user-123",
      },
    });
  });
});
