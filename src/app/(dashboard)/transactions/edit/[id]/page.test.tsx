import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions } from "@/hooks/useTransactions";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock("@/hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

vi.mock("@/hooks/useTransactions", () => ({
  useTransactions: vi.fn(),
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

describe("Edit Transaction Page", () => {
  const getTransaction = vi.fn();
  const updateTransaction = vi.fn();
  const push = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useParams).mockReturnValue({ id: "transaction-123" });
    vi.mocked(useRouter).mockReturnValue({
      push,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });

    vi.mocked(useCategories).mockReturnValue({
      categories: [
        { id: "cat-1", name: "Food" },
        { id: "cat-2", name: "Transport" },
      ],
    } as unknown as ReturnType<typeof useCategories>);

    getTransaction.mockResolvedValue(null);

    vi.mocked(useTransactions).mockReturnValue({
      getTransaction,
      updateTransaction,
    } as unknown as ReturnType<typeof useTransactions>);
  });

  it("renders all transaction fields and buttons", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /edit transaction form/i }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^type$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("fetches the transaction using the ID from the route", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(getTransaction).toHaveBeenCalledWith("transaction-123");
    });
  });

  it("renders the available categories", () => {
    render(<Home />);

    expect(screen.getByRole("option", { name: "Food" })).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Transport" }),
    ).toBeInTheDocument();
  });

  it("updates the transaction and redirects after form submission", async () => {
    updateTransaction.mockResolvedValue(undefined);

    render(<Home />);

    await waitFor(() => {
      expect(getTransaction).toHaveBeenCalledWith("transaction-123");
    });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Lunch" },
    });

    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "cat-1" },
    });

    fireEvent.change(screen.getByLabelText(/^type$/i), {
      target: { value: "EXPENSE" },
    });

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "250" },
    });

    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: "2026-10-18" },
    });

    fireEvent.change(screen.getByLabelText(/note/i), {
      target: { value: "Lunch with friends" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(updateTransaction).toHaveBeenCalledWith("transaction-123", {
        title: "Lunch",
        categoryId: "cat-1",
        type: "EXPENSE",
        amount: 250,
        date: "2026-10-18",
        note: "Lunch with friends",
      });

      expect(push).toHaveBeenCalledWith("/transactions");
    });
  });
});
