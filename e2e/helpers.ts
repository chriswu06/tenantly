import { expect, type Page } from "@playwright/test";
import path from "node:path";

export const SUMMONS = path.join(__dirname, "fixtures", "sample-summons.jpg");

export const CASE = {
  address: "2417 E Monument St, Apt 2, Baltimore, MD 21205",
  caseNumber: "D-01-LT-26-004821",
  landlord: "Harbor Point Rentals LLC",
  filing: "2026-09-18",
  hearing: "2026-10-13T09:00",
};

/** Fills the review form (manual entry or corrections). */
export async function fillDetails(page: Page, values: Partial<typeof CASE> = {}) {
  const v = { ...CASE, ...values };
  await page.getByLabel("Property address").fill(v.address);
  await page.getByLabel("Case number").fill(v.caseNumber);
  await page.getByLabel("Landlord (plaintiff)").fill(v.landlord);
  await page.getByLabel("Filing date").fill(v.filing);
  await page.getByLabel("Court date and time").fill(v.hearing);
}

export async function signIn(page: Page) {
  const email = process.env.E2E_ADVOCATE_EMAIL;
  const password = process.env.E2E_ADVOCATE_PASSWORD;
  if (!email || !password) throw new Error("Set E2E_ADVOCATE_EMAIL and E2E_ADVOCATE_PASSWORD in .env.local");
  await page.goto("/advocate/sign-in");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/advocate");
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
}
