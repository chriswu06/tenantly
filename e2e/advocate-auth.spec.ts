import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test("the console needs a signed-in advocate", async ({ page }) => {
  await page.goto("/advocate/cases");
  await page.waitForURL("**/advocate/sign-in?next=%2Fadvocate%2Fcases");
});

test("a wrong password shows an error", async ({ page }) => {
  await page.goto("/advocate/sign-in");
  await page.getByLabel("Work email").fill("nobody@example.com");
  await page.getByLabel("Password", { exact: true }).fill("not-the-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText(/don’t match an account/)).toBeVisible();
});

test("an advocate signs in and out", async ({ page }) => {
  await signIn(page);
  await page.goto("/advocate/settings");
  await page.getByRole("button", { name: "Sign out" }).last().click();
  await page.waitForURL("**/advocate/sign-in");
  await page.goto("/advocate");
  await page.waitForURL("**/advocate/sign-in**");
});

test("sign-up needs an invitation", async ({ page }) => {
  await page.goto("/advocate/sign-up");
  await expect(page.getByRole("heading", { name: "You need an invitation" })).toBeVisible();
});
