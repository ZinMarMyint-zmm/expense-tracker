import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Transaction } from "@/types/transaction";
import { formatDate } from "./formatDate";
import { convertCurrency, type ExchangeRate } from "@/lib/exchangeRate";
import { formatCurrency } from "@/lib/currencyFormatter";
import { type Currency } from "@/lib/currency";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export function generateTransactionPDF(
  transactions: Transaction[],
  selectedCurrency: string,
  rates: ExchangeRate[]
) {
  const doc = new jsPDF();
  const targetCurrency = selectedCurrency as Currency;

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => {
      const converted = convertCurrency(transaction.amount, transaction.currency, targetCurrency, rates);
      return total + converted;
    }, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => {
      const converted = convertCurrency(transaction.amount, transaction.currency, targetCurrency, rates);
      return total + converted;
    }, 0);

  const balance = totalIncome - totalExpense;

  doc.setFontSize(22);
  doc.text("Expense Tracker", 14, 20);
  doc.setFontSize(12);
  doc.text("Transaction Report", 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [["Summary Type", "Amount"]],
    body: [
      ["Total Income", formatCurrency(totalIncome, targetCurrency)],
      ["Total Expense", formatCurrency(totalExpense, targetCurrency)],
      ["Balance", formatCurrency(balance, targetCurrency)],
    ],
    theme: "striped",
    headStyles: { fillColor: [107, 96, 84] },
    margin: { left: 14 },
    styles: { font: "Helvetica" }
  });

  const tableHeaders = [["Title", "Category", "Type", "Amount", "Date", "Note"]];
  
  const tableRows = transactions.map((transaction) => {
    const formattedAmount = formatCurrency(
      convertCurrency(transaction.amount, transaction.currency, targetCurrency, rates),
      targetCurrency
    );

    return [
      transaction.title,
      transaction.category?.name ?? "",
      transaction.type,
      formattedAmount,
      formatDate(transaction.date),
      transaction.note ?? "",
    ];
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: tableHeaders,
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [248, 159, 27] }, 
    margin: { left: 14 },
    styles: { font: "Helvetica", overflow: "linebreak" },
  });

  doc.save("transactions.pdf");
}
