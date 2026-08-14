import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type RouteParams = {
  params: Promise<{ id: string }>;
};

//
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error("Get Category Error", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, type, amount, date, note, categoryId } = body;

    if (!title || !type || amount === undefined || !date || !categoryId) {
      return NextResponse.json(
        {
          error:
            "PUT requires all mandatory fields: title, type, amount, date, categoryId",
        },
        { status: 400 },
      );
    }

    const replacedTransaction = await prisma.transaction.update({
      where: { id },
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
    const deletedTransaction = await prisma.transaction.delete({
      where: { id },
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
