export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction{
    id: string
    title: string
    categoryId:string
    type: TransactionType
    amount: number
    date: string
    note: string | null
    createdAt: Date
    updatedAt: Date
}

export interface CreateTransactionInput{
    title: string,
    categoryId: string,
    type: TransactionType
    amount: number
    date: string
    note: string | null
}

