import { test, expect } from "@playwright/test";

test("user can register and log in", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "TestPass123!";

  // Register
  await page.goto("/register");
  await page.getByLabel("Name").fill("E2E Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/login$/);

  // Login
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  // Verify session
  const response = await page.request.get("/api/auth/me");
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.user.email).toBe(email);
  expect(body.user.name).toBe("E2E Test User");
});

test("user can log out and lose access to session", async ({ page }) => {
  // Register and log in first
  const email = `e2e-logout-${Date.now()}@example.com`;
  const password = "TestPass123!";

  await page.goto("/register");
  await page.getByLabel("Name").fill("E2E Logout User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  // Confirm logout
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.getByText("Confirm Log out")).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).last().click();

  await expect(page).toHaveURL("/");

  // Verify session is gone
  const response = await page.request.get("/api/auth/me");
  expect(response.status()).toBe(401);
});