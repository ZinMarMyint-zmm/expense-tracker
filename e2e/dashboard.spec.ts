import { test, expect } from "@playwright/test";

test("dashboard displays correct expense summary", async ({ page }) => {
  const email = `e2e-dashboard-${Date.now()}@example.com`;
  const password = "TestPass123!";
  const transactionTitle = `Dashboard Test ${Date.now()}`;

  let transactionId: string | undefined;

  await page.goto("/register");
  await page.getByLabel("Name").fill("Dashboard Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  try {
    const categoriesResponse = await page.request.get("/api/categories");
    expect(categoriesResponse.status()).toBe(200);

    const categories = await categoriesResponse.json();
    expect(categories.length).toBeGreaterThan(0);

    const createResponse = await page.request.post("/api/transactions", {
      data: {
        title: transactionTitle,
        categoryId: categories[0].id,
        type: "EXPENSE",
        amount: 125,
        date: new Date().toISOString().slice(0, 10),
        note: "Dashboard E2E test",
        currency: "THB",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdTransaction = await createResponse.json();
    transactionId = createdTransaction.id;

    // Verify the summary API returns the expected expense
    const summaryResponse = await page.request.get(
      "/api/dashboard/summary?currency=THB",
    );
    expect(summaryResponse.status()).toBe(200);

    const summary = await summaryResponse.json();
    const expenseSummary = summary.find(
      (item: { type: string }) => item.type === "EXPENSE",
    );

    expect(expenseSummary).toBeDefined();
    expect(Number(expenseSummary._sum.amount)).toBeCloseTo(125, 2);

    // Verify the dashboard UI

    // Verify the dashboard UI
    await page.goto("/dashboard");

    await expect(page.getByText("Total Income")).toBeVisible();
    await expect(page.getByText("Total Expense")).toBeVisible();
    await expect(page.getByText("Net Balance")).toBeVisible();

    // Verify the exact expense and balance amounts
    const expenseCard = page
      .locator("section")
      .filter({ has: page.getByText("Total Expense") })
      .getByText("- ฿125.00");

    await expect(expenseCard).toBeVisible();

    const balanceCard = page
      .locator("section.grid.grid-cols-1.md\\:grid-cols-3")
      .filter({ has: page.getByText("Net Balance") });

    await expect(balanceCard.getByText("฿-125.00")).toBeVisible();
  } finally {
    if (transactionId) {
      const cleanupResponse = await page.request.delete(
        `/api/transactions/${transactionId}`,
        { timeout: 5000 },
      );

      expect([200, 404]).toContain(cleanupResponse.status());
    }
  }
});
