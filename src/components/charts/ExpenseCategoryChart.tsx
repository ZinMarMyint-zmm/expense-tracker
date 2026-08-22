"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExpenseCategoryData {
  category: string;
  amount: number;
}

interface ExpenseCategoryChartProps {
  expenseByCategory: ExpenseCategoryData[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const colors = [
  "#3f51b5",
  "#ff9800",
  "#009688",
  "#9c27b0",
  "#e91e63",
  "#607d8b",
];

export const ExpenseCategoryChart = ({
  expenseByCategory,
}: ExpenseCategoryChartProps) => {
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
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            paddingAngle={4}
            label={(entry) => {
              const percentage = (entry.value / total) * 100;

              return `(${percentage.toFixed(0)}%)`;
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          />

          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
