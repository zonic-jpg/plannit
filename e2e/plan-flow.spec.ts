import { expect, test } from "@playwright/test";

test("reference trip generates scored Montenegro plan", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Montenegro, scored and staged/i })).toBeVisible();
  await page.getByRole("button", { name: /Plan my trip/i }).click();
  await expect(page.getByText("Scored locations")).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("Kotor", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Cost estimate")).toBeVisible();
});
