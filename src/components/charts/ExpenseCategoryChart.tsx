"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the shape of your breakdown entries
interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Recharts pass implicit parameters to custom dynamic label renderers
interface PieLabelProps {
  name: string;
  percent: number;
}

const categoryData: CategoryData[] = [
  { name: "Housing", value: 1800, color: "#3f51b5" },
  { name: "Food", value: 600, color: "#ff9800" },
  { name: "Bills", value: 350, color: "#009688" },
  { name: "Transport", value: 450, color: "#9c27b0" },
  { name: "Entertainment", value: 300, color: "#e91e63" },
  { name: "Health", value: 500, color: "#607d8b" },
];

export const ExpenseCategoryChart: React.FC = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={4}
            label={(entry: PieLabelProps) =>
              `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`
            }
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`$${value}`, "Amount"]} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
