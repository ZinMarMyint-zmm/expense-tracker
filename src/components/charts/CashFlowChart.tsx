"use client";

import { CashFlowChartProps } from "@/types/dashboard";
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

import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/lib/currencyFormatter";

export const CashFlowChart = ({ monthly }: CashFlowChartProps) => {
  const selectedCurrency = useAppSelector((state) => state.currency.currency);
  return (
    <div className="w-full h-[350px]">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Cash Flow Analytics
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={monthly}
          margin={{ top: 10, right: 10, bottom: 5, left: -10 }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              formatCurrency(value, selectedCurrency)
            }
          />
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
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingBottom: "20px" }}
          />

          <Bar
            dataKey="INCOME"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            name="Income"
            maxBarSize={30}
          />
          <Bar
            dataKey="EXPENSE"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
            name="Expense"
            maxBarSize={30}
          />
          <Bar
            dataKey="BALANCE"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name="Balance"
            maxBarSize={30}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
