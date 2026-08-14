"use client";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const { createCategory } = useCategories();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const icon = formData.get("icon");
    const color = formData.get("color");
    if (
      typeof name !== "string" ||
      typeof icon !== "string" ||
      typeof color !== "string"
    ) {
      return;
    }
    await createCategory({ name, icon, color });
    router.push("/categories");
  };
  return (
    <>
      <section>
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md bg-white p-5 mt-10 rounded space-y-4"
        >
          <h1 className="text-center my-3 font-extrabold text-2xl">
            Category Form
          </h1>
          <div>
            <label
              htmlFor="name"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Category Name"
            />
          </div>
          <div>
            <label
              htmlFor="icon"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Icon
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Category Icon"
            />
          </div>
          <div>
            <label
              htmlFor="color"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Category Color"
            />
          </div>
          <div className="text-center space-x-4">
            <Link
              href="/categories"
              className="btn bg-[#D5ECD4] text-[#6B6054] px-2 py-1 rounded"
            >
              Cancel
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
