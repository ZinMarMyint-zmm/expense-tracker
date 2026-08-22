import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const SESSION_COOKIE_NAME = "session";

export async function createSession(userId: string) {
  const sessionId = randomUUID();

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
}

export async function getCurrentUser() {
    const cookiesStore = await cookies();

    const sessionId = cookiesStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
        return null;
    }

    const session = await prisma.session.findUnique({
        where: {
            id:sessionId
        },
        include: {
            user:true
        }
    })

    if (!session) {
        return null;
    }

    if (session.expiresAt < new Date()) {
        return null;
    }

    return session.user
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return user;
}