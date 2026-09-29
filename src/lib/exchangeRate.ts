import { type Currency } from "./currency";

export type ExchangeRate = {
  base: Currency;
  quote: Currency;
  rate: number;
  date: string;
};

const FRANKFURTER_API = "https://api.frankfurter.dev/v2";

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const response = await fetch(
    `${FRANKFURTER_API}/rates?base=USD&quotes=USD,MMK,THB,JPY`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return response.json();
}

export async function getExchangeRates(): Promise<ExchangeRate[]>{
    const response = await fetch('/api/exchange-rates');

    if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
    }

    return response.json();
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRate[]
): number {
  if (from === to) {
    return amount;
  }

  const fromRate =
    from === "USD"
      ? 1
      : rates.find((item) => item.quote === from)?.rate;

  const toRate =
    to === "USD"
      ? 1
      : rates.find((item) => item.quote === to)?.rate;

  if (fromRate === undefined || toRate === undefined) {
    throw new Error("Exchange rate not found");
  }

  const amountInUSD = amount / fromRate;

  return amountInUSD * toRate;
}

