"use client";

import { useQuery } from "@tanstack/react-query";
import { getExchangeRates } from "@/lib/exchangeRate";

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ["exchangeRates"],
    queryFn: getExchangeRates,
    staleTime: 1000 * 60 * 60,
  });
};