"use client";
import Link from "next/link";
import { register as registerService } from "@/services/register.service";
import { useRouter } from "next/navigation";
export default function Register() {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return;
    }
    await registerService({ name, email, password });
    router.push("/login");
  };
  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md bg-white p-5 mt-5 rounded space-y-4"
      >
        <h1 className="text-center my-3 font-extrabold text-2xl">
          Register Form
        </h1>
        <div>
          <label
            htmlFor="name"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Username
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="Enter your name"
          />
        </div>
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
            name="email"
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
            name="password"
            className="border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
            placeholder="Password"
          />
        </div>

        <div className="text-center space-x-4">
          <Link href="/register">
            <button className="btn bg-[#D5ECD4] text-[#6B6054] px-2 py-1 rounded">
              Cancel
            </button>
          </Link>
          <button className="btn bg-[#6B6054] text-[#D5ECD4] px-2 py-1 rounded">
            Register
          </button>
        </div>
      </form>
    </section>
  );
}
