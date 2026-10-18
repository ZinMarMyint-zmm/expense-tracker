import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | undefined;

  try {
    cookieStore = await cookies();

    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Failed to logout", error);

    // Clear the browser cookie even if session deletion fails.
    cookieStore?.delete(SESSION_COOKIE_NAME);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}