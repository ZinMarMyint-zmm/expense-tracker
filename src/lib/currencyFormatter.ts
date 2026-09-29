import { type Currency, currencyConfig } from "@/lib/currency";

export function formatCurrency(
  amount: number,
  currency: Currency,
): string {
  const config = currencyConfig[currency];

  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(amount);

  return `${config.symbol}${formattedAmount}`;
}