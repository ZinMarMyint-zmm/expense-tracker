import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get /api/categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany()
        return NextResponse.json(categories, {status:200})
    }
    catch (error) {
        console.error("Failed to fetch categories",error)
        return NextResponse.json({error:"Internal Server Error"},{status : 500})
    }
    
}

// POST /api/categories
export async function POST(request: Request) {
    try {
        const { name, icon, color } = await request.json()
        if (!name || !icon || !color) {
            return NextResponse.json({error:"Name, icon and color are required."},{status:400})
        }
        const newCategory = await prisma.category.create({
            data: {name,icon,color}
        })
        return NextResponse.json(newCategory,{status:201})
    } catch (error) {
        console.error("Failed creating category", error)
        return NextResponse.json({error:"Internal Server Error"},{status : 500})
    }
}