"use client";

import {
  getDashboardSummary,
  getMonthlyData,
  getExpenseByCategory,
} from "@/services/dashboard.service";

import { useQueries } from '@tanstack/react-query';

import { useAppSelector } from "@/store/hooks";

export const useDashboard = () => {

  const selectedCurrency = useAppSelector(
  (state) => state.currency.currency
);

  const [summaryQuery, monthlyQuery, expenseQuery] = useQueries({
    queries: [
      {
        queryKey: ['dashboardSummary',selectedCurrency],
        queryFn: ()=>getDashboardSummary(selectedCurrency),
      },
      {
        queryKey: ['dashboardMonthly',selectedCurrency],
        queryFn: ()=>getMonthlyData(selectedCurrency),
      },
      {
        queryKey: ['dashboardExpenseByCategory',selectedCurrency],
        queryFn: ()=>getExpenseByCategory(selectedCurrency),
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
