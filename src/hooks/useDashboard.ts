"use client";

import {
  getDashboardSummary,
  getMonthlyData,
  getExpenseByCategory,
} from "@/services/dashboard.service";
import { useState, useEffect } from "react";

export const useDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
  async function fetchDashboardData() {
    try {
      setLoading(true);

      const [
        summaryData,
        monthlyData,
        expensebyCategoryData,
      ] = await Promise.all([
        getDashboardSummary(),
        getMonthlyData(),
        getExpenseByCategory(),
      ]);

      setSummary(summaryData);
      setMonthly(monthlyData);
      setExpenseByCategory(expensebyCategoryData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  fetchDashboardData();
}, []);

  return {
    summary,
    monthly,
    expenseByCategory,
    loading,
    error,
  };
};
