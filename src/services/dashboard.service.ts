export async function getDashboardSummary() {
    const response = await fetch("/api/dashboard/summary");
    if (!response.ok) {
        throw new Error("Failed to fetch summary")
    }
    return response.json()
}


export async function getMonthlyData() {
    const response = await fetch("/api/dashboard/monthly");
    if (!response.ok) {
        throw new Error("Failed to fetch monthly data")
    }
    return response.json()
}

export async function getExpenseByCategory() {
    const response = await fetch("/api/dashboard/expense-by-category");
    if (!response.ok) {
        throw new Error("Failed to fetch expense by category")
    }
    return response.json()
}