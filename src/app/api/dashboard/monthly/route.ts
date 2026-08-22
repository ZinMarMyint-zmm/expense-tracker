import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/dashboard/monthly
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const now = new Date();
    // Start of the month 5 months ago (0:00 AM)
    const startOfRange = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1),
    );

    // all days of the current month
    const endOfRange = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const monthly = await prisma.transaction.groupBy({
      by: ["date", "type"],
      where: {
        userId: user.id,
        date: {
          gte: startOfRange,
          lt: endOfRange,
        },
      },
      _sum: {
        amount: true,
      },
    });

    //Helper formatter to convert Dates to "MMM YYYY"
    const formatToTextMonth = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
    };

    //Initialize the 6 target months using the text string format as keys
    const monthlyMap: Record<string, { INCOME: number; EXPENSE: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      const textMonthStr = formatToTextMonth(d);
      monthlyMap[textMonthStr] = { INCOME: 0, EXPENSE: 0 };
    }

    //Map daily database values into the text month buckets
    monthly.forEach((group) => {
      const textMonthStr = formatToTextMonth(group.date);
      const amount = group._sum.amount ? Number(group._sum.amount) : 0;

      if (monthlyMap[textMonthStr]) {
        monthlyMap[textMonthStr][group.type] += amount;
      }
    });

    //Structure into exact nested array format
    const finalPayload = Object.entries(monthlyMap).map(([month, data]) => {
      const balance = data.INCOME - data.EXPENSE;
      return {
        month: month,
        INCOME: data.INCOME,
        EXPENSE: data.EXPENSE,
        BALANCE: balance,
      };
    });
    return NextResponse.json(finalPayload, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch monthly transactions", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
