import { beforeEach, describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { getCurrentUser } from "@/lib/auth";
import { POST, GET } from "./route";
import prisma from "@/lib/prisma";

describe("POST /api/transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Lunch",
        type: "EXPENSE",
        amount: 1000,
        date: "2026-10-08",
        categoryId: "category-123",
        currency: "THB",
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });
  });

  it("should create a transaction for an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const createdTransaction = {
      id: "transaction-123",
      title: "Lunch",
      type: "EXPENSE",
      amount: 1000,
      date: new Date("2026-10-08"),
      note: null,
      userId: "user-123",
      categoryId: "category-123",
      currency: "THB",
    };

    vi.mocked(prisma.transaction.create).mockResolvedValue(
      createdTransaction as never,
    );

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Lunch",
        type: "EXPENSE",
        amount: 1000,
        date: "2026-10-08",
        categoryId: "category-123",
        currency: "THB",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body).toEqual({
      id: "transaction-123",
      title: "Lunch",
      type: "EXPENSE",
      amount: 1000,
      date: "2026-10-08T00:00:00.000Z",
      note: null,
      userId: "user-123",
      categoryId: "category-123",
      currency: "THB",
    });

    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: {
        title: "Lunch",
        type: "EXPENSE",
        amount: 1000,
        date: new Date("2026-10-08"),
        note: null,
        userId: "user-123",
        categoryId: "category-123",
        currency: "THB",
      },
    });
  });

  it("should return 400 for invalid transaction data", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "",
        type: "EXPENSE",
        amount: 0,
        date: "2026-10-08",
        categoryId: "category-123",
        currency: "THB",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    expect(await response.json()).toEqual({
      error: "Title is required.",
    });

    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid currency", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Lunch",
        type: "EXPENSE",
        amount: 1000,
        date: "2026-10-08",
        categoryId: "category-123",
        currency: "EUR",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    expect(await response.json()).toEqual({
      error: "Invalid currency.",
    });

    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid transaction type", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Lunch",
        type: "INVALID",
        amount: 1000,
        date: "2026-10-08",
        categoryId: "category-123",
        currency: "THB",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    expect(await response.json()).toEqual({
      error: "Invalid transaction type.",
    });

    expect(prisma.transaction.create).not.toHaveBeenCalled();
  });
});

describe("GET /api/transactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "GET",
    });

    const response = await GET(request);

    expect(response.status).toBe(401);

    expect(await response.json()).toEqual({
      error: "Unauthorized",
    });

    expect(prisma.transaction.findMany).not.toHaveBeenCalled();
    expect(prisma.transaction.count).not.toHaveBeenCalled();
  });
  it("should return transactions and pagination for an authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const mockTransactions = [
      {
        id: "transaction-123",
        title: "Lunch",
        type: "EXPENSE",
        amount: 1000,
        date: new Date("2026-10-08"),
        userId: "user-123",
        categoryId: "category-123",
        category: {
          id: "category-123",
          name: "Food",
          icon: "Food",
          color: "#FF9800",
        },
      },
    ];

    vi.mocked(prisma.transaction.findMany).mockResolvedValue(
      mockTransactions as never,
    );

    vi.mocked(prisma.transaction.count).mockResolvedValue(1);

    const request = new Request("http://localhost:3000/api/transactions", {
      method: "GET",
    });

    const response = await GET(request);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.transactions).toHaveLength(1);
    expect(body.transactions[0].title).toBe("Lunch");

    expect(body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-123",
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      skip: 0,
      take: 10,
    });

    expect(prisma.transaction.count).toHaveBeenCalledWith({
      where: {
        userId: "user-123",
      },
    });
  });

  it("should apply custom pagination parameters", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.transaction.count).mockResolvedValue(12);

    const request = new Request(
      "http://localhost:3000/api/transactions?page=2&limit=5",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.pagination).toEqual({
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-123",
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      skip: 5,
      take: 5,
    });

    expect(prisma.transaction.count).toHaveBeenCalledWith({
      where: {
        userId: "user-123",
      },
    });
  });

  it("should limit the maximum number of transactions to 50", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.transaction.count).mockResolvedValue(100);

    const request = new Request(
      "http://localhost:3000/api/transactions?page=1&limit=100",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body.pagination).toEqual({
      page: 1,
      limit: 50,
      total: 100,
      totalPages: 2,
    });

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-123",
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      skip: 0,
      take: 50,
    });
  });

  it("should filter transactions by startDate and endDate", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    vi.mocked(prisma.transaction.findMany).mockResolvedValue([] as never);
    vi.mocked(prisma.transaction.count).mockResolvedValue(0);

    const request = new Request(
      "http://localhost:3000/api/transactions?startDate=2026-10-01&endDate=2026-10-08",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);

    const expectedWhere = {
      userId: "user-123",
      date: {
        gte: new Date("2026-10-01"),
        lt: new Date("2026-10-09"),
      },
    };

    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: expectedWhere,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      skip: 0,
      take: 10,
    });

    expect(prisma.transaction.count).toHaveBeenCalledWith({
      where: expectedWhere,
    });
  });
});
