import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ItemCard } from "./ItemCard";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/lib/currencyFormatter";

vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("@/lib/currencyFormatter", () => ({
  formatCurrency: vi.fn((amount, currency) => `${currency} ${amount}`),
}));

describe("ItemCard", () => {
  const mockState = {
    currency: { currency: "USD" },
  } as Parameters<Parameters<typeof useAppSelector>[0]>[0];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector(mockState),
    );
  });

  it("renders all three summary cards", () => {
    render(<ItemCard summary={[]} />);

    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Total Expense")).toBeInTheDocument();
    expect(screen.getByText("Net Balance")).toBeInTheDocument();
  });

  it("calculates income, expense, and balance correctly", () => {
    const summary = [
      { type: "INCOME" as const, _sum: { amount: 1000 } },
      { type: "INCOME" as const, _sum: { amount: 500 } },
      { type: "EXPENSE" as const, _sum: { amount: 200 } },
      { type: "EXPENSE" as const, _sum: { amount: 100 } },
    ];

    render(<ItemCard summary={summary} />);

    expect(formatCurrency).toHaveBeenCalledWith(1500, "USD");
    expect(formatCurrency).toHaveBeenCalledWith(300, "USD");
    expect(formatCurrency).toHaveBeenCalledWith(1200, "USD");
  });

  it("shows zero totals when summary is empty", () => {
    render(<ItemCard summary={[]} />);

    expect(formatCurrency).toHaveBeenCalledWith(0, "USD");
  });

  it("treats null amounts as zero", () => {
    const summary = [
      { type: "INCOME" as const, _sum: { amount: null } },
      { type: "EXPENSE" as const, _sum: { amount: null } },
    ];

    render(<ItemCard summary={summary} />);

    expect(formatCurrency).toHaveBeenCalledWith(0, "USD");
    expect(formatCurrency).toHaveBeenCalledWith(0, "USD");
  });

  it("uses the selected currency from Redux", () => {
    const thbState = {
      currency: { currency: "THB" },
    } as Parameters<Parameters<typeof useAppSelector>[0]>[0];

    vi.mocked(useAppSelector).mockImplementation((selector) =>
      selector(thbState),
    );

    render(<ItemCard summary={[{ type: "INCOME", _sum: { amount: 100 } }]} />);

    expect(formatCurrency).toHaveBeenCalledWith(100, "THB");
    expect(formatCurrency).toHaveBeenCalledWith(0, "THB");
  });
});
