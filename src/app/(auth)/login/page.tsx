import Link from "next/link";
export default function Login() {
  return (
    <section>
      <form
        action=""
        className="mx-auto max-w-md bg-white p-5 mt-5 rounded space-y-4"
      >
        <h1 className="text-center my-3 font-extrabold text-2xl">Login Form</h1>
        <div>
          <label
            htmlFor="email"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="Password"
          />
        </div>

        <div className="text-center space-x-4">
          <Link href="/transactions">
            <button className="btn bg-[#D5ECD4] text-[#6B6054] px-2 py-1 rounded">
              Cancel
            </button>
          </Link>
          <button className="btn bg-[#6B6054] text-[#D5ECD4] px-2 py-1 rounded">
            Login
          </button>
        </div>
      </form>
    </section>
  );
}
