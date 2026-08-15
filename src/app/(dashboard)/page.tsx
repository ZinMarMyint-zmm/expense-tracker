"use client";
import { ItemCard } from "@/components/ItemCard";
import { Statistics } from "@/components/Statistics";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const { summary, monthly, expenseByCategory, loading, error } =
    useDashboard();
  console.log(summary);
  console.log(monthly);
  console.log(expenseByCategory);
  return (
    <>
      <p className="mb-3">An overview of expense dashboard</p>
      <ItemCard summary={summary} />
      <Statistics monthly={monthly} expenseByCategory={expenseByCategory} />
    </>
  );
}
