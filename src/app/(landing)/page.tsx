import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  CheckCircle,
  BarChart3,
  Shield,
} from "lucide-react";

export default function Landing() {
  return (
    <section className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#828C51]" />
            <span className="font-bold text-xl tracking-tight">
              Money Tracker
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {/* <a href="#features" className="hover:text-[#828C51] transition">
              Features
            </a> */}
            {/* <a
              href="#how-it-works"
              className="hover:text-emerald-600 transition"
            >
              How it Works
            </a>
            <a href="#pricing" className="hover:text-emerald-600 transition">
              Pricing
            </a> */}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-[#828C51] transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-[#828C51] hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
      <header className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Hero Text */}
        <div>
          <p className="text-[#828C51] font-semibold mb-4">
            SIMPLE. CLEAR. FINANCIAL.
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Take Control of Your Money,{" "}
            <span className="text-[#828C51]">Effortlessly.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl">
            Track your income and expenses, understand your spending, and get a
            clear view of your financial activity in one simple place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="bg-[#828C51] hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-[#828C51]/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="border border-slate-300 hover:border-[#828C51] hover:text-[#828C51] text-slate-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right - Dashboard Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6">
            {/* Balance */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Monthly Balance
                </p>

                <p className="text-3xl font-bold text-slate-900">$2,450.80</p>
              </div>

              <Wallet className="w-8 h-8 text-[#828C51]" />
            </div>

            {/* Income */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-slate-500">Income</p>

                <p className="text-xl font-bold text-emerald-600">$4,200</p>
              </div>

              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                Income
              </span>
            </div>

            {/* Expense */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-slate-500">Expense</p>

                <p className="text-xl font-bold text-rose-500">$1,749.20</p>
              </div>

              <span className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
                Expense
              </span>
            </div>

            {/* Category bars */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Housing</span>
                  <span className="text-slate-500">$800</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Food</span>
                  <span className="text-slate-500">$420</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full">
                  <div
                    className="bg-[#EF4444] h-full rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Transport</span>
                  <span className="text-slate-500">$250</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full">
                  <div
                    className="bg-[#3B82F6] h-full rounded-full"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section id="features" className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[#828C51] font-semibold mb-3">FEATURES</p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to understand your money
            </h2>

            <p className="mt-4 text-slate-600">
              Keep track of your financial activity and understand where your
              money goes with simple, useful insights.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Transaction Tracking */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#828C51] mb-5">
                <Wallet className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg mb-2">
                Income & Expense Tracking
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Easily record, update, and manage your income and expenses with
                transaction categories and notes.
              </p>
            </div>

            {/* Dashboard */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#828C51] mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg mb-2">Financial Dashboard</h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                See your monthly income, expenses, and balance through simple
                financial summaries and charts.
              </p>
            </div>

            {/* Categories */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#828C51] mb-5">
                <CheckCircle className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg mb-2">Category Insights</h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Understand your spending habits with expense breakdowns by
                category.
              </p>
            </div>

            {/* Authentication */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#828C51] mb-5">
                <Shield className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg mb-2">Secure Authentication</h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Protect your account with password hashing and session-based
                authentication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
