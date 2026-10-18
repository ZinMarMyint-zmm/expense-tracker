import { describe, it, expect } from "vitest";
import { validateTransactionInput } from "./transactionValidation";

describe("validateTransactionInput", () => {
  it("should accept valid transaction data", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "EXPENSE",
      amount: 1000,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "THB",
    });
    expect(result).toBeNull();
  });

  it("should reject amount = 0", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "EXPENSE",
      amount: 0,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "THB",
    });
    expect(result).toBe("Amount must be greater than 0.");
  });

  it("should reject negative amount", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "EXPENSE",
      amount: -100,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "THB",
    });

    expect(result).toBe("Amount must be greater than 0.");
  });

  it("should reject missing title", () => {
    const result = validateTransactionInput({
      title: "",
      type: "EXPENSE",
      amount: 1000,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "THB",
    });

    expect(result).toBe("Title is required.");
  });

  it("should reject invalid currency", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "EXPENSE",
      amount: 1000,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "EUR",
    });

    expect(result).toBe("Invalid currency.");
  });

  it("should reject invalid transaction type", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "INVALID",
      amount: 1000,
      date: "2026-10-07",
      categoryId: "category-123",
      currency: "THB",
    });

    expect(result).toBe("Invalid transaction type.");
  });

  it("should reject missing category", () => {
    const result = validateTransactionInput({
      title: "Lunch",
      type: "EXPENSE",
      amount: 1000,
      date: "2026-10-07",
      categoryId: "",
      currency: "THB",
    });

    expect(result).toBe("Category is required.");
  });
    
    it("should reject NaN amount", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: NaN,
    date: "2026-10-07",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBe("Amount must be greater than 0.");
});

it("should reject non-numeric amount", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: "abc",
    date: "2026-10-07",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBe("Amount must be greater than 0.");
});

it("should reject Infinity amount", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: Infinity,
    date: "2026-10-07",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBe("Amount must be greater than 0.");
});

it("should reject missing date", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: 1000,
    date: "",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBe("Date is required.");
});

it("should reject whitespace-only title", () => {
  const result = validateTransactionInput({
    title: "   ",
    type: "EXPENSE",
    amount: 1000,
    date: "2026-10-07",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBe("Title is required.");
});

it("should reject whitespace-only category", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: 1000,
    date: "2026-10-07",
    categoryId: "   ",
    currency: "THB",
  });

  expect(result).toBe("Category is required.");
});

it("should accept a numeric string amount", () => {
  const result = validateTransactionInput({
    title: "Lunch",
    type: "EXPENSE",
    amount: "1000",
    date: "2026-10-07",
    categoryId: "category-123",
    currency: "THB",
  });

  expect(result).toBeNull();
});
});
