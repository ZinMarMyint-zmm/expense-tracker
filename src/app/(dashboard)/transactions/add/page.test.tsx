import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";

const mockPush = vi.fn();
const mockCreateTransaction = vi.fn();

const mockUseCategories = vi.fn();
const mockUseTransactions = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/hooks/useCategories", () => ({
  useCategories: () => mockUseCategories(),
}));

vi.mock("@/hooks/useTransactions", () => ({
  useTransactions: () => mockUseTransactions(),
}));

describe("Transaction Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCategories.mockReturnValue({
      categories: [
        { id: "cat-1", name: "Food" },
        { id: "cat-2", name: "Transport" },
      ],
      loading: false,
    });

    mockUseTransactions.mockReturnValue({
      createTransaction: mockCreateTransaction,
    });

    mockCreateTransaction.mockResolvedValue({});
  });

  it("renders the transaction form fields", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Transaction Form" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Note")).toBeInTheDocument();
  });

  it("disables the category select while categories are loading", () => {
    mockUseCategories.mockReturnValue({
      categories: [],
      loading: true,
    });

    render(<Home />);

    expect(screen.getByLabelText("Category")).toBeDisabled();
    expect(
      screen.getByRole("option", { name: "Loading categories..." }),
    ).toBeInTheDocument();
  });

  it("submits transaction data and navigates to transactions", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Lunch" },
    });

    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "cat-1" },
    });

    fireEvent.change(screen.getByLabelText("Type"), {
      target: { value: "EXPENSE" },
    });

    fireEvent.change(screen.getByLabelText("Amount"), {
      target: { value: "250" },
    });

    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2026-10-13" },
    });

    fireEvent.change(screen.getByLabelText("Note"), {
      target: { value: "Lunch with friends" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(mockCreateTransaction).toHaveBeenCalledWith({
        title: "Lunch",
        categoryId: "cat-1",
        type: "EXPENSE",
        amount: 250,
        date: "2026-10-13",
        note: "Lunch with friends",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/transactions");
    });
  });

  it("provides a cancel link to the transactions page", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/transactions",
    );
  });
});
