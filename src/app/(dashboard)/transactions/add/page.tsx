"use client";
import { useCategories } from "@/hooks/useCategories";
import { createTransaction } from "@/services/transaction.service";
import { TransactionType } from "@/types/transaction";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransactions } from "@/hooks/useTransactions";
export default function Home() {
  const router = useRouter();
  const { categories, loading } = useCategories();
  const { createTransaction } = useTransactions();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      return;
    }
    const amountNumber = Number(amount);
    if (Number.isNaN(amountNumber)) {
      return;
    }
    await createTransaction({
      title,
      categoryId,
      type: type as TransactionType,
      amount: amountNumber,
      date,
      note,
    });
    router.push("/transactions");
  };
  return (
    <>
      <section>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md bg-white p-5 mt-5 rounded space-y-4"
        >
          <h1 className="text-center my-3 font-extrabold text-2xl">
            Transaction Form
          </h1>
          <div>
            <label
              htmlFor="title"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Title"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Category
            </label>
            <select
              name="categoryId"
              id="categoryId"
              className="border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5"
              disabled={loading}
            >
              {loading ? (
                <option>Loading categories...</option>
              ) : (
                categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              className="border border-default-medium text-heading text-sm rounded-base block w-full px-3 py-2.5"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Amount"
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Date"
            />
          </div>
          <div>
            <label
              htmlFor="note"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Note
            </label>
            <input
              type="text"
              id="note"
              name="note"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Note"
            />
          </div>
          <div className="text-center space-x-4">
            <Link href="/transactions">
              <button className="btn bg-[#D5ECD4] text-[#6B6054] px-2 py-1 rounded">
                Cancel
              </button>
            </Link>
            <button className="btn bg-[#6B6054] text-[#D5ECD4] px-2 py-1 rounded">
              Save
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
