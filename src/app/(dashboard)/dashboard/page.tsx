"use client";
import { ItemCard } from "@/components/ItemCard";
import { Statistics } from "@/components/Statistics";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { summary, monthly, expenseByCategory } = useDashboard();
  console.log(summary);
  console.log(monthly);
  console.log(expenseByCategory);

  return (
    <section className="my-3">
      <ItemCard summary={summary} />
      <Statistics monthly={monthly} expenseByCategory={expenseByCategory} />
    </section>
  );
}
