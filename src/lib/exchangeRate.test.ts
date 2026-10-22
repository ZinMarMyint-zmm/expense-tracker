import { describe, expect, it } from "vitest";
import { convertCurrency, type ExchangeRate } from "./exchangeRate";

describe("convertCurrency", () => {
  it("should convert THB to USD correctly", () => {
    const rates: ExchangeRate[] = [
      {
        base: "USD",
        quote: "THB",
        rate: 33.4,
        date: "2026-10-06",
      },
    ];

    const result = convertCurrency(334, "THB", "USD", rates);

    expect(result).toBe(10);
  });

  it("should return the same amount when currencies are the same", () => {
    const rates: ExchangeRate[] = [];

    const result = convertCurrency(1000, "THB", "THB", rates);

    expect(result).toBe(1000);
  });

  it("should convert USD to THB correctly", () => {
    const rates: ExchangeRate[] = [
      {
        base: "USD",
        quote: "THB",
        rate: 33.4,
        date: "2026-10-06",
      },
    ];

    const result = convertCurrency(10, "USD", "THB", rates);

    expect(result).toBe(334);
  });

  it("should throw an error when exchange rate is not found", () => {
    const rates: ExchangeRate[] = [];

    expect(() => {
      convertCurrency(100, "THB", "USD", rates);
    }).toThrow("Exchange rate not found");
  });

  it("should throw when the target currency rate is missing", () => {
    const rates: ExchangeRate[] = [
      {
        base: "USD",
        quote: "THB",
        rate: 33.4,
        date: "2026-10-06",
      },
    ];

    expect(() => convertCurrency(100, "THB", "JPY", rates)).toThrow(
      "Exchange rate not found",
    );
  });

  it("should throw when the source currency rate is missing", () => {
    const rates: ExchangeRate[] = [
      {
        base: "USD",
        quote: "THB",
        rate: 33.4,
        date: "2026-10-06",
      },
    ];

    expect(() => convertCurrency(100, "JPY", "THB", rates)).toThrow(
      "Exchange rate not found",
    );
  });

  it("should return zero when the amount is zero", () => {
    const rates: ExchangeRate[] = [
      {
        base: "USD",
        quote: "THB",
        rate: 33.4,
        date: "2026-10-06",
      },
    ];

    expect(convertCurrency(0, "THB", "USD", rates)).toBe(0);
  });
});
