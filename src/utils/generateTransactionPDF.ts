import jsPDF from "jspdf";
import { Transaction } from "@/types/transaction";
import { formatDate } from "./formatDate";

export function generateTransactionPDF(transactions: Transaction[]) {
  const doc = new jsPDF();

  //calculate summary
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = totalIncome - totalExpense;

  //Headers
  doc.setFontSize(20);
  doc.text("Expense Tracker", 20, 20);

  doc.setFontSize(12);
  doc.text("Transaction Report", 20, 30);

  // Summary
  doc.setFontSize(14);
  doc.text("Summary", 20, 45);

  doc.setFontSize(11);
  doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 20, 55);
  doc.text(`Total Expense: ${totalExpense.toFixed(2)}`, 20, 65);
  doc.text(`Balance: ${balance.toFixed(2)}`, 20, 75);

  // Transaction Table
  doc.setFontSize(14);
  doc.text("Transactions", 20, 90);

  let y = 100;

  // Table headers
  doc.setFontSize(10);

  doc.text("Title", 20, y);
  doc.text("Category", 60, y);
  doc.text("Type", 100, y);
  doc.text("Amount", 130, y);
  doc.text("Date", 160, y);

  y += 7;

  // Separator
  doc.line(20, y, 190, y);

  y += 7;

   // Table rows
  transactions.forEach((transaction) => {
    doc.text(transaction.title, 20, y);

    doc.text(
      transaction.category?.name ?? "",
      60,
      y,
    );

    doc.text(transaction.type, 100, y);

    doc.text(
      Number(transaction.amount).toFixed(2),
      130,
      y,
    );

    doc.text(
      formatDate(transaction.date),
      160,
      y,
    );

    y += 7;

    // New page
    if (y > 280) {
      doc.addPage();

      y = 20;

      doc.setFontSize(10);

      doc.text("Title", 20, y);
      doc.text("Category", 60, y);
      doc.text("Type", 100, y);
      doc.text("Amount", 130, y);
      doc.text("Date", 160, y);

      y += 7;

      doc.line(20, y, 190, y);

      y += 7;
    }
     });

  doc.save("transactions.pdf");
}
