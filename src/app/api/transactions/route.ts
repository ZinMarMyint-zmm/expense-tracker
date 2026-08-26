import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/transactions
export async function GET(request: Request) {
  try {
    //current user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);

    //filter
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter: {
      gte?: Date;
      lt?: Date;
    } = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      dateFilter.lt = end;
    }

    //pagination
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );

    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
      ...(startDate || endDate ? { date: dateFilter } : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.transaction.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 },
    );
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
