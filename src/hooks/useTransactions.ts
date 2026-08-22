"use client";
import {
  getTransactions,
  createTransaction as createTransactionService,
  getTransaction as getTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService,
} from "@/services/transaction.service";
import { CreateTransactionInput, Transaction,TransactionFilters } from "@/types/transaction";
import { useState, useEffect, useCallback } from "react";


export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async (filters?: TransactionFilters) => {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setError("Failed to fetch transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);
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
      const newTransaction = await createTransactionService({
        title,
        categoryId,
        type,
        amount,
        date,
        note,
      });
      setTransactions((prev) => [...prev, newTransaction]);
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

      setTransactions((prev) => {
        const updated = prev.filter((transaction) => transaction.id !== id);

        return updated;
      });
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  return {
    fetchTransactions,
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
  };
};
