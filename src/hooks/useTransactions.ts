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
  TransactionFilters,
} from "@/types/transaction";
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTransactions = () => {
  const queryClient = useQueryClient();

  //client side filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 10
  })
  //GET
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions",filters],
    queryFn: () => getTransactions(filters),
  });

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  //Create
  const createMutation = useMutation({
    mutationFn: createTransactionService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });

  const createTransaction = async (input: CreateTransactionInput) => {
    await createMutation.mutateAsync(input);
  };

  //Get Single
  const getTransaction = async (id: string) => {
    try {
      const transaction = await getTransactionService(id);
      return transaction;
    } catch (error) {
      console.error("Failed to fetch transaction", error);
      throw error;
    }
  };

  // Update
  const updateMutation = useMutation({
    mutationFn: ({
      id,
    input,
    }: {
    id: string;
      input: CreateTransactionInput;
      }) => updateTransactionService(id, input),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    }
  })
  const updateTransaction = async (
    id: string,
    input: CreateTransactionInput,
  ) => {
    await updateMutation.mutateAsync({
      id,
      input,
    });
  };

  //Delete
  const deleteMutation = useMutation({
    mutationFn: deleteTransactionService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });

  const deleteTransaction = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    transactions,
    pagination,
    loading: isLoading,
    error: isError ? "Failed to fetch transactions" : "",
    filters,
    setFilters,
    createTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
  };
};
