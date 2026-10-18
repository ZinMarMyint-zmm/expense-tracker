import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
  },
}));

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { POST } from "./route";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when required fields are missing", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Name, email and password are required.",
    });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("should return 400 when password is shorter than 6 characters", async () => {
    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "12345",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Password must be at least 6 characters",
    });

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("should return 400 when email is already registered", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing-user",
      name: "Existing User",
      email: "test@example.com",
      passwordHash: "existing-hash",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "TEST@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Email already registered",
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("should register a user successfully", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "TEST@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      message: "User registered successfully",
      user: {
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
      },
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed-password",
      },
    });
  });

  it("should not return the password hash in the response", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed-password",
    } as never);

    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user).not.toHaveProperty("passwordHash");
    expect(JSON.stringify(data)).not.toContain("hashed-password");
  });

  it("should return 500 when database creation fails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
    vi.mocked(prisma.user.create).mockRejectedValue(
      new Error("Database error"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
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