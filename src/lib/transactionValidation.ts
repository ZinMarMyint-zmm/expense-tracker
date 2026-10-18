import { Currency } from "@/lib/currency";
import { TransactionType } from "@/types/transaction";

const validCurrencies: Currency[] = ["USD", "MMK", "THB", "JPY"];
const validTransactionTypes: TransactionType[] = ["INCOME", "EXPENSE"];

type TransactionValidationInput = {
  title: unknown;
  type: unknown;
  amount: unknown;
  date: unknown;
  categoryId: unknown;
  currency: unknown;
};

export function validateTransactionInput(
  input: TransactionValidationInput,
): string | null {
  if (typeof input.title !== "string" || !input.title.trim()) {
    return "Title is required.";
  }

  if (
    typeof input.type !== "string" ||
    !validTransactionTypes.includes(input.type as TransactionType)
  ) {
    return "Invalid transaction type.";
  }

  if (
    !Number.isFinite(Number(input.amount)) ||
    Number(input.amount) <= 0
  ) {
    return "Amount must be greater than 0.";
  }

  if (typeof input.date !== "string" || !input.date.trim()) {
    return "Date is required.";
  }

  if (
    typeof input.categoryId !== "string" ||
    !input.categoryId.trim()
  ) {
    return "Category is required.";
  }

  if (
    typeof input.currency !== "string" ||
    !validCurrencies.includes(input.currency as Currency)
  ) {
    return "Invalid currency.";
  }

  return null;
}