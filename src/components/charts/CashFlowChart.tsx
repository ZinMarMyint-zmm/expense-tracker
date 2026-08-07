"use client";
import React from "react";
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
  Income: number;
  Expense: number;
  Balance: number;
}

const cashFlowData: MonthlyData[] = [
  { month: "Jan", Income: 5000, Expense: 3800, Balance: 1200 },
  { month: "Feb", Income: 5200, Expense: 4100, Balance: 2300 },
  { month: "Mar", Income: 4800, Expense: 3900, Balance: 3200 },
  { month: "Apr", Income: 5500, Expense: 4500, Balance: 4200 },
  { month: "May", Income: 6000, Expense: 4800, Balance: 5400 },
  { month: "Jun", Income: 5800, Expense: 5000, Balance: 6200 },
  { month: "Jul", Income: 5900, Expense: 5200, Balance: 6900 },
  { month: "Aug", Income: 6100, Expense: 4700, Balance: 8300 },
  { month: "Sep", Income: 6500, Expense: 4900, Balance: 9900 },
  { month: "Oct", Income: 6200, Expense: 5100, Balance: 11000 },
  { month: "Nov", Income: 7000, Expense: 5500, Balance: 12500 },
  { month: "Dec", Income: 8500, Expense: 6000, Balance: 15000 },
];

export const CashFlowChart: React.FC = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={cashFlowData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" tickFormatter={(value: number) => `$${value}`} />
          <Tooltip formatter={(value: number) => [`$${value}`, ""]} />
          <Legend />

          <Bar dataKey="Income" fill="#4caf50" name="Income" />
          <Bar dataKey="Expense" fill="#f44336" name="Expense" />
          <Bar dataKey="Balance" fill="#2196f3" name="Balance" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
