import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

import { getCurrentUser } from "@/lib/auth";
import { GET } from "./route";

describe("GET /api/auth/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when user is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      message: "Unauthorized",
    });
  });

  it("should return the authenticated user's data", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: "USER",
      passwordHash: "hashed-password",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      user: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      },
    });
  });

  it("should not expose the password hash in the response", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      role: "USER",
      passwordHash: "hashed-password",
    } as Awaited<ReturnType<typeof getCurrentUser>>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(data)).not.toContain("hashed-password");
  });

  it("should return 500 when getCurrentUser throws an error", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(
      new Error("Authentication error"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      const response = await GET();

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        message: "Internal Server Error",
      });
    } finally {
      consoleError.mockRestore();
    }
  });
});
