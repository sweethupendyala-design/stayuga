import { test, expect } from "@playwright/test";

test.describe("Stay filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/stays");
    await page.waitForLoadState("networkidle");
  });

  test("Search box filters by location or stay name", async ({ page }) => {
    await page.getByPlaceholder(/search by location or stay name/i).fill("Goa");
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page).toHaveURL(/search=Goa/);
  });

  test("Guests stepper increments and is reflected in the URL on Search", async ({ page }) => {
    await page.getByRole("button", { name: "Guests" }).click();
    await page.getByRole("button", { name: "Increase Guests" }).click();
    await page.getByRole("button", { name: "Increase Guests" }).click();
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page).toHaveURL(/minGuests=2/);
  });

  test("Bedrooms stepper increments and is reflected in the URL on Search", async ({ page }) => {
    await page.getByRole("button", { name: "Bedrooms" }).click();
    await page.getByRole("button", { name: "Increase Bedrooms" }).click();
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page).toHaveURL(/minBedrooms=1/);
  });

  test("Price range min/max appear in the URL on Search", async ({ page }) => {
    await page.getByRole("button", { name: "Price range" }).click();
    await page.getByPlaceholder("0").fill("5000");
    await page.getByPlaceholder("No limit").fill("20000");
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page).toHaveURL(/minPrice=5000/);
    await expect(page).toHaveURL(/maxPrice=20000/);
  });

  test("Minimum price greater than maximum shows a validation error", async ({ page }) => {
    await page.getByRole("button", { name: "Price range" }).click();
    await page.getByPlaceholder("0").fill("30000");
    await page.getByPlaceholder("No limit").fill("10000");
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page.getByText(/can't be more than the maximum/i)).toBeVisible();
  });

  test("Search with no selection navigates to /stays with no filters", async ({ page }) => {
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page).toHaveURL("/stays?");
  });

  test("Clear button resets all filters back to /stays", async ({ page }) => {
    await page.goto("/stays?search=Goa&minGuests=4");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /^clear$/i }).click();
    await expect(page).toHaveURL("/stays");
  });

  test("Combined filters all appear in the URL", async ({ page }) => {
    await page.getByPlaceholder(/search by location or stay name/i).fill("Shimla");
    await page.getByRole("button", { name: "Guests" }).click();
    await page.getByRole("button", { name: "Increase Guests" }).click();
    await page.getByRole("button", { name: /^search$/i }).click();
    const url = page.url();
    expect(url).toContain("search=Shimla");
    expect(url).toContain("minGuests=1");
  });
});
