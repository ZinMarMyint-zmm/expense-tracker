
import { test, expect } from "@playwright/test";

test("application opens successfully", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/localhost:3000/);
});
