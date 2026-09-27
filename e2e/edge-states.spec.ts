import { expect, test } from "@playwright/test";
import { fillDetails } from "./helpers";

test("manual entry shows field errors, then routes an out-of-city address", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter details manually" }).first().click();
  await page.waitForURL("**/scan/review");

  await fillDetails(page, { caseNumber: "D1" });
  await page.getByRole("button", { name: "Verify license" }).last().click();
  await expect(page.getByText("Enter the case number from the top of your summons.")).toBeVisible();
  await expect(page.getByLabel("Case number")).toHaveAttribute("aria-invalid", "true");

  await fillDetails(page, { address: "8120 Liberty Rd, Windsor Mill, MD 21244" });
  await page.getByRole("button", { name: "Verify license" }).last().click();
  await page.waitForURL("**/scan/outside-area", { timeout: 60_000 });
  await expect(page.getByText("Baltimore County").filter({ visible: true }).first()).toBeVisible();
});

test("upload failures explain what went wrong", async ({ page }) => {
  await page.goto("/scan/upload-failed?reason=size");
  await expect(page.getByText(/10 MB/).first()).toBeAttached();
});

test("an expired session is explained on the start screen", async ({ page }) => {
  await page.goto("/?expired=1");
  await expect(page.getByText("Your previous session ended").filter({ visible: true }).first()).toBeVisible();
});

test("case pages need a case", async ({ page }) => {
  await page.goto("/results");
  await page.waitForURL("**/?expired=1");
});
