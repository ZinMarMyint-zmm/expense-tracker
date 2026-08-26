"use client";
import {
  getTransactions,
  createTransaction as createTransactionService,
  getTransaction as getTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from "@/services/transaction.service";
import {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  TransactionPagination,
} from "@/types/transaction";
import { useState, useEffect, useCallback } from "react";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<TransactionPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchTransactions = useCallback(
    async (newFilters?: TransactionFilters) => {
      try {
        setLoading(true);
        setError("");

        const data = await getTransactions(newFilters);

        setTransactions(data.transactions);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Failed to fetch transactions", error);

        setError("Failed to fetch transactions");
        setTransactions([]);

        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async ({
    title,
    categoryId,
    type,
    amount,
    date,
    note,
  }: CreateTransactionInput) => {
    try {
      await createTransactionService({
        title,
        categoryId,
        type,
        amount,
        date,
        note,
      });
      await fetchTransactions({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Failed to create transaction", error);
    }
  };

  const getTransaction = async (id: string) => {
    try {
      const transaction = await getTransactionService(id);
      return transaction;
    } catch (error) {
      console.error("Failed to fetch transaction", error);
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    { title, categoryId, type, amount, date, note }: CreateTransactionInput,
  ) => {
    try {
      const updatedTransaction = await updateTransactionService(id, {
        title,
        categoryId,
        type,
        amount,
        date,
        note,
      });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? updatedTransaction
            : transaction,
        ),
      );
    } catch (error) {
      console.error("Failed to update transaction", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteTransactionService(id);

      const currentPage = pagination.page;

      const data = await getTransactions({
        page: currentPage,
        limit: pagination.limit,
      });

      if (
        currentPage > data.pagination.totalPages &&
        data.pagination.totalPages > 0
      ) {
        const previousPage = currentPage - 1;

        const previousData = await getTransactions({
          page: previousPage,
          limit: pagination.limit,
        });

        setTransactions(previousData.transactions);
        setPagination(previousData.pagination);
      } else {
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  return {
    fetchTransactions,
    transactions,
    loading,
    pagination,
    error,
    createTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
  };
};
