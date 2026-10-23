import { test, expect } from "@playwright/test";

test("admin can create a category", async ({ page }) => {
  const email = "e2e-admin@example.com";
  const password = process.env.E2E_ADMIN_PASSWORD;
  const categoryName = `Test Category ${Date.now()}`;

  if (!password) {
    throw new Error("E2E_ADMIN_PASSWORD is not configured");
  }

  // Login as the seeded admin
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  // Open the category form
  await page.goto("/categories");
  await page.getByRole("link", { name: "Add Category" }).click();

  await page.getByLabel("Name").fill(categoryName);
  await page.getByLabel("Icon").fill("🧪");
  await page.getByLabel("Color").fill("#123456");

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/categories") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: "Save" }).click();

  const response = await responsePromise;
  expect(response.status()).toBe(201);

  await expect(page).toHaveURL(/\/categories$/);
  await expect(page.getByRole("cell", { name: categoryName })).toBeVisible();
  const categoryRow = page.getByRole("row").filter({ hasText: categoryName });

  await expect(categoryRow).toBeVisible();
  await expect(categoryRow.getByRole("cell", { name: "🧪" })).toBeVisible();
  await expect(
    categoryRow.getByRole("cell", { name: "#123456" }),
  ).toBeVisible();
});
