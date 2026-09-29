import { Currency } from "@/lib/currency";

export async function getDashboardSummary(currency: Currency) {
    const response = await fetch(`/api/dashboard/summary?currency=${currency}`);
    if (!response.ok) {
        throw new Error("Failed to fetch summary")
    }
    return response.json()
}


export async function getMonthlyData(currency: Currency) {
    const response = await fetch(`/api/dashboard/monthly?currency=${currency}`);
    if (!response.ok) {
        throw new Error("Failed to fetch monthly data")
    }
    return response.json()
}

export async function getExpenseByCategory(currency: Currency) {
    const response = await fetch(`/api/dashboard/expense-by-category?currency=${currency}`);
    if (!response.ok) {
        throw new Error("Failed to fetch expense by category")
    }
    return response.json()
}