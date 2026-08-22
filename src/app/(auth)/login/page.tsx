"use client";

import Link from "next/link";
import { login as loginService } from "@/services/login.service";
import { useRouter } from "next/navigation";
import login from "@/assets/login.jpeg";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return;
    }

    try {
      await loginService({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2 bg-slate-50">
      {/* Image */}
      <div className="relative hidden md:block">
        <Image
          src={login}
          alt="Money Tracker login"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-[#6B6054]/20" />

        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-bold">Take control of your money.</h2>

          <p className="mt-2 text-white/80">
            Track your income and expenses with clarity.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to Money Tracker
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              required
              className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
            </div>

            <input
              type="password"
              id="password"
              name="password"
              required
              className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#A6C36F] focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Enter your password"
            />
          </div>

          {/* Login */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#6B6054] py-3 text-sm font-semibold text-white transition hover:bg-[#A6C36F]"
          >
            Sign In
          </button>

          {/* Register  */}
          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="font-semibold text-[#6B6054] hover:text-[#A6C36F]"
            >
              Create one
            </Link>
          </p>

          {/* Back */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
