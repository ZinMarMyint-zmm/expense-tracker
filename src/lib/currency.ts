export type Currency = "USD" | "MMK" | "THB" | "JPY";

export const currencyConfig: Record<
  Currency,
  {
    name: string;
    symbol: string;
    decimalPlaces: number;
  }
> = {
  USD: {
    name: "US Dollar",
    symbol: "$",
    decimalPlaces: 2,
  },
  MMK: {
    name: "Myanmar Kyat",
    symbol: "K",
    decimalPlaces: 0,
  },
  THB: {
    name: "Thai Baht",
    symbol: "฿",
    decimalPlaces: 2,
  },
  JPY: {
    name: "Japanese Yen",
    symbol: "¥",
    decimalPlaces: 0,
  },
};