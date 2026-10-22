"use client";

import { useCategories } from "@/hooks/useCategories";
import { Transaction, TransactionType } from "@/types/transaction";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";

export default function Home() {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { categories } = useCategories();
  const { getTransaction, updateTransaction } = useTransactions();

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Update form submitted");
    setError("");

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const categoryId = formData.get("categoryId");
    const type = formData.get("type");
    const amount = formData.get("amount");
    const date = formData.get("date");
    const note = formData.get("note");

    if (
      typeof title !== "string" ||
      typeof categoryId !== "string" ||
      typeof type !== "string" ||
      typeof amount !== "string" ||
      typeof date !== "string" ||
      typeof note !== "string"
    ) {
      setError("Please complete all transaction fields.");
      return;
    }

    const amountNumber = Number(amount);

    if (
      !title.trim() ||
      !categoryId ||
      !date ||
      !amount.trim() ||
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0
    ) {
      setError("Please enter a valid title, category, amount, and date.");
      return;
    }

    try {
      console.log("Updating transaction:", id);

      await updateTransaction(id, {
        title: title.trim(),
        categoryId,
        type: type as TransactionType,
        amount: amountNumber,
        date,
        note,
      });

      console.log("Transaction updated successfully");
      router.push("/transactions");
    } catch (err) {
      console.error("Failed to update transaction:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update transaction. Please try again.",
      );
    }
  };

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const data = await getTransaction(id);
        setTransaction(data);
      } catch (err) {
        console.error("Failed to fetch transaction:", err);
        setError("Could not load this transaction.");
      }
    }

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  return (
    <section>
      <form
        onSubmit={handleUpdate}
        className="mx-auto max-w-md bg-white p-5 mt-5 rounded space-y-4"
      >
        <h1 className="text-center my-3 font-extrabold text-2xl">
          Edit Transaction Form
        </h1>

        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="title" className="block mb-2.5 text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={transaction?.title ?? ""}
            required
            className="border rounded block w-full px-3 py-2.5"
            placeholder="Title"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block mb-2.5 text-sm font-medium"
          >
            Category
          </label>
          <select
            name="categoryId"
            id="categoryId"
            defaultValue={transaction?.categoryId ?? ""}
            required
            className="border rounded block w-full px-3 py-2.5"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block mb-2.5 text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={transaction?.type ?? "EXPENSE"}
            required
            className="border rounded block w-full px-3 py-2.5"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block mb-2.5 text-sm font-medium">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            defaultValue={transaction?.amount ?? ""}
            min="0.01"
            step="0.01"
            required
            className="border rounded block w-full px-3 py-2.5"
            placeholder="Amount"
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2.5 text-sm font-medium">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={
              transaction?.date ? transaction.date.slice(0, 10) : ""
            }
            required
            className="border rounded block w-full px-3 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="note" className="block mb-2.5 text-sm font-medium">
            Note
          </label>
          <input
            type="text"
            id="note"
            name="note"
            defaultValue={transaction?.note ?? ""}
            className="border rounded block w-full px-3 py-2.5"
            placeholder="Note"
          />
        </div>

        <div className="text-center space-x-4">
          <Link
            href="/transactions"
            className="inline-block btn bg-[#D5ECD4] text-[#6B6054] px-2 py-1 rounded"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn bg-[#6B6054] text-[#D5ECD4] px-2 py-1 rounded"
          >
            Update
          </button>
        </div>
      </form>
    </section>
  );
}
