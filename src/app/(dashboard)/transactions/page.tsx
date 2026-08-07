import {
  Download,
  SquareArrowRightExit,
  Calendar,
  Funnel,
  Trash,
  SquarePen,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <div className="flex justify-end gap-3 my-5">
        <button className="btn bg-[#ffff] text-black p-2 rounded flex items-center gap-1">
          <Download className="w-4 h-4" />
          <p className="font-mono text-sm">Pdf Download</p>
        </button>
        <button className="btn bg-[#ffff] text-black p-2 rounded flex items-center gap-1">
          <SquareArrowRightExit className="w-4 h-4" />
          <p className="font-mono text-sm">Export</p>
        </button>
        <Link href="transactions/add">
          <button className="btn bg-[#6B6054] text-white p-2 rounded">
            <p className="font-mono text-sm">Add Transaction</p>
          </button>
        </Link>
      </div>

      <div className="flex md:flex-row flex-col gap-4 justify-center mb-5">
        <div className="w-full md:flex-1 bg-white p-6 rounded-sm shadow">
          <div className="flex justify-end gap-3">
            <button className="btn p-2 border-gray-300 shadow flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <p className="text-xs">Start Date</p>
            </button>
            <button className="btn p-2 border-gray-300 shadow flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <p className="text-xs">End Date</p>
            </button>
            <button className="btn p-2 border-gray-300 shadow flex items-center gap-1">
              <Funnel className="w-3 h-3" />
              <p className="text-xs">Filter</p>
            </button>
          </div>
          <div className="my-5 bg-gray-200">
            <table className="table-auto md:table-fixed w-full text-sm text-left rtl:text-right text-body">
              <thead className="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                <tr>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Note
                  </th>
                  <th scope="col" className="px-6 py-3 text-heading">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    Salary
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    Income
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    25000
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    Salary
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    07/08/2026
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    ...
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
