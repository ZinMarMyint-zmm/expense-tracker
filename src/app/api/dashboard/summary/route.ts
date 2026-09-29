import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import { fetchExchangeRates, convertCurrency } from "@/lib/exchangeRate";
import { type Currency } from "@/lib/currency";

// GET /api/dashboard/summary
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") as Currency;
    const validCurrencies: Currency[] = ["USD", "MMK", "THB", "JPY"];

    if (!validCurrencies.includes(currency)) {
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    }
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
      select: {
        type: true,
        amount: true,
        currency: true,
      },
    });
    const rates = await fetchExchangeRates();

    const summary = transactions.reduce<
  {
    type: "INCOME" | "EXPENSE";
    _sum: { amount: number };
  }[]
>((acc, transaction) => {
  const convertedAmount = convertCurrency(
    Number(transaction.amount),
    transaction.currency,
    currency,
    rates,
  );

  const existing = acc.find(
    (item) => item.type === transaction.type,
  );

  if (existing) {
    existing._sum.amount += convertedAmount;
  } else {
    acc.push({
      type: transaction.type,
      _sum: {
        amount: convertedAmount,
      },
    });
  }

  return acc;
}, []);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch summary", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
