import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";
import { useTransactions } from "@/hooks/useTransactions";
import { useAppSelector } from "@/store/hooks";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { getPaginationPages } from "@/utils/getPaginationPages";

vi.mock("@/hooks/useTransactions", () => ({
  useTransactions: vi.fn(),
}));

vi.mock("@/store/hooks", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("@/hooks/useExchangeRates", () => ({
  useExchangeRates: vi.fn(),
}));

vi.mock("@/lib/exchangeRate", () => ({
  convertCurrency: vi.fn(() => 100),
}));

vi.mock("@/lib/currencyFormatter", () => ({
  formatCurrency: vi.fn(() => "USD 100.00"),
}));

vi.mock("@/utils/formatDate", () => ({
  formatDate: vi.fn(() => "2026-10-01"),
}));

vi.mock("@/utils/exportTransactions", () => ({
  exportTransactions: vi.fn(),
}));

vi.mock("@/utils/generateTransactionPDF", () => ({
  generateTransactionPDF: vi.fn(),
}));

vi.mock("@/utils/getPaginationPages", () => ({
  getPaginationPages: vi.fn(() => [1]),
}));

describe("Transactions Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppSelector).mockReturnValue("USD");

    vi.mocked(useExchangeRates).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useExchangeRates>);

    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
      filters: { page: 1 },
      setFilters: vi.fn(),
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);
  });

  it("renders the transaction table headings", () => {
    render(<Home />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Note")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("shows the empty state when there are no transactions", () => {
    render(<Home />);

    expect(screen.getByText("No transactions yet.")).toBeInTheDocument();
  });

  it("shows a loading indicator while data is loading", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
      filters: { page: 1 },
      setFilters: vi.fn(),
      loading: true,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    render(<Home />);

    expect(screen.queryByText("No transactions yet.")).not.toBeInTheDocument();
  });

  it("shows an error message when loading transactions fails", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
      filters: { page: 1 },
      setFilters: vi.fn(),
      loading: false,
      error: "Unable to load transactions",
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    render(<Home />);

    expect(
      screen.getByText("Error:Unable to load transactions"),
    ).toBeInTheDocument();
  });

  it("applies the selected date range and resets page to 1", async () => {
    const setFilters = vi.fn();

    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 3, total: 30, page: 2, limit: 10 },
      filters: { page: 2 },
      setFilters,
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    render(<Home />);

    const dateInputs = screen.getAllByDisplayValue("");

    const dateInputsByType = document.querySelectorAll('input[type="date"]');

    expect(dateInputsByType).toHaveLength(2);

    fireEvent.change(dateInputsByType[0], {
      target: { value: "2026-10-01" },
    });

    fireEvent.change(dateInputsByType[1], {
      target: { value: "2026-10-15" },
    });

    fireEvent.click(screen.getByRole("button", { name: /filter/i }));

    expect(setFilters).toHaveBeenCalledTimes(1);

    const updater = vi.mocked(setFilters).mock.calls[0][0];

    expect(updater).toEqual(expect.any(Function));

    expect(
      (updater as (prev: Record<string, unknown>) => Record<string, unknown>)({
        page: 3,
        type: "EXPENSE",
      }),
    ).toEqual({
      page: 1,
      type: "EXPENSE",
      startDate: "2026-10-01",
      endDate: "2026-10-15",
    });
  });

  it("shows the date-filter empty state when a date range is active", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 1, total: 0, page: 1, limit: 10 },
      filters: {
        page: 1,
        startDate: "2026-10-01",
        endDate: "2026-10-15",
      },
      setFilters: vi.fn(),
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    render(<Home />);

    expect(
      screen.getByText(/no transactions found for the selected date range/i),
    ).toBeInTheDocument();
  });

  it("renders pagination when there are multiple pages", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 3, total: 30, page: 2, limit: 10 },
      filters: { page: 2 },
      setFilters: vi.fn(),
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    vi.mocked(getPaginationPages).mockReturnValue([1, 2, 3]);

    render(<Home />);

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Previous on the first page", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 3, total: 30, page: 1, limit: 10 },
      filters: { page: 1 },
      setFilters: vi.fn(),
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    vi.mocked(getPaginationPages).mockReturnValue([1, 2, 3]);

    render(<Home />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("disables Next on the last page", () => {
    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 3, total: 30, page: 3, limit: 10 },
      filters: { page: 3 },
      setFilters: vi.fn(),
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    vi.mocked(getPaginationPages).mockReturnValue([1, 2, 3]);

    render(<Home />);

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("changes to the next page when Next is clicked", async () => {
    const setFilters = vi.fn();

    vi.mocked(useTransactions).mockReturnValue({
      transactions: [],
      pagination: { totalPages: 3, total: 30, page: 1, limit: 10 },
      filters: { page: 1 },
      setFilters,
      loading: false,
      error: null,
      deleteTransaction: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
    } as unknown as ReturnType<typeof useTransactions>);

    vi.mocked(getPaginationPages).mockReturnValue([1, 2, 3]);

    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(setFilters).toHaveBeenCalled();

    const updater = setFilters.mock.calls[0][0];

    expect(typeof updater).toBe("function");
    expect(updater({ page: 1 })).toEqual({ page: 2 });
  });
});
