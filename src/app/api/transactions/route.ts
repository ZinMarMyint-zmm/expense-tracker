import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/transactions
export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: {
                date: 'desc',
            }
        })
        return NextResponse.json(transactions, {status:200})
    } catch (error) {
        console.error("Failed to fetch transactions", error)
        return NextResponse.json({error: "Internal server error"},{status: 500})
    }
}

// POST /api/transactions
export async function POST(request:Request) {
    try {
        
        const body = await request.json()
        const { title, type, amount, date, note, categoryId } = body

        const TEST_USER_ID = "U0001";

        if (!title || !type || !amount || !date || !categoryId) {
            return NextResponse.json({error: "Title, type, amount, date, userId, categoryId are required."},{status: 400})
        }
        const newTransaction = await prisma.transaction.create({
            data: {
                title,
                type,
                amount:Number(amount),
                date:new Date(date),
                note:note || null,
                userId: TEST_USER_ID,
                categoryId
            }
        })
        return NextResponse.json(newTransaction,{status: 201})
    } catch (error) {
        console.error("Failed creating a new transaction", error)
        return NextResponse.json({error: "Internal server error"},{status : 500})
    }
}

// PUT /api/transactions/[id]
export async function PUT() { }

// DELETE /api/transactions/[id]
export async function DELETE() {}
