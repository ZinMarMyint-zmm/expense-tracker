import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);
    const aggregates = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const payload = aggregates.map((group) => {
      const categoryMatch = categories.find((c) => c.id === group.categoryId);

      return {
        category: categoryMatch?.name || "Uncategorized",
        amount: group._sum.amount ? Number(group._sum.amount) : 0,
      };
    });
    payload.sort((a, b) => b.amount - a.amount);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Category analytics endpoint error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
