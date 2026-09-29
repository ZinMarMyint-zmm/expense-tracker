import useLayout from "@/hooks/useLayout";
import { NavbarProps } from "@/types/navigation";
import { Currency } from "@/lib/currency";
import { Menu, ChevronDown } from "lucide-react"; // ChevronDown Icon ထည့်သွင်းရန်
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrency } from "@/store/slices/currencySlice";

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, loading } = useAuth();
  const { sidebarItems } = useLayout();
  const pathname = usePathname();

  const currentPage = sidebarItems.find((item) => item.href === pathname);
  const title = currentPage?.title ?? "Expense Tracker";

  const dispatch = useAppDispatch();
  const selectedCurrency = useAppSelector((state) => state.currency.currency);
  const currencies: Currency[] = ["MMK", "THB", "USD", "JPY"];

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 focus:outline-none md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="hidden text-xl font-bold tracking-tight text-slate-800 sm:block">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Custom Styled Currency Select Box */}
        <div className="relative">
          <select
            value={selectedCurrency}
            onChange={(event) => {
              dispatch(setCurrency(event.target.value as Currency));
            }}
            className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none cursor-pointer transition-colors hover:bg-slate-50"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* User Profile Avatar */}
        <div className="h-8 w-8 rounded-full bg-[#f89f1b] flex items-center justify-center text-xs font-bold text-[#ec001b] shadow-sm shadow-indigo-600/20">
          {!loading && user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      </div>
    </header>
  );
};
