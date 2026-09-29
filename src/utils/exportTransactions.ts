import { Transaction } from "@/types/transaction";
import { formatDate } from "./formatDate";
import { convertCurrency, ExchangeRate } from "@/lib/exchangeRate";
import { formatCurrency } from "@/lib/currencyFormatter";
import { Currency } from "@/lib/currency";

export function exportTransactions(
  transactions: Transaction[],
  selectedCurrency: string,
  rates: ExchangeRate[],
) {
    const headers = ["Title", "Category", "Type", "Amount", "Date", "Note"];
    
    const targetCurrency = selectedCurrency as Currency;

  const rows = transactions.map((transaction) => [
    transaction.title,
    transaction.category?.name ?? "",
    transaction.type,
    formatCurrency(
      convertCurrency(
        transaction.amount,
        transaction.currency,
        targetCurrency,
        rates,
      ),
      targetCurrency,
    ),
    formatDate(transaction.date),
    (transaction.note ?? "").replace(/\r?\n|\r/g, " "),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "transaction.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
