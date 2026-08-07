import Link from "next/link";
export default function Home() {
  return (
    <>
      <section>
        <form
          action=""
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
              className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
              placeholder="Category Color"
            />
          </div>
          <div className="text-center space-x-4">
            <Link href="/categories">
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
