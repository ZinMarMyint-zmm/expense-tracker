import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import useLayout from "@/hooks/useLayout";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrency } from "@/store/slices/currencySlice";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/useLayout", () => ({
  default: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@/store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

describe("Navbar", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: { name: "Zin Mar" },
      loading: false,
    } as ReturnType<typeof useAuth>);

    vi.mocked(useLayout).mockReturnValue({
      sidebarItems: [{ href: "/dashboard", title: "Dashboard" }],
    } as ReturnType<typeof useLayout>);

    vi.mocked(usePathname).mockReturnValue("/dashboard");
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);

    vi.mocked(useAppSelector).mockReturnValue("USD");
  });

  it("renders the current page title", () => {
    render(<Navbar onMenuClick={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("shows the selected currency and available options", () => {
    render(<Navbar onMenuClick={vi.fn()} />);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("USD");
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.getByRole("option", { name: "MMK" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "THB" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "USD" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "JPY" })).toBeInTheDocument();
  });

  it("dispatches setCurrency when the selected currency changes", () => {
    render(<Navbar onMenuClick={vi.fn()} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "THB" },
    });

    expect(mockDispatch).toHaveBeenCalledWith(setCurrency("THB"));
  });

  it("calls onMenuClick when the sidebar toggle is clicked", () => {
    const onMenuClick = vi.fn();

    render(<Navbar onMenuClick={onMenuClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it("displays the user's initial", () => {
    render(<Navbar onMenuClick={vi.fn()} />);

    expect(screen.getByText("Z")).toBeInTheDocument();
  });
});
