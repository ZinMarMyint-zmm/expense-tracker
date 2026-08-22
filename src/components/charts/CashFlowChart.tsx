"use client";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the shape of your monthly financial records
interface MonthlyData {
  month: string;
  INCOME: number;
  EXPENSE: number;
  BALANCE: number;
}
interface CashFlowChartProps {
  monthly: MonthlyData[];
}

export const CashFlowChart = ({ monthly }: CashFlowChartProps) => {
  console.log(monthly);
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={monthly}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={(value: number) => `$${value}`} />
          <Tooltip formatter={(value: number) => [`$${value}`, ""]} />
          <Legend />

          <Bar dataKey="INCOME" fill="#4caf50" name="Income" />
          <Bar dataKey="EXPENSE" fill="#f44336" name="Expense" />
          <Bar dataKey="BALANCE" fill="#2196f3" name="Balance" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
