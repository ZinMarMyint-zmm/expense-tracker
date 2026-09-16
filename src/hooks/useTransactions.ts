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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTransactions = () => {
  const queryClient = useQueryClient();
  //GET
  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
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

  const getTransaction = async (id: string) => {
    try {
      const transaction = await getTransactionService(id);
      return transaction;
    } catch (error) {
      console.error("Failed to fetch transaction", error);
      throw error;
    }
  };

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
    createTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
  };
};
