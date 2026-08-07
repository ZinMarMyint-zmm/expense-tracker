"use client";
import { useCategory } from "@/services/category.service";
import { Trash, SquarePen } from "lucide-react";
import Link from "next/link";
export default function Home() {
  const { categories } = useCategory();
  return (
    <section>
      <div className="flex justify-end gap-3 my-5">
        <Link href="categories/add">
          <button className="btn bg-[#6B6054] text-white p-2 rounded">
            <p className="font-mono text-sm">Add Category</p>
          </button>
        </Link>
      </div>
      <div>
        <table className="table-auto md:table-fixed w-full text-sm text-left rtl:text-right text-body">
          <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
            <tr>
              <th scope="col" className="px-6 py-3 text-heading">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-heading">
                Icon
              </th>
              <th scope="col" className="px-6 py-3 text-heading">
                Color
              </th>
              <th scope="col" className="px-6 py-3 text-heading">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              return (
                <tr key={category.id}>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {category.name}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {category.icon}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {category.color}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    <button className="mr-2 text-blue-500">
                      <SquarePen className="w-4 h-4" />
                    </button>
                    <button className="text-red-500">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
