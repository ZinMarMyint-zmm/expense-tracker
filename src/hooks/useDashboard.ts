"use client";

import {
  getDashboardSummary,
  getMonthlyData,
  getExpenseByCategory,
} from "@/services/dashboard.service";

import { useQueries } from '@tanstack/react-query';

export const useDashboard = () => {

  const [summaryQuery, monthlyQuery, expenseQuery] = useQueries({
    queries: [
      {
        queryKey: ['dashboardSummary'],
        queryFn: getDashboardSummary,
      },
      {
        queryKey: ['dashboardMonthly'],
        queryFn: getMonthlyData,
      },
      {
        queryKey: ['dashboardExpenseByCategory'],
        queryFn: getExpenseByCategory,
      },
    ],
  });
  const isLoading = summaryQuery.isLoading || monthlyQuery.isLoading || expenseQuery.isLoading;
  const isError = summaryQuery.isError || monthlyQuery.isError || expenseQuery.isError;
  const errorMessage = isError ? "Failed to load dashboard data" : "";
  

  return {
    summary: summaryQuery.data ?? [],
    monthly: monthlyQuery.data ?? [],
    expenseByCategory: expenseQuery.data ?? [],
    loading:isLoading,
    error:errorMessage,
  };
};
