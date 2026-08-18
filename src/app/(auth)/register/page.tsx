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
    <section className="min-h-screen bg-[#D5ECD4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side */}
        <div className="hidden md:flex bg-[#6B6054] text-[#D5ECD4] p-10 flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">Money Tracker</h2>

            <p className="mt-3 text-[#D5ECD4]/80 leading-relaxed">
              Take control of your money and understand your financial activity
              in one simple place.
            </p>
          </div>

          <div>
            <p className="text-4xl font-extrabold leading-tight">
              Start tracking
              <br />
              your money
              <br />
              today.
            </p>

            <p className="mt-5 text-sm text-[#D5ECD4]/70">
              Simple. Clear. Financial.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-10 md:p-12">
          <div className="max-w-md mx-auto">
            {/* Heading */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-[#6B6054] uppercase tracking-wider">
                Get started
              </p>

              <h1 className="mt-2 text-3xl font-extrabold text-[#6B6054]">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Start managing your income and expenses with Money Tracker.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-semibold text-[#6B6054]"
                >
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-[#6B6054] outline-none transition focus:border-[#6B6054] focus:ring-2 focus:ring-[#D5ECD4]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-[#6B6054]"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-[#6B6054] outline-none transition focus:border-[#6B6054] focus:ring-2 focus:ring-[#D5ECD4]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-semibold text-[#6B6054]"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-[#6B6054] outline-none transition focus:border-[#6B6054] focus:ring-2 focus:ring-[#D5ECD4]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <Link
                  href="/"
                  className="flex-1 rounded-lg bg-[#D5ECD4] px-4 py-3 text-center text-sm font-semibold text-[#6B6054] transition hover:opacity-80"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#6B6054] px-4 py-3 text-sm font-semibold text-[#D5ECD4] transition hover:opacity-90"
                >
                  Register
                </button>
              </div>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#6B6054] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
