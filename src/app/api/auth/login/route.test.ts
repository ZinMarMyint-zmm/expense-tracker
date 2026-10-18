import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  createSession: vi.fn(),
}));

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { POST } from "./route";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when required fields are missing", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Email and password are required",
    });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should return 401 when the user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "unknown@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Invalid email or password",
    });

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should return 401 when the password is incorrect", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
    } as never);

    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "wrong-password",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Invalid email or password",
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should normalize email to lowercase when finding the user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "TEST@EXAMPLE.COM",
          password: "password123",
        }),
      },
    );

    await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("should log in successfully and create a session", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
    } as never);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(createSession).mockResolvedValue(undefined);

    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "TEST@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Login successful",
      user: {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );
    expect(createSession).toHaveBeenCalledWith("user-123");
  });

  it("should return 500 when session creation fails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
    } as never);

    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(createSession).mockRejectedValue(
      new Error("Session creation failed"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Internal Server Error",
    });

    consoleError.mockRestore();
  });
});