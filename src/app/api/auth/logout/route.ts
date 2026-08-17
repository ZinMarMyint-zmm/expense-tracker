import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
    const cookieStore = await cookies()

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
}