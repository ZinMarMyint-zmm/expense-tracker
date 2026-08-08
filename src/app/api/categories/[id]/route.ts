import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type RouteParams = {
    params: Promise<{ id: string }>
};

// PUT /api/categories/[id]
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json()

        const { name, icon, color } = body;

        if (!name || !icon || !color) {
            return NextResponse.json(
                {
                    error:"PUT requires all mandatory fields: name, icon, color",
                },{status:400}
            )
        }

        const replacedCategory = await prisma.category.update({
            where: { id },
            data: {
                name,
                icon,
                color
            }
        })
        return NextResponse.json(replacedCategory,{status:200})
    } catch (error) {
        console.error("Failed to update Category", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return NextResponse.json({error:"Category not found."},{status: 404})
        }
        return NextResponse.json({error:"Internal server error"},{status:500})
    }
}

// DELETE /api/categories/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const deletedCategory = await prisma.category.delete({
            where: { id },
        })
        return NextResponse.json({message: "Category deleted successfully", id: deletedCategory.id},{status:200})
    } catch (error) {
        console.error("Failed to delete category", error)
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Category not found" },
                {status: 404}
            )
        }
        return NextResponse.json(
            { error: "Internal server error" },
            {status: 500}
        )
    }
}

