import Link from "next/link";
export default function Home() {
  return (
    <>
      <section>
        <form
          action=""
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
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Title"
            />
          </div>
          <div>
            <label
              htmlFor="type"
              className="block mb-2.5 text-sm font-medium text-heading"
            >
              Type
            </label>
            <input
              type="text"
              id="type"
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Type"
            />
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
              type="text"
              id="date"
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
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
