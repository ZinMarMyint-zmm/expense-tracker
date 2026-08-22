import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/transactions
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/transactions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, amount, date, note, categoryId } = body;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const numericAmount = Number(amount);

    if (
      !title ||
      !type ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !date ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          error: "Title, type, amount, date, categoryId are required.",
        },
        { status: 400 },
      );
    }
    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        type,
        amount: Number(amount),
        date: new Date(date),
        note: note || null,
        userId: user.id,
        categoryId,
      },
    });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Failed creating a new transaction", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
