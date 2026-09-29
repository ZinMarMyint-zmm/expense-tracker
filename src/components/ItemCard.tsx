import { BanknoteArrowUp, Banknote, BanknoteArrowDown } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/lib/currencyFormatter";

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

export const ItemCard = ({ summary }: ItemCardProps) => {
  const selectedCurrency = useAppSelector((state) => state.currency.currency);

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

  const balance = income - expense;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-3">
          <span>Total Income</span>
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <BanknoteArrowUp size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-600">
          + {formatCurrency(income, selectedCurrency)}
        </h2>
        <p className="text-xs text-slate-400 mt-2">Current billing month</p>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-3">
          <span>Total Expense</span>
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
            <BanknoteArrowDown size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-rose-600">
          - {formatCurrency(expense, selectedCurrency)}
        </h2>
        <p className="text-xs text-slate-400 mt-2">Current billing month</p>
      </div>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between text-sm font-medium text-slate-500 mb-3">
          <span>Net Balance</span>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Banknote size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {formatCurrency(balance, selectedCurrency)}
        </h2>
        <p className="text-xs text-slate-400 mt-2">Current billing month</p>
      </div>
    </section>
  );
};
