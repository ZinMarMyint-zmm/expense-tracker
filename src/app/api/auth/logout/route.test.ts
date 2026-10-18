import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockDeleteCookie } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockDeleteCookie: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: mockGet,
    delete: mockDeleteCookie,
  })),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    session: {
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  SESSION_COOKIE_NAME: "session",
}));

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(undefined);
  });

  it("should delete the session and cookie when a session exists", async () => {
    mockGet.mockReturnValue({
      value: "session-123",
    });

    vi.mocked(prisma.session.delete).mockResolvedValue({
      id: "session-123",
    } as never);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Logged out successfully",
    });

    expect(prisma.session.delete).toHaveBeenCalledWith({
      where: {
        id: "session-123",
      },
    });

    expect(mockDeleteCookie).toHaveBeenCalledWith("session");
  });

  it("should clear the cookie when no session exists", async () => {
    mockGet.mockReturnValue(undefined);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Logged out successfully",
    });

    expect(prisma.session.delete).not.toHaveBeenCalled();
    expect(mockDeleteCookie).toHaveBeenCalledWith("session");
  });

  it("should return 500 and clear the cookie when session deletion fails", async () => {
    mockGet.mockReturnValue({
      value: "session-123",
    });

    vi.mocked(prisma.session.delete).mockRejectedValue(
      new Error("Database error"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = await POST();

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: "Internal Server Error",
      });

      expect(mockDeleteCookie).toHaveBeenCalledWith("session");
    } finally {
      consoleError.mockRestore();
    }
  });
});