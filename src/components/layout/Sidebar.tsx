"use client";
import { usePathname } from "next/navigation";
import { SidebarProps } from "@/types/navigation";
import Link from "next/link";
import useLayout from "@/hooks/useLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

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
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Pure Light Sidebar */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col bg-[#e0e2e7] border-r border-slate-100 text-slate-600 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-[#f89f1b] flex items-center justify-center text-[10px] font-bold text-[#ec001b]">
              E
            </span>
            Expense Tracker
          </span>
        </div>

        {/* Navigation - Minimalist Style */}
        <nav className="flex-1 py-4 space-y-0.5">
          {sidebarItems
            .filter((item) => !item.adminOnly || user?.role === "ADMIN")
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50/70 text-[#f89f1b] border-l-2 border-[#f89f1b]"
                      : "text-slate-700 border-l-2 border-transparent hover:bg-slate-50/80 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-[#f89f1b]" : "text-slate-700"}`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
        </nav>

        {/* Footer & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Log out</span>
          </button>

          <p className="text-[10px] text-slate-400 px-4">
            © 2026 Expense Tracker. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <h2 className="text-md font-bold text-slate-900">
              Confirm Log out
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to log out of your account?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
