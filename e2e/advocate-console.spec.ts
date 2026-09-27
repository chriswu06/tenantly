import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("search, filter and paginate cases", async ({ page }) => {
  await page.goto("/advocate/cases");
  const search = page.getByRole("searchbox").first();
  await search.fill("Monument");
  await expect(page).toHaveURL(/q=Monument/);
  await expect(page.getByText(/2417 E Monument St/).filter({ visible: true }).first()).toBeVisible();

  await page.goto("/advocate/cases?filter=no-license");
  await expect(page.getByText(/Showing 1–/).filter({ visible: true }).first()).toBeVisible();
});

test("open a case and see its records and activity", async ({ page }) => {
  await page.goto("/advocate/cases");
  await page.locator('a[href^="/advocate/cases/STD-"]:visible').first().click();
  await page.waitForURL(/\/advocate\/cases\/STD-/);
  const reference = page.url().split("/").pop()!;
  await page.goto(`/advocate/cases/${reference}/records`);
  await expect(page.getByText("License verification").filter({ visible: true }).first()).toBeVisible();
  const pdf = await page.request.get(`/api/cases/${reference}/report?type=case`);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
});

test("an unknown case shows not found", async ({ page }) => {
  await page.goto("/advocate/cases/STD-0000-0000");
  await expect(page.getByText("Case not found")).toBeVisible();
});

test("every console page loads without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of ["/advocate", "/advocate/cases", "/advocate/lookups", "/advocate/reports", "/advocate/team", "/advocate/settings"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
