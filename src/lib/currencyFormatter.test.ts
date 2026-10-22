import { describe, it, expect } from "vitest";
import { formatCurrency } from "./currencyFormatter";

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    const result = formatCurrency(1234.56, "USD");

    expect(result).toBe("$1,234.56");
  });

  it("should format THB correctly", () => {
    const result = formatCurrency(1234.5, "THB");

    expect(result).toBe("฿1,234.50");
  });

  it("should format MMK correctly", () => {
    const result = formatCurrency(1234.56, "MMK");

    expect(result).toBe("K1,235");
  });

  it("should format zero correctly", () => {
    const result = formatCurrency(0, "USD");

    expect(result).toBe("$0.00");
  });

  it("should format JPY without decimal places", () => {
    const result = formatCurrency(1234.56, "JPY");

    expect(result).toBe("¥1,235");
  });

  it("should format negative amounts correctly", () => {
    expect(formatCurrency(-1234.56, "USD")).toBe("$-1,234.56");
  });

  it("should round amounts according to currency decimal places", () => {
    expect(formatCurrency(1234.567, "USD")).toBe("$1,234.57");
  });
});
