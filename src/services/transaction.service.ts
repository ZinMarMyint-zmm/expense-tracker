import { Transaction, CreateTransactionInput } from "@/types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function createTransaction(
  transaction: CreateTransactionInput,
): Promise<Transaction> {
  const { title, categoryId, type, amount, date, note } = transaction;

  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, categoryId, type, amount, date, note }),
  });
  if (!response.ok) {
    throw new Error("Failed to create categories");
  }
  return response.json();
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${id}`);
  const transaction = await response.json();
  if (!response.ok) {
    throw new Error("Failed to get transaction");
  }
  return transaction;
}

export async function updateTransaction(
  id: string,
  transaction: CreateTransactionInput,
): Promise<Transaction> {
  const { title, categoryId, type, amount, date, note } = transaction;
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, categoryId, type, amount, date, note }),
  });
  const data = await response.json();

  console.log("UPDATE STATUS:", response.status, response.statusText);
  console.log("UPDATE RESPONSE:", data);
  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to deleted transaction");
  }
}
