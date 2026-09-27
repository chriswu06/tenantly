import { expect, test } from "@playwright/test";
import { SUMMONS } from "./helpers";

// The main path: upload → Gemini reads it → confirm → license check → results → next steps.
test("tenant checks their landlord's license and prepares for court", async ({ page, request }) => {
  await page.goto("/");
  await page.locator("input[type=file][name=summons]").first().setInputFiles(SUMMONS);
  await page.waitForURL("**/scan/extracting");
  await page.waitForURL("**/scan/review", { timeout: 90_000 });

  // Gemini pre-filled the form from the summons.
  await expect(page.getByLabel("Property address")).toHaveValue(/2417 E Monument St/);
  await expect(page.getByLabel("Case number")).toHaveValue("D-01-LT-26-004821");
  await expect(page.getByLabel("Landlord (plaintiff)")).toHaveValue(/Harbor Point Rentals/);

  await page.getByRole("button", { name: "Verify license" }).last().click();
  await page.waitForURL("**/verify/guided-check", { timeout: 90_000 });
  await expect(page.getByText("2417 E MONUMENT ST", { exact: true })).toBeVisible();

  await page.getByText("No license shows up").click();
  await page.getByRole("button", { name: "See my results" }).click();
  await page.waitForURL("**/results");
  await expect(page.getByRole("heading", { level: 1, name: "No active rental license found" })).toBeVisible();

  // Summary PDF is served to this browser only.
  const summaryHref = await page.locator('a[href*="type=summary"]').first().getAttribute("href");
  const pdf = await page.request.get(summaryHref!);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect((await request.get(summaryHref!)).status()).toBe(404); // a different browser gets nothing

  await page.goto("/certification");
  await page.getByRole("button", { name: "Mark as requested" }).last().click();
  await page.waitForURL("**/court-prep");
  const photoId = page.getByRole("checkbox", { name: "Photo ID" });
  await Promise.all([page.waitForResponse((r) => r.request().method() === "POST"), photoId.check()]);
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Photo ID" })).toBeChecked();

  await page.goto("/share");
  await page.getByText("Public Justice Center", { exact: true }).click();
  await page.getByLabel("First name").fill("Test");
  await page.getByRole("textbox", { name: "Phone" }).fill("410-555-0199");
  await page.getByRole("button", { name: "Share my case" }).last().click();
  await page.waitForURL("**/share/confirmation?org=pjc");

  await page.goto("/outcome");
  await page.getByText("Case postponed").click();
  await page.getByRole("button", { name: "Submit anonymously" }).last().click();
  await expect(page.getByRole("heading", { name: "Thank you" })).toBeVisible();
});

test("read aloud returns speech audio", async ({ page }) => {
  await page.goto("/how-it-works", { waitUntil: "networkidle" });
  const response = page.waitForResponse((r) => r.url().endsWith("/api/tts"));
  await page.getByRole("button", { name: /^(Listen|Read this page aloud)$/ }).filter({ visible: true }).first().click();
  const tts = await response;
  expect(tts.status()).toBe(200);
  expect(tts.headers()["content-type"]).toBe("audio/mpeg");
});
