import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto('http://localhost:5173/auth/login');

  await page.locator('input[name="phone"]').fill("03545676674");
  await page.getByRole("button", { name: /login/i }).click();

//   await expect(page).toHaveURL(/\/rides\/browse/);
 await expect(page).toHaveURL(/\/(rides|dashboard|home)?$/);

  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
