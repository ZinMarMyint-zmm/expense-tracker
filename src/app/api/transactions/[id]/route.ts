import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/transactions/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
        
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Failed to get transaction", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
// PUT /api/transactions/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, type, amount, date, note, categoryId } = body;

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
          error:
            "PUT requires all mandatory fields: title, type, amount, date, categoryId",
        },
        { status: 400 },
      );
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const replacedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        title,
        type,
        amount: Number(amount),
        date: new Date(date),
        note: note || null,
        categoryId,
      },
    });

    return NextResponse.json(replacedTransaction, { status: 200 });
  } catch (error) {
    console.error("Failed to update transaction", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const deletedTransaction = await prisma.transaction.delete({
      where: { id: transaction.id },
    });
    return NextResponse.json(
      {
        message: "Transaction deleted successfully",
        id: deletedTransaction.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete transaction", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Transaction not found." },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
