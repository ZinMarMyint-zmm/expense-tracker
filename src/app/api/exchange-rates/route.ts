import { NextResponse } from "next/server";

const FRANKFURTER_API = "https://api.frankfurter.dev/v2";

export async function GET() {
  try {
    const response = await fetch(
      `${FRANKFURTER_API}/rates?base=USD&quotes=USD,MMK,THB,JPY`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const rates = await response.json();

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Exchange rate error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch exchange rates",
      },
      {
        status: 500,
      }
    );
  }
}