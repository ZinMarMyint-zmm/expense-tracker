export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction{
    id: string;
  title: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;

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

export type TransactionFilters = {
  startDate?: string;
  endDate?: string;
};

