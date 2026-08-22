import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

// Get /api/categories
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, icon, color } = await request.json();
    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: "Name, icon and color are required." },
        { status: 400 },
      );
    }
    const newCategory = await prisma.category.create({
      data: { name, icon, color },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed creating category", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
