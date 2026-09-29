"use client";
import { ItemCard } from "@/components/ItemCard";
import { Statistics } from "@/components/Statistics";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { summary, monthly, expenseByCategory } = useDashboard();
  const hasTransactions = monthly.length > 0 || expenseByCategory.length > 0;

  return (
    <section className="my-3">
      <ItemCard summary={summary} />
      {hasTransactions && (
        <Statistics monthly={monthly} expenseByCategory={expenseByCategory} />
      )}
    </section>
  );
}
