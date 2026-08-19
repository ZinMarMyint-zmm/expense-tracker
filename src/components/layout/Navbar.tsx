import useLayout from "@/hooks/layout";
import { NavbarProps } from "@/types/navigation";
import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, loading } = useAuth();

  const { sidebarItems } = useLayout();
  const pathname = usePathname();

  const currentPage = sidebarItems.find((item) => item.href === pathname);

  const title = currentPage?.title ?? "Expense Tracker";

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* left side  */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded p-2 text-gray-600 hover:bg-gray-100 focus:outline-none md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu />
        </button>

        <h1 className="hidden text-lg font-semibold text-gray-800 sm:block">
          {title}
        </h1>
      </div>
      {/* right side  */}
      <div className="flex items-center gap-4">
        {/* <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
          <Bell />
        </button> */}
        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white">
          {!loading && user?.name ? user.name.charAt(0).toUpperCase() : ""}
        </div>
      </div>
    </header>
  );
};
