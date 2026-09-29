import { Currency } from "@/lib/currency";

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction{
    id: string;
  title: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;
  currency: Currency;
  userId: string;
  categoryId: string;

  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export interface CreateTransactionInput{
    title: string,
    categoryId: string,
    type: TransactionType
    amount: number
    date: string
    note: string | null
}

export type CreateTransactionPayload = CreateTransactionInput & {
  currency: Currency;
};

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

