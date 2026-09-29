"use client";

import { ChartData, ExpenseCategoryChartProps } from "@/types/dashboard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/lib/currencyFormatter";

// Modern Pastel Color Palette
const colors = [
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#64748b", // Slate
];

export const ExpenseCategoryChart = ({
  expenseByCategory,
}: ExpenseCategoryChartProps) => {
  const selectedCurrency = useAppSelector((state) => state.currency.currency);
  const total = expenseByCategory.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const chartData: ChartData[] = expenseByCategory.map((item, index) => ({
    name: item.category,
    value: Number(item.amount),
    color: colors[index % colors.length],
  }));

  return (
    <div className="w-full h-[350px] relative">
      <h3 className="text-base font-semibold text-slate-900 mb-2">
        Expenses by Category
      </h3>

      {/* Total Amount Text in the Center of Donut */}
      <div className="absolute top-[52%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none hidden sm:block">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Total spent
        </p>
        <p className="text-lg font-bold text-slate-800">
          {formatCurrency(total, selectedCurrency)}
        </p>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="55%"
            innerRadius={65} // เพิ่ม innerRadius เป็น Donut
            outerRadius={95}
            paddingAngle={3}
            label={({ percent }) =>
              percent ? `${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
            formatter={(value) => [
              formatCurrency(Number(value), selectedCurrency),
              "Amount",
            ]}
          />

          <Legend
            verticalAlign="bottom"
            height={40}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
