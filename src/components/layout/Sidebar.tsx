"use client";
import { usePathname } from "next/navigation";
import { SidebarProps } from "@/types/navigation";
import Link from "next/link";
import useLayout from "@/hooks/useLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { sidebarItems } = useLayout();
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  async function handleLogout() {
    await logout();
    router.push("/");
  }
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#6B6054]/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col bg-[#6B6054] text-slate-100 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 items-center py-5 px-6 border-b border-[#6B6054] md:flex">
          <span className="text-xl font-bold tracking-wider text-white">
            Expense Tracker
          </span>
        </div>

        <nav>
          {sidebarItems
            .filter((item) => !item.adminOnly || user?.role === "ADMIN")
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Closes mobile menu drawer on link click
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#929487] text-white"
                      : "text-[#D5ECD4] hover:bg-[#6B6054] hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
        </nav>
        <div className="border-t border-[#6B6054] mt-auto">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="md:px-5 px-3 py-3 bg-[#D5ECD4] text-[#6B6054] rounded-lg text-sm font-medium transition-color"
            >
              Log out
            </button>
          </div>

          <p className="p-4 text-xs text-[#D5ECD4]">
            © 2026 Expense Tracker. All rights reserved.
          </p>
        </div>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#6B6054]/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-bold text-[#6B6054]">Log out?</h2>

              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to log out of your account?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="rounded-lg bg-[#D5ECD4] px-4 py-2 text-sm font-semibold text-[#6B6054]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-[#6B6054] px-4 py-2 text-sm font-semibold text-[#D5ECD4]"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
