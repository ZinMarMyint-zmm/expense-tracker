
import { test, expect } from "@playwright/test";

test("user can create, edit, and delete a transaction", async ({ page }) => {
  const email = `e2e-transaction-${Date.now()}@example.com`;
  const password = "TestPass123!";
  const originalTitle = `E2E Transaction ${Date.now()}`;
  const updatedTitle = `${originalTitle} Updated`;

  // Register a test user
  await page.goto("/register");
  await page.getByLabel("Name").fill("E2E Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/login/);

  // Log in
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  // Get an available category
  const categoriesResponse = await page.request.get("/api/categories");
  expect(categoriesResponse.status()).toBe(200);

  const categories = await categoriesResponse.json();
  expect(categories.length).toBeGreaterThan(0);

  const categoryId = categories[0].id;
  let transactionId: string | undefined;

  try {
    // Create a transaction through the API
    const createResponse = await page.request.post("/api/transactions", {
      data: {
        title: originalTitle,
        categoryId,
        type: "EXPENSE",
        amount: 125,
        date: "2026-09-01",
        note: "Created by Playwright",
        currency: "THB",
      },
    });

    expect(createResponse.status()).toBe(201);

    const createdTransaction = await createResponse.json();
    transactionId = createdTransaction.id;

    // Verify it appears in the list
    await page.goto("/transactions");
    await expect(page.getByText(originalTitle)).toBeVisible();

    // Open the edit page
    await page.goto(`/transactions/edit/${transactionId}`);
    await expect(
      page.getByRole("heading", { name: "Edit Transaction Form" }),
    ).toBeVisible();

    await expect(page.getByLabel("Title")).toHaveValue(originalTitle);
    await page.getByLabel("Title").fill(updatedTitle);

    const updateResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/api/transactions/${transactionId}`) &&
        response.request().method() === "PUT",
    );

    await page.getByRole("button", { name: "Update" }).click();

    const updateResponse = await updateResponsePromise;
    expect(updateResponse.status()).toBe(200);

    // Verify redirect and updated title
    await expect(page).toHaveURL(/\/transactions$/);
    await expect(page.getByText(updatedTitle)).toBeVisible();

    // Delete the transaction
    page.once("dialog", (dialog) => dialog.accept());

    const row = page.getByRole("row").filter({ hasText: updatedTitle });
    await row.getByRole("button").last().click();

    await expect(page.getByText(updatedTitle)).toHaveCount(0);
  } finally {
    // Clean up if the transaction still exists
    if (transactionId) {
      const cleanupResponse = await page.request.delete(
        `/api/transactions/${transactionId}`,
        { timeout: 5000 },
      );

      expect([200, 404]).toContain(cleanupResponse.status());
    }
  }
});
