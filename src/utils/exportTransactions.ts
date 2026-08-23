import { Transaction } from "@/types/transaction";
import { formatDate } from "./formatDate";

export function exportTransactions(transactions: Transaction[]) {
    const headers = [
        "Title",
        "Category",
        "Type",
        "Amount",
        "Date",
        "Note"
    ];

    const rows = transactions.map(transaction => [
        transaction.title,
        transaction.category?.name ?? "",
        transaction.type,
        transaction.amount,
        formatDate(transaction.date),
        transaction.note ?? ""
    ]);

    const csvContent = [
        headers,
        ...rows
    ].map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
    ).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a")
    link.href = url;
    link.download = "transaction.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}