type SummaryType = "EXPENSE" | "INCOME";

interface SummaryItem {
  type: SummaryType;
  _sum: {
    amount: number | null;
  };
}

interface ItemCardProps {
  summary: SummaryItem[];
}
import { BanknoteArrowUp, Banknote, BanknoteArrowDown } from "lucide-react";

export const ItemCard = ({ summary }: ItemCardProps) => {
  // 1. Calculate totals from the summary array
  const { income, expense } = summary.reduce(
    (acc, item) => {
      const amount = Number(item._sum?.amount ?? 0);
      if (item.type === "INCOME") {
        acc.income += amount;
      } else if (item.type === "EXPENSE") {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );

  // 2. Calculate balance
  const balance = income - expense;

  // 3. Helper to format numbers nicely (e.g., 1,234.56)
  const formatCurrency = (val: number) => val.toLocaleString();

  return (
    <section className="flex md:flex-row flex-col gap-4 justify-center mb-5">
      {/* Income Card */}
      <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
        <p className="mb-5 flex items-center text-gray-500 gap-2">
          <BanknoteArrowUp />
          Income
        </p>
        <h1 className="font-bold text-2xl text-emerald-600">
          ${formatCurrency(income)}
        </h1>
        <p>for this month</p>
      </div>

      {/* Expense Card */}
      <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
        <p className="mb-5 flex items-center text-gray-500 gap-2">
          <BanknoteArrowDown />
          Expense
        </p>
        <h1 className="font-bold text-2xl text-rose-600">
          ${formatCurrency(expense)}
        </h1>
        <p>for this month</p>
      </div>

      {/* Balance Card */}
      <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
        <p className="mb-5 flex items-center text-gray-500 gap-2">
          <Banknote />
          Balance
        </p>
        <h1 className="font-bold text-2xl">${formatCurrency(balance)}</h1>
        <p>for this month</p>
      </div>
    </section>
  );
};
